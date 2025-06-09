import sys
import json
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import base64
import os
import matplotlib.cm as cm

# Suppress TensorFlow logging
import logging
tf.get_logger().setLevel(logging.ERROR)
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

# Disable TensorFlow progress output
tf.keras.backend.clear_session()
tf.config.run_functions_eagerly(True)  # This helps suppress some progress output

# Get the absolute path of the script's directory
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
# Load the model using absolute path
MODEL_PATH = os.path.join(SCRIPT_DIR, "src", "models", "model_Xception_ft.hdf5")

# Print debug info to stderr
print(f"Looking for model at: {MODEL_PATH}", file=sys.stderr)

# Verify model exists before loading
if not os.path.exists(MODEL_PATH):
    print(json.dumps({"error": f"Model file not found at: {MODEL_PATH}"}), file=sys.stdout)
    sys.exit(1)

try:
    print("Loading model...", file=sys.stderr)
    model = tf.keras.models.load_model(MODEL_PATH)

    # Create Grad-CAM model
    grad_model = tf.keras.models.clone_model(model)
    grad_model.set_weights(model.get_weights())
    grad_model.layers[-1].activation = None
    grad_model = tf.keras.models.Model(
        inputs=[grad_model.inputs],
        outputs=[
            grad_model.get_layer("global_average_pooling2d_1").input,
            grad_model.output,
        ],
    )
    print("Model loaded successfully", file=sys.stderr)
except Exception as e:
    print(json.dumps({"error": f"Error loading model: {str(e)}"}), file=sys.stdout)
    sys.exit(1)

def make_gradcam_heatmap(grad_model, img_array, pred_index=None):
    """
    Generate a Grad‐CAM heatmap (224×224) for the given model + input.
    """
    with tf.GradientTape() as tape:
        last_conv_output, preds = grad_model(img_array)
        if pred_index is None:
            pred_index = tf.argmax(preds[0])
        class_channel = preds[:, pred_index]

    grads = tape.gradient(class_channel, last_conv_output)
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))

    last_conv_output = last_conv_output[0]  # shape (h, w, filters)
    heatmap = last_conv_output @ pooled_grads[..., tf.newaxis]
    heatmap = tf.squeeze(heatmap)
    heatmap = tf.maximum(heatmap, 0) / tf.math.reduce_max(heatmap)
    return heatmap.numpy()

def save_and_display_gradcam(img: Image.Image, heatmap: np.ndarray, alpha=0.4):
    """
    Superimpose the Grad‐CAM heatmap on top of the original PIL image.
    Returns both the combined image and its base64 representation.
    """
    # Normalize heatmap to 0–255, apply 'jet' colormap, then resize to original image
    heatmap_uint8 = np.uint8(255 * heatmap)
    jet = cm.get_cmap("jet")
    jet_colors = jet(np.arange(256))[:, :3]  # shape (256,3)

    jet_heatmap = jet_colors[heatmap_uint8]  # shape (H, W, 3)
    jet_heatmap = tf.keras.preprocessing.image.array_to_img(jet_heatmap)
    jet_heatmap = jet_heatmap.resize(img.size)
    jet_heatmap = tf.keras.preprocessing.image.img_to_array(jet_heatmap)

    # Convert original PIL to array, combine
    img_array = tf.keras.preprocessing.image.img_to_array(img)
    super_imposed = jet_heatmap * alpha + img_array
    super_imposed = tf.keras.preprocessing.image.array_to_img(super_imposed)

    # Create a side-by-side view of original and heatmap
    width, height = img.size
    combined = Image.new('RGB', (width * 2, height))
    combined.paste(img, (0, 0))
    combined.paste(super_imposed, (width, 0))

    # Convert to base64
    buffered = io.BytesIO()
    combined.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode()

    return img_str

def preprocess_image(image_data, is_base64=True):
    if is_base64:
        # Convert base64 to image
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes))
    else:
        # Load image from file path
        image = Image.open(image_data)

    # Convert to RGB if necessary
    if image.mode != 'RGB':
        image = image.convert('RGB')

    # Resize image
    image = image.resize((224, 224))

    # Convert to numpy array and preprocess
    img_array = np.array(image)
    img_array = img_array / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    return img_array, image

def predict(image_data, is_base64=True):
    try:
        print("Preprocessing image...", file=sys.stderr)
        # Preprocess the image
        img_array, original_image = preprocess_image(image_data, is_base64)
        print("Image preprocessed successfully", file=sys.stderr)

        print("Making prediction...", file=sys.stderr)
        # Make prediction
        prediction = model.predict(img_array)
        probabilities = prediction[0].tolist()
        print("Prediction completed", file=sys.stderr)

        # Get class names
        class_names = ["Healthy", "Doubtful", "Minimal", "Moderate", "Severe"]

        # Get the predicted class
        predicted_class = class_names[np.argmax(probabilities)]
        confidence = float(np.max(probabilities))

        # Generate heatmap
        print("Generating heatmap...", file=sys.stderr)
        heatmap = make_gradcam_heatmap(grad_model, img_array)
        heatmap_image = save_and_display_gradcam(original_image, heatmap)
        print("Heatmap generated successfully", file=sys.stderr)

        # Prepare response
        response = {
            "prediction": predicted_class,
            "confidence": confidence,
            "probabilities": dict(zip(class_names, probabilities)),
            "heatmap_image": heatmap_image
        }

        # Print the response as JSON to stdout only
        print(json.dumps(response), file=sys.stdout)

    except Exception as e:
        error_response = {
            "error": str(e)
        }
        print(json.dumps(error_response), file=sys.stdout)
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        # If image path is provided as argument
        image_path = sys.argv[1]
        if not os.path.exists(image_path):
            print(json.dumps({"error": f"Image file not found: {image_path}"}))
            sys.exit(1)
        predict(image_path, is_base64=False)
    else:
        # Read image data from stdin (base64)
        image_data = sys.stdin.read()
        predict(image_data, is_base64=True)
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import logging
import socket

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
# Simple CORS configuration
CORS(app)

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Load the model
MODEL_PATH = "./src/models/model_Xception_ft.hdf5"
try:
    model = tf.keras.models.load_model(MODEL_PATH)
    logger.info("Model loaded successfully")
except Exception as e:
    logger.error(f"Error loading model: {str(e)}")
    raise

@app.route('/test', methods=['GET'])
def test():
    """Test endpoint to verify server is running"""
    return jsonify({"status": "ok", "message": "Server is running"})

def preprocess_image(image_file):
    """Preprocess the image for prediction"""
    try:
        # Read the image file
        image = Image.open(image_file)

        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')

        # Resize image
        image = image.resize((224, 224))

        # Convert to numpy array and preprocess
        img_array = np.array(image)
        img_array = img_array / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        return img_array
    except Exception as e:
        logger.error(f"Error preprocessing image: {str(e)}")
        raise Exception(f"Error preprocessing image: {str(e)}")

@app.route('/predict', methods=['POST'])
def predict():
    try:
        logger.debug("Received request headers: %s", dict(request.headers))
        logger.debug("Received request files: %s", request.files)

        # Check if image file is in request
        if 'image' not in request.files:
            logger.error("No image file in request")
            return jsonify({'error': 'No image file provided'}), 400

        file = request.files['image']
        logger.debug("Received file: %s", file.filename)

        # Check if file is empty
        if file.filename == '':
            logger.error("Empty filename")
            return jsonify({'error': 'No selected file'}), 400

        # Check if file is an image
        if not file.content_type.startswith('image/'):
            logger.error("Invalid file type: %s", file.content_type)
            return jsonify({'error': 'File is not an image'}), 400

        # Process the image
        logger.debug("Processing image...")
        img_array = preprocess_image(file)

        # Make prediction
        logger.debug("Making prediction...")
        prediction = model.predict(img_array)
        probabilities = prediction[0].tolist()

        # Get class names
        class_names = ["Healthy", "Doubtful", "Minimal", "Moderate", "Severe"]

        # Get the predicted class
        predicted_class = class_names[np.argmax(probabilities)]
        confidence = float(np.max(probabilities))

        # Prepare response
        response = {
            "prediction": predicted_class,
            "confidence": confidence,
            "probabilities": dict(zip(class_names, probabilities))
        }

        logger.debug("Sending response: %s", response)
        return jsonify(response)

    except Exception as e:
        logger.error("Error in predict endpoint: %s", str(e), exc_info=True)
        return jsonify({'error': str(e)}), 500

def is_port_in_use(port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('localhost', port)) == 0

if __name__ == '__main__':
    try:
        port = 8081
        if is_port_in_use(port):
            logger.error(f"Port {port} is already in use")
            raise Exception(f"Port {port} is already in use")

        logger.info(f"Starting Flask server on port {port}...")
        logger.info(f"Server will be available at http://localhost:{port}")
        app.run(host='0.0.0.0', port=port, debug=True)
    except Exception as e:
        logger.error(f"Error starting server: {str(e)}")
        raise
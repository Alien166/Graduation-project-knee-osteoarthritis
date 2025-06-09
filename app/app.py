import streamlit as st
import tensorflow as tf
import numpy as np
from PIL import Image
import matplotlib.cm as cm
import streamlit.components.v1 as components
import json
import base64
import io

# ─── Constants ────────────────────────────────────────────────────────────────
CLASS_NAMES = ["Healthy", "Doubtful", "Minimal", "Moderate", "Severe"]
TARGET_SIZE = (224, 224)
MODEL_PATH = "./src/models/model_Xception_ft.hdf5"
ICON_PATH = "app/img/mdc.png"

# Enhanced color palette for better visual hierarchy
CHART_COLORS = ["#4CAF50", "#2196F3", "#FFEB3B", "#FF9800", "#F44336"]


@st.cache_resource
def load_model():
    """
    Load the pre‐trained Xception model and build a Grad‐CAM model.
    """
    model = tf.keras.models.load_model(MODEL_PATH)

    # Clone for Grad-CAM (remove final activation)
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
    return model, grad_model


def preprocess_image(uploaded_file):
    """
    Load and preprocess the uploaded image into a (1, 224, 224, 3) tensor.
    Returns (img_array, pil_image).
    """
    try:
        img = tf.keras.preprocessing.image.load_img(uploaded_file, target_size=TARGET_SIZE)
        img_array = tf.keras.preprocessing.image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = tf.keras.applications.xception.preprocess_input(img_array)
        return img_array, img
    except Exception as e:
        st.error(f"Error preprocessing image: {str(e)}")
        return None, None


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

    # Convert to base64 for server response
    buffered = io.BytesIO()
    combined.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode()

    return combined, img_str


def render_probability_chart(labels, probabilities):
    """
    Renders a robust horizontal bar chart that works reliably in Streamlit.
    """
    # Round probabilities and ensure they're proper numbers
    rounded_probs = [float(round(p, 2)) for p in probabilities]
    max_prob_idx = probabilities.index(max(probabilities))

    # Prepare colors with highlighting
    colors = []
    for i, color in enumerate(CHART_COLORS):
        if i == max_prob_idx:
            colors.append(color)
        else:
            colors.append(color + "80")  # 50% opacity

    # Generate unique ID for this chart
    chart_id = f"chart_{abs(hash(str(probabilities)))}"

    # Simplified, more reliable chart configuration
    chart_config = {
        "type": "bar",
        "data": {
            "labels": labels,
            "datasets": [{
                "data": rounded_probs,
                "backgroundColor": colors,
                "borderColor": CHART_COLORS,
                "borderWidth": 2,
                "borderRadius": 6
            }]
        },
        "options": {
            "responsive": True,
            "maintainAspectRatio": False,
            "indexAxis": "y",
            "plugins": {
                "legend": {"display": False},
                "tooltip": {
                    "backgroundColor": "rgba(0,0,0,0.8)",
                    "titleColor": "white",
                    "bodyColor": "white",
                    "borderColor": "white",
                    "borderWidth": 1,
                    "cornerRadius": 6
                }
            },
            "scales": {
                "x": {
                    "min": 0,
                    "max": 100,
                    "ticks": {
                        "color": "white"
                    },
                    "grid": {"color": "rgba(255,255,255,0.2)"},
                    "title": {
                        "display": True,
                        "text": "Probability (%)",
                        "color": "white",
                        "font": {"size": 14, "weight": "bold"}
                    }
                },
                "y": {
                    "ticks": {"color": "white", "font": {"size": 12, "weight": "bold"}},
                    "grid": {"display": False}
                }
            },
            "animation": {"duration": 1000}
        }
    }

    chart_json = json.dumps(chart_config)

    html = f"""
    <div style="
        background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
        border-radius: 12px;
        padding: 20px;
        margin: 10px 0;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    ">
        <h3 style="
            color: white;
            text-align: center;
            margin-bottom: 20px;
            font-size: 18px;
            font-weight: 600;
        ">Arthrosis Severity Probability Distribution</h3>

        <div style="height: 300px; position: relative;">
            <canvas id="{chart_id}"></canvas>
        </div>

        <!-- Data labels overlay -->
        <div style="margin-top: 15px;">
            <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 5px;">
                {"".join([f'''
                <div style="
                    background: {CHART_COLORS[i]};
                    color: white;
                    padding: 6px 12px;
                    border-radius: 15px;
                    font-size: 12px;
                    font-weight: bold;
                    flex: 1;
                    text-align: center;
                    min-width: 80px;
                    {'border: 2px solid white; transform: scale(1.05);' if i == max_prob_idx else ''}
                ">
                    {labels[i]}<br>{rounded_probs[i]:.1f}%
                </div>
                ''' for i in range(len(labels))])}
            </div>
        </div>

        <p style="
            color: rgba(255,255,255,0.8);
            text-align: center;
            margin-top: 15px;
            font-size: 12px;
            font-style: italic;
        ">Prediction: {labels[max_prob_idx]} with {rounded_probs[max_prob_idx]:.1f}% confidence</p>
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js"></script>
    <script>
        // Use setTimeout to ensure DOM is ready
        setTimeout(function() {{
            const canvas = document.getElementById('{chart_id}');

            if (canvas) {{
                const ctx = canvas.getContext('2d');

                const config = {chart_json};

                // Add percentage formatter for x-axis
                config.options.scales.x.ticks.callback = function(value) {{
                    return value + '%';
                }};

                try {{
                    new Chart(ctx, config);
                    console.log('Chart created successfully');
                }} catch (e) {{
                    console.error('Chart creation failed:', e);
                }}
            }} else {{
                console.error('Canvas element not found: {chart_id}');
            }}
        }}, 200);
    </script>
    """

    components.html(html, height=450)


def main():
    icon = Image.open(ICON_PATH)
    st.set_page_config(
        page_title="Severity Analysis of Arthrosis in the Knee",
        page_icon=icon,
        layout="wide"
    )

    # Load model + Grad‐CAM helper
    model, grad_model = load_model()

    with st.sidebar:
        st.image(icon)
        st.subheader("Final Project – MDC013")
        uploaded_file = st.file_uploader("Choose X-ray image", type=["jpg", "jpeg", "png"])

        # Add some additional information in sidebar
        st.markdown("---")
        st.markdown("### About This Tool")
        st.markdown("""
        This AI-powered tool analyzes knee X-ray images to assess arthrosis severity using:

        - **Deep Learning Model**: Xception architecture fine-tuned for medical imaging
        - **Grad-CAM Visualization**: Shows which areas the model focuses on
        - **Probability Analysis**: Detailed breakdown of prediction confidence
        """)

    st.header("Severity Analysis of Arthrosis in the Knee")

    # Add description
    st.markdown("""
    Upload a knee X-ray image to get an AI-powered analysis of arthrosis severity.
    The system will provide both a prediction and visual explanations of the decision-making process.
    """)

    if uploaded_file is None:
        st.info("📁 Please upload an X-ray image to proceed with the analysis.")

        # Show example information when no file is uploaded
        st.markdown("### Severity Classifications")
        col1, col2, col3, col4, col5 = st.columns(5)

        with col1:
            st.success("**Healthy**")
            st.caption("No signs of arthrosis")

        with col2:
            st.info("**Doubtful**")
            st.caption("Questionable findings")

        with col3:
            st.warning("**Minimal**")
            st.caption("Early stage changes")

        with col4:
            st.warning("**Moderate**")
            st.caption("Clear arthrotic changes")

        with col5:
            st.error("**Severe**")
            st.caption("Advanced arthrosis")

        return

    # Two‐column layout: left for input+prediction, right for explainability+chart
    col1, col2 = st.columns([1, 1])

    with col1:
        st.subheader("🩻 Input Image")
        st.image(uploaded_file, use_container_width=True, caption="Uploaded X-ray image")

        img_array, img = preprocess_image(uploaded_file)
        if img_array is None or img is None:
            return

        if st.button("🔍 Analyze Arthrosis Severity", type="primary", use_container_width=True):
            with st.spinner("Analyzing image... This may take a moment."):
                preds = model.predict(img_array)
                probs = 100 * preds[0]
                idx = np.argmax(probs)
                cls_name = CLASS_NAMES[idx]
                cls_prob = probs[idx]

                st.subheader("📊 Prediction Results")

                # Enhanced prediction display with color coding
                if cls_name == "Healthy":
                    st.success(f"**{cls_name}** – {cls_prob:.2f}% confidence")
                elif cls_name == "Doubtful":
                    st.info(f"**{cls_name}** – {cls_prob:.2f}% confidence")
                elif cls_name == "Minimal":
                    st.warning(f"**{cls_name}** – {cls_prob:.2f}% confidence")
                elif cls_name == "Moderate":
                    st.warning(f"**{cls_name}** – {cls_prob:.2f}% confidence")
                else:  # Severe
                    st.error(f"**{cls_name}** – {cls_prob:.2f}% confidence")

                # Save for the right column
                st.session_state["probabilities"] = probs
                st.session_state["img_array"] = img_array
                st.session_state["img"] = img
                st.session_state["prediction"] = cls_name
                st.session_state["confidence"] = cls_prob

    # Show results in right column if prediction has been made
    if "probabilities" in st.session_state:
        with col2:
            st.subheader("🔍 AI Explainability (Grad-CAM)")
            st.caption("Left: Original X-ray, Right: Areas of interest highlighted by AI")

            heatmap = make_gradcam_heatmap(grad_model, st.session_state["img_array"])
            superimposed, heatmap_base64 = save_and_display_gradcam(st.session_state["img"], heatmap)
            st.image(superimposed, use_container_width=True,
                    caption="Red areas indicate regions of high attention by the AI model")

            # Store the heatmap in session state for server response
            st.session_state["heatmap_image"] = heatmap_base64

            st.subheader("📈 Detailed Analysis")
            render_probability_chart(
                CLASS_NAMES,
                st.session_state["probabilities"].tolist()
            )

            # Additional insights
            st.markdown("### 💡 Clinical Interpretation")
            pred_name = st.session_state["prediction"]
            confidence = st.session_state["confidence"]

            if confidence > 80:
                confidence_level = "High"
                confidence_color = "🟢"
            elif confidence > 60:
                confidence_level = "Moderate"
                confidence_color = "🟡"
            else:
                confidence_level = "Low"
                confidence_color = "🔴"

            # Create response data
            response_data = {
                "prediction": pred_name,
                "confidence": float(confidence),
                "confidence_level": confidence_level,
                "probabilities": st.session_state["probabilities"].tolist(),
                "heatmap_image": st.session_state["heatmap_image"]
            }

            # Store response data in session state
            st.session_state["response_data"] = response_data

            st.markdown(f"""
            **Prediction:** {pred_name}
            **Confidence Level:** {confidence_color} {confidence_level} ({confidence:.1f}%)

            *Note: This AI analysis is for research purposes and should not replace professional medical diagnosis.*
            """)


if __name__ == "__main__":
    main()
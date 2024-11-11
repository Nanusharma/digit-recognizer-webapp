from flask import Flask, render_template, request, jsonify
import google.generativeai as genai
import os
from werkzeug.utils import secure_filename
from fpdf import FPDF
import tempfile
from PIL import Image
import io

app = Flask(__name__)

# Set up configuration
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Configure Gemini API
genai.configure(api_key="AIzaSyDYltgI3n1k1hWNTss2v34SHpO3ozaF2-E")
generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 40,
    "max_output_tokens": 10000,
    "response_mime_type": "text/plain",
}
model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
)


@app.route('/')
def home():
    return render_template('main.html')

@app.route('/write')
def write():
    return render_template('indexCanvas.html')

@app.route('/upload-image')
def upload_image():
    return render_template('indexUpload.html')

@app.route('/audio')
def audio():
    return render_template('indexAudio.html')


@app.route('/upload', methods=['POST'])
def upload():
    if 'audio' in request.files:
        audio_file = request.files['audio']
        if audio_file:
            audio_file.save(os.path.join(UPLOAD_FOLDER, secure_filename(audio_file.filename)))
            return jsonify({'success': True, 'message': 'Audio uploaded successfully'}), 200

    if 'image' in request.files:
        image_file = request.files['image']
        if image_file:
            # Process the image file by saving it temporarily to get a file path
            with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_image_file:
                temp_image_file.write(image_file.read())
                temp_image_path = temp_image_file.name

            # Generate text description for the image
            response_text = gemini_img(temp_image_path)
            
            # Convert generated text to a PDF
            output_filename = text_to_pdf(response_text)
            
            # Clean up temporary image file
            os.remove(temp_image_path)

            return jsonify({'success': True, 'message': 'Image uploaded successfully', 'pdf_file': output_filename}), 200

    return jsonify({'success': False, 'error': 'No file uploaded'}), 400


def gemini_img(image_path):
    """Processes the image using the Gemini model to generate descriptive content."""
    # Upload the image file
    myfile = genai.upload_file(image_path)

    # Generate content based on the image file
    result = model.generate_content([myfile, "\n\n", 
                                     "Can you tell me what we are talking about in the image and create in-depth details to study these topics and related topics?"])

    return result.text


def text_to_pdf(text):
    """Converts provided text into a PDF file and saves it."""
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.multi_cell(0, 10, text)
    
    output_filename = os.path.join(UPLOAD_FOLDER, "output.pdf")
    pdf.output(output_filename)
    return output_filename  # Return filename for reference


# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)

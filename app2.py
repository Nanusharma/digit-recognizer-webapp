from flask import Flask, render_template, request, jsonify
import google.generativeai as genai
import os
from werkzeug.utils import secure_filename
from fpdf import FPDF
from PIL import image
app = Flask(__name__)

# Set up configuration
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# Configure Gemini API
genai.configure(api_key="")
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


# Helper function to check allowed file types
# def allowed_file(filename):
#     return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Route for the home page
@app.route('/')
def home():
    return render_template('main.html')

# Route for writing feature
@app.route('/write')
def write():
    return render_template('indexCanvas.html')

# Route for image upload page
@app.route('/upload-image')
def upload_image():
    return render_template('indexUpload.html')

# Route for audio feature
@app.route('/audio')
def audio():
    return render_template('indexAudio.html')

# Upload and analyze image
# @app.route('/upload', methods=['POST'])
# def upload():
#     if 'image' not in request.files:
#         return jsonify({'success': False, 'error': 'No file uploaded'}), 400

#     file = request.files['image']
#     if file.filename == '':
#         return jsonify({'success': False, 'error': 'No file selected'}), 400

#     if file and allowed_file(file.filename):
#         filename = secure_filename(file.filename)
#         file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
#         file.save(file_path)

#         try:
#             # Upload the image to Gemini and generate content
#             myfile = genai.upload_file(file_path)
#             query = request.form.get("query", "Can you explain what is in the image?")
#             result = model.generate_content([myfile, "\n\n", query])

#             return jsonify({'success': True, 'message': 'Image uploaded successfully', 'response': result.text})
#         except Exception as e:
#             return jsonify({'success': False, 'error': str(e)}), 500
#     else:
#         return jsonify({'success': False, 'error': 'Invalid file type'}), 400



@app.route('/upload', methods=['POST'])
def upload():
    if 'audio' in request.files:
        audio_file = request.files['audio']
        if audio_file:
            # Process the audio file (e.g., save it, analyze it, etc.)
            return jsonify({'success': True, 'message': 'Audio uploaded successfully'}), 200

    if 'image' in request.files:
        image_file = request.files['image']
        if image_file:
            # Process the image file (e.g., save it, analyze it, etc.)
            return jsonify({'success': True, 'message': 'Image uploaded successfully'}), 200

    return jsonify({'success': False, 'error': 'No file uploaded'}), 400


def text_to_pdf(text):
    # Create a PDF object
    pdf = FPDF()
    
    # Add a page to the PDF
    pdf.add_page()
    
    # Set the font and size
    pdf.set_font("Arial", size=12)
    
    # Write the text to the PDF
    pdf.multi_cell(0, 10, text)
    
    output_filename= "output.pdf"
    # Save the PDF to a file
    pdf.output(output_filename)







# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)

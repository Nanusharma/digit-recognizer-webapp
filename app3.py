from flask import Flask, render_template, jsonify, request
import os
import base64
from datetime import datetime

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('main.html')

@app.route('/save-drawing', methods=['POST'])
def save_drawing():
    try:
        # Get the image data from the request
        data = request.json['imageData']
        
        # Remove the data URL prefix to get just the base64 string
        image_data = data.replace('data:image/jpeg;base64,', '')
        
        # Decode the base64 string
        image_bytes = base64.b64decode(image_data)
        
        # Create a unique filename using timestamp
        filename = f'drawing_{datetime.now().strftime("%Y%m%d_%H%M%S")}.jpg'
        
        # Ensure the uploads directory exists
        upload_dir = os.path.join(app.static_folder, 'uploads')
        if not os.path.exists(upload_dir):
            os.makedirs(upload_dir)
        
        # Save the file
        filepath = os.path.join(upload_dir, filename)
        with open(filepath, 'wb') as f:
            f.write(image_bytes)
        
        return jsonify({
            'success': True, 
            'filename': filename,
            'path': f'/static/uploads/{filename}'
        })
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
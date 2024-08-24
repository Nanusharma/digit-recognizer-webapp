from flask import Flask, request, render_template, jsonify
import numpy as np
import pickle

app = Flask(__name__)

# Load the model
with open('model.pkl', 'rb') as file:  
    model = pickle.load(file)

@app.route('/pixel-values', methods=['POST'])
def predict():
    data = request.get_json(force=True)  
    pixel_values = data['pixelValues']
    
    # Convert the pixel values to a numpy array
    pixel_values = np.array(pixel_values).reshape(1, -1)
    # pixel_values = np.array(pixel_values).reshape(1, 28, 28, 1)
    # Make prediction
    prediction = model.predict(pixel_values)
    # prediction = np.argmax(model.predict(x_test), axis=-1)
    return jsonify({'prediction': prediction.tolist()})

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)

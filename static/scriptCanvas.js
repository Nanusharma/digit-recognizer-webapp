// const canvas = document.getElementById('canvas');
// const ctx = canvas.getContext('2d');
// const smallCanvas = document.createElement('canvas');
// const smallCtx = smallCanvas.getContext('2d');

// smallCanvas.width = 28;
// smallCanvas.height = 28;

// // function drawGrid() {
// //   ctx.strokeStyle = 'white';
// //   ctx.lineWidth = 1;

// //   for (let i = 0; i <= canvas.width; i += 28) {
// //     ctx.beginPath();
// //     ctx.moveTo(i, 0);
// //     ctx.lineTo(i, canvas.height);
// //     ctx.stroke();
// //   }

// //   for (let i = 0; i <= canvas.height; i += 28) {
// //     ctx.beginPath();
// //     ctx.moveTo(0, i);
// //     ctx.lineTo(canvas.width, i);
// //     ctx.stroke();
// //   }
// // }

// function changeCanvasColor(color) {
//   ctx.fillStyle = 'black';
//   ctx.fillRect(0, 0, canvas.width, canvas.height);
// }

// changeCanvasColor();

// let isDrawing = false;

// canvas.addEventListener('mousedown', () => isDrawing = true);
// canvas.addEventListener('mouseup', () => isDrawing = false);
// canvas.addEventListener('mousemove', draw);

// function draw(event) {
//   if (!isDrawing) return;
//   ctx.fillStyle = 'white';
//   ctx.fillRect(event.offsetX, event.offsetY, 10, 10);
// }

// function clearCanvas() {
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
  
//   changeCanvasColor();
//   drawGrid();
//   ctx.strokeStyle = 'white';
  
//   const pixelValuesElement = document.getElementById('pixelValues');
//   if (pixelValuesElement) {
//     pixelValuesElement.textContent = '';
//   }
// }


// function getPixelValues() {
//   smallCtx.drawImage(canvas, 0, 0, smallCanvas.width, smallCanvas.height);
//   const imgData = smallCtx.getImageData(0, 0, smallCanvas.width, smallCanvas.height);
//   const pixels = imgData.data;
//   const grayscaleValues = [];

//   // Create a 28x28 grid for grayscale values
//   for (let i = 0; i < smallCanvas.height; i++) {
//       const row = [];
//       for (let j = 0; j < smallCanvas.width; j++) {
//           const index = (i * smallCanvas.width + j) * 4;
//           const avg = (pixels[index] + pixels[index + 1] + pixels[index + 2]) / 3;
//           row.push(Math.floor(avg)); // Round off the grayscale value
//       }
//       grayscaleValues.push(row);
//   }

//   // Display the grayscale pixel values in the <pre> element
//   const formattedValues = grayscaleValues.map(row => row.join(', ')).join('\n');
//   document.getElementById('pixelValues').textContent = formattedValues;

//   const xhr = new XMLHttpRequest();
//   xhr.open('POST', '/pixel-values', true);
//   xhr.setRequestHeader('Content-Type', 'application/json');
//   xhr.onreadystatechange = function () {
//       if (xhr.readyState === 4 && xhr.status === 200) {
//           const response = JSON.parse(xhr.responseText);
//           console.log('Prediction:', response.prediction);

//           // Display the prediction result on the frontend
//           document.getElementById('predictionResult').textContent = 'Predicted Digit: ' + response.prediction;
//       }
//   };
//   xhr.send(JSON.stringify({ pixelValues: grayscaleValues }));
// }

// drawGrid() // Call the drawGrid function to draw the grid lines

// // drawGrid(); // Call the drawGrid function to draw the grid lines



// Canvas setup
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Drawing state
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Set canvas size to 80% of the smaller viewport dimension
function resizeCanvas() {
    const size = Math.min(window.innerWidth * 0.8, window.innerHeight * 0.8);
    canvas.width = size;
    canvas.height = size;
    
    // Reset canvas background
    setCanvasBackground();
}

// Set white background
function setCanvasBackground() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Initialize canvas
function initCanvas() {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
}

// Drawing function
function draw(e) {
    if (!isDrawing) return;
    
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    
    // Get correct coordinates based on canvas position
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.lineTo(x, y);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    
    [lastX, lastY] = [x, y];
}

// Event listeners for drawing
canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    [lastX, lastY] = [e.clientX - rect.left, e.clientY - rect.top];
});

canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mouseout', () => isDrawing = false);

// Touch events for mobile support
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    [lastX, lastY] = [touch.clientX - rect.left, touch.clientY - rect.top];
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (!isDrawing) return;
    
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    
    draw({
        clientX: touch.clientX,
        clientY: touch.clientY
    });
});

canvas.addEventListener('touchend', () => isDrawing = false);
canvas.addEventListener('touchcancel', () => isDrawing = false);

// Clear canvas function
function clearCanvas() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Save as JPG function
// Save as JPG function
function saveAsJPG() {
    // Show loading state
    const predictionResult = document.getElementById('predictionResult');
    predictionResult.textContent = 'Saving drawing...';

    // Convert canvas to JPG data URL
    const dataURL = canvas.toDataURL('image/jpeg');

    // Create a FormData object to hold both audio and image data
    const formData = new FormData();
    formData.append('image', dataURL); // Append canvas image data

    // If you have audio data, you can also append it here
    // formData.append('audio', audioBlob, 'recording.wav'); // Uncomment if you want to send audio too

    // Send to Flask backend
    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            predictionResult.textContent = 'Drawing saved successfully!';
            // Clear success message after 3 seconds
            setTimeout(() => {
                predictionResult.textContent = '';
            }, 3000);
        } else {
            throw new Error(data.error || 'Failed to save drawing');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        predictionResult.textContent = 'Error saving drawing.';
        // Clear error message after 3 seconds
        setTimeout(() => {
            predictionResult.textContent = '';
        }, 3000);
    });
}
// Initialize canvas when page loads
document.addEventListener('DOMContentLoaded', initCanvas);
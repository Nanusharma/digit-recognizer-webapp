const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const smallCanvas = document.createElement('canvas');
const smallCtx = smallCanvas.getContext('2d');

smallCanvas.width = 50;
smallCanvas.height = 50;

function drawGrid() {
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 1;

  for (let i = 0; i <= canvas.width; i += 28) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, canvas.height);
    ctx.stroke();
  }

  for (let i = 0; i <= canvas.height; i += 28) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(canvas.width, i);
    ctx.stroke();
  }
}

function changeCanvasColor(color) {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

changeCanvasColor();

let isDrawing = false;

canvas.addEventListener('mousedown', () => isDrawing = true);
canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mousemove', draw);

function draw(event) {
  if (!isDrawing) return;
  ctx.fillStyle = 'white';
  ctx.fillRect(event.offsetX, event.offsetY, 10, 10);
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  changeCanvasColor();
  drawGrid();
  ctx.strokeStyle = 'white';
  
  const pixelValuesElement = document.getElementById('pixelValues');
  if (pixelValuesElement) {
    pixelValuesElement.textContent = '';
  }
}


function getPixelValues() {
  smallCtx.drawImage(canvas, 0, 0, smallCanvas.width, smallCanvas.height);
  const imgData = smallCtx.getImageData(0, 0, smallCanvas.width, smallCanvas.height);
  const pixels = imgData.data;
  const grayscaleValues = [];

  for (let i = 0; i < pixels.length; i += 4) {
    const avg = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
    grayscaleValues.push(avg);
  }

  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/pixel-values', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      console.log('Prediction:', response.prediction);

      // Display the prediction result on the frontend
      document.getElementById('predictionResult').textContent = 'Predicted Digit: ' + response.prediction;
    }
  };
  xhr.send(JSON.stringify({ pixelValues: grayscaleValues }));
}
drawGrid() // Call the drawGrid function to draw the grid lines

// drawGrid(); // Call the drawGrid function to draw the grid lines
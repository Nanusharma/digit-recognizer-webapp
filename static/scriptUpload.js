document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const imageInput = document.getElementById('imageInput');
    const file = imageInput.files[0]; // Get the uploaded file

    if (file) {
        const formData = new FormData();
        formData.append('image', file); // Append the image file to the FormData object

        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Image uploaded successfully!');
            } else {
                alert('Error uploading image: ' + data.error);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('An error occurred while uploading the image.');
        });
    } else {
        alert('Please select an image to upload.');
    }
});
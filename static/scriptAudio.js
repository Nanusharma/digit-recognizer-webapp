let mediaRecorder;
let audioChunks = [];
let audioBlob;
const startRecordBtn = document.getElementById("startRecord");
const stopRecordBtn = document.getElementById("stopRecord");
const audioPlayback = document.getElementById("audioPlayback");
const uploadBtn = document.getElementById("uploadAudio");
const fileInput = document.getElementById("fileInput");
const uploadFileAudioBtn = document.getElementById("uploadFileAudio");

startRecordBtn.addEventListener("click", startRecording);
stopRecordBtn.addEventListener("click", stopRecording);
uploadBtn.addEventListener("click", uploadAudio);
fileInput.addEventListener("change", handleFileSelect);
uploadFileAudioBtn.addEventListener("click", uploadSelectedAudio);

async function startRecording() {
    audioChunks = [];
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start();
    mediaRecorder.ondataavailable = event => {
        audioChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
        audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        audioPlayback.src = audioUrl;

        // Enable the upload button for recorded audio
        uploadBtn.disabled = false;
    };

    startRecordBtn.disabled = true;
    stopRecordBtn.disabled = false;
}

function stopRecording() {
    mediaRecorder.stop();
    startRecordBtn.disabled = false;
    stopRecordBtn.disabled = true;
}

// Function to handle upload of recorded audio
async function uploadAudio() {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.wav');

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            console.log('Audio uploaded successfully!');
        } else {
            console.error('Audio upload failed.');
        }
    } catch (error) {
        console.error('Error uploading audio:', error);
    }
}

// Function to handle file selection
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        audioBlob = file; // Set the file as the audioBlob for uploading
        const audioUrl = URL.createObjectURL(file);
        audioPlayback.src = audioUrl;

        // Enable the upload button for selected file
        uploadFileAudioBtn.disabled = false;
    }
}

// Function to upload selected audio file
async function uploadSelectedAudio() {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'selected_audio.wav');

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            console.log('Selected audio file uploaded successfully!');
        } else {
            console.error('Audio file upload failed.');
        }
    } catch (error) {
        console.error('Error uploading audio file:', error);
    }
}

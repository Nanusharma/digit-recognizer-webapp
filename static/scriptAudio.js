let mediaRecorder;
let audioChunks = [];
let audioBlob;
const startRecordBtn = document.getElementById("startRecord");
const stopRecordBtn = document.getElementById("stopRecord");
const audioPlayback = document.getElementById("audioPlayback");
const uploadBtn = document.getElementById("uploadAudio");

startRecordBtn.addEventListener("click", startRecording);
stopRecordBtn.addEventListener("click", stopRecording);
uploadBtn.addEventListener("click", uploadAudio);

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

        // Enable the upload button
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
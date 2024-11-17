const startButton = document.getElementById('startButton');
const switchCameraButton = document.getElementById('switchCamera');
const video = document.getElementById('video');
const description = document.getElementById('description');

let facingMode = 'user'; // Default to front camera
let stream = null;

startButton.addEventListener('click', () => {
  console.log('Starting camera...');
  navigator.mediaDevices.getUserMedia({ video: { facingMode: facingMode } })
    .then(newStream => {
      console.log('Camera access successful.');
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        console.log('Stopping previous stream.');
      }
      stream = newStream;
      video.srcObject = stream;
      video.play();

      console.log('Initializing OpenCV.js...');
      cv.onRuntimeInitialized = () => {
      console.log('OpenCV.js initialized successfully!');
    };


switchCameraButton.addEventListener('click', () => {
  console.log('Switching camera...');
  facingMode = facingMode === 'user' ? 'environment' : 'user';
  startButton.click(); // Trigger camera restart with new facing mode
});

function generateDescription(predictions) {
  console.log('Generating description...');
  let descriptionText = "Detected objects: ";
  predictions.forEach(prediction => {
    descriptionText += prediction.class + ", ";
  });
  return descriptionText;
}

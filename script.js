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
        console.log('OpenCV.js initialized.');

        const videoCapture = new cv.VideoCapture(video);
        const frame = new cv.Mat();

        console.log('Loading COCO-SSD model...');
        cocoSsd.load().then(model => {
          console.log('Model loaded successfully.');

          function processFrame() {
            videoCapture.read(frame);
            console.log('Frame captured.');

            // Convert the frame to a tensor
            const tensor = tf.browser.fromPixels(frame);
            const resized = tf.image.resizeBilinear(tensor, [300, 300]);
            const expanded = resized.expandDims(0);
            console.log('Frame converted to tensor.');

            // Run the model on the tensor
            model.detect(expanded).then(predictions => {
              console.log('Object detection complete.');

              // Draw bounding boxes and labels on the frame using OpenCV.js
              // ... (Your code to draw on the frame)

              // Generate description
              const descriptionText = generateDescription(predictions);
              description.textContent = descriptionText;
              console.log('Description generated:', descriptionText);
            });

            requestAnimationFrame(processFrame);
          }

          requestAnimationFrame(processFrame);
        });
      };
    })
    .catch(error => {
      console.error('Error accessing camera:', error);
    });
});

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

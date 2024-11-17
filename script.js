const startButton = document.getElementById('startButton');
const video = document.getElementById('video');
const description = document.getElementById('description');

let facingMode = 'user'; // Default to front camera
let stream = null;

startButton.addEventListener('click', () => {
  navigator.mediaDevices.getUserMedia({ video: { facingMode: facingMode } })
    .then(newStream => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      stream = newStream;
      video.srcObject = stream;
      video.play();


      // Load the COCO-SSD model
      cocoSsd.load().then(model => {
        const src = new cv.VideoCapture(video);
        const frame = new cv.Mat();

        setInterval(() => {
          src.read(frame);

          // Convert the frame to a tensor
          const tensor = tf.browser.fromPixels(frame);
          const resized = tf.image.resizeBilinear(tensor, [300, 300]);
          const expanded = resized.expandDims(0);

          // Run the model on the tensor
          model.detect(expanded).then(predictions => {
            // Draw bounding boxes and labels on the frame
            // ... (You can use OpenCV.js functions to draw on the frame)

            // Generate description
            const descriptionText = generateDescription(predictions);
            description.textContent = descriptionText;
          });
        }, 100);
      });

      startButton.disabled = true; // Disable the button after starting the camera
    })
    .catch(error => {
      console.error('Error accessing camera:', error);
    });
});

switchCameraButton.addEventListener('click', () => {
  facingMode = facingMode === 'user' ? 'environment' : 'user';
  startButton.click(); // Trigger camera restart with new facing mode
});

function generateDescription(predictions) {
  // Implement your logic to generate a textual description based on the predictions
  // For example, you could iterate over the predictions and create a sentence like:
  // "Detected objects: person, car, dog"
  let descriptionText = "Detected objects: ";
  predictions.forEach(prediction => {
    descriptionText += prediction.class + ", ";
  });
  return descriptionText;
}

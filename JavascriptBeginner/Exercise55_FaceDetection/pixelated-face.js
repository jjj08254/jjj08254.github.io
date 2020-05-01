const wrap = document.querySelector('.wrap');
const video = document.querySelector('.webcam');
const canvas = document.querySelector('.video');
const ctx = canvas.getContext('2d');
const faceCanvas = document.querySelector('.face');
const faceCtx = faceCanvas.getContext('2d');
const optionsInputs = document.querySelectorAll(
  '.controls input[type="range"]'
);

const options = {
  SIZE: 10,
  SCALE: 1.35,
};

function handleOption(e) {
  const { value, name } = e.currentTarget;
  options[name] = parseFloat(value);
}
optionsInputs.forEach(input => input.addEventListener('input', handleOption));

const faceDetector = new window.FaceDetector();

// write a function tahta will populate the users video

async function populateVideo() {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { width: window.width, height: window.height },
  });
  video.srcObject = stream;
  await video.play();

  // size the canvases to be the same size as the video
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  faceCanvas.width = video.videoWidth;
  faceCanvas.height = video.videoHeight;
}

async function detect() {
  const faces = await faceDetector.detect(video);
  faceCtx.clearRect(0, 0, faceCanvas.width, faceCanvas.height);
  // faces is an object

  console.log(faces);
  faces.forEach(face => drawFace(face));
  faces.forEach(face => censor(face));

  // ask the browser when the next animation frame is
  // and tell it to run detect for us
  requestAnimationFrame(detect);
  // recursion is when a function calls itself,
  // it will run forever and ever and ever until something stops, until there's an exit condition
}

function drawFace(face) {
  const { width, height, top, left } = face.boundingBox;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#ffc600';
  ctx.lineWidth = 2;
  ctx.strokeRect(left, top, width, height);
}

function censor(face) {
  const faceBoundingBox = face.boundingBox;
  faceCtx.imageSmoothingEnabled = false;

  // draw the small face
  faceCtx.drawImage(
    // 5 source args
    video, // where does the source come from?
    faceBoundingBox.x, // where do we star the source pull from?
    faceBoundingBox.y, // x = left, y = top
    faceBoundingBox.width,
    faceBoundingBox.height,
    // 4 draw args
    faceBoundingBox.x, // where should we start drawing the x and y
    faceBoundingBox.y,
    options.SIZE,
    options.SIZE
  );

  // take that face back out and draw it back at normal size
  // draw the small face back on, but scale up

  const width = faceBoundingBox.width * options.SCALE;
  const height = faceBoundingBox.height * options.SCALE;
  faceCtx.drawImage(
    faceCanvas, // source
    faceBoundingBox.x, // where should we start drawing the x and y
    faceBoundingBox.y,
    options.SIZE,
    options.SIZE,
    // Drawing args
    faceBoundingBox.x - (width - faceBoundingBox.width) / 2,
    faceBoundingBox.y - (height - faceBoundingBox.height) / 2,
    width,
    height
  );
}

populateVideo().then(detect);
wrap.addEventListener('click',(e) => {
  alert('Check chrome://flags/ and see if "Experimental Web Platform features" is on')
  e.stopPropagation();
}, {once: true});
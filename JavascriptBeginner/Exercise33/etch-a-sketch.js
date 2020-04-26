// Select the elements on the page - canvas, shake button
const canvas = document.querySelector('#etch-a-sketch');
const ctx = canvas.getContext('2d');

const controlButtons = document.querySelectorAll('[data-key]');

const shakebutton = document.querySelector('.shake');

const MOVE_AMOUNT = 20;

// Setup our canvas for drawing
const { width, height } = canvas;
// make a variable called height and width from the samw properties on our canvas

let x = Math.floor(Math.random() * width);
let y = Math.floor(Math.random() * height);

let hue = 0;
ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
ctx.lineJoin = 'round';
ctx.lineCap = 'round';
ctx.lineWidth = 20;

ctx.beginPath(); // start the drawing
ctx.moveTo(x, y); // start from
ctx.lineTo(x, y); // move to
ctx.stroke();

// write a draw function
// prettier-ignore
function draw(options) { // { key } = options
  console.log(options.key); // key = options.key

  // increment the hue
  hue += 10;
  ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;

  // start the path
  ctx.beginPath();
  ctx.moveTo(x, y);
  // move our x and y values depending on what the user did
  switch (options.key) {
    case 'ArrowUp':
        y -= MOVE_AMOUNT;
        break;
    case 'ArrowRight':
        x += MOVE_AMOUNT;
        break;
    case 'ArrowLeft':
        x -= MOVE_AMOUNT;
        break;
    case 'ArrowDown':
        y += MOVE_AMOUNT;
        break; 
      default:
        break;
  }
  ctx.lineTo(x, y);
  ctx.stroke();
}

// write a handle for the keys
function handleKey(e) {
  if (e.key.includes('Arrow')) {
    e.preventDefault();
    draw({ key: e.key });
  }
}

// clear by shake function

function clearCanvas() {
  canvas.classList.add('shake');
  ctx.clearRect(0, 0, width, height);
  //   canvas.addEventListener('animationend', () => {
  //     canvas.classList.remove('shake');
  //   }, {once: true});
}

// Use Buttons to draw
function handleControl(e) {
  draw({ key: e.currentTarget.dataset.key });
}

// listen for arrow keys
window.addEventListener('keydown', handleKey);
shakebutton.addEventListener('click', clearCanvas);
canvas.addEventListener('animationend', () => {
  canvas.classList.remove('shake');
  console.log('removed');
});

controlButtons.forEach(controlButton =>
  controlButton.addEventListener('click', handleControl)
);

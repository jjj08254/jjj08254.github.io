const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');
const rgbButton = document.querySelector('[data-button=rgbSplit]');
const redButton = document.querySelector('[data-button=redEffect]');
const greenButton = document.querySelector('[data-button=greenScreen]');
const noneButton = document.querySelector('[data-button=noneEffect]');

function getVideo(){
    navigator.mediaDevices.getUserMedia({video: true, audio: false}) // return a promise
        .then(localMediaStream => {
            console.log(localMediaStream) //localMediaStream will be an object

//  DEPRECIATION : 
//       The following has been depreceated by major browsers as of Chrome and Firefox.
//       video.src = window.URL.createObjectURL(localMediaStream);
//       Please refer to these:
//       Deprecated  - https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
//       Newer Syntax - https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/srcObject
               
            video.srcObject = localMediaStream;
              // In order for video to work, it needs to be converted into some sort of URL
            video.play(); // play the video
        })
        .catch(err => {
            console.error(`OH NO!!!`, err)
        });
        // catch() method returns a Promise and deals with rejected cases only.
}

function paintToCanvas(e){
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;

    const func = effects[this.dataset.button] || noneEffect
    let TF = this.dataset.button === 'rgbSplit';
    clearInterval(interval)
    interval = setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);
        // start from top, left of the canvas and paint the height and width
        
        // take the pixels out    
        let pixels = ctx.getImageData(0, 0, width, height);
        
        
        // mess with them
        pixels = func(pixels);

        //pixels = redEffect(pixels);
        //pixels = rgbSplit(pixels);
        if(TF){
            ctx.globalAlpha = 0.4;
        };
        // put them back
        ctx.putImageData(pixels, 0, 0);

    }, 16);

    return interval
}

function takePhoto(){
    // play the sound
    snap.currentTime = 0;
    snap.play();

    // take the data out of the canvas
    const data = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'handsome'); // set 'download' attribute
    link.innerHTML = `<img src='${data}' alt='Handsome Man' />`;
    //link.textContent = 'Download Image';
    strip.insertBefore(link, strip.firstChild);
}

function noneEffect(pixels){
    return pixels
}

function redEffect(pixels){
    for(let i = 0; i < pixels.data.length; i+=4){
        pixels.data[i+0] = pixels.data[i+0] + 100; //r
        pixels.data[i+1] = pixels.data[i+1] - 50; //g
        pixels.data[i+2] = pixels.data[i+2] * 0.5; //b
    }
    return pixels;
}

function rgbSplit(pixels){
    for(let i = 0; i < pixels.data.length; i+=4){
        pixels.data[i-150] = pixels.data[i+0]; //r
        pixels.data[i+500] = pixels.data[i+1]; //g
        pixels.data[i-550] = pixels.data[i+2]; //b
    }
    return pixels;
}

function greenScreen(pixels){
  const levels = {};

  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
      // take it out!
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
}

let interval;
const effects = {
    redEffect: redEffect,
    rgbSplit: rgbSplit,
    greenScreen: greenScreen,
    noneEffect: noneEffect
}

getVideo();


video.addEventListener('canplay', paintToCanvas);
    // once video is played

redButton.addEventListener('click', paintToCanvas);
rgbButton.addEventListener('click',paintToCanvas);
greenButton.addEventListener('click',paintToCanvas);
noneButton.addEventListener('click', paintToCanvas);
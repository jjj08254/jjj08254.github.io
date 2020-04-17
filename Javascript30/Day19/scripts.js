const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo(){
    navigator.mediaDevices.getUserMedia({video: true, audio: false}) // return a promise
        .then(localMediaStream => {
            console.log(localMediaStream) //localMediaStream will be an object
            video.src = window.URL.createObjectURL(localMediaStream);
                // In order for video to work, it needs to be converted into some sort of URL
            video.play(); // play the video
        })
        .catch(err => {
            console.error(`OH NO!!!`, err)
        });
        // catch() method returns a Promise and deals with rejected cases only.
}

function paintToCanvas(){
    const width = video.videoWidth;
    const height = video.videoHight;
    canvas.width = width;
    canvas.height = height;

    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);
            // start from top, left of the canvas and paint the height and width
          
        // take the pixels out    
        let pixesls = ctx.getImageData(0, 0, width, height);
        // mess with them
            //pixels = redEffect(pixels);

            //pixels = rgbSplit(pixels);
            //ctx.globalAlpha = 0.4;

        pixels = greenScreen(pixels);
        // put them back
        ctx.putImageData(pixels, 0, 0);

    }, 16);
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

function redEffect(pixels){
    for(let i = 0; i < pixels.date.length; i+=4){
        pixels.data[i+0] = pixels.data[i+0] + 100; //r
        pixels.data[i+1] = pixels.data[i+1] - 50; //g
        pixels.data[i+2] = pixels.data[i+2] * 0.5; //b
    }
    return pixels;
}

function rgbSplit(pixels){
    for(let i = 0; i < pixels.date.length; i+=4){
        pixels.data[i-550] = pixels.data[i+0]; //r
        pixels.data[i+100] = pixels.data[i+1]; //g
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

getVideo();


video.addEventListener('camplay', paintToCanvas);
    // once video is played
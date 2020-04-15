/* Get out Elements */
var player = document.querySelector('.player');
var video = document.querySelector('.viewer');
var progress = document.querySelector('.progress');
var progressBar = document.querySelector('.progress__filled');
var toggle = document.querySelector('.toggle');
var skipButtons = document.querySelectorAll('[data-skip]');
    // [] here represents attribute
var ranges = document.querySelectorAll('.player__slider');



/* Build out Functions */
function togglePlay(){
    if(video.paused){  // video.paused is a property
        video.play();
    }else{
        video.pause()
    };
}

function updateButton(){
    if(this.paused){
        toggle.textContent = '►'
    }else{
        toggle.textContent = '❚ ❚'
    };
}

function skip(){
    // console.dir(parseFloat(this.dataset.skip));
    // console.dir(video);
    video.currentTime += parseFloat(this.dataset.skip);
        //parseFloat: change a string to number w/ decimals  
}

function handleRangeUpdate(){
    // console.dir(this.value);
    // video[this.name] = this.value;
        // video[properties]
    if(this.name === 'volume'){
        video.volume = this.value;
    }else if(this.name === 'playbackRate'){
        video.playbackRate = this.value;
    }
}

function handleProgress(){
    var percent = (video.currentTime / video.duration) * 100;
    progressBar.style.flexBasis = `${percent}%`;
}

function scrub(e){
    var scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
        //offset is position relative
    video.currentTime = scrubTime;
    console.dir(progress)
    console.log(e)
}

/* Hook up the event listener */
video.addEventListener('click',togglePlay);
video.addEventListener('play',updateButton);
video.addEventListener('pause',updateButton);
video.addEventListener('timeupdate',handleProgress);

toggle.addEventListener('click',togglePlay);
skipButtons.forEach(button => button.addEventListener('click',skip));
ranges.forEach(range => range.addEventListener('change',handleRangeUpdate));
ranges.forEach(range => range.addEventListener('mousemove',handleRangeUpdate));

var mousedown = false;
progress.addEventListener('click',scrub);

// progress.addEventListener('mousemove', () => mousedown && scrub(e))
        // if mousedown is ture then(&&) do scrub function
progress.addEventListener('mousemove', (e) => {
    if(mousedown){
        scrub(e);
    }
});
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);

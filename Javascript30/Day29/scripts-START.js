const timeButtons = document.querySelectorAll('button[data-time]')
const displayEndTime = document.querySelector('.display__end-time')
const displayLeftTime = document.querySelector('.display__time-left')

function startTimer(){
    const timeSelected = parseInt(this.dataset.time);
    timer(timeSelected)
}

let countdown;

function timer(timeSelected){
    const now = Date.now(); // (new Date()).getTime()
        //now will be current totoalsecs in milisec
    const then = now + timeSelected*1000;

    displayTimeLeft(timeSelected); // in order to display from first seconds
    addTime(then);

    clearInterval(countdown);
    // clear existing interval

    countdown = setInterval(() => {
        const secondsLeft = Math.round((then - Date.now()) / 1000); // change unit to seconds
        // chech if we should stop it
        if(secondsLeft <= 0) {
            clearInterval(countdown);
        }
        // display it
        displayTimeLeft(secondsLeft);
    }, 1000)
}

function displayTimeLeft(secondsLeft){
    const minutes = Math.floor(secondsLeft / 60);
    const remainderSeconds = secondsLeft % 60;
    const display = `${minutes < 10 ? '0' : ''}${minutes}:${remainderSeconds< 10 ? '0' : ''}${remainderSeconds}`;
    displayLeftTime.textContent = display;
    document.title = display;
}

function addTime(timestamp){
    const end = new Date(timestamp);
    const futureHours = end.getHours();
    const futureMins = end.getMinutes(); 

    // const timeSelected = parseInt(this.dataset.time);

    // const currentTime = new Date();
    // const currenthours = currentTime.getHours();
    // const currentmins = currentTime.getMinutes();
    // const currentsecs = currentTime.getSeconds();
    // const currentTotalSecs = currenthours*3600 + currentmins*60 + currentsecs;

    // const futureTotalSecs = currentTotalSecs + timeSelected;
    // const futureHours = Math.floor(futureTotalSecs/3600);
    // const futureMins = Math.floor((futureTotalSecs - futureHours*3600) / 60);

    displayEndTime.innerHTML = `Be back at 
        ${futureHours > 12 ? futureHours-12 : futureHours}:${futureMins < 10 ? '0' : ''}${futureMins}`;
}


timeButtons.forEach(timeButton => timeButton.addEventListener('click', startTimer));
// document.customForm.addEventListener('submit', function(e){
//     e.preventDefault();
//     this.minutes.value;
//     this.reset();
// });

form = document.querySelector('#custom');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const mins = form.minutes.value;
    const secs = mins*60;
    timer(secs);
    form.reset();
});
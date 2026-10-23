const audio = document.getElementById('audio-player');
const playBtn = document.getElementById('play-btn');
const volumeBtn = document.getElementById('volume-btn');
const currentTimeEl = document.getElementById('current-time');
const duration = document.getElementById('duration');
const progressBar = document.getElementById('progress-bar');
const progressContainer = document.getElementById('progress-container');
const volumeSlider = document.getElementById('volume-slider');

//To Format seconds into MM:SS format
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    //return mins: (check if secs is less than 10, if true add a leading 0 in front)
    //if false add an empty string and add the seconds to give us the audio duration.
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
}

audio.addEventListener('loadedmetadata', () => {
    duration.textContent = formatTime(audio.duration);
})

audio.addEventListener('ended', () => {
    playBtn.classList.remove('fa-circle-pause');
    playBtn.classList.add('fa-circle-play');
    currentTimeEl.innerText = '0:00';
    progressBar.style.width = '0%';
    cardElement.classList.remove('is-playing');
    cardElement.classList.add('jumah-mubarak-card');
})

function togglePlay() {
    if (audio.paused) {
        audio.play();
        playBtn.classList.remove('fa-circle-play');
        playBtn.classList.add('fa-circle-pause');
        cardElement.classList.add('is-playing');
    } else {
        audio.pause();
        playBtn.classList.remove('fa-circle-pause');
        playBtn.classList.add('fa-circle-play');
        cardElement.classList.remove('is-playing');
    }
}

playBtn.addEventListener('click', togglePlay);

function updateProgress(e) {
    const {currentTime, duration} = e.srcElement;
    if (isNaN(duration)) return;

    const progressPercent = (currentTime / duration) * 100;
    progressBar.style.width = `${progressPercent}%`;

    currentTimeEl.textContent = formatTime(currentTime);
}

audio.addEventListener('timeupdate', updateProgress);

function toggleMute() {
    audio.muted = !audio.muted;

    if (audio.muted) {
        volumeBtn.classList.remove('fa-volume-high');
        volumeBtn.classList.add('fa-volume-xmark')
    } else {
        volumeBtn.classList.remove('fa-volume-xmark');
        volumeBtn.classList.add('fa-volume-high')
    }
}

volumeBtn.addEventListener('click', toggleMute);

function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;

    if (!isNaN(duration)) {
        audio.currentTime = (clickX / width) * duration;
    }
}

progressContainer.addEventListener('click', setProgress)

volumeSlider.addEventListener('input', (e) => {
    audio.volume = e.target.value;
    
    if (audio.volume === 0) {
        volumeBtn.classList.remove('fa-volume-high');
        volumeBtn.classList.add('fa-volume-xmark');
        audio.muted = true;
    } else {
        volumeBtn.classList.remove('fa-volume-xmark');
        volumeBtn.classList.add('fa-volume-high');
        audio.muted = false;
    }
});

const cardElement = document.querySelector('#card');
const quoteText  = document.getElementById('quote-text');
const shareBtn = document.getElementById('share-btn');

const duaaList = [
    "“Whoever reads Surah Al-Kahf on the day of Jumu'ah, a light will shine for them between this Friday and the next.”",
    "“O Allah, bless our Jumu'ah and fill our hearts with peace and gratitude.”",
    "“Friday is the balance of the week, the sanctuary of the soul.”",
    "“May your Jumu'ah be filled with accepted prayers and abundant blessings.”"
];

function loadRandomQuote() {
    const randomIndex = Math.floor(Math.random() * duaaList.length);
    quoteText.textContent = duaaList[randomIndex];
}
loadRandomQuote();

shareBtn.addEventListener('click', async () => {
    if (navigator.share) {
        try {
            await navigator.share({
                title: 'Jumu\'ah Mubarak',
                text: 'Listen to this peaceful recitation for Jumu\'ah Mubarak!',
                url: window.location.href,
            });
        } catch (err) {
            console.log('Share canceled', err);
        }
    } else {
        // Fallback for browsers that don't support native share
        navigator.clipboard.writeText(window.location.href);
        alert('Card link copied to clipboard!');
    }
});
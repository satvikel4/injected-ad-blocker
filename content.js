function getYouTubeVideoId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('v');
}

function injectTranscriptButton() {
    const controlsContainer = document.querySelector('.ytp-right-controls');
    if (controlsContainer) {
        const transcriptButton = document.createElement('button');
        transcriptButton.textContent = 'Get Transcript';
        transcriptButton.style.cssText = 'margin-right: 10px; padding: 5px;';
        transcriptButton.addEventListener('click', handleTranscriptRetrieval);
        controlsContainer.prepend(transcriptButton);
    }
}

function handleTranscriptRetrieval() {
    const videoId = getYouTubeVideoId();
    const tactiqUrl = `https://tactiq.io/tools/run/youtube_transcript?yt=${videoId}`;
    window.open(tactiqUrl, '_blank');
}

function injectAdSkipButton() {
    const controlsContainer = document.querySelector('.ytp-right-controls');
    if (controlsContainer) {
        const adSkipButton = document.createElement('button');
        adSkipButton.textContent = 'Analyze & Skip Ads';
        adSkipButton.style.cssText = 'margin-right: 10px; padding: 5px;';
        adSkipButton.addEventListener('click', handleAdSkipping);
        controlsContainer.prepend(adSkipButton);
    }
}

async function handleAdSkipping() {
    const transcript = prompt("Please paste the transcript from tactiq.io:");
    if (transcript) {
        const adTimestamps = await detectAds(transcript);
        controlPlayback(adTimestamps);
    }
}

async function detectAds(transcript) {
    const response = await fetch('http://localhost:5000/detect-ads', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transcript }),
    });
    return await response.json();
}

function controlPlayback(adTimestamps) {
    const video = document.querySelector('video');
    if (!video) return;

    let currentAdIndex = 0;

    video.addEventListener('timeupdate', () => {
        if (currentAdIndex < adTimestamps.length) {
            const [adStart, adEnd] = adTimestamps[currentAdIndex];
            if (video.currentTime >= adStart && video.currentTime < adEnd) {
                video.currentTime = adEnd;
                currentAdIndex++;
            }
        }
    });
}

injectTranscriptButton();
injectAdSkipButton();
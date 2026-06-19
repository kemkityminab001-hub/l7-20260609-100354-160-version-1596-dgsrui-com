(function () {
    var shell = document.querySelector('[data-player]');
    if (!shell) {
        return;
    }

    var video = shell.querySelector('video');
    var cover = shell.querySelector('.play-trigger');
    var mediaUrl = window.__CURRENT_STREAM__;
    var hlsInstance = null;

    function attachMedia() {
        if (!video || !mediaUrl || video.getAttribute('data-ready') === '1') {
            return;
        }

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = mediaUrl;
        } else if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hlsInstance.loadSource(mediaUrl);
            hlsInstance.attachMedia(video);
        } else {
            video.src = mediaUrl;
        }

        video.setAttribute('data-ready', '1');
    }

    function startPlayback() {
        attachMedia();
        if (cover) {
            cover.classList.add('is-hidden');
        }
        var playTask = video.play();
        if (playTask && typeof playTask.catch === 'function') {
            playTask.catch(function () {
                if (cover) {
                    cover.classList.remove('is-hidden');
                }
            });
        }
    }

    if (cover) {
        cover.addEventListener('click', startPlayback);
    }

    video.addEventListener('click', function () {
        if (video.paused) {
            startPlayback();
        } else {
            video.pause();
        }
    });

    window.addEventListener('pagehide', function () {
        if (hlsInstance) {
            hlsInstance.destroy();
        }
    });
})();

(function() {
    var player = document.querySelector('[data-player]');

    if (!player) {
        return;
    }

    var video = player.querySelector('video');
    var cover = player.querySelector('[data-play-cover]');
    var button = player.querySelector('[data-play-button]');
    var source = player.getAttribute('data-m3u8');
    var started = false;
    var hlsInstance = null;

    function startVideo() {
        if (!video || !source) {
            return;
        }

        if (!started) {
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls();
                hlsInstance.loadSource(source);
                hlsInstance.attachMedia(video);
            } else {
                video.src = source;
            }

            started = true;
        }

        video.controls = true;

        if (cover) {
            cover.classList.add('is-hidden');
        }

        var promise = video.play();

        if (promise && typeof promise.catch === 'function') {
            promise.catch(function() {
                if (cover) {
                    cover.classList.remove('is-hidden');
                }
            });
        }
    }

    if (button) {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            startVideo();
        });
    }

    if (cover) {
        cover.addEventListener('click', startVideo);
    }

    player.addEventListener('click', function(event) {
        if (!started && event.target !== video) {
            startVideo();
        }
    });

    window.addEventListener('pagehide', function() {
        if (hlsInstance) {
            hlsInstance.destroy();
            hlsInstance = null;
        }
    });
})();

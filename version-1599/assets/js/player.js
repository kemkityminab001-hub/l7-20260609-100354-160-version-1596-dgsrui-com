(function () {
  window.initMoviePlayer = function (videoUrl, videoId, buttonId, shellId) {
    var video = document.getElementById(videoId);
    var button = document.getElementById(buttonId);
    var shell = document.getElementById(shellId);
    var started = false;
    var hlsInstance = null;

    if (!video || !button || !shell || !videoUrl) {
      return;
    }

    function attachSource() {
      if (started) {
        return;
      }
      started = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = videoUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls();
        hlsInstance.loadSource(videoUrl);
        hlsInstance.attachMedia(video);
      } else {
        video.src = videoUrl;
      }
    }

    function playVideo() {
      attachSource();
      button.classList.add('is-hidden');
      var playRequest = video.play();
      if (playRequest && typeof playRequest.catch === 'function') {
        playRequest.catch(function () {
          button.classList.remove('is-hidden');
        });
      }
    }

    function toggleVideo() {
      if (video.paused) {
        playVideo();
      } else {
        video.pause();
      }
    }

    button.addEventListener('click', playVideo);
    shell.addEventListener('click', function (event) {
      if (event.target === shell) {
        playVideo();
      }
    });
    video.addEventListener('click', toggleVideo);
    video.addEventListener('play', function () {
      button.classList.add('is-hidden');
    });
    video.addEventListener('pause', function () {
      if (!video.ended) {
        button.classList.remove('is-hidden');
      }
    });
    window.addEventListener('beforeunload', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  };
})();

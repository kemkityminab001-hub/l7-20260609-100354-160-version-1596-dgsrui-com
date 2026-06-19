function createPlayableVideo(sourceUrl) {
  var frame = document.querySelector('[data-player]');

  if (!frame) {
    return;
  }

  var video = frame.querySelector('video');
  var overlay = frame.querySelector('.player-overlay');
  var hlsInstance = null;
  var hasStarted = false;

  function startPlayback() {
    if (!video || hasStarted) {
      return;
    }

    hasStarted = true;

    if (overlay) {
      overlay.classList.add('is-hidden');
    }

    video.setAttribute('controls', 'controls');

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = sourceUrl;
      video.play().catch(function() {});
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(sourceUrl);
      hlsInstance.attachMedia(video);
      hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function() {
        video.play().catch(function() {});
      });
      return;
    }

    video.src = sourceUrl;
    video.play().catch(function() {});
  }

  if (overlay) {
    overlay.addEventListener('click', startPlayback);
  }

  frame.addEventListener('click', function(event) {
    if (event.target === video || event.target === frame) {
      startPlayback();
    }
  });

  video.addEventListener('play', function() {
    if (overlay) {
      overlay.classList.add('is-hidden');
    }
  });

  window.addEventListener('pagehide', function() {
    if (hlsInstance) {
      hlsInstance.destroy();
      hlsInstance = null;
    }
  });
}

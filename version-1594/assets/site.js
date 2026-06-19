(function () {
  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function setupNavigation() {
    var toggle = document.querySelector("[data-nav-toggle]");
    var panel = document.querySelector("[data-mobile-panel]");
    if (!toggle || !panel) {
      return;
    }
    toggle.addEventListener("click", function () {
      panel.classList.toggle("open");
    });
  }

  function setupSearchForms() {
    document.querySelectorAll("[data-site-search]").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var input = form.querySelector("input[name='q']");
        var query = input ? input.value.trim() : "";
        var target = "./search.html";
        if (query) {
          target += "?q=" + encodeURIComponent(query);
        }
        window.location.href = target;
      });
    });
  }

  function setupHero() {
    var shell = document.querySelector("[data-hero-slider]");
    if (!shell) {
      return;
    }
    var slides = Array.prototype.slice.call(shell.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(shell.querySelectorAll("[data-hero-dot]"));
    if (!slides.length) {
      return;
    }
    var index = 0;
    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("active", slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === index);
      });
    }
    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener("click", function () {
        show(dotIndex);
      });
    });
    window.setInterval(function () {
      show(index + 1);
    }, 5200);
  }

  function setupFilters() {
    document.querySelectorAll(".filter-scope").forEach(function (scope) {
      var search = scope.querySelector("[data-card-search]");
      var filters = Array.prototype.slice.call(scope.querySelectorAll("[data-filter-field]"));
      var sort = scope.querySelector("[data-card-sort]");
      var list = scope.querySelector("[data-card-list]");
      if (!list) {
        return;
      }
      var cards = Array.prototype.slice.call(list.querySelectorAll(".movie-card"));
      function apply() {
        var query = search ? search.value.trim().toLowerCase() : "";
        cards.forEach(function (card) {
          var text = (card.getAttribute("data-keywords") || "") + " " + (card.getAttribute("data-title") || "");
          var visible = !query || text.toLowerCase().indexOf(query) !== -1;
          filters.forEach(function (filter) {
            var field = filter.getAttribute("data-filter-field");
            var value = filter.value;
            if (value && card.getAttribute("data-" + field) !== value) {
              visible = false;
            }
          });
          card.classList.toggle("hidden-card", !visible);
        });
      }
      function reorder() {
        if (!sort) {
          return;
        }
        var value = sort.value;
        var sorted = cards.slice();
        if (value === "year-desc") {
          sorted.sort(function (a, b) {
            return Number(b.getAttribute("data-year") || 0) - Number(a.getAttribute("data-year") || 0);
          });
        }
        if (value === "year-asc") {
          sorted.sort(function (a, b) {
            return Number(a.getAttribute("data-year") || 0) - Number(b.getAttribute("data-year") || 0);
          });
        }
        if (value === "title-asc") {
          sorted.sort(function (a, b) {
            return (a.getAttribute("data-title") || "").localeCompare(b.getAttribute("data-title") || "", "zh-Hans-CN");
          });
        }
        sorted.forEach(function (card) {
          list.appendChild(card);
        });
      }
      if (search) {
        search.addEventListener("input", apply);
      }
      filters.forEach(function (filter) {
        filter.addEventListener("change", apply);
      });
      if (sort) {
        sort.addEventListener("change", function () {
          reorder();
          apply();
        });
      }
      var params = new URLSearchParams(window.location.search);
      var q = params.get("q");
      if (q && search) {
        search.value = q;
      }
      var sortValue = params.get("sort");
      if (sortValue && sort) {
        if (sortValue === "latest") {
          sort.value = "year-desc";
        }
        if (sortValue === "popular") {
          sort.value = "default";
        }
      }
      reorder();
      apply();
    });
  }

  window.initializeMoviePlayer = function (source) {
    var shell = document.querySelector(".player-shell");
    if (!shell) {
      return;
    }
    var video = shell.querySelector("video");
    var overlay = shell.querySelector(".player-overlay");
    var message = shell.querySelector(".player-message");
    var hlsInstance = null;
    var loaded = false;

    function showMessage(text) {
      if (!message) {
        return;
      }
      message.textContent = text;
      message.classList.add("show");
      window.setTimeout(function () {
        message.classList.remove("show");
      }, 2600);
    }

    function loadVideo() {
      if (loaded || !video) {
        return;
      }
      loaded = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
      } else {
        showMessage("播放暂时不可用");
      }
    }

    function playVideo() {
      loadVideo();
      if (!video) {
        return;
      }
      var promise = video.play();
      if (promise && promise.catch) {
        promise.catch(function () {
          showMessage("点击播放器继续播放");
        });
      }
    }

    if (overlay) {
      overlay.addEventListener("click", playVideo);
    }
    video.addEventListener("play", function () {
      shell.classList.add("playing");
    });
    video.addEventListener("pause", function () {
      shell.classList.remove("playing");
    });
    video.addEventListener("error", function () {
      showMessage("播放暂时不可用");
    });
    video.addEventListener("click", function () {
      if (video.paused) {
        playVideo();
      }
    });
    window.addEventListener("beforeunload", function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  };

  onReady(function () {
    setupNavigation();
    setupSearchForms();
    setupHero();
    setupFilters();
  });
})();

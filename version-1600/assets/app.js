(function () {
  const menuButton = document.querySelector(".menu-toggle");
  const mobileNav = document.querySelector(".mobile-nav");

  if (menuButton && mobileNav) {
    menuButton.addEventListener("click", function () {
      const isOpen = mobileNav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });
  }

  const backButton = document.querySelector(".back-to-top");

  if (backButton) {
    const toggleBackButton = function () {
      backButton.classList.toggle("show", window.scrollY > 420);
    };

    toggleBackButton();
    window.addEventListener("scroll", toggleBackButton, { passive: true });
    backButton.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const hero = document.querySelector("[data-hero-slider]");

  if (hero) {
    const slides = Array.from(hero.querySelectorAll(".hero-slide"));
    const thumbs = Array.from(hero.querySelectorAll(".hero-thumb"));
    let index = 0;
    let timer = null;

    const showSlide = function (nextIndex) {
      if (!slides.length) {
        return;
      }

      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("active", slideIndex === index);
      });
      thumbs.forEach(function (thumb, thumbIndex) {
        thumb.classList.toggle("active", thumbIndex === index);
      });
    };

    const startTimer = function () {
      timer = window.setInterval(function () {
        showSlide(index + 1);
      }, 5200);
    };

    const resetTimer = function () {
      if (timer) {
        window.clearInterval(timer);
      }
      startTimer();
    };

    thumbs.forEach(function (thumb) {
      thumb.addEventListener("click", function () {
        const next = Number(thumb.getAttribute("data-slide"));
        if (!Number.isNaN(next)) {
          showSlide(next);
          resetTimer();
        }
      });
    });

    showSlide(0);
    startTimer();
  }

  const grid = document.querySelector(".filter-grid");
  const searchInput = document.querySelector(".page-search-input");
  const selects = Array.from(document.querySelectorAll(".filter-select"));
  const emptyState = document.querySelector(".empty-state");

  if (grid && searchInput) {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q") || "";

    if (query) {
      searchInput.value = query;
    }

    const cards = Array.from(grid.querySelectorAll(".movie-card"));

    const applyFilters = function () {
      const keyword = searchInput.value.trim().toLowerCase();
      let visibleCount = 0;

      cards.forEach(function (card) {
        const text = [
          card.getAttribute("data-title"),
          card.getAttribute("data-year"),
          card.getAttribute("data-type"),
          card.getAttribute("data-region"),
          card.getAttribute("data-genre"),
          card.getAttribute("data-tags")
        ].join(" ").toLowerCase();

        let matched = !keyword || text.includes(keyword);

        selects.forEach(function (select) {
          const key = select.getAttribute("data-filter-key");
          const value = select.value;

          if (value && card.getAttribute("data-" + key) !== value) {
            matched = false;
          }
        });

        card.style.display = matched ? "" : "none";
        if (matched) {
          visibleCount += 1;
        }
      });

      if (emptyState) {
        emptyState.classList.toggle("show", visibleCount === 0);
      }
    };

    searchInput.addEventListener("input", applyFilters);
    selects.forEach(function (select) {
      select.addEventListener("change", applyFilters);
    });
    applyFilters();
  }
})();

function initMoviePlayer(playUrl) {
  const video = document.getElementById("movie-player");
  const shell = document.querySelector(".player-shell");
  const startButton = document.querySelector(".player-start");
  let attached = false;
  let hls = null;

  if (!video || !playUrl) {
    return;
  }

  const attach = function () {
    if (attached) {
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
      hls.loadSource(playUrl);
      hls.attachMedia(video);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = playUrl;
    } else {
      video.src = playUrl;
    }

    attached = true;
  };

  const begin = function () {
    attach();
    const promise = video.play();

    if (promise && typeof promise.catch === "function") {
      promise.catch(function () {});
    }
  };

  if (startButton) {
    startButton.addEventListener("click", begin);
  }

  video.addEventListener("click", function () {
    if (video.paused) {
      begin();
    }
  });

  video.addEventListener("play", function () {
    if (shell) {
      shell.classList.add("is-playing");
    }
  });

  video.addEventListener("pause", function () {
    if (shell) {
      shell.classList.remove("is-playing");
    }
  });

  video.addEventListener("ended", function () {
    if (shell) {
      shell.classList.remove("is-playing");
    }
  });

  window.addEventListener("pagehide", function () {
    if (hls) {
      hls.destroy();
      hls = null;
    }
  });
}

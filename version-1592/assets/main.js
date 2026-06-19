(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function setupMenu() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var panel = document.querySelector("[data-mobile-panel]");
    if (!toggle || !panel) {
      return;
    }
    toggle.addEventListener("click", function () {
      panel.classList.toggle("is-open");
    });
  }

  function setupHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
    if (!slides.length) {
      return;
    }
    var current = 0;
    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === current);
      });
    }
    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        show(index);
      });
    });
    show(0);
    window.setInterval(function () {
      show(current + 1);
    }, 5200);
  }

  function setupSearchForms() {
    var forms = Array.prototype.slice.call(document.querySelectorAll("[data-site-search]"));
    forms.forEach(function (form) {
      form.addEventListener("submit", function (event) {
        var input = form.querySelector("input[name='q']");
        if (!input || !input.value.trim()) {
          event.preventDefault();
          return;
        }
      });
    });
  }

  function setupLocalFilter() {
    var form = document.querySelector("[data-local-filter]");
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-movie-card]"));
    if (!form || !cards.length) {
      return;
    }
    function applyFilter() {
      var q = (form.querySelector("[name='localSearch']") || {}).value || "";
      var type = (form.querySelector("[name='typeFilter']") || {}).value || "";
      var year = (form.querySelector("[name='yearFilter']") || {}).value || "";
      q = q.trim().toLowerCase();
      cards.forEach(function (card) {
        var text = (card.getAttribute("data-text") || "").toLowerCase();
        var cardType = card.getAttribute("data-type") || "";
        var cardYear = card.getAttribute("data-year") || "";
        var matched = true;
        if (q && text.indexOf(q) === -1) {
          matched = false;
        }
        if (type && cardType !== type) {
          matched = false;
        }
        if (year && cardYear !== year) {
          matched = false;
        }
        card.style.display = matched ? "" : "none";
      });
    }
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      applyFilter();
    });
    form.addEventListener("input", applyFilter);
    form.addEventListener("change", applyFilter);
  }

  function textNode(parent, text) {
    parent.appendChild(document.createTextNode(text || ""));
  }

  function makeSearchCard(item) {
    var article = document.createElement("article");
    article.className = "movie-card";

    var poster = document.createElement("a");
    poster.className = "poster-link";
    poster.href = item.url;

    var img = document.createElement("img");
    img.src = item.cover;
    img.alt = item.title;
    img.loading = "lazy";
    poster.appendChild(img);

    var badge = document.createElement("span");
    badge.className = "card-badge";
    textNode(badge, item.year + " · " + item.type);
    poster.appendChild(badge);
    article.appendChild(poster);

    var body = document.createElement("div");
    body.className = "card-body";

    var title = document.createElement("h2");
    title.className = "card-title";
    var link = document.createElement("a");
    link.href = item.url;
    textNode(link, item.title);
    title.appendChild(link);
    body.appendChild(title);

    var meta = document.createElement("div");
    meta.className = "meta-line";
    textNode(meta, item.category + " · " + item.region);
    body.appendChild(meta);

    var desc = document.createElement("p");
    desc.className = "card-text";
    textNode(desc, item.oneLine);
    body.appendChild(desc);

    article.appendChild(body);
    return article;
  }

  function setupSearchPage() {
    var results = document.querySelector("[data-search-results]");
    if (!results || !window.SEARCH_MOVIES) {
      return;
    }
    var form = document.querySelector("[data-search-page-form]");
    var input = document.querySelector("[data-search-page-input]");
    var params = new URLSearchParams(window.location.search);
    var initial = (params.get("q") || "").trim();
    if (input) {
      input.value = initial;
    }
    function render(query) {
      var q = (query || "").trim().toLowerCase();
      var list = window.SEARCH_MOVIES.filter(function (item) {
        if (!q) {
          return true;
        }
        var haystack = [item.title, item.region, item.type, item.category, item.tags, item.oneLine, String(item.year)].join(" ").toLowerCase();
        return haystack.indexOf(q) !== -1;
      }).slice(0, 96);
      results.innerHTML = "";
      if (!list.length) {
        var empty = document.createElement("div");
        empty.className = "empty-state";
        textNode(empty, "没有找到匹配内容，可以换一个片名、类型或标签继续搜索。");
        results.appendChild(empty);
        return;
      }
      list.forEach(function (item) {
        results.appendChild(makeSearchCard(item));
      });
    }
    if (form && input) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var value = input.value.trim();
        var target = value ? "search.html?q=" + encodeURIComponent(value) : "search.html";
        window.history.replaceState(null, "", target);
        render(value);
      });
    }
    render(initial);
  }

  function setupPlayer(source) {
    var video = document.getElementById("movieVideo");
    var button = document.querySelector("[data-play-button]");
    if (!video || !source) {
      return;
    }
    var attached = false;
    function attach(callback) {
      if (attached) {
        if (callback) {
          callback();
        }
        return;
      }
      attached = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
        if (callback) {
          callback();
        }
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls();
        hls.loadSource(source);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          if (callback) {
            callback();
          }
        });
      } else {
        video.src = source;
        if (callback) {
          callback();
        }
      }
    }
    function start() {
      attach(function () {
        if (button) {
          button.classList.add("is-hidden");
        }
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(function () {});
        }
      });
    }
    if (button) {
      button.addEventListener("click", start);
    }
    video.addEventListener("click", function () {
      if (!attached) {
        start();
      }
    });
  }

  window.setupPlayer = setupPlayer;

  ready(function () {
    setupMenu();
    setupHero();
    setupSearchForms();
    setupLocalFilter();
    setupSearchPage();
  });
})();

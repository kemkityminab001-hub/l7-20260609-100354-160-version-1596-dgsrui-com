(function() {
  var navToggle = document.querySelector('.nav-toggle');
  var mobilePanel = document.querySelector('[data-mobile-panel]');

  if (navToggle && mobilePanel) {
    navToggle.addEventListener('click', function() {
      var isOpen = mobilePanel.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.textContent = isOpen ? '×' : '☰';
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var heroIndex = 0;

  function showHeroSlide(index) {
    if (!slides.length) {
      return;
    }

    heroIndex = (index + slides.length) % slides.length;

    slides.forEach(function(slide, current) {
      slide.classList.toggle('is-active', current === heroIndex);
    });

    dots.forEach(function(dot, current) {
      dot.classList.toggle('is-active', current === heroIndex);
    });
  }

  dots.forEach(function(dot) {
    dot.addEventListener('click', function() {
      var nextIndex = Number(dot.getAttribute('data-hero-dot')) || 0;
      showHeroSlide(nextIndex);
    });
  });

  if (slides.length > 1) {
    window.setInterval(function() {
      showHeroSlide(heroIndex + 1);
    }, 5200);
  }

  var searchForms = Array.prototype.slice.call(document.querySelectorAll('[data-search-form]'));

  searchForms.forEach(function(form) {
    form.addEventListener('submit', function(event) {
      var input = form.querySelector('input[name="q"]');
      if (!input || input.value.trim()) {
        return;
      }
      event.preventDefault();
      input.focus();
    });
  });

  var localSearch = document.querySelector('[data-local-search]');
  var filterButtons = Array.prototype.slice.call(document.querySelectorAll('[data-filter-value]'));
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
  var activeFilter = '';

  function applyLocalFilter() {
    if (!cards.length) {
      return;
    }

    var keyword = localSearch ? localSearch.value.trim().toLowerCase() : '';

    cards.forEach(function(card) {
      var haystack = [
        card.getAttribute('data-title') || '',
        card.getAttribute('data-tags') || '',
        card.getAttribute('data-year') || '',
        card.getAttribute('data-region') || ''
      ].join(' ').toLowerCase();
      var matchKeyword = !keyword || haystack.indexOf(keyword) !== -1;
      var matchFilter = !activeFilter || haystack.indexOf(activeFilter.toLowerCase()) !== -1;
      card.classList.toggle('is-filtered-out', !(matchKeyword && matchFilter));
    });
  }

  if (localSearch) {
    localSearch.addEventListener('input', applyLocalFilter);
  }

  filterButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      filterButtons.forEach(function(item) {
        item.classList.remove('is-active');
      });
      button.classList.add('is-active');
      activeFilter = button.getAttribute('data-filter-value') || '';
      applyLocalFilter();
    });
  });

  function cardTemplate(movie) {
    var tags = movie.tags.slice(0, 3).map(function(tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join('');

    return [
      '<article class="movie-card">',
      '  <a class="movie-thumb" href="' + escapeHtml(movie.url) + '">',
      '    <img src="' + escapeHtml(movie.image) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
      '    <span class="duration-pill">' + escapeHtml(movie.duration) + '</span>',
      '  </a>',
      '  <div class="movie-card-body">',
      '    <a class="movie-title" href="' + escapeHtml(movie.url) + '">' + escapeHtml(movie.title) + '</a>',
      '    <p>' + escapeHtml(movie.oneLine) + '</p>',
      '    <div class="movie-meta">',
      '      <span>' + escapeHtml(movie.year) + '</span>',
      '      <span>' + escapeHtml(movie.region) + '</span>',
      '      <span>' + escapeHtml(movie.type) + '</span>',
      '    </div>',
      '    <div class="tag-row">' + tags + '</div>',
      '  </div>',
      '</article>'
    ].join('');
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, function(character) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[character];
    });
  }

  function runSearchPage() {
    var resultBox = document.querySelector('[data-search-results]');
    var titleBox = document.querySelector('[data-search-title]');
    var input = document.querySelector('[data-search-input]');

    if (!resultBox || !window.MOVIE_SEARCH_DATA) {
      return;
    }

    var params = new URLSearchParams(window.location.search);
    var query = (params.get('q') || '').trim();

    if (input) {
      input.value = query;
    }

    if (!query) {
      return;
    }

    var tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
    var results = window.MOVIE_SEARCH_DATA.filter(function(movie) {
      var haystack = [movie.title, movie.oneLine, movie.region, movie.type, movie.year, movie.genre, movie.tags.join(' ')].join(' ').toLowerCase();
      return tokens.every(function(token) {
        return haystack.indexOf(token) !== -1;
      });
    }).slice(0, 120);

    if (titleBox) {
      titleBox.textContent = '搜索结果';
    }

    if (!results.length) {
      resultBox.innerHTML = '<div class="content-panel"><h2>暂无匹配内容</h2><p>换一个影片名、地区、年份或类型关键词试试。</p></div>';
      return;
    }

    resultBox.innerHTML = results.map(cardTemplate).join('');
  }

  runSearchPage();
})();

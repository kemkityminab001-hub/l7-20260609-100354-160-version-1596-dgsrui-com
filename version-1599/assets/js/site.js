(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function normalize(value) {
    return (value || '').toString().toLowerCase().trim();
  }

  ready(function () {
    var searchToggle = document.querySelector('.search-toggle');
    var headerSearch = document.querySelector('.header-search');
    var menuToggle = document.querySelector('.menu-toggle');
    var mobileNav = document.querySelector('.mobile-nav');
    var backTop = document.querySelector('.back-to-top');

    if (searchToggle && headerSearch) {
      searchToggle.addEventListener('click', function () {
        headerSearch.classList.toggle('is-open');
        var input = headerSearch.querySelector('input');
        if (headerSearch.classList.contains('is-open') && input) {
          input.focus();
        }
      });
    }

    if (menuToggle && mobileNav) {
      menuToggle.addEventListener('click', function () {
        mobileNav.classList.toggle('is-open');
      });
    }

    if (backTop) {
      window.addEventListener('scroll', function () {
        if (window.scrollY > 320) {
          backTop.classList.add('is-visible');
        } else {
          backTop.classList.remove('is-visible');
        }
      });
      backTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    if (slides.length > 1) {
      var current = 0;
      var showSlide = function (index) {
        current = index;
        slides.forEach(function (slide, i) {
          slide.classList.toggle('is-active', i === current);
        });
        dots.forEach(function (dot, i) {
          dot.classList.toggle('is-active', i === current);
        });
      };
      dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
          showSlide(index);
        });
      });
      window.setInterval(function () {
        showSlide((current + 1) % slides.length);
      }, 5600);
    }

    var filterInputs = Array.prototype.slice.call(document.querySelectorAll('[data-filter-input]'));
    filterInputs.forEach(function (input) {
      var list = document.querySelector(input.getAttribute('data-filter-input')) || document.querySelector('[data-filter-list]');
      var empty = document.querySelector('[data-empty-state]');
      var filter = function () {
        var keyword = normalize(input.value);
        var cards = list ? Array.prototype.slice.call(list.querySelectorAll('.movie-card')) : [];
        var visible = 0;
        cards.forEach(function (card) {
          var matched = !keyword || normalize(card.getAttribute('data-search')).indexOf(keyword) !== -1;
          card.style.display = matched ? '' : 'none';
          if (matched) {
            visible += 1;
          }
        });
        if (empty) {
          empty.classList.toggle('is-visible', visible === 0);
        }
      };
      input.addEventListener('input', filter);
      filter();
    });

    var searchPageInput = document.querySelector('#search-page-input');
    if (searchPageInput) {
      var params = new URLSearchParams(window.location.search);
      var q = params.get('q');
      if (q) {
        searchPageInput.value = q;
        searchPageInput.dispatchEvent(new Event('input'));
      }
    }
  });
})();

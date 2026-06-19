(function() {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function() {
            mobileNav.classList.toggle('is-open');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    var activeIndex = 0;
    var timer = null;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }

        activeIndex = (index + slides.length) % slides.length;

        slides.forEach(function(slide, currentIndex) {
            slide.classList.toggle('is-active', currentIndex === activeIndex);
        });

        dots.forEach(function(dot, currentIndex) {
            dot.classList.toggle('is-active', currentIndex === activeIndex);
        });
    }

    function startHero() {
        if (timer) {
            window.clearInterval(timer);
        }

        timer = window.setInterval(function() {
            showSlide(activeIndex + 1);
        }, 5200);
    }

    dots.forEach(function(dot, index) {
        dot.addEventListener('click', function() {
            showSlide(index);
            startHero();
        });
    });

    showSlide(0);
    startHero();

    var filterInput = document.querySelector('[data-filter-input]');
    var filterButton = document.querySelector('[data-filter-button]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-title]'));
    var noResult = document.querySelector('[data-no-result]');

    function applyFilter() {
        if (!filterInput || !cards.length) {
            return;
        }

        var keyword = filterInput.value.trim().toLowerCase();
        var shown = 0;

        cards.forEach(function(card) {
            var source = [
                card.getAttribute('data-title') || '',
                card.getAttribute('data-tags') || '',
                card.getAttribute('data-year') || '',
                card.getAttribute('data-region') || ''
            ].join(' ').toLowerCase();
            var matched = !keyword || source.indexOf(keyword) !== -1;
            card.style.display = matched ? '' : 'none';
            if (matched) {
                shown += 1;
            }
        });

        if (noResult) {
            noResult.style.display = shown ? 'none' : 'block';
        }
    }

    if (filterInput) {
        filterInput.addEventListener('input', applyFilter);
        filterInput.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                applyFilter();
            }
        });
    }

    if (filterButton) {
        filterButton.addEventListener('click', applyFilter);
    }
})();

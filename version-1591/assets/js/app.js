(function () {
    var toggle = document.querySelector('[data-nav-toggle]');
    var menu = document.querySelector('[data-nav-menu]');
    if (toggle && menu) {
        toggle.addEventListener('click', function () {
            menu.classList.toggle('open');
        });
    }

    var hero = document.querySelector('[data-hero]');
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var current = 0;

        function show(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('active', i === current);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('active', i === current);
            });
        }

        if (prev) {
            prev.addEventListener('click', function () {
                show(current - 1);
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                show(current + 1);
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-hero-dot')) || 0);
            });
        });

        window.setInterval(function () {
            show(current + 1);
        }, 5000);
    }

    var params = new URLSearchParams(window.location.search);
    var q = params.get('q') || '';
    var input = document.querySelector('[data-search-input]');
    var grid = document.querySelector('[data-search-grid]');
    var empty = document.querySelector('[data-empty-result]');
    var status = document.querySelector('[data-search-status]');

    function applySearch(value) {
        if (!grid) {
            return;
        }
        var query = String(value || '').trim().toLowerCase();
        var cards = Array.prototype.slice.call(grid.querySelectorAll('[data-search]'));
        var visible = 0;
        cards.forEach(function (card) {
            var haystack = (card.getAttribute('data-search') || '').toLowerCase();
            var matched = !query || haystack.indexOf(query) !== -1;
            card.style.display = matched ? '' : 'none';
            if (matched) {
                visible += 1;
            }
        });
        if (empty) {
            empty.classList.toggle('show', visible === 0);
        }
        if (status) {
            status.textContent = query ? '已筛选相关作品。' : '输入关键词即可筛选片库。';
        }
    }

    if (input) {
        input.value = q;
        input.addEventListener('input', function () {
            applySearch(input.value);
        });
        applySearch(q);
    }
})();

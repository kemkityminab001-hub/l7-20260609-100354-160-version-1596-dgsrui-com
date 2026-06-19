(function () {
    const toggle = document.querySelector("[data-nav-toggle]");
    const panel = document.querySelector("[data-mobile-panel]");

    if (toggle && panel) {
        toggle.addEventListener("click", function () {
            panel.classList.toggle("is-open");
        });
    }

    const hero = document.querySelector("[data-hero]");

    if (hero) {
        const slides = Array.from(hero.querySelectorAll(".hero-slide"));
        const dots = Array.from(hero.querySelectorAll(".hero-dot"));
        const next = hero.querySelector("[data-hero-next]");
        const prev = hero.querySelector("[data-hero-prev]");
        let index = 0;
        let timer = null;

        const show = function (target) {
            index = (target + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === index);
            });
        };

        const start = function () {
            if (timer) {
                window.clearInterval(timer);
            }
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        };

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener("click", function () {
                show(dotIndex);
                start();
            });
        });

        if (next) {
            next.addEventListener("click", function () {
                show(index + 1);
                start();
            });
        }

        if (prev) {
            prev.addEventListener("click", function () {
                show(index - 1);
                start();
            });
        }

        show(0);
        start();
    }

    const headerSearch = document.querySelector("[data-header-search]");

    if (headerSearch) {
        headerSearch.addEventListener("submit", function (event) {
            event.preventDefault();
            const input = headerSearch.querySelector("input");
            const keyword = input ? input.value.trim() : "";
            const suffix = keyword ? "?q=" + encodeURIComponent(keyword) : "";
            window.location.href = "./search.html" + suffix;
        });
    }

    const filterArea = document.querySelector("[data-filter-list]");

    if (filterArea) {
        const cards = Array.from(filterArea.querySelectorAll(".movie-card"));
        const keywordInput = document.querySelector("[data-search-input]");
        const yearSelect = document.querySelector("[data-year-filter]");
        const typeSelect = document.querySelector("[data-type-filter]");
        const categorySelect = document.querySelector("[data-category-filter]");
        const empty = document.querySelector("[data-empty]");
        const params = new URLSearchParams(window.location.search);
        const preset = params.get("q") || "";

        if (keywordInput && preset) {
            keywordInput.value = preset;
        }

        const normalize = function (value) {
            return String(value || "").toLowerCase().trim();
        };

        const apply = function () {
            const keyword = normalize(keywordInput ? keywordInput.value : "");
            const year = yearSelect ? yearSelect.value : "";
            const type = typeSelect ? typeSelect.value : "";
            const category = categorySelect ? categorySelect.value : "";
            let visible = 0;

            cards.forEach(function (card) {
                const haystack = normalize([
                    card.dataset.title,
                    card.dataset.year,
                    card.dataset.region,
                    card.dataset.type,
                    card.dataset.genre,
                    card.dataset.tags,
                    card.dataset.category
                ].join(" "));
                const okKeyword = !keyword || haystack.indexOf(keyword) !== -1;
                const okYear = !year || card.dataset.year === year;
                const okType = !type || card.dataset.type === type;
                const okCategory = !category || card.dataset.category === category;
                const showCard = okKeyword && okYear && okType && okCategory;
                card.style.display = showCard ? "" : "none";
                if (showCard) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.classList.toggle("is-visible", visible === 0);
            }
        };

        [keywordInput, yearSelect, typeSelect, categorySelect].forEach(function (control) {
            if (control) {
                control.addEventListener("input", apply);
                control.addEventListener("change", apply);
            }
        });

        apply();
    }
}());

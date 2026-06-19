
import { H as Hls } from './hls.js';

const ready = (callback) => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback);
  } else {
    callback();
  }
};

ready(() => {
  initMobileNav();
  initHeroCarousel();
  initFilters();
  initPlayers();
  hydrateSearchFromQuery();
});

function initMobileNav() {
  const toggle = document.querySelector('[data-mobile-toggle]');
  const panel = document.querySelector('[data-mobile-panel]');
  if (!toggle || !panel) {
    return;
  }

  toggle.addEventListener('click', () => {
    panel.classList.toggle('is-open');
  });
}

function initHeroCarousel() {
  const hero = document.querySelector('[data-hero]');
  if (!hero) {
    return;
  }

  const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
  const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
  const next = hero.querySelector('[data-hero-next]');
  const prev = hero.querySelector('[data-hero-prev]');
  let index = 0;
  let timer = null;

  const show = (target) => {
    index = (target + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('is-active', slideIndex === index);
    });
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('is-active', dotIndex === index);
    });
  };

  const start = () => {
    stop();
    timer = window.setInterval(() => show(index + 1), 5200);
  };

  const stop = () => {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  };

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      show(Number(dot.dataset.heroDot || 0));
      start();
    });
  });

  next?.addEventListener('click', () => {
    show(index + 1);
    start();
  });

  prev?.addEventListener('click', () => {
    show(index - 1);
    start();
  });

  hero.addEventListener('mouseenter', stop);
  hero.addEventListener('mouseleave', start);
  start();
}

function initFilters() {
  const panel = document.querySelector('[data-filter-panel]');
  const cards = Array.from(document.querySelectorAll('[data-movie-card]'));
  if (!panel || cards.length === 0) {
    return;
  }

  const input = panel.querySelector('[data-filter-input]');
  const channel = panel.querySelector('[data-filter-channel]');
  const year = panel.querySelector('[data-filter-year]');
  const count = panel.querySelector('[data-filter-count]');
  const empty = document.querySelector('[data-empty-state]');

  const apply = () => {
    const keyword = (input?.value || '').trim().toLowerCase();
    const channelValue = channel?.value || '';
    const yearValue = year?.value || '';
    let visible = 0;

    cards.forEach((card) => {
      const haystack = `${card.dataset.title || ''} ${card.dataset.tags || ''}`.toLowerCase();
      const matchesKeyword = !keyword || haystack.includes(keyword);
      const matchesChannel = !channelValue || card.dataset.channel === channelValue;
      const matchesYear = !yearValue || card.dataset.year === yearValue;
      const shouldShow = matchesKeyword && matchesChannel && matchesYear;

      card.hidden = !shouldShow;
      if (shouldShow) {
        visible += 1;
      }
    });

    if (count) {
      count.textContent = `正在显示 ${visible} 部影片`;
    }
    if (empty) {
      empty.hidden = visible !== 0;
    }
  };

  input?.addEventListener('input', apply);
  channel?.addEventListener('change', apply);
  year?.addEventListener('change', apply);
  apply();
}

function hydrateSearchFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const query = params.get('q');
  if (!query) {
    return;
  }

  const input = document.querySelector('[data-filter-input]');
  if (input) {
    input.value = query;
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }
}

function initPlayers() {
  const players = Array.from(document.querySelectorAll('[data-player]'));
  players.forEach((player) => {
    const source = player.dataset.src;
    const frame = player.querySelector('.player-frame');
    const video = player.querySelector('video');
    const button = player.querySelector('.player-start');
    const status = player.querySelector('[data-player-status]');

    if (!source || !frame || !video || !button) {
      return;
    }

    let initialized = false;

    button.addEventListener('click', async () => {
      if (!initialized) {
        initialized = true;
        attachHls(video, source, status);
      }

      frame.classList.add('is-playing');
      video.controls = true;
      try {
        await video.play();
      } catch (error) {
        if (status) {
          status.textContent = '浏览器阻止了自动播放，请再次点击视频播放。';
          status.style.display = 'block';
        }
      }
    });
  });
}

function attachHls(video, source, status) {
  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = source;
    if (status) {
      status.textContent = '已使用浏览器原生 HLS 播放。';
    }
    return;
  }

  if (Hls && Hls.isSupported()) {
    const hls = new Hls({
      enableWorker: true,
      lowLatencyMode: true,
      backBufferLength: 90
    });

    hls.loadSource(source);
    hls.attachMedia(video);
    hls.on(Hls.Events.ERROR, (_, data) => {
      if (!status) {
        return;
      }
      if (data?.fatal) {
        status.textContent = '播放源暂时无法连接，请稍后重试。';
        status.style.display = 'block';
      }
    });

    if (status) {
      status.textContent = '已初始化 HLS 播放器。';
    }
    return;
  }

  video.src = source;
  if (status) {
    status.textContent = '当前浏览器可能不支持 HLS，已尝试直接加载播放源。';
  }
}

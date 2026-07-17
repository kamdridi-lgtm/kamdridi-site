(() => {
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  menuButton.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  }));

  const languageButtons = [...document.querySelectorAll('.language-option')];
  let language = 'pt';

  const languageCodes = { pt: 'pt-BR', fr: 'fr', en: 'en' };
  const playerLabels = {
    pt: { play: 'Reproduzir', pause: 'Pausar' },
    fr: { play: 'Lire', pause: 'Mettre en pause' },
    en: { play: 'Play', pause: 'Pause' }
  };

  const applyLanguage = (nextLanguage) => {
    language = nextLanguage;
    document.documentElement.lang = languageCodes[language];

    document.querySelectorAll('[data-pt][data-fr][data-en]').forEach((el) => {
      el.innerHTML = el.dataset[language];
    });

    ['aria-label', 'placeholder', 'alt'].forEach((attribute) => {
      const key = attribute === 'aria-label' ? 'aria' : attribute;
      document.querySelectorAll(`[data-${key}-pt][data-${key}-fr][data-${key}-en]`).forEach((el) => {
        el.setAttribute(attribute, el.dataset[`${key}${language.charAt(0).toUpperCase()}${language.slice(1)}`]);
      });
    });

    languageButtons.forEach((button) => {
      const active = button.dataset.lang === language;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });

    const playControl = document.getElementById('play-track');
    if (playControl) {
      playControl.setAttribute('aria-label', audio && !audio.paused ? playerLabels[language].pause : playerLabels[language].play);
    }
  };

  languageButtons.forEach((button) => {
    button.addEventListener('click', () => {
      applyLanguage(button.dataset.lang);
      try { localStorage.setItem('echoes-language', button.dataset.lang); } catch (_) {}
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  const audio = document.getElementById('audio');
  const playButton = document.getElementById('play-track');
  const prevButton = document.getElementById('prev-track');
  const nextButton = document.getElementById('next-track');
  const progress = document.getElementById('progress');
  const elapsed = document.getElementById('elapsed');
  const remaining = document.getElementById('remaining');
  const nowTitle = document.getElementById('now-title');
  const nowSubtitle = document.getElementById('now-subtitle');
  const tracks = [...document.querySelectorAll('.playlist-item')];
  let current = 0;

  const formatTime = (seconds) => {
    if (!Number.isFinite(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${secs}`;
  };

  const loadTrack = (index, autoplay = false) => {
    current = (index + tracks.length) % tracks.length;
    tracks.forEach((item, idx) => item.classList.toggle('active', idx === current));
    const item = tracks[current];
    audio.src = item.dataset.src;
    nowTitle.textContent = item.dataset.title;
    nowSubtitle.textContent = item.dataset.subtitle;
    progress.value = 0;
    elapsed.textContent = '0:00';
    remaining.textContent = '0:36';
    if (autoplay) audio.play().catch(() => {});
  };

  tracks.forEach((item, index) => item.addEventListener('click', () => loadTrack(index, true)));
  playButton.addEventListener('click', () => audio.paused ? audio.play() : audio.pause());
  prevButton.addEventListener('click', () => loadTrack(current - 1, true));
  nextButton.addEventListener('click', () => loadTrack(current + 1, true));
  audio.addEventListener('play', () => { playButton.textContent = 'Ⅱ'; playButton.setAttribute('aria-label', playerLabels[language].pause); });
  audio.addEventListener('pause', () => { playButton.textContent = '▶'; playButton.setAttribute('aria-label', playerLabels[language].play); });
  audio.addEventListener('ended', () => loadTrack(current + 1, true));
  audio.addEventListener('timeupdate', () => {
    const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
    progress.value = pct;
    elapsed.textContent = formatTime(audio.currentTime);
    remaining.textContent = formatTime(Math.max(0, (audio.duration || 36) - audio.currentTime));
  });
  progress.addEventListener('input', () => {
    if (audio.duration) audio.currentTime = (Number(progress.value) / 100) * audio.duration;
  });
  loadTrack(0);
  let initialLanguage = 'pt';
  try {
    const savedLanguage = localStorage.getItem('echoes-language');
    if (languageCodes[savedLanguage]) initialLanguage = savedLanguage;
  } catch (_) {}
  applyLanguage(initialLanguage);

  const lightbox = document.querySelector('.lightbox');
  const lightboxImage = lightbox.querySelector('img');
  document.querySelectorAll('.gallery-item, .lightbox-trigger').forEach(item => item.addEventListener('click', () => {
    lightboxImage.src = item.dataset.full;
    lightboxImage.alt = item.querySelector('img').alt;
    lightbox.showModal();
  }));
  lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) lightbox.close();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (lightbox.open) lightbox.close();
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  });

  document.addEventListener('click', (event) => {
    if (window.innerWidth > 760 || !nav.classList.contains('open')) return;
    if (nav.contains(event.target) || menuButton.contains(event.target)) return;
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  });

  const form = document.querySelector('.signup');
  const message = document.querySelector('.form-message');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = form.querySelector('input');
    if (!input.checkValidity()) {
      input.reportValidity();
      return;
    }
    const formMessages = {
      pt: 'Obrigado. A integração com sua lista de e-mail pode ser conectada aqui.',
      fr: 'Merci. L’intégration à votre liste e-mail peut être connectée ici.',
      en: 'Thank you. Your email list integration can be connected here.'
    };
    message.textContent = formMessages[language];
    input.value = '';
  });
})();

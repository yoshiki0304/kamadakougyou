(() => {
  const body = document.body;
  requestAnimationFrame(() => body.classList.add('loaded'));

  const header = document.querySelector('.site-header');
  const progress = document.querySelector('.scroll-progress');
  const toTop = document.querySelector('.to-top');
  const menuBtn = document.querySelector('.menu-btn');
  const nav = document.querySelector('.nav');

  const closeMenu = () => {
    if (!menuBtn || !nav) return;
    menuBtn.classList.remove('active');
    nav.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    body.classList.remove('nav-open');
  };

  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      const opening = !nav.classList.contains('open');
      menuBtn.classList.toggle('active', opening);
      nav.classList.toggle('open', opening);
      menuBtn.setAttribute('aria-expanded', String(opening));
      body.classList.toggle('nav-open', opening);
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    window.addEventListener('resize', () => { if (window.innerWidth > 980) closeMenu(); });
  }

  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls = [...document.querySelectorAll('.reveal, .reveal-clip')];
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, {threshold: .01, rootMargin: '0px 0px 22% 0px'});
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY || document.documentElement.scrollTop;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progress) progress.style.width = (max > 0 ? Math.min(100, y / max * 100) : 0) + '%';
      if (header) header.classList.toggle('is-scrolled', y > 20);
      if (toTop) toTop.classList.toggle('show', y > 520);

      if (!reduceMotion) {
        document.querySelectorAll('[data-parallax]').forEach(el => {
          const rect = el.getBoundingClientRect();
          const speed = Number(el.dataset.parallax || .08);
          const centerDiff = (rect.top + rect.height / 2) - window.innerHeight / 2;
          el.style.transform = `translate3d(0, ${centerDiff * -speed}px, 0) scale(1.08)`;
        });
      }
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  if (toTop) toTop.addEventListener('click', () => window.scrollTo({top:0, behavior: reduceMotion ? 'auto' : 'smooth'}));

  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const fd = new FormData(form);
      const subject = `【鎌田工業HP】${fd.get('subject') || 'お問い合わせ'}`;
      const bodyText = [
        `お名前：${fd.get('name') || ''}`,
        `会社名：${fd.get('company') || ''}`,
        `電話番号：${fd.get('tel') || ''}`,
        `メール：${fd.get('email') || ''}`,
        '',
        'お問い合わせ内容：',
        fd.get('message') || ''
      ].join('\n');
      window.location.href = `mailto:spqg9fp9@honey.ocn.ne.jp?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
    });
  }
})();

(() => {
  const heroVideo = document.querySelector('.hero-video');
  const heroVideoToggle = document.querySelector('.hero-video-toggle');
  if (!heroVideo) return;

  // iPhone / Android を含め、CSSや <source media> 任せにせず
  // 画面幅に応じて再生ファイルを明示的に切り替える。
  const mobileQuery = window.matchMedia('(max-width: 767px)');
  let activeKind = '';

  const applyResponsiveVideo = (force = false) => {
    const kind = mobileQuery.matches ? 'mobile' : 'pc';
    if (!force && activeKind === kind) return;

    const source = kind === 'mobile' ? heroVideo.dataset.mobileSrc : heroVideo.dataset.pcSrc;
    const poster = kind === 'mobile' ? heroVideo.dataset.mobilePoster : heroVideo.dataset.pcPoster;
    if (!source) return;

    activeKind = kind;
    if (poster) heroVideo.poster = poster;

    // 属性とプロパティの両方を指定し、iOS Safari の自動再生条件を満たす。
    heroVideo.muted = true;
    heroVideo.defaultMuted = true;
    heroVideo.autoplay = true;
    heroVideo.loop = true;
    heroVideo.playsInline = true;
    heroVideo.setAttribute('muted', '');
    heroVideo.setAttribute('autoplay', '');
    heroVideo.setAttribute('loop', '');
    heroVideo.setAttribute('playsinline', '');
    heroVideo.setAttribute('webkit-playsinline', '');

    const resolved = new URL(source, window.location.href).href;
    if (heroVideo.currentSrc !== resolved && heroVideo.src !== resolved) {
      heroVideo.src = source;
      heroVideo.load();
    }

    const tryPlay = () => heroVideo.play().catch(() => {});
    if (heroVideo.readyState >= 2) tryPlay();
    else heroVideo.addEventListener('canplay', tryPlay, { once: true });
  };

  applyResponsiveVideo(true);
  if (typeof mobileQuery.addEventListener === 'function') {
    mobileQuery.addEventListener('change', () => applyResponsiveVideo(true));
  } else if (typeof mobileQuery.addListener === 'function') {
    mobileQuery.addListener(() => applyResponsiveVideo(true));
  }
  window.addEventListener('orientationchange', () => setTimeout(() => applyResponsiveVideo(true), 120));

  if (!heroVideoToggle) return;
  const icon = heroVideoToggle.querySelector('.hero-video-toggle-icon');
  const label = heroVideoToggle.querySelector('.hero-video-toggle-text');

  const syncVideoButton = () => {
    const paused = heroVideo.paused;
    heroVideoToggle.setAttribute('aria-pressed', String(paused));
    heroVideoToggle.setAttribute('aria-label', paused ? 'メインビジュアル動画を再生' : 'メインビジュアル動画を一時停止');
    if (icon) icon.textContent = paused ? '▶' : 'Ⅱ';
    if (label) label.textContent = paused ? 'PLAY' : 'PAUSE';
  };

  heroVideoToggle.addEventListener('click', () => {
    if (heroVideo.paused) heroVideo.play().catch(() => {});
    else heroVideo.pause();
  });
  heroVideo.addEventListener('play', syncVideoButton);
  heroVideo.addEventListener('pause', syncVideoButton);
  heroVideo.addEventListener('loadeddata', syncVideoButton);
  syncVideoButton();
})();

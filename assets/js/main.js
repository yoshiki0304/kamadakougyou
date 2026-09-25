(() => {
  const body = document.body;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     Logo page transition
     --------------------------------------------------------- */
  const transition = document.createElement('div');
  transition.className = 'page-transition';
  transition.setAttribute('aria-hidden', 'true');
  transition.innerHTML = `
    <div class="page-transition-inner">
      <div class="page-transition-mark"><img src="assets/img/kamada-logo.png" alt=""></div>
      <p class="page-transition-name">KAMADA KOGYO CO., LTD.</p>
      <div class="page-transition-dots" aria-hidden="true"><i></i><i></i><i></i></div>
    </div>`;
  body.appendChild(transition);

  let navigating = false;
  const showTransition = (href) => {
    if (navigating) return;
    navigating = true;
    body.classList.add('is-page-leaving');
    transition.classList.add('is-active');
    transition.setAttribute('aria-hidden', 'false');

    // Keep the transition visible long enough to register as a deliberate page change.
    const delay = reduceMotion ? 80 : 660;
    window.setTimeout(() => { window.location.href = href; }, delay);
  };

  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('a[href]');
    if (!link || link.hasAttribute('download') || link.target === '_blank') return;
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) return;

    let url;
    try { url = new URL(link.href, window.location.href); } catch (_) { return; }
    if (url.origin !== window.location.origin) return;
    if (url.pathname === window.location.pathname && url.search === window.location.search && url.hash) return;

    event.preventDefault();
    document.querySelector('.menu-btn')?.classList.remove('active');
    document.querySelector('.nav')?.classList.remove('open');
    body.classList.remove('nav-open');
    showTransition(url.href);
  });

  window.addEventListener('pageshow', () => {
    navigating = false;
    body.classList.remove('is-page-leaving');
    transition.classList.remove('is-active');
    transition.setAttribute('aria-hidden', 'true');
  });

  /* ---------------------------------------------------------
     Site-wide text motion
     --------------------------------------------------------- */
  const headingSelector = [
    '.page-title',
    '.section-title',
    '.fan-hero-copy h1',
    '.fan-teaser-copy h2',
    '.cta-inner h2',
    '.company-statement h2',
    '.service-feature-copy h2',
    '.service-card h3',
    '.service-item h3',
    '.flow-item h3',
    '.contact-side h2',
    '.contact-card h2',
    '.fan-message h2',
    '.fan-note h2'
  ].join(',');

  const splitHeading = (el) => {
    if (!el || el.dataset.motionSplit === 'true') return;
    el.dataset.motionSplit = 'true';
    // Animate the heading as a single typographic block instead of splitting
    // Japanese text into individual inline-block characters. Character-level
    // splitting creates invalid Japanese line breaks (e.g. punctuation or a
    // final kana stranded on its own line), especially on narrow screens.
    el.classList.add('motion-heading');
  };

  document.querySelectorAll(headingSelector).forEach(splitHeading);

  const addMotionClass = (selector, className) => {
    document.querySelectorAll(selector).forEach((el, index) => {
      if (el.closest('.page-transition')) return;
      el.classList.add(className);
      el.style.setProperty('--motion-delay', `${Math.min((index % 4) * 70, 210)}ms`);
    });
  };

  addMotionClass('.page-kicker,.kicker,.section-index,.service-no,.photo-tag,.num,.gallery-label', 'motion-label');
  addMotionClass('.page-intro,.section-lead,.hero-video-copy p,.text-stack p,.company-statement p,.service-feature-copy p,.service-card p,.service-item p,.flow-item p,.fan-hero-copy p,.fan-message-text p,.fan-note p,.contact-side p,.contact-card .note,.cta-inner p,.footer-address', 'motion-copy');
  addMotionClass('.fact-list li,.contact-direct,.data-table tr,.footer-links a', 'motion-card-text');

  const motionEls = [...document.querySelectorAll('.motion-heading,.motion-copy,.motion-label,.motion-card-text')];
  if (reduceMotion || !('IntersectionObserver' in window)) {
    motionEls.forEach((el) => el.classList.add('motion-visible'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('motion-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -5% 0px' });
    motionEls.forEach((el) => observer.observe(el));

    // Safety fallback: never leave copy invisible because of a browser observer quirk.
    window.setTimeout(() => {
      motionEls.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 1.15) el.classList.add('motion-visible');
      });
    }, 1100);
  }
})();

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
    menuBtn.setAttribute('aria-label', 'メニューを開く');
    body.classList.remove('nav-open');
  };

  // Place the mobile menu directly under <body>. This prevents iOS Safari
  // from trapping a fixed menu inside the header's backdrop-filter layer.
  const navHome = nav?.parentNode;
  const navAfter = nav?.nextSibling;
  const navBreakpoint = window.matchMedia('(max-width: 980px)');
  const placeMenu = () => {
    if (!nav || !navHome) return;
    if (navBreakpoint.matches && nav.parentNode !== body) body.appendChild(nav);
    if (!navBreakpoint.matches && nav.parentNode !== navHome) navHome.insertBefore(nav, navAfter);
    if (!navBreakpoint.matches) closeMenu();
  };
  placeMenu();
  navBreakpoint.addEventListener?.('change', placeMenu);

  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      const opening = !nav.classList.contains('open');
      menuBtn.classList.toggle('active', opening);
      nav.classList.toggle('open', opening);
      menuBtn.setAttribute('aria-expanded', String(opening));
      menuBtn.setAttribute('aria-label', opening ? 'メニューを閉じる' : 'メニューを開く');
      body.classList.toggle('nav-open', opening);
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
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
  const pcVideo = document.querySelector('.hero-video-pc');
  const mobileVideo = document.querySelector('.hero-video-mobile');
  const heroVideoToggle = document.querySelector('.hero-video-toggle');
  if (!pcVideo && !mobileVideo) return;

  const mobileQuery = window.matchMedia('(max-width: 767px)');
  const activeVideo = () => mobileQuery.matches ? mobileVideo : pcVideo;
  const inactiveVideo = () => mobileQuery.matches ? pcVideo : mobileVideo;

  const prepare = (video) => {
    if (!video) return;
    video.muted = true;
    video.defaultMuted = true;
    video.autoplay = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute('muted', '');
    video.setAttribute('autoplay', '');
    video.setAttribute('loop', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
  };

  prepare(pcVideo);
  prepare(mobileVideo);

  const syncVideoButton = () => {
    if (!heroVideoToggle) return;
    const video = activeVideo();
    if (!video) return;
    const icon = heroVideoToggle.querySelector('.hero-video-toggle-icon');
    const label = heroVideoToggle.querySelector('.hero-video-toggle-text');
    const paused = video.paused;
    heroVideoToggle.setAttribute('aria-pressed', String(paused));
    heroVideoToggle.setAttribute('aria-label', paused ? 'メインビジュアル動画を再生' : 'メインビジュアル動画を一時停止');
    if (icon) icon.textContent = paused ? '▶' : 'Ⅱ';
    if (label) label.textContent = paused ? 'PLAY' : 'PAUSE';
  };

  const activateCorrectVideo = () => {
    const active = activeVideo();
    const inactive = inactiveVideo();
    if (inactive && !inactive.paused) inactive.pause();
    if (!active) return;
    prepare(active);
    const tryPlay = () => active.play().then(syncVideoButton).catch(syncVideoButton);
    if (active.readyState >= 2) tryPlay();
    else active.addEventListener('canplay', tryPlay, { once: true });
    syncVideoButton();
  };

  activateCorrectVideo();
  if (typeof mobileQuery.addEventListener === 'function') {
    mobileQuery.addEventListener('change', activateCorrectVideo);
  } else if (typeof mobileQuery.addListener === 'function') {
    mobileQuery.addListener(activateCorrectVideo);
  }
  window.addEventListener('orientationchange', () => setTimeout(activateCorrectVideo, 120));

  if (heroVideoToggle) {
    heroVideoToggle.addEventListener('click', () => {
      const video = activeVideo();
      if (!video) return;
      if (video.paused) video.play().catch(() => {});
      else video.pause();
      setTimeout(syncVideoButton, 0);
    });
  }

  [pcVideo, mobileVideo].forEach((video) => {
    if (!video) return;
    video.addEventListener('play', syncVideoButton);
    video.addEventListener('pause', syncVideoButton);
    video.addEventListener('loadeddata', syncVideoButton);
  });
})();

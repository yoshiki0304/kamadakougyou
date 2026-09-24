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

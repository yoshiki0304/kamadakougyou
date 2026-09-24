(() => {
  const menuBtn = document.querySelector('.menu-btn');
  const nav = document.querySelector('.nav');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menuBtn.classList.toggle('active', open);
      menuBtn.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('open');
      menuBtn.classList.remove('active');
      menuBtn.setAttribute('aria-expanded', 'false');
    }));
  }

  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {threshold: 0.12}) : null;
  document.querySelectorAll('.reveal').forEach(el => observer ? observer.observe(el) : el.classList.add('visible'));

  const form = document.querySelector('#contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const subject = `【Webサイトお問い合わせ】${data.get('subject') || 'お問い合わせ'}`;
      const body = [
        `お名前：${data.get('name') || ''}`,
        `会社名：${data.get('company') || ''}`,
        `電話番号：${data.get('tel') || ''}`,
        `メール：${data.get('email') || ''}`,
        `お問い合わせ種別：${data.get('subject') || ''}`,
        '',
        'お問い合わせ内容：',
        data.get('message') || ''
      ].join('\n');
      location.href = `mailto:spqg9fp9@honey.ocn.ne.jp?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }

  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
})();

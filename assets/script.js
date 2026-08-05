(() => {
  const menuButton = document.querySelector('[data-menu-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');

  if (menuButton && mobileMenu) {
    const closeMenu = () => {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open menu');
      mobileMenu.dataset.open = 'false';
      document.body.classList.remove('menu-open');
    };

    menuButton.addEventListener('click', () => {
      const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
      mobileMenu.dataset.open = String(!isOpen);
      document.body.classList.toggle('menu-open', !isOpen);
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 992) closeMenu();
    });
  }

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  document.querySelectorAll('[data-current-year]').forEach((node) => {
    node.textContent = new Date().getFullYear();
  });

  const openingDate = new Date('2026-08-10T07:00:00+05:00');
  const hasOpened = Date.now() >= openingDate.getTime();
  document.querySelectorAll('[data-opening-status]').forEach((node) => {
    node.textContent = hasOpened
      ? 'Open daily from 7:00 AM to 10:00 PM'
      : 'Opening 10 August 2026 · Daily 7:00 AM to 10:00 PM';
  });

  const requestForm = document.querySelector('[data-whatsapp-form]');
  if (requestForm) {
    requestForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(requestForm);
      const name = String(formData.get('name') || '').trim();
      const service = String(formData.get('service') || '').trim();
      const mode = String(formData.get('mode') || '').trim();
      const details = String(formData.get('details') || '').trim();

      const message = [
        'Hello Yaqoob Enterprises,',
        '',
        `Name: ${name}`,
        `Service: ${service}`,
        `Preferred option: ${mode}`,
        `Requirement: ${details}`,
        '',
        'Please confirm availability, requirements and estimated charges.'
      ].join('\n');

      const url = `https://wa.me/923492568864?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }
})();

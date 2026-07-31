(() => {
  'use strict';

  const header = document.querySelector('[data-header]');
  const menu = document.querySelector('[data-menu]');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
  const sections = [...document.querySelectorAll('main section[id]')];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const projectGalleries = [
    {
      src: 'https://raw.githubusercontent.com/Altan-Y/access-governance-dashboard/main/screenshots/accesshub-gallery.webp',
      alt: 'AccessHub product gallery with login, dashboard and permission-aware job-role management',
    },
    {
      src: 'https://raw.githubusercontent.com/Altan-Y/interactive-employee-onboarding/main/screenshots/onboarding-gallery.webp',
      alt: 'Interactive Employee Onboarding gallery with access, flow selection, tutorial and setup instructions',
    },
  ];

  [...document.querySelectorAll('.project-card')].slice(0, 2).forEach((card, index) => {
    const visual = card.querySelector('.project-visual');
    const image = visual?.querySelector('img');
    const gallery = projectGalleries[index];
    if (!visual || !image || !gallery) return;

    image.src = gallery.src;
    image.alt = gallery.alt;
    image.style.aspectRatio = '4 / 3';
    image.style.objectFit = 'contain';
    image.style.objectPosition = 'center';
    image.style.background = '#07182b';
    visual.style.background = '#07182b';
  });

  const setMenu = (open) => {
    if (!menu || !menuToggle) return;
    menu.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
  };

  menuToggle?.addEventListener('click', () => {
    setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => setMenu(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenu(false);
  });

  const updateHeader = () => {
    header?.classList.toggle('is-scrolled', window.scrollY > 24);
  };

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const revealItems = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px' });

    revealItems.forEach((item) => revealObserver.observe(item));
  }

  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;
      navLinks.forEach((link) => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${visible.target.id}`);
      });
    }, { threshold: [0.2, 0.45, 0.7], rootMargin: '-18% 0px -55%' });

    sections.forEach((section) => sectionObserver.observe(section));
  }

  const year = document.querySelector('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());
})();

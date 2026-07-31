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
      hero: 'https://raw.githubusercontent.com/Altan-Y/access-governance-dashboard/main/screenshots/accesshub-gallery.webp',
      heroAlt: 'AccessHub product gallery with login, dashboard and permission-aware job-role management',
      screenshots: [
        ['https://raw.githubusercontent.com/Altan-Y/access-governance-dashboard/main/screenshots/accesshub-login.webp', 'AccessHub demo login'],
        ['https://raw.githubusercontent.com/Altan-Y/access-governance-dashboard/main/screenshots/accesshub-dashboard.webp', 'AccessHub dashboard'],
        ['https://raw.githubusercontent.com/Altan-Y/access-governance-dashboard/main/screenshots/accesshub-job-roles.webp', 'AccessHub job-role management'],
      ],
    },
    {
      hero: 'https://raw.githubusercontent.com/Altan-Y/interactive-employee-onboarding/main/screenshots/onboarding-gallery.webp',
      heroAlt: 'Interactive Employee Onboarding gallery with access, flow selection, tutorial and setup instructions',
      screenshots: [
        ['https://raw.githubusercontent.com/Altan-Y/interactive-employee-onboarding/main/screenshots/onboarding-access.webp', 'Onboarding protected access'],
        ['https://raw.githubusercontent.com/Altan-Y/interactive-employee-onboarding/main/screenshots/onboarding-device-selection.webp', 'Onboarding device selection'],
        ['https://raw.githubusercontent.com/Altan-Y/interactive-employee-onboarding/main/screenshots/onboarding-tutorial.webp', 'Onboarding tutorial'],
        ['https://raw.githubusercontent.com/Altan-Y/interactive-employee-onboarding/main/screenshots/onboarding-password-step.webp', 'Onboarding setup instruction'],
      ],
    },
    {
      hero: 'https://raw.githubusercontent.com/Altan-Y/freshservice-asset-context-demo/main/screenshots/ticket-context.webp',
      heroAlt: 'Freshservice-style service ticket preview with an asset context widget',
      screenshots: [
        ['https://raw.githubusercontent.com/Altan-Y/freshservice-asset-context-demo/main/screenshots/ticket-context.webp', 'Service ticket with asset context'],
        ['https://raw.githubusercontent.com/Altan-Y/freshservice-asset-context-demo/main/screenshots/asset-card-original-style.webp', 'Compact original-style asset card'],
      ],
    },
  ];

  const galleryStyle = document.createElement('style');
  galleryStyle.textContent = `
    .project-gallery-strip{display:grid;grid-template-columns:repeat(auto-fit,minmax(92px,1fr));gap:9px;margin:0 0 27px}
    .project-gallery-strip a{display:block;overflow:hidden;background:#07182b;border:1px solid rgba(194,213,232,.16);border-radius:5px;transition:transform 160ms ease,border-color 160ms ease}
    .project-gallery-strip a:hover{transform:translateY(-3px);border-color:rgba(213,177,108,.72)}
    .project-gallery-strip img{display:block;width:100%;height:82px;object-fit:cover;object-position:top center}
    @media(max-width:560px){.project-gallery-strip{grid-template-columns:repeat(2,minmax(0,1fr))}.project-gallery-strip img{height:96px}}
  `;
  document.head.appendChild(galleryStyle);

  [...document.querySelectorAll('.project-card')].forEach((card, index) => {
    const visual = card.querySelector('.project-visual');
    const image = visual?.querySelector('img');
    const data = projectGalleries[index];
    if (!visual || !image || !data) return;

    image.src = data.hero;
    image.alt = data.heroAlt;
    image.style.aspectRatio = index < 2 ? '4 / 3' : '16 / 9';
    image.style.objectFit = index < 2 ? 'contain' : 'cover';
    image.style.objectPosition = 'top center';
    image.style.background = '#07182b';
    visual.style.background = '#07182b';

    const strip = document.createElement('div');
    strip.className = 'project-gallery-strip';
    strip.setAttribute('aria-label', 'Project screenshots');

    data.screenshots.forEach(([src, alt]) => {
      const link = document.createElement('a');
      link.href = src;
      link.target = '_blank';
      link.rel = 'noreferrer';
      link.setAttribute('aria-label', `Open ${alt}`);

      const thumbnail = document.createElement('img');
      thumbnail.src = src;
      thumbnail.alt = alt;
      thumbnail.loading = 'lazy';
      link.appendChild(thumbnail);
      strip.appendChild(link);
    });

    const projectLink = card.querySelector('.text-link');
    projectLink?.before(strip);
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

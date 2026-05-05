const initMobileMenu = () => {
  const hamburger = document.querySelector('.nav-hamburger');
  const panel = document.querySelector('.mobile-menu-panel');
  const overlay = document.querySelector('.mobile-menu-overlay');
  const closeBtn = document.querySelector('.mobile-menu-close');

  if (!hamburger || !panel) return;

  const open = () => {
    panel.classList.add('open');
    overlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    panel.classList.remove('open');
    overlay?.classList.remove('open');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  overlay?.addEventListener('click', close);

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
};

document.addEventListener('DOMContentLoaded', initMobileMenu);

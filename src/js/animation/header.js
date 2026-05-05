const initHeader = () => {
  const header = document.querySelector('.pv-header');
  if (!header) return;

  const update = () => {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
};

document.addEventListener('DOMContentLoaded', initHeader);

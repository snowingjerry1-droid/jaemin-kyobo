const viewer = document.querySelector('#image-viewer');
const viewerImage = document.querySelector('#viewer-image');
const viewerCaption = document.querySelector('#viewer-caption');
const viewerClose = document.querySelector('#viewer-close');
let triggerButton = null;

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const progressBar = document.querySelector('.reading-progress span');
const revealTargets = document.querySelectorAll([
  '.section-header',
  '.customer-proof',
  '.growth-track',
  '.listen-highlight',
  '.process-flow',
  '.process-note',
  '.scope-note',
  '.finance-grid',
  '.sales-cards',
  '.tools-note',
  '.tool-list',
  '.closing h2',
  '.closing-name',
].join(','));

document.body.classList.add('motion-ready');
revealTargets.forEach((target) => target.classList.add('reveal'));

if (!reduceMotion && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });

  revealTargets.forEach((target) => revealObserver.observe(target));
} else {
  revealTargets.forEach((target) => target.classList.add('is-visible'));
}

let progressFrame = null;
const updateProgress = () => {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? Math.min(window.scrollY / scrollableHeight, 1) : 0;
  progressBar.style.transform = `scaleX(${progress})`;
  progressFrame = null;
};

window.addEventListener('scroll', () => {
  if (progressFrame !== null) return;
  progressFrame = window.requestAnimationFrame(updateProgress);
}, { passive: true });

window.addEventListener('resize', updateProgress, { passive: true });
updateProgress();

document.querySelectorAll('[data-image]').forEach((button) => {
  button.addEventListener('click', () => {
    triggerButton = button;
    viewerImage.src = button.dataset.image;
    viewerImage.alt = button.querySelector('img')?.alt ?? '';
    viewerCaption.textContent = button.dataset.caption ?? '';
    viewer.showModal();
    viewerClose.focus();
  });
});

viewerClose.addEventListener('click', () => viewer.close());

viewer.addEventListener('click', (event) => {
  const bounds = viewer.getBoundingClientRect();
  const isOutside = event.clientX < bounds.left
    || event.clientX > bounds.right
    || event.clientY < bounds.top
    || event.clientY > bounds.bottom;

  if (isOutside) viewer.close();
});

viewer.addEventListener('close', () => {
  viewerImage.removeAttribute('src');
  triggerButton?.focus();
  triggerButton = null;
});

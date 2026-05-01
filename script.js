const root = document.documentElement;
const revealItems = document.querySelectorAll('.reveal');
const updateForm = document.querySelector('.updates-form');
const statusMessage = document.querySelector('.form-status');

let ticking = false;

function updateScrollProgress() {
  const scrollable = Math.max(document.body.scrollHeight - window.innerHeight, 1);
  const progress = Math.min(window.scrollY / scrollable, 1);

  root.style.setProperty('--scroll-progress', progress.toFixed(4));
  ticking = false;
}

function requestScrollUpdate() {
  if (!ticking) {
    requestAnimationFrame(updateScrollProgress);
    ticking = true;
  }
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.16,
    rootMargin: '0px 0px -8% 0px',
  },
);

revealItems.forEach((item) => revealObserver.observe(item));

window.addEventListener('scroll', requestScrollUpdate, { passive: true });
window.addEventListener('resize', requestScrollUpdate);
requestScrollUpdate();

if (updateForm && statusMessage) {
  updateForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(updateForm);
    const email = String(formData.get('email') || '').trim();

    statusMessage.textContent = email
      ? `Thanks. We will send GOSIM Shenzhen 2026 updates to ${email}.`
      : 'Enter an email address to receive conference updates.';
  });
}

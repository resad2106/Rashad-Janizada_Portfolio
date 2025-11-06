// ---------------- THEME TOGGLE ---------------- //
const themeToggleBtn = document.getElementById('themeToggle');
const htmlEl = document.documentElement;
const ICON_SUN = document.getElementById('icon-sun');
const ICON_MOON = document.getElementById('icon-moon');

function setTheme(theme) {
  htmlEl.setAttribute('data-theme', theme);
  document.body.classList.toggle('dark', theme === 'dark');

  ICON_SUN.style.display = theme === 'dark' ? 'block' : 'none';
  ICON_MOON.style.display = theme === 'dark' ? 'none' : 'block';

  try { localStorage.setItem('theme', theme); } catch(e){}
}

// initialize theme from localStorage
const savedTheme = (() => {
  try { return localStorage.getItem('theme'); } catch(e){ return null; }
})();
setTheme(savedTheme === 'dark' ? 'dark' : 'light');

themeToggleBtn.addEventListener('click', () => {
  const current = htmlEl.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  setTheme(next);
});

// ---------------- Smooth scroll for navbar links ---------------- //
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = this.getAttribute('href');
    if (!target || target === '#') return;
    e.preventDefault();
    const el = document.querySelector(target);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ---------------- IntersectionObserver for fade-in elements ---------------- //
const faders = document.querySelectorAll('.fade-in');
if ('IntersectionObserver' in window) {
  const appearOptions = { threshold: 0.12 };
  const appearOnScroll = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, appearOptions);
  faders.forEach(f => appearOnScroll.observe(f));
} else {
  faders.forEach(f => f.classList.add('visible'));
}

// ---------------- Skill bars animation when in view ---------------- //
const bars = document.querySelectorAll('.bar');
if ('IntersectionObserver' in window) {
  const barObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.28 });
  bars.forEach(b => barObserver.observe(b));
} else {
  bars.forEach(b => b.classList.add('animate'));
}

// ---------------- Back to top button ---------------- //
const topBtn = document.getElementById('topBtn');
window.addEventListener('scroll', () => {
  topBtn.style.display = window.scrollY > 360 ? 'block' : 'none';
});
topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ---------------- Subtle pointer tilt for project cards (desktop only) ---------------- //
const projectCards = document.querySelectorAll('.project-card');
if (window.matchMedia('(pointer:fine)').matches) {
  projectCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const rx = (+1) * (dy / r.height) * 6;
      const ry = (-1) * (dx / r.width) * 8;
      card.style.transform = `translateY(-8px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.01)`;
      card.style.transition = 'transform 0.08s linear';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform .45s cubic-bezier(.2,.9,.25,1)';
    });
  });
}

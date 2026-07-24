(function () {
  'use strict';

  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------------- Theme toggle ---------------- */
  var root = document.documentElement;
  var themeToggle = document.getElementById('themeToggle');
  var stored = null;
  try { stored = window.localStorage ? localStorage.getItem('rj-theme') : null; } catch (e) { stored = null; }

  if (stored === 'light' || stored === 'dark') {
    root.setAttribute('data-theme', stored);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    root.setAttribute('data-theme', 'light');
  }

  themeToggle.addEventListener('click', function () {
    var current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    var next = current === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    try { if (window.localStorage) localStorage.setItem('rj-theme', next); } catch (e) { /* ignore */ }
  });

  /* ---------------- Scroll progress bar ---------------- */
  var progress = document.getElementById('scrollProgress');
  function updateProgress() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progress.style.width = pct + '%';
  }

  /* ---------------- Sticky nav shadow ---------------- */
  var nav = document.getElementById('siteNav');
  function updateNavState() {
    if (window.scrollY > 12) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        updateProgress();
        updateNavState();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
  updateProgress();
  updateNavState();

  /* ---------------- Mobile menu ---------------- */
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');

  function closeMobileMenu() {
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', function () {
    var isOpen = mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMobileMenu);
  });

  /* ---------------- Smooth scroll w/ nav offset ---------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href');
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - 64;
      window.scrollTo({ top: top, behavior: 'smooth' });
      history.replaceState(null, '', id);
    });
  });

  /* ---------------- Active nav link highlighting ---------------- */
  var navLinks = document.querySelectorAll('[data-nav]');
  var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));

  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var id = entry.target.getAttribute('id');
      var link = document.querySelector('.nav-links a[href="#' + id + '"]');
      if (!link) return;
      if (entry.isIntersecting) {
        navLinks.forEach(function (l) { l.classList.remove('active'); });
        document.querySelectorAll('a[href="#' + id + '"][data-nav]').forEach(function (l) {
          l.classList.add('active');
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

  sections.forEach(function (s) { sectionObserver.observe(s); });

  /* ---------------- Reveal on scroll ---------------- */
  var revealItems = document.querySelectorAll('.reveal');
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry, i) {
      if (entry.isIntersecting) {
        var el = entry.target;
        var delay = (Array.prototype.indexOf.call(revealItems, el) % 4) * 60;
        setTimeout(function () { el.classList.add('is-visible'); }, delay);
        revealObserver.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  revealItems.forEach(function (el) { revealObserver.observe(el); });

  /* ---------------- Terminal typing line ---------------- */
  var terminalEl = document.getElementById('terminalTyped');
  var terminalText = 'whoami';
  var ti = 0;

  function typeTerminal() {
    if (ti <= terminalText.length) {
      terminalEl.textContent = terminalText.slice(0, ti);
      ti++;
      setTimeout(typeTerminal, 90);
    } else {
      setTimeout(startRoleCycle, 350);
    }
  }

  /* ---------------- Role cycling typewriter ---------------- */
  var roleEl = document.getElementById('roleTyped');
  var roles = ['Software Engineer', 'Full-Stack Developer', 'Web Developer', 'Java Developer'];
  var roleIndex = 0, charIndex = 0, deleting = false;

  function startRoleCycle() { tickRole(); }

  function tickRole() {
    var word = roles[roleIndex];
    var speed = deleting ? 45 : 85;

    if (!deleting && charIndex <= word.length) {
      roleEl.textContent = word.slice(0, charIndex);
      charIndex++;
      if (charIndex > word.length) {
        deleting = true;
        speed = 1600;
      }
    } else if (deleting) {
      roleEl.textContent = word.slice(0, charIndex);
      charIndex--;
      if (charIndex < 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        charIndex = 0;
        speed = 300;
      }
    }
    setTimeout(tickRole, speed);
  }

  var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    terminalEl.textContent = terminalText;
    roleEl.textContent = roles[0];
  } else {
    typeTerminal();
  }

  /* ---------------- Contact form ---------------- */
  var form = document.getElementById('contactForm');
  var successMsg = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var submitBtn = form.querySelector('.form-submit');
      var label = submitBtn.querySelector('.btn-label');
      var originalLabel = label.textContent;

      label.textContent = 'Sending…';
      submitBtn.disabled = true;

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      }).then(function (response) {
        if (response.ok) {
          form.reset();
          successMsg.classList.add('show');
          label.textContent = originalLabel;
          submitBtn.disabled = false;
          setTimeout(function () { successMsg.classList.remove('show'); }, 6000);
        } else {
          label.textContent = 'Something went wrong — try again';
          submitBtn.disabled = false;
          setTimeout(function () { label.textContent = originalLabel; }, 3000);
        }
      }).catch(function () {
        label.textContent = 'Network error — try again';
        submitBtn.disabled = false;
        setTimeout(function () { label.textContent = originalLabel; }, 3000);
      });
    });
  }
})();

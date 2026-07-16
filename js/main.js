/* Maryam Sadeghabadi — Portfolio interactions */
(function () {
  'use strict';

  var nav = document.getElementById('nav');
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');
  var progressBar = document.getElementById('progressBar');

  /* Year */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Nav scrolled state */
  function onScroll() {
    var scrolled = window.scrollY > 24;
    if (nav) nav.classList.toggle('scrolled', scrolled);

    /* progress bar */
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var pct = max > 0 ? (h.scrollTop || document.body.scrollTop) / max * 100 : 0;
    if (progressBar) progressBar.style.width = pct + '%';

    /* active link */
    updateActiveLink();
  }

  /* Mobile menu */
  if (navToggle) {
    navToggle.addEventListener('click', function () {
      var open = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
  if (navLinks) {
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* Reveal on scroll using IntersectionObserver */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* Smooth scroll with nav offset for anchor links */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length <= 1) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - 60;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* Active nav link highlighting */
  var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
  var linkMap = {};
  document.querySelectorAll('.nav__links a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href && href.length > 1) linkMap[href.slice(1)] = a;
  });
  function updateActiveLink() {
    var pos = window.scrollY + 120;
    var current = null;
    sections.forEach(function (s) {
      if (s.offsetTop <= pos) current = s.id;
    });
    Object.keys(linkMap).forEach(function (id) {
      linkMap[id].classList.toggle('active', id === current);
    });
  }

  /* Add active style dynamically */
  var style = document.createElement('style');
  style.textContent =
    '.nav__links a.active { color: var(--text) !important; background: rgba(255,255,255,0.06); }' +
    '.nav__links a.active::after { content:""; }';
  document.head.appendChild(style);

  /* ===== Email copy (bot-protected) =====
     Emails are never written verbatim in the HTML; they are split into
     data-u (user) and data-d (domain) attributes and assembled at runtime,
     so crawlers scanning static markup can't harvest them. */
  var toast = document.getElementById('toast');
  var toastMsg = document.getElementById('toastMsg');
  var toastTimer = null;

  function showToast(msg) {
    if (!toast || !toastMsg) return;
    toastMsg.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 2200);
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    /* Fallback for older browsers / non-secure contexts */
    return new Promise(function (resolve, reject) {
      try {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        var ok = document.execCommand('copy');
        document.body.removeChild(ta);
        ok ? resolve() : reject();
      } catch (e) { reject(e); }
    });
  }

  document.querySelectorAll('[data-email]').forEach(function (btn) {
    var user = btn.getAttribute('data-u') || '';
    var domain = btn.getAttribute('data-d') || '';
    var address = user + '@' + domain;

    /* Reveal assembled address on hover for human users (still not in raw HTML) */
    var label = btn.querySelector('[data-email-label]');
    if (label) {
      var original = label.textContent;
      btn.addEventListener('mouseenter', function () { label.textContent = address; });
      btn.addEventListener('mouseleave', function () { label.textContent = original; });
      btn.addEventListener('focus', function () { label.textContent = address; });
      btn.addEventListener('blur', function () { label.textContent = original; });
    }

    btn.addEventListener('click', function () {
      copyText(address).then(function () {
        showToast('Copied: ' + address);
      }, function () {
        showToast('Couldn\u2019t copy — please copy manually');
      });
    });
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
})();

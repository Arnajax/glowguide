/**
 * Glowguide — main.js
 * Minimal JS: mobile menu + smooth scroll + active TOC highlighting
 */

(function () {
  'use strict';

  /* ---- Mobile navigation toggle ---- */
  const hamburger = document.querySelector('.nav-hamburger');
  const nav = document.querySelector('.site-nav');

  if (hamburger && nav) {
    hamburger.addEventListener('click', function () {
      const isOpen = nav.classList.toggle('is-open');
      hamburger.setAttribute('aria-expanded', isOpen);
      hamburger.classList.toggle('is-active', isOpen);
    });

    // Close nav when a link is clicked
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', false);
        hamburger.classList.remove('is-active');
      });
    });

    // Close nav on outside click
    document.addEventListener('click', function (e) {
      if (!hamburger.contains(e.target) && !nav.contains(e.target)) {
        nav.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', false);
        hamburger.classList.remove('is-active');
      }
    });
  }

  /* ---- Smooth scroll for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const headerHeight = document.querySelector('.site-header')
          ? document.querySelector('.site-header').offsetHeight
          : 0;
        const top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ---- TOC active highlighting on scroll ---- */
  const tocLinks = document.querySelectorAll('.toc__list a');
  const sections = Array.from(tocLinks).map(function (link) {
    return document.querySelector(link.getAttribute('href'));
  }).filter(Boolean);

  if (tocLinks.length && sections.length) {
    function onScroll() {
      const scrollPos = window.scrollY + 120;
      let current = 0;
      sections.forEach(function (section, i) {
        if (section.offsetTop <= scrollPos) current = i;
      });
      tocLinks.forEach(function (link, i) {
        link.style.fontWeight = i === current ? '600' : '';
        link.style.color = i === current ? 'var(--text-primary)' : '';
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---- Lazy load images ---- */
  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });

    lazyImages.forEach(function (img) {
      imageObserver.observe(img);
    });
  }

})();

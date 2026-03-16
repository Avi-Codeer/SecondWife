/**
 * Second Wife Restaurant & Cafe
 * Main JavaScript
 */

(function () {
  'use strict';

  /* ── Navbar scroll behaviour ──────────────────────────────── */
  const navbar = document.getElementById('navbar');

  function handleNavbarScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  /* ── Active nav link highlighting ─────────────────────────── */
  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveLink() {
    let currentSection = '';
    sections.forEach(function (section) {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        currentSection = section.getAttribute('id');
      }
    });
    navLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + currentSection) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });

  /* ── Mobile nav toggle ─────────────────────────────────────── */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navLinks');

  function closeMenu() {
    navToggle.classList.remove('open');
    navMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu on link click
    navMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!navbar.contains(e.target)) {
        closeMenu();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ── Back to top button ────────────────────────────────────── */
  const backToTop = document.getElementById('backToTop');

  if (backToTop) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }, { passive: true });

    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Scroll reveal animations ──────────────────────────────── */
  function initReveal() {
    const revealEls = document.querySelectorAll(
      '.menu-card, .amenity-card, .why-card, .review-card, ' +
      '.gallery-item, .stat-item, .about-grid > *, ' +
      '.contact-info, .contact-form-wrap, .contact-map, ' +
      '.events-features .event-feat'
    );

    revealEls.forEach(function (el) {
      el.classList.add('reveal');
    });

    // Stagger children within grids
    document.querySelectorAll('.menu-grid, .amenities-grid, .why-grid, .reviews-grid, .gallery-grid').forEach(function (grid) {
      Array.from(grid.children).forEach(function (child, index) {
        child.style.transitionDelay = (index * 0.06) + 's';
      });
    });

    const about = document.querySelector('.about-images');
    const aboutContent = document.querySelector('.about-content');
    if (about) about.classList.add('reveal-left');
    if (aboutContent) aboutContent.classList.add('reveal-right');

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(function (el) {
      observer.observe(el);
    });
  }

  if ('IntersectionObserver' in window) {
    initReveal();
  } else {
    // Fallback for older browsers: make everything visible
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ── Stats counter animation ───────────────────────────────── */
  function animateCount(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    }
    requestAnimationFrame(update);
  }

  const statNumbers = document.querySelectorAll('.stat-number');
  if ('IntersectionObserver' in window && statNumbers.length) {
    const statObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(function (el) { statObserver.observe(el); });
  }

  /* ── Gallery lightbox ──────────────────────────────────────── */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  let currentGalleryIndex = 0;

  function openLightbox(index) {
    currentGalleryIndex = index;
    const item = galleryItems[index];
    const img = item.querySelector('img');
    const caption = item.querySelector('.gallery-overlay span');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = caption ? caption.textContent.trim() : img.alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    lightboxImg.src = '';
  }

  function showPrev() {
    currentGalleryIndex = (currentGalleryIndex - 1 + galleryItems.length) % galleryItems.length;
    openLightbox(currentGalleryIndex);
  }

  function showNext() {
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryItems.length;
    openLightbox(currentGalleryIndex);
  }

  galleryItems.forEach(function (item, index) {
    item.addEventListener('click', function () { openLightbox(index); });
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', 'View image ' + (index + 1));
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(index);
      }
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrev);
  if (lightboxNext) lightboxNext.addEventListener('click', showNext);

  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });

  /* ── Contact form ──────────────────────────────────────────── */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Basic validation
      const requiredFields = contactForm.querySelectorAll('[required]');
      let valid = true;

      requiredFields.forEach(function (field) {
        if (!field.value.trim()) {
          field.style.borderColor = '#e74c3c';
          valid = false;
        } else {
          field.style.borderColor = '';
        }
      });

      if (!valid) return;

      // Simulate form submission
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;

      setTimeout(function () {
        contactForm.hidden = true;
        if (formSuccess) formSuccess.hidden = false;
      }, 1200);
    });

    // Real-time validation feedback
    contactForm.querySelectorAll('[required]').forEach(function (field) {
      field.addEventListener('input', function () {
        if (field.value.trim()) {
          field.style.borderColor = '';
        }
      });
    });
  }

  /* ── Footer year ───────────────────────────────────────────── */
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ── Smooth scroll for anchor links ───────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navH = navbar ? navbar.offsetHeight : 0;
        const targetPos = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });

})();

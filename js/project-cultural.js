/* ═══════════════════════════════════════════════════════════
   project-cultural.js — CULTURAL CREATIVE × DIGITAL VISUAL
   Vanilla JS: Sticky Method, Back-to-Top, Lightbox, Parallax
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── 1. BACK TO TOP ── */
  var backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── 2. HERO PARALLAX ── */
  var heroBg = document.querySelector('.cc-hero-bg img');
  var heroSection = document.querySelector('.cc-hero');
  if (heroBg && heroSection) {
    window.addEventListener('scroll', function () {
      var scrolled = window.scrollY;
      var heroHeight = heroSection.offsetHeight;
      if (scrolled < heroHeight) {
        var offset = scrolled * 0.25;
        heroBg.style.transform = 'translateY(' + offset + 'px) scale(1.04)';
      }
    }, { passive: true });
  }

  /* ── 3. STICKY DESIGN METHOD SECTION ── */
  var methodSection = document.getElementById('design-method');
  if (!methodSection) return;

  var steps = methodSection.querySelectorAll('.cc-ms-item');
  var panels = methodSection.querySelectorAll('.cc-mv-panel');
  if (!steps.length || !panels.length) return;

  // Create an observer for each step's position relative to the section
  var stepPositions = [];
  for (var i = 0; i < steps.length; i++) {
    stepPositions.push(steps[i].offsetTop + steps[i].parentElement.offsetTop);
  }

  function updateMethodStep() {
    var sectionRect = methodSection.getBoundingClientRect();
    var sectionTop = sectionRect.top;
    var sectionHeight = sectionRect.height;
    var viewportHeight = window.innerHeight;
    var progress = -sectionTop / (sectionHeight - viewportHeight);

    // Clamp progress between 0 and 1
    progress = Math.max(0, Math.min(1, progress));

    // Determine active step based on progress
    var stepIndex = Math.round(progress * (steps.length - 1));
    stepIndex = Math.max(0, Math.min(stepIndex, steps.length - 1));

    // Update active states
    for (var j = 0; j < steps.length; j++) {
      if (j === stepIndex) {
        steps[j].classList.add('active');
      } else {
        steps[j].classList.remove('active');
      }
    }

    // Update visible panel
    for (var k = 0; k < panels.length; k++) {
      if (parseInt(panels[k].getAttribute('data-panel'), 10) === stepIndex + 1) {
        panels[k].classList.add('active');
      } else {
        panels[k].classList.remove('active');
      }
    }
  }

  // Use IntersectionObserver to detect when the section is in view
  var methodObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        updateMethodStep();
      }
    });
  }, { threshold: [0, 0.25, 0.5, 0.75, 1] });

  methodObserver.observe(methodSection);

  // Also update on scroll within the section
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking && methodSection.getBoundingClientRect().top < window.innerHeight && methodSection.getBoundingClientRect().bottom > 0) {
      requestAnimationFrame(function () {
        updateMethodStep();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  /* ── 4. LIGHTBOX BINDING FOR GALLERY IMAGES ── */
  // Bind click-to-zoom on gallery items and key visuals
  var zoomableImages = document.querySelectorAll(
    '.cc-gallery-item img, .cc-gen-item img, .cc-triptych-item img, ' +
    '.cc-universe-main img, .cc-glasses-poster img, .cc-poster img, .cc-space-item img'
  );

  zoomableImages.forEach(function (img) {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', function () {
      openCulturalLightbox(img.src, img.alt || '');
    });
  });

  function openCulturalLightbox(src, alt) {
    // Reuse global lightbox if available, otherwise create simple one
    var existingLB = document.querySelector('.lightbox');
    if (existingLB) {
      var lbImg = existingLB.querySelector('.lightbox-img');
      if (lbImg) {
        lbImg.src = src;
        existingLB.classList.add('lightbox-open');
        return;
      }
    }

    // Fallback: create a minimal lightbox
    var overlay = document.createElement('div');
    overlay.style.cssText =
      'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.85);' +
      'display:flex;align-items:center;justify-content:center;' +
      'opacity:0;transition:opacity .3s ease;cursor:pointer;';
    document.body.appendChild(overlay);

    var viewer = document.createElement('img');
    viewer.src = src;
    viewer.alt = alt;
    viewer.style.cssText =
      'max-width:92vw;max-height:92vh;border-radius:8px;box-shadow:0 24px 80px rgba(0,0,0,.5);';
    overlay.appendChild(viewer);

    // Animate in
    requestAnimationFrame(function () { overlay.style.opacity = '1'; });

    function close() {
      overlay.style.opacity = '0';
      setTimeout(function () { overlay.remove(); }, 300);
    }
    overlay.addEventListener('click', close);
    document.addEventListener('keydown', function handler(e) {
      if (e.key === 'Escape') { close(); document.removeEventListener('keydown', handler); }
    });
  }

})();

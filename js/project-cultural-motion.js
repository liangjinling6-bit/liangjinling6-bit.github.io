/* ═══════════════════════════════════════════════════════════════
   CULTURAL VISUAL MOTION — Interaction Script
   Scroll Reveal · Video Controls · Sticky Nav
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Sticky Nav Visibility ── */
  const nav = document.getElementById('cvmNav');
  const heroSection = document.getElementById('hero');
  let lastScrollY = 0;
  let navVisible = false;

  function updateNav() {
    const scrollY = window.scrollY;
    const heroBottom = heroSection ? heroSection.offsetTop + heroSection.offsetHeight - 200 : 300;

    if (scrollY > heroBottom && !navVisible) {
      nav.classList.add('visible');
      navVisible = true;
    } else if (scrollY <= heroBottom && navVisible) {
      nav.classList.remove('visible');
      navVisible = false;
    }

    lastScrollY = scrollY;
  }

  /* ── Section-based Nav Highlighting ── */
  const sections = ['overview', 'approach', 'case-aigc', 'case-xilankapu', 'languages', 'showcase'];
  const navLinks = document.querySelectorAll('.cvm-nav-link');

  function highlightNav() {
    const scrollY = window.scrollY + 180;

    for (let i = sections.length - 1; i >= 0; i--) {
      const el = document.getElementById(sections[i]);
      if (!el) continue;
      const top = el.offsetTop;
      const bottom = top + el.offsetHeight;

      if (scrollY >= top && scrollY < bottom) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('data-section') === sections[i]) {
            link.classList.add('active');
          }
        });
        break;
      }
    }
  }

  /* ── IntersectionObserver: Reveal on Scroll ── */
  function initReveal() {
    var reveals = document.querySelectorAll('.cvm-reveal');
    if (!reveals.length) return;

    // Show hero elements immediately after a short delay
    setTimeout(function () {
      var heroReveals = document.querySelectorAll('.cvm-hero .cvm-reveal');
      heroReveals.forEach(function (el) { el.classList.add('revealed'); });
    }, 200);

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ── Video Play/Pause Toggle ── */
  window.toggleVideoPlay = function (id) {
    var video = document.getElementById(id);
    if (!video) return;

    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
    updatePlayButton(id);
  };

  /* ── Mute Toggle ── */
  window.toggleMute = function (id) {
    var video = document.getElementById(id);
    if (!video) return;
    video.muted = !video.muted;
    updateMuteButton(id);
  };

  function updatePlayButton(id) {
    var video = document.getElementById(id);
    if (!video) return;
    var btns = video.closest('.cvm-fv-player, .cvm-final-item')
      ? video.parentElement.querySelectorAll('.cvm-fv-btn')
      : [];
    btns.forEach(function (btn) {
      if (!video.paused) {
        btn.classList.add('playing');
      } else {
        btn.classList.remove('playing');
      }
    });
  }

  function updateMuteButton(id) {
    var video = document.getElementById(id);
    if (!video) return;
    var btns = video.parentElement.querySelectorAll('.cvm-fv-btn');
    btns.forEach(function (btn) {
      if (video.muted) {
        btn.classList.add('muted');
      } else {
        btn.classList.remove('muted');
      }
    });
  }

  /* ── Auto-sync play button state on video events ── */
  function syncVideoButtons() {
    var videos = document.querySelectorAll('.cvm-fv-player video, .cvm-final-item video');
    videos.forEach(function (video) {
      video.addEventListener('play', function () { updatePlayButton(video.id); });
      video.addEventListener('pause', function () { updatePlayButton(video.id); });
    });
  }

  /* ── Smooth Scroll for Nav Links ── */
  function initSmoothScroll() {
    navLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var targetId = this.getAttribute('href').substring(1);
        var target = document.getElementById(targetId);
        if (target) {
          var offsetTop = target.offsetTop - 60;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  /* ── Throttled Scroll Handler ── */
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        updateNav();
        highlightNav();
        ticking = false;
      });
      ticking = true;
    }
  }

  /* ── Init ── */
  function init() {
    initReveal();
    initSmoothScroll();
    syncVideoButtons();
    updateNav();

    window.addEventListener('scroll', onScroll, { passive: true });

    // Ensure all autoplay videos are muted (browser requirement)
    document.querySelectorAll('video[autoplay]').forEach(function (v) {
      v.muted = true;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

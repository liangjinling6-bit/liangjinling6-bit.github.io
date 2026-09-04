/**
 * 作品集网站交互脚本
 * 功能：滚动揭示动画、视差效果、作品分类筛选、图片淡入、头部滚动效果、灯箱
 */
(function () {
  'use strict';

  /* ========== 滚动揭示动画 ========== */
  const revealElements = document.querySelectorAll(
    '.reveal, .work-card, .detail-card, .detail-step, .light-card, .info-item, .stat, .skill-item'
  );

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-in');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    revealElements.forEach(function (el, index) {
      el.style.transitionDelay = (index % 4) * 0.08 + 's';
      revealObserver.observe(el);
    });
  } else {
    revealElements.forEach(function (el) {
      el.classList.add('reveal-in');
    });
  }

  /* ========== 头部滚动效果 ========== */
  var header = document.querySelector('.header');
  var lastScrollY = 0;

  window.addEventListener('scroll', function () {
    var scrollY = window.pageYOffset;

    if (header) {
      if (scrollY > 50) {
        header.classList.add('header-scrolled');
      } else {
        header.classList.remove('header-scrolled');
      }
    }

    lastScrollY = scrollY;
  }, { passive: true });

  /* ========== 视差效果 ========== */
  var parallaxElements = document.querySelectorAll('[data-parallax]');
  if (parallaxElements.length > 0) {
    window.addEventListener('scroll', function () {
      var scrollY = window.pageYOffset;
      parallaxElements.forEach(function (el) {
        var speed = parseFloat(el.getAttribute('data-parallax')) || 0.3;
        el.style.transform = 'translateY(' + scrollY * speed + 'px)';
      });
    }, { passive: true });
  }

  /* ========== Hero blob 视差 ========== */
  var heroBlobs = document.querySelectorAll('.hero .blob, .footer-cta .blob');
  if (heroBlobs.length > 0) {
    document.addEventListener('mousemove', function (e) {
      var x = (e.clientX / window.innerWidth - 0.5) * 2;
      var y = (e.clientY / window.innerHeight - 0.5) * 2;
      heroBlobs.forEach(function (blob, i) {
        var factor = (i + 1) * 15;
        blob.style.transform = 'translate(' + x * factor + 'px, ' + y * factor + 'px)';
      });
    });
  }

  /* ========== 作品分类筛选 ========== */
  var filterTabs = document.querySelectorAll('.filter-tab');
  var filterItems = document.querySelectorAll('.filter-item');

  filterTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var category = this.getAttribute('data-filter');

      // 切换激活态
      filterTabs.forEach(function (t) {
        t.classList.remove('filter-tab-active');
      });
      this.classList.add('filter-tab-active');

      // 筛选项目
      filterItems.forEach(function (item) {
        if (category === 'all' || item.getAttribute('data-category') === category) {
          item.classList.remove('filter-hidden');
          item.classList.add('filter-show');
        } else {
          item.classList.add('filter-hidden');
          item.classList.remove('filter-show');
        }
      });
    });
  });

  /* ========== 图片淡入加载 ========== */
  var lazyImages = document.querySelectorAll('img[data-src]');
  if ('IntersectionObserver' in window && lazyImages.length > 0) {
    var imageObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var img = entry.target;
          img.src = img.getAttribute('data-src');
          img.removeAttribute('data-src');
          img.classList.add('img-loaded');
          imageObserver.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });

    lazyImages.forEach(function (img) {
      imageObserver.observe(img);
    });
  }

  /* ========== 图片灯箱 ========== */
  var galleryImages = document.querySelectorAll('.detail-gallery img, .detail-hero img');

  // 创建灯箱 DOM
  var lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML =
    '<button class="lightbox-close" aria-label="关闭">&times;</button>' +
    '<button class="lightbox-prev" aria-label="上一张">&#8249;</button>' +
    '<img class="lightbox-img" src="" alt="放大图片">' +
    '<button class="lightbox-next" aria-label="下一张">&#8250;</button>';
  document.body.appendChild(lightbox);

  var currentImageIndex = 0;
  var gallerySrcs = [];

  galleryImages.forEach(function (img, index) {
    gallerySrcs.push(img.src);
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', function (e) {
      e.preventDefault();
      currentImageIndex = index;
      lightbox.querySelector('.lightbox-img').src = img.src;
      lightbox.classList.add('lightbox-open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('lightbox-open');
    document.body.style.overflow = '';
  }

  function navigateLightbox(direction) {
    currentImageIndex = (currentImageIndex + direction + gallerySrcs.length) % gallerySrcs.length;
    lightbox.querySelector('.lightbox-img').src = gallerySrcs[currentImageIndex];
  }

  lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightbox.querySelector('.lightbox-prev').addEventListener('click', function (e) {
    e.stopPropagation();
    navigateLightbox(-1);
  });
  lightbox.querySelector('.lightbox-next').addEventListener('click', function (e) {
    e.stopPropagation();
    navigateLightbox(1);
  });
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('lightbox-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });

  /* ========== 平滑滚动 ========== */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var offset = 72;
        var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  /* ========== 页面淡入 ========== */
  document.body.classList.add('page-loaded');

  /* ========== 数字递增动画 ========== */
  var statValues = document.querySelectorAll('.stat-value');
  if ('IntersectionObserver' in window && statValues.length > 0) {
    var statObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var raw = el.textContent.trim();
        var match = raw.match(/^(.+?)(\d+)(.*)$/);
        if (!match) {
          statObserver.unobserve(el);
          return;
        }
        var prefix = match[1];
        var target = parseInt(match[2], 10);
        var suffix = match[3];
        var current = 0;
        var duration = 1200;
        var startTime = null;

        function animate(time) {
          if (!startTime) startTime = time;
          var progress = Math.min((time - startTime) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = prefix + Math.floor(eased * target) + suffix;
          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            el.textContent = prefix + target + suffix;
          }
        }
        requestAnimationFrame(animate);
        statObserver.unobserve(el);
      });
    }, { threshold: 0.5 });

    statValues.forEach(function (el) {
      statObserver.observe(el);
    });
  }

  /* ========== 自助贩卖机点单原型 ========== */
  (function () {
    const proto = document.getElementById('vendingProto');
    if (!proto) return;

    const products = {
      drink: [
        { name: '冰美式', price: 8, icon: '☕' },
        { name: '拿铁', price: 12, icon: '🥛' },
        { name: '鲜橙汁', price: 6, icon: '🍊' },
        { name: '气泡水', price: 5, icon: '🫧' }
      ],
      snack: [
        { name: '能量棒', price: 9, icon: '🍫' },
        { name: '薯片', price: 7, icon: '🥔' },
        { name: '每日坚果', price: 10, icon: '🥜' },
        { name: '黑巧', price: 6, icon: '🍩' }
      ]
    };

    const listEl = document.getElementById('protoList');
    const countEl = document.getElementById('protoCount');
    const totalEl = document.getElementById('protoTotal');
    const toastEl = document.getElementById('protoToast');
    const tabs = proto.querySelectorAll('.proto-tab');
    let activeCat = 'drink';
    let count = 0;
    let total = 0;
    let toastTimer = null;

    function render() {
      listEl.innerHTML = '';
      products[activeCat].forEach(function (p) {
        const item = document.createElement('div');
        item.className = 'proto-item';
        item.innerHTML =
          '<div class="proto-thumb">' + p.icon + '</div>' +
          '<div class="proto-info"><div class="proto-name">' + p.name + '</div>' +
          '<div class="proto-price">&#165;' + p.price + '</div></div>' +
          '<button class="proto-add" aria-label="加入购物车">&#43;</button>';
        item.querySelector('.proto-add').addEventListener('click', function () {
          count += 1;
          total += p.price;
          updateCart();
          showToast(p.name + ' 已加入');
        });
        listEl.appendChild(item);
      });
    }

    function updateCart() {
      countEl.textContent = count;
      totalEl.textContent = total;
    }

    function showToast(msg) {
      toastEl.textContent = msg;
      toastEl.classList.add('proto-show');
      if (toastTimer) clearTimeout(toastTimer);
      toastTimer = setTimeout(function () {
        toastEl.classList.remove('proto-show');
      }, 1200);
    }

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('proto-active'); });
        tab.classList.add('proto-active');
        activeCat = tab.getAttribute('data-cat');
        render();
      });
    });

    document.getElementById('protoOrder').addEventListener('click', function () {
      if (count === 0) {
        showToast('请先选择商品');
        return;
      }
      showToast('下单成功 · 共 ' + count + ' 件 &#165;' + total);
    });

    render();
  })();

  /* ========== 文化创意综合页 · 子项目标签切换 ========== */
  (function () {
    const tabs = document.querySelectorAll('.culture-tab');
    const panels = document.querySelectorAll('.culture-panel');
    if (!tabs.length || !panels.length) return;

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        const target = tab.getAttribute('data-target');
        tabs.forEach(function (t) { t.classList.remove('active'); });
        panels.forEach(function (p) { p.classList.remove('active'); });
        tab.classList.add('active');
        const activePanel = document.getElementById(target);
        if (activePanel) activePanel.classList.add('active');
        // 切换后回到内容顶部，避免视差错位
        activePanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  })();
})();

/* ========== Interactive Hero: PART Hover Preview ========== */
(function () {
  var hero = document.querySelector('.hero-dynamic');
  var preview = document.getElementById('heroPreview');
  var partCards = document.querySelectorAll('.hero-folder[data-part]');

  if (!hero || !preview || !partCards.length) return;

  var previews = {
    part01: [
      'assets/images/project-e-teach.png',
      'assets/images/vending-order-phone.png',
      'assets/images/project-ui.png'
    ],
    part23: [
      'assets/images/project-animal.png',
      'assets/images/project-motion.png',
      'assets/images/project-creative.png'
    ],
    part04: [
      'assets/images/project-cultural.png',
      'assets/images/project-film.png',
      'assets/images/project-xilan.png'
    ]
  };

  function clearPartState() {
    hero.classList.remove('part-active', 'part-part01', 'part-part23', 'part-part04');
    preview.classList.remove('is-active');
    preview.innerHTML = '';
  }

  function activatePart(part) {
    var images = previews[part] || [];
    if (!images.length) return;

    hero.classList.remove('part-part01', 'part-part23', 'part-part04');
    hero.classList.add('part-active', 'part-' + part);
    preview.innerHTML = images
      .map(function (src) {
        return '<img src="' + src + '" alt="" loading="lazy">';
      })
      .join('');
    preview.classList.add('is-active');
  }

  function resetPapers(folder) {
    folder.querySelectorAll('.paper').forEach(function (paper) {
      paper.style.setProperty('--magnet-x', '0px');
      paper.style.setProperty('--magnet-y', '0px');
    });
  }

  partCards.forEach(function (card) {
    card.addEventListener('mouseenter', function () {
      card.classList.add('is-hovered');
      activatePart(card.getAttribute('data-part'));
    });

    card.addEventListener('mouseleave', function () {
      card.classList.remove('is-hovered');
      resetPapers(card);
      clearPartState();
    });

    card.addEventListener('focusin', function () {
      card.classList.add('is-hovered');
      activatePart(card.getAttribute('data-part'));
    });

    card.addEventListener('focusout', function () {
      card.classList.remove('is-hovered');
      resetPapers(card);
      clearPartState();
    });

    card.querySelectorAll('.paper').forEach(function (paper) {
      paper.addEventListener('click', function (e) {
        e.stopPropagation();
      });

      paper.addEventListener('mousemove', function (e) {
        if (!card.classList.contains('is-hovered')) return;

        var rect = paper.getBoundingClientRect();
        var centerX = rect.left + rect.width / 2;
        var centerY = rect.top + rect.height / 2;
        var offsetX = (e.clientX - centerX) * 0.15;
        var offsetY = (e.clientY - centerY) * 0.15;
        paper.style.setProperty('--magnet-x', offsetX + 'px');
        paper.style.setProperty('--magnet-y', offsetY + 'px');
      });

      paper.addEventListener('mouseleave', function () {
        paper.style.setProperty('--magnet-x', '0px');
        paper.style.setProperty('--magnet-y', '0px');
      });
    });
  });
})();

/* ========== 视频 Blob 加载器（全站通用） ==========
   部署网关(CloudStudio)不支持 HTTP Range(无 Content-Length / 206 分片)，
   iOS Safari 等移动端浏览器会拒绝直接 <video src> 流式播放，导致视频静默消失。
   方案：把全站所有 <video> 的资源改为 fetch 全量下载 → Blob URL 播放，绕开服务器限制。
   - 自动播放视频(autoplay)：加载完成后自动 play
   - 非自动播放视频(带 controls)：同样 blob 化，使移动端点按播放也能正常出画面
   串行下载避免首屏并发过大；fetch 全部失败时回退到原生 src，绝不留下空源。 */
(function () {
  'use strict';
  if (!('fetch' in window) || !('URL' in window)) return;

  function collectSources(video) {
    var urls = [];
    var direct = video.getAttribute('src');
    if (direct) urls.push(direct);
    video.querySelectorAll('source').forEach(function (s) {
      var u = s.getAttribute('src');
      if (u) urls.push(u);
    });
    return urls;
  }

  /* 记录原生源，fetch 全部失败时用于回退 */
  function snapshotNative(video) {
    var snap = { src: video.getAttribute('src'), sources: [] };
    video.querySelectorAll('source').forEach(function (s) {
      snap.sources.push({ src: s.getAttribute('src'), type: s.getAttribute('type') });
    });
    return snap;
  }

  function restoreNative(video, snap) {
    try {
      snap.sources.forEach(function (s) {
        var el = document.createElement('source');
        if (s.src) el.setAttribute('src', s.src);
        if (s.type) el.setAttribute('type', s.type);
        video.appendChild(el);
      });
      if (snap.src) video.setAttribute('src', snap.src);
      video.load();
    } catch (e) { /* ignore */ }
  }

  function stripSources(video) {
    try {
      video.removeAttribute('src');
      video.querySelectorAll('source').forEach(function (s) { s.remove(); });
    } catch (e) { /* ignore */ }
  }

  function loadVideo(video, urls, isAutoplay) {
    if (video.dataset.blob === '1') return;
    video.dataset.blob = '1';
    var snap = snapshotNative(video);
    stripSources(video); // 先移除原生源，避免移动端用 Range 请求卡死
    var done = false;

    function tryFetch(i) {
      if (done || i >= urls.length) {
        if (!done) restoreNative(video, snap); // 全部失败 → 回退原生源
        return;
      }
      fetch(urls[i])
        .then(function (r) {
          if (!r.ok) throw new Error('HTTP ' + r.status);
          return r.blob();
        })
        .then(function (blob) {
          if (done) return;
          if (!blob || blob.size < 100) { tryFetch(i + 1); return; }
          done = true;
          var url = URL.createObjectURL(blob);
          if (isAutoplay) video.muted = true; // 仅自动播放强制静音以满足自动播放策略
          video.src = url;
          video.load(); // 确保新 blob 源立即生效
          if (isAutoplay) {
            var p = video.play();
            if (p && p.catch) p.catch(function () {
              /* iOS 自动播放被拦：首次用户手势后重试，避免视频"静默消失" */
              var evts = ['touchstart', 'pointerdown', 'scroll', 'click'];
              var h = function () {
                evts.forEach(function (e) { window.removeEventListener(e, h, { passive: true }); });
                var p2 = video.play();
                if (p2 && p2.catch) p2.catch(function () {});
              };
              evts.forEach(function (e) { window.addEventListener(e, h, { passive: true }); });
            });
          }
        })
        .catch(function (e) {
          if (!done) console.warn('[video-blob] fetch 失败:', urls[i], e && e.message);
          tryFetch(i + 1);
        });
    }
    tryFetch(0);
  }

  function start() {
    document.querySelectorAll('video').forEach(function (video) {
      if (video.dataset.blob === '1') return;
      if (video.currentSrc && video.currentSrc.indexOf('blob:') === 0) {
        video.dataset.blob = '1';
        return;
      }
      var urls = collectSources(video);
      if (!urls.length) return;
      var isAutoplay = video.hasAttribute('autoplay') || video.autoplay;
      loadVideo(video, urls, isAutoplay);
    });
  }

  /* 首屏渲染完成后再串行加载视频 */
  if (document.readyState === 'complete') {
    setTimeout(start, 300);
  } else {
    window.addEventListener('load', function () { setTimeout(start, 300); });
  }
})();

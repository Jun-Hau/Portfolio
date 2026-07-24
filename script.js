/* ================================================================
   PORTFOLIO — script.js  (Professional Redesign)
   Jun Hau Chang | Robotics & Mechatronics Engineer
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Navbar scroll effect ──────────────────────────────────── */
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    updateActiveNavLink();
  });

  /* ── Active nav link highlighting ─────────────────────────── */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a');

  function updateActiveNavLink() {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');
      const link   = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (link && scrollY >= top && scrollY < top + height) {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }

  /* ── Mobile hamburger ──────────────────────────────────────── */
  const hamburger  = document.getElementById('hamburger');
  const navLinksEl = document.querySelector('.nav-links');

  function setMenuOpen(open) {
    navLinksEl.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  if (hamburger && navLinksEl) {
    hamburger.addEventListener('click', () => {
      setMenuOpen(!navLinksEl.classList.contains('open'));
    });

    navLinksEl.addEventListener('click', e => {
      if (e.target.tagName === 'A') setMenuOpen(false);
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) setMenuOpen(false);
    });
  }

  /* ── Smooth anchor scroll ──────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = navbar.offsetHeight;
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── Scroll reveal ─────────────────────────────────────────── */
  const revealEls = document.querySelectorAll(
    '.about-text, .about-card-col, .skill-category, .timeline-item, ' +
    '.proj-card, .honour-card, .contact-card, .section-header'
  );
  revealEls.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Staggered delay within each visible batch
        const siblings = [...revealEls].filter(
          el => el.closest('section') === entry.target.closest('section')
        );
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, Math.min(idx * 75, 450));
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ── Skill bar animation ───────────────────────────────────── */
  const skillFills    = document.querySelectorAll('.skill-fill');
  const skillObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  skillFills.forEach(fill => skillObserver.observe(fill));

  /* ── Image Carousels ───────────────────────────────────────── */
  document.querySelectorAll('.img-carousel').forEach(carousel => {
    const imgs  = carousel.querySelectorAll('img');
    const dots  = carousel.querySelector('.carousel-dots');
    const prev  = carousel.querySelector('.carousel-prev');
    const next  = carousel.querySelector('.carousel-next');

    if (imgs.length <= 1) {
      [prev, next].forEach(b => b && (b.style.display = 'none'));
      return;
    }

    let current = 0;

    // Build dots
    imgs.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => goTo(i));
      dots.appendChild(dot);
    });

    function goTo(idx) {
      imgs[current].classList.remove('active');
      dots.querySelectorAll('.dot')[current].classList.remove('active');
      current = (idx + imgs.length) % imgs.length;
      imgs[current].classList.add('active');
      dots.querySelectorAll('.dot')[current].classList.add('active');
    }

    prev && prev.addEventListener('click', e => { e.stopPropagation(); goTo(current - 1); });
    next && next.addEventListener('click', e => { e.stopPropagation(); goTo(current + 1); });

    // Auto-advance
    let timer = setInterval(() => goTo(current + 1), 4500);
    carousel.addEventListener('mouseenter', () => clearInterval(timer));
    carousel.addEventListener('mouseleave', () => {
      timer = setInterval(() => goTo(current + 1), 4500);
    });
  });

  /* ── Lightbox ──────────────────────────────────────────────── */
  const lightbox      = document.getElementById('lightbox');
  const lightboxImg   = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  document.querySelectorAll('.img-carousel img').forEach(img => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

  /* ── Project expand / collapse — click to toggle ── */
  document.querySelectorAll('.proj-card').forEach(card => {
    const details = card.querySelector('.proj-details');
    if (!details) return;

    const toggle = document.createElement('button');
    toggle.className = 'proj-toggle';
    toggle.textContent = 'Read More ↓';
    details.insertAdjacentElement('beforebegin', toggle);

    let open = false;

    toggle.addEventListener('click', () => {
      open = !open;
      card.classList.toggle('pinned', open);
      toggle.textContent = open ? 'Show Less ↑' : 'Read More ↓';
    });
  });

  /* ── Project filter tabs ───────────────────────────────────── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projCards  = document.querySelectorAll('.proj-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      projCards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden', !match);
      });
    });
  });

  /* ── Animated counter ──────────────────────────────────────── */
  function animateCounter(el, target, duration = 1400) {
    const hasPlus = el.textContent.includes('+');
    const start   = performance.now();
    function step(now) {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      const val  = Math.round(ease * target);
      el.textContent = val + (hasPlus ? '+' : '');
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const statsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.stat-num').forEach(el => {
          const num = parseFloat(el.textContent.replace(/[^0-9.]/g, ''));
          el.textContent = '0' + (el.textContent.includes('+') ? '+' : '');
          animateCounter(el, num);
        });
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) statsObserver.observe(heroStats);

});

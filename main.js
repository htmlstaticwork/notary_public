/* ============================================================
   NOTARY PRO — Main JavaScript
   ============================================================ */

(() => {
  'use strict';

  /* ── 1. Theme ── */
  const getTheme = () => localStorage.getItem('np-theme') || 'light';
  const applyTheme = (t) => {
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('np-theme', t);
    document.querySelectorAll('#theme-toggle, #theme-toggle-m, #theme-toggle-auth').forEach(btn => {
      const icon = btn.querySelector('svg use') || btn.querySelector('i[data-lucide]');
      if (btn.querySelector('[data-lucide]')) {
        btn.querySelector('[data-lucide]').setAttribute('data-lucide', t === 'dark' ? 'sun' : 'moon');
      }
    });
    if (window.lucide) lucide.createIcons();
  };
  applyTheme(getTheme());

  const toggleTheme = () => applyTheme(getTheme() === 'dark' ? 'light' : 'dark');
  document.addEventListener('click', e => {
    if (e.target.closest('#theme-toggle, #theme-toggle-m, #theme-toggle-auth')) toggleTheme();
  });

  /* ── 2. RTL ── */
  const getRTL = () => localStorage.getItem('np-rtl') === 'true';
  const applyRTL = (v) => {
    document.documentElement.setAttribute('dir', v ? 'rtl' : 'ltr');
    localStorage.setItem('np-rtl', v);
  };
  applyRTL(getRTL());

  document.addEventListener('click', e => {
    if (e.target.closest('#rtl-toggle, #rtl-toggle-m, #rtl-toggle-auth')) applyRTL(!getRTL());
  });

  /* ── 3. Header scroll effect ── */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── 4. Active nav link ── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .drawer-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ── 5. Mobile Drawer ── */
  const hamburger = document.getElementById('hamburger');
  const drawer = document.getElementById('mobile-drawer');
  const overlay = document.getElementById('drawer-overlay');
  const drawerClose = document.getElementById('drawer-close');

  const openDrawer = () => {
    drawer?.classList.add('open');
    overlay?.classList.add('open');
    hamburger?.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const closeDrawer = () => {
    drawer?.classList.remove('open');
    overlay?.classList.remove('open');
    hamburger?.classList.remove('open');
    document.body.style.overflow = '';
  };

  hamburger?.addEventListener('click', () => drawer?.classList.contains('open') ? closeDrawer() : openDrawer());
  drawerClose?.addEventListener('click', closeDrawer);
  overlay?.addEventListener('click', closeDrawer);

  // Close drawer on nav link click (mobile)
  drawer?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));

  /* ── 6. Scroll Reveal (Intersection Observer) ── */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 80);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    revealEls.forEach(el => observer.observe(el));
  }

  /* ── 7. Counter Animation ── */
  const animateCounter = (el) => {
    const target = parseFloat(el.getAttribute('data-target') || el.textContent);
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const duration = 1800;
    const start = performance.now();
    const isFloat = target % 1 !== 0;

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const value = eased * target;
      el.textContent = prefix + (isFloat ? value.toFixed(1) : Math.floor(value)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-counter]').forEach(el => counterObserver.observe(el));

  /* ── 8. FAQ Accordion ── */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      // close all
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ── 9. Password Toggle ── */
  document.querySelectorAll('.toggle-pw').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.closest('.input-wrapper')?.querySelector('input');
      if (!input) return;
      const isText = input.type === 'text';
      input.type = isText ? 'password' : 'text';
      const icon = btn.querySelector('[data-lucide]');
      if (icon) {
        icon.setAttribute('data-lucide', isText ? 'eye' : 'eye-off');
        lucide.createIcons();
      }
    });
  });

  /* ── 10. Back to Top ── */
  const btt = document.querySelector('.back-to-top');
  if (btt) {
    window.addEventListener('scroll', () => btt.classList.toggle('visible', window.scrollY > 400), { passive: true });
    btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ── 11. 3D Tilt Effect (Home 2 only) ── */
  const tiltCards = document.querySelectorAll('.tilt-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateZ(0)';
    });
  });

  /* ── 12. Dashboard Sidebar Toggle ── */
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebar = document.querySelector('.sidebar');
  const sidebarOverlay = document.querySelector('.sidebar-overlay');

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      sidebarOverlay?.classList.toggle('open');
    });
    sidebarOverlay?.addEventListener('click', () => {
      sidebar.classList.remove('open');
      sidebarOverlay.classList.remove('open');
    });
  }

  /* ── 13. Smooth Anchor Scroll ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── 14. Newsletter form ── */
  const newsletterForms = document.querySelectorAll('.newsletter-form');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const btn = form.querySelector('button');
      if (!input?.value) return;
      btn.textContent = '✓ Subscribed!';
      btn.style.background = '#22c55e';
      input.value = '';
      setTimeout(() => {
        btn.textContent = 'Subscribe';
        btn.style.background = '';
      }, 3000);
    });
  });

  /* ── 15. Contact form ── */
  const contactForm = document.getElementById('contact-form');
  contactForm?.addEventListener('submit', e => {
    e.preventDefault();
    const btn = contactForm.querySelector('[type="submit"]');
    const orig = btn.textContent;
    btn.textContent = '✓ Message Sent!';
    btn.disabled = true;
    setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 3000);
  });

  /* ── 16. Init Lucide Icons ── */
  if (window.lucide) lucide.createIcons();

})();


document.addEventListener('DOMContentLoaded', () => {
  /* Mobile Navigation Toggle */
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('primary-nav');

  if (navToggle && nav) {
    // Toggle open/close on click
    navToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      // Prevent background scroll while menu is open (mobile UX)
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu when a link is clicked (mobile UX)
    nav.addEventListener('click', (e) => {
      if (e.target.closest('a')) {
        nav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        nav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });

    // Close when clicking outside nav/toggle (mobile drawer UX)
    document.addEventListener('click', (e) => {
      const clickedInside = e.target.closest('#primary-nav') || e.target.closest('.nav-toggle');
      if (!clickedInside) {
        nav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* STEP 1: JS-only initial reveal for hero */
  const hero = document.getElementById('hero');
  if (!hero) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Cache elements
  const content  = hero.querySelector('.hero-content');
  const h1       = content ? content.querySelector('h1') : null;
  const t1       = h1 ? h1.querySelector('.t1') : null;
  const t2       = h1 ? h1.querySelector('.t2') : null;
  const t3       = h1 ? h1.querySelector('.t3') : null;
  const tagline  = content ? content.querySelector('.tagline') : null;
  const ctas     = content ? content.querySelector('.cta-buttons') : null;
  const logoImg  = hero.querySelector('.hero-logo img');

  const ease = 'cubic-bezier(0.22, 1, 0.36, 1)';

  const setFinal = (el) => {
    if (!el) return;
    el.style.opacity = '1';
    el.style.transform = 'translate(0, 0)';
  };

  const animateIn = (el, axis = 'Y', distance = 18, duration = 850, delay = 0) => {
    if (!el) return null;
    const from = { opacity: 0, transform: `translate${axis}(${distance}px)` };
    const to   = { opacity: 1, transform: `translate${axis}(0)` };
    // Ensure element starts at the expected state
    el.style.opacity = '0';
    el.style.transform = `translate${axis}(${distance}px)`;
    return el.animate([from, to], { duration, delay, easing: ease, fill: 'forwards' });
  };

  const revealHero = () => {
    if (prefersReducedMotion) {
      [content, t1, t2, t3, tagline, ctas, logoImg].forEach(setFinal);
      return;
    }

    // Sequence: content → t1 → t2 → t3 → tagline → ctas → logo (from right)
    animateIn(content, 'Y', 18, 1200, 0);
    animateIn(t1, 'Y', 18, 560, 80);
    animateIn(t2, 'Y', 18, 860, 380);
    animateIn(t3, 'Y', 18, 1160, 780);
    animateIn(tagline, 'Y', 18, 2000, 1200);
    animateIn(ctas, 'Y', 18, 1560, 1200);
    animateIn(logoImg, 'X', 18, 2000, 1000);
  };

  // Trigger once when ~30% of hero becomes visible
  if (prefersReducedMotion) {
    revealHero();
  } else {
    try {
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              revealHero();
              obs.unobserve(entry.target); // cleanup
            }
          });
        },
        { threshold: 0.5 }
      );
      observer.observe(hero);
    } catch (err) {
      // Fallback for older browsers
      revealHero();
    }
  }

  /* ===============================================
     STEP 3: Subtle background parallax (disabled for reduced motion)
  =============================================== */
  if (!prefersReducedMotion) {
    const startY = window.scrollY;
    const basePos = 50;      // base % for center
    const strength = 0.08;   // parallax factor (0.04–0.10 is subtle and smooth)

    const onScroll = () => {
      const delta = window.scrollY - startY;
      hero.style.backgroundPosition = `center calc(${basePos}% + ${delta * strength}px)`;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
  }
});
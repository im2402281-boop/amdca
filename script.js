/* =================================================================
   A. Modern Day Cricket Academy — script.js
   All JavaScript extracted from index.html for clean code structure
================================================================= */

/* ================================================
   1. LOADER — Hide after page loads
================================================ */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 1600);
});

/* ================================================
   2. GENERATE FLOATING PARTICLES in Hero
================================================ */
const particlesContainer = document.getElementById('particles');
for (let i = 0; i < 22; i++) {
  const p = document.createElement('div');
  p.classList.add('particle');
  const size = Math.random() * 5 + 3;
  p.style.cssText = `
    width:${size}px;
    height:${size}px;
    left:${Math.random() * 100}%;
    bottom:${Math.random() * 40}%;
    --dur:${(Math.random() * 8 + 5)}s;
    --delay:${(Math.random() * 8)}s;
  `;
  particlesContainer.appendChild(p);
}

/* ================================================
   3. NAVBAR — Scroll behaviour + sticky style
================================================ */
const navbar     = document.getElementById('navbar');
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  navbar.classList.toggle('scrolled', y > 60);
  scrollTopBtn.classList.toggle('visible', y > 400);
}, { passive: true });

/* ================================================
   4. HAMBURGER MENU — Toggle mobile nav
================================================ */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('open');
});

// Close mobile menu when any link is clicked
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
  });
});

/* ================================================
   5. SCROLL REVEAL — IntersectionObserver
================================================ */
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Stagger delay based on sibling index
      const siblings = entry.target.parentElement?.querySelectorAll(
        '.reveal, .reveal-left, .reveal-right'
      );
      if (siblings) {
        let delay = 0;
        siblings.forEach((el, i) => {
          if (el === entry.target) delay = i * 80;
        });
        entry.target.style.transitionDelay = delay + 'ms';
      }
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ================================================
   6. SCROLL TO TOP button
================================================ */
scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ================================================
   7. PATRON IMAGE SLIDER — Auto + manual
================================================ */
const track = document.getElementById('patronTrack');
const dots   = document.querySelectorAll('.slider-dot');
let current  = 0;
const total  = 3;
let autoTimer = null;

function goToSlide(idx) {
  current = (idx + total) % total;
  track.style.transform = `translateX(-${current * 100}%)`;
  dots.forEach((d, i) => d.classList.toggle('active', i === current));
}

document.getElementById('patronPrev').addEventListener('click', () => {
  goToSlide(current - 1);
  resetAuto();
});
document.getElementById('patronNext').addEventListener('click', () => {
  goToSlide(current + 1);
  resetAuto();
});
dots.forEach(d => {
  d.addEventListener('click', () => {
    goToSlide(+d.dataset.idx);
    resetAuto();
  });
});

function startAuto() {
  autoTimer = setInterval(() => goToSlide(current + 1), 4000);
}
function resetAuto() {
  clearInterval(autoTimer);
  startAuto();
}
startAuto();

// Touch / swipe support for mobile
let touchStartX = 0;
const sliderWrap = document.querySelector('.patron-slider-wrap');

sliderWrap.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

sliderWrap.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].screenX;
  if (Math.abs(diff) > 50) {
    goToSlide(diff > 0 ? current + 1 : current - 1);
    resetAuto();
  }
});

/* ================================================
   8. GALLERY LIGHTBOX
================================================ */
const lightbox = document.getElementById('lightbox');
const lbImg    = document.getElementById('lightboxImg');

document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    lbImg.src = item.dataset.img;
    lbImg.alt = item.querySelector('img').alt;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

/* ================================================
   9. HERO COUNTER ANIMATION
================================================ */
const counters = document.querySelectorAll('[data-count]');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el     = entry.target;
      const target = +el.dataset.count;
      const step   = target / (1600 / 16); // ~1.6s duration at 60fps
      let count    = 0;

      const timer = setInterval(() => {
        count += step;
        if (count >= target) {
          el.textContent = target + (target >= 100 ? '+' : '');
          clearInterval(timer);
        } else {
          el.textContent = Math.floor(count) + (target >= 100 ? '+' : '');
        }
      }, 16);

      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

counters.forEach(c => counterObserver.observe(c));

/* ================================================
   10. BOOKING FORM — Send to WhatsApp
================================================ */
document.getElementById('bookingForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const name    = document.getElementById('fname').value.trim();
  const phone   = document.getElementById('fphone').value.trim();
  const session = document.getElementById('fsession').value;
  const msg     = document.getElementById('fmessage').value.trim();

  if (!name || !phone || !session) {
    alert('Please fill in all required fields.');
    return;
  }

  const waText = encodeURIComponent(
    `*New Booking Request - A. MDCA*\n\n` +
    `👤 Name: ${name}\n` +
    `📞 Phone: ${phone}\n` +
    `🏏 Session: ${session}\n` +
    `💬 Message: ${msg || 'N/A'}`
  );

  window.open(`https://wa.me/923214983884?text=${waText}`, '_blank');
  this.reset();
});

/* ================================================
   11. PARALLAX — Hero ball follows scroll
================================================ */
const heroBall = document.querySelector('.hero-ball');

window.addEventListener('scroll', () => {
  if (heroBall) {
    heroBall.style.transform = `translateY(${window.scrollY * 0.15}px)`;
  }
}, { passive: true });

/* ================================================
   12. ACTIVE NAV LINK HIGHLIGHT on scroll
================================================ */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-menu a, .mobile-menu a');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 100;
  sections.forEach(sec => {
    if (scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight) {
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === '#' + sec.id) {
          link.style.color = 'var(--gold)';
        }
      });
    }
  });
}, { passive: true });

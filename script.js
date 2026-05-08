/* ============================================
   ASTRO VARENYAM — Interactions & Animations
   ============================================ */

(function () {
  'use strict';



  /* ------------------------------------------
     NAV: scroll glass effect
  ------------------------------------------ */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  /* ------------------------------------------
     HAMBURGER mobile menu
  ------------------------------------------ */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });

  /* ------------------------------------------
     LANGUAGE TOGGLE & PERSISTENCE
  ------------------------------------------ */
  const langToggle = document.getElementById('langToggle');
  const langToggleMobile = document.getElementById('langToggleMobile');
  
  function setLanguage(lang) {
    document.body.classList.remove('lang-en', 'lang-hi');
    document.body.classList.add(`lang-${lang}`);
    document.documentElement.lang = lang;
    localStorage.setItem('astro_lang', lang);
    // Set cookie for 1 year
    const d = new Date();
    d.setTime(d.getTime() + (365*24*60*60*1000));
    document.cookie = `astro_lang=${lang};expires=${d.toUTCString()};path=/;SameSite=Strict`;
  }

  function toggleLanguage() {
    const isEn = document.body.classList.contains('lang-en');
    setLanguage(isEn ? 'hi' : 'en');
  }

  // Initialize language on load
  const getSavedLang = () => {
    // Check localStorage first, then cookie
    const local = localStorage.getItem('astro_lang');
    if (local) return local;
    const cookie = document.cookie.split('; ').find(row => row.startsWith('astro_lang='));
    return cookie ? cookie.split('=')[1] : 'en';
  };

  setLanguage(getSavedLang());

  if (langToggle) langToggle.addEventListener('click', toggleLanguage);
  if (langToggleMobile) langToggleMobile.addEventListener('click', toggleLanguage);

  /* ------------------------------------------
     SCROLL REVEAL
  ------------------------------------------ */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger children in same parent
        const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ------------------------------------------
     HERO: particle field
  ------------------------------------------ */
  function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    const count = 50;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.cssText = `
        left: ${Math.random() * 100}%;
        top:  ${Math.random() * 100}%;
        --dur:   ${3 + Math.random() * 5}s;
        --delay: ${Math.random() * 6}s;
        --op:    ${0.15 + Math.random() * 0.45};
        width:   ${Math.random() > 0.7 ? 3 : 2}px;
        height:  ${Math.random() > 0.7 ? 3 : 2}px;
      `;
      container.appendChild(p);
    }
  }
  createParticles();

  /* ------------------------------------------
     ACTIVE NAV link highlight on scroll
  ------------------------------------------ */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.style.color = link.getAttribute('href') === `#${id}` ? 'var(--accent-green)' : '';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));

  /* ------------------------------------------
     SMOOTH cursor-aware card tilt (service cards)
  ------------------------------------------ */
  document.querySelectorAll('.service-card, .testimonial-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top  - rect.height / 2;
      const rotX = -(y / rect.height) * 4;
      const rotY =  (x / rect.width)  * 4;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94), background 0.3s';
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s linear, background 0.3s';
    });
  });

  /* ------------------------------------------
     Counter animation for authority strip
  ------------------------------------------ */
  function animateCounter(el, target, suffix = '') {
    const duration = 1800;
    const start = performance.now();
    const isPlus = suffix === '+';
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + (isPlus ? '+' : suffix);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const nums = entry.target.querySelectorAll('.auth-num');
        nums.forEach(num => {
          const raw = num.textContent.trim();
          const hasSuffix = raw.endsWith('+');
          const val = parseInt(raw.replace('+', ''));
          if (!isNaN(val)) animateCounter(num, val, hasSuffix ? '+' : '');
        });
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const authSection = document.querySelector('.authority');
  if (authSection) counterObserver.observe(authSection);

  /* ------------------------------------------
     WHATSAPP ATTENTION
  ------------------------------------------ */
  setTimeout(() => {
    const whatsapp = document.querySelector('.floating-whatsapp');
    if (whatsapp) {
      whatsapp.classList.add('pulse-attention');
    }
  }, 30000);

  /* ------------------------------------------
     HERO: Typewriter Effect
  ------------------------------------------ */
  const typewriterEl = document.getElementById('typewriter-headline');
  const cursor = '<span class="typewriter-cursor">|</span>';
  const phrases = [
    { text: 'Astrology is not <em>prediction.</em> It is <span class="gold">alignment.</span>' },
    { text: 'ज्योतिष भविष्यवाणी नहीं है। <em>यह संरेखण है।</em>' },
    { text: 'Your stars don\'t <em>define</em> you. They <span class="gold">guide</span> you.' },
    { text: 'आपके सितारे आपको <em>परिभाषित</em> नहीं करते। वे आपका <span class="gold">मार्गदर्शन</span> करते हैं।' },
    { text: 'Precision in <em>timing.</em> Clarity in <span class="gold">purpose.</span>' },
    { text: 'समय में <em>सटीकता।</em> उद्देश्य में <span class="gold">स्पष्टता।</span>' },
    { text: 'Unlock the <em>wisdom</em> of the <span class="gold">cosmos.</span>' },
    { text: 'ब्रह्मांड के <em>ज्ञान</em> को <span class="gold">अनलॉक</span> करें।' },
    { text: 'Transform your <em>destiny</em> through <span class="gold">Vedic wisdom.</span>' },
    { text: 'वैदिक ज्ञान के माध्यम से अपने <em>भाग्य</em> को <span class="gold">बदलें।</span>' }
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentPhrase = phrases[phraseIndex].text;
    
    // Get visible text without HTML tags to count actual characters
    const visibleTextOnly = currentPhrase.replace(/<[^>]*>/g, '');
    const totalChars = Array.from(visibleTextOnly).length;
    
    if (isDeleting) {
      charIndex--;
    } else {
      charIndex++;
    }

    // Build visible HTML by walking through the phrase and counting non-tag characters
    let visibleHTML = '';
    let count = 0;
    let i = 0;
    const phraseChars = Array.from(currentPhrase);
    
    while (i < phraseChars.length) {
      if (phraseChars[i] === '<') {
        // Capture full tag
        while (i < phraseChars.length && phraseChars[i] !== '>') {
          visibleHTML += phraseChars[i];
          i++;
        }
        if (i < phraseChars.length) {
          visibleHTML += phraseChars[i]; // add '>'
          i++;
        }
      } else {
        if (count < charIndex) {
          visibleHTML += phraseChars[i];
          count++;
          i++;
        } else {
          break;
        }
      }
    }

    typewriterEl.innerHTML = visibleHTML + cursor;

    let delta = isDeleting ? 30 : 70;

    if (!isDeleting && charIndex === totalChars) {
      isDeleting = true;
      delta = 3000; 
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delta = 500;
    }

    setTimeout(type, delta);
  }

  if (typewriterEl) type();

  /* ------------------------------------------
     BACK TO TOP: 30% scroll threshold
  ------------------------------------------ */
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const threshold = scrollHeight * 0.2;
      
      if (scrolled > threshold) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

})();

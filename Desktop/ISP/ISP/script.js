const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

// Mobile nav toggle
const navToggle = $('.nav-toggle');
const navList = $('#primary-menu');
if (navToggle && navList) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navList.classList.toggle('open');
  });

  // Close menu on link click (mobile)
  $$('#primary-menu a').forEach(a => a.addEventListener('click', () => {
    navList.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }));
}

// Smooth scroll for anchor links
$$('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const targetId = link.getAttribute('href');
    if (targetId && targetId.length > 1) {
      const el = $(targetId);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.pushState(null, '', targetId);
      }
    }
  });
});

// Footer year
const yearEl = $('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Basic contact form handling (front-end only)
const form = $('.contact-form');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const status = $('.form-status', form);
    const name = $('#name', form);
    const email = $('#email', form);
    const message = $('#message', form);

    let valid = true;
    const setError = (input, msg) => {
      const err = input.parentElement.querySelector('.error');
      if (err) err.textContent = msg || '';
      if (msg) valid = false;
    };
    setError(name, !name.value.trim() ? 'Please enter your name' : '');
    setError(email, !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value) ? 'Please enter a valid email' : '');
    setError(message, !message.value.trim() ? 'Please enter a message' : '');
    if (!valid) return;

    try {
      status.textContent = 'Thanks! Your message has been captured.';
      form.reset();
    } catch (err) {
      status.textContent = 'Something went wrong. Please try again later.';
    }
  });
}





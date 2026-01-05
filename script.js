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

// Web3Forms form handling function
const handleFormSubmission = async (form, e) => {
  e.preventDefault();
  const status = $('.form-status', form);
  const submitBtn = $('button[type="submit"]', form);
  const email = $('#email', form);
  const message = $('#message', form);

  // Show loading state
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;
  if (status) status.textContent = '';

  try {
    const formData = new FormData(form);
    
    const response = await fetch(form.action, {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (result.success) {
      if (status) {
        status.textContent = 'Thank you! Your message has been sent successfully.';
        status.style.color = '#10b981';
      }
      form.reset();
    } else {
      throw new Error(result.message || 'Submission failed');
    }
  } catch (err) {
    console.error('Form submission error:', err);
    if (status) {
      status.textContent = 'Sorry, there was an error sending your message. Please try again or contact us directly.';
      status.style.color = '#ef4444';
    }
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
};

// Web3Forms contact form handling
const contactForm = $('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => handleFormSubmission(contactForm, e));
}

// Web3Forms quote form handling
const quoteForm = $('.quote-form');
if (quoteForm) {
  quoteForm.addEventListener('submit', (e) => handleFormSubmission(quoteForm, e));
}

// WhatsApp modal & floating action button
(() => {
  // Config: set your default WhatsApp number here (international format, no plus or spaces)
  const DEFAULT_WA_NUMBER = '27747394461'; // +27 747 394 461

  // Create floating button
  const fab = document.createElement('button');
  fab.className = 'wa-fab';
  fab.setAttribute('aria-label', 'Chat on WhatsApp');
  fab.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.52 3.48A11.78 11.78 0 0012 .75 11.25 11.25 0 00.75 12 11.2 11.2 0 002 17.07L.75 23.25l6.36-1.65A11.18 11.18 0 0012 23.25 11.25 11.25 0 0023.25 12a11.2 11.2 0 00-2.73-8.52zM12 21.21a9.2 9.2 0 01-4.7-1.29l-.34-.2-3.77.98 1-3.67-.22-.38A9.2 9.2 0 1121.21 12 9.24 9.24 0 0112 21.21zm5.3-6.86c-.29-.15-1.7-.84-1.96-.94s-.45-.15-.64.15-.73.94-.9 1.14-.33.22-.62.07a7.49 7.49 0 01-2.21-1.36 8.29 8.29 0 01-1.53-1.9c-.16-.29 0-.45.12-.6s.29-.33.43-.51.19-.29.29-.49a.53.53 0 000-.51c-.07-.15-.64-1.55-.88-2.12s-.45-.49-.64-.5h-.55a1.06 1.06 0 00-.76.37 3.2 3.2 0 00-1 2.37 5.52 5.52 0 001.15 2.93 12.61 12.61 0 004.82 4.49 5.52 5.52 0 002.93 1.15 3.2 3.2 0 002.19-.69 2.67 2.67 0 00.91-2 1.74 1.74 0 00-.11-.8c-.1-.21-.39-.33-.68-.48z"/></svg>';

  // Backdrop and modal
  const backdrop = document.createElement('div');
  backdrop.className = 'wa-modal-backdrop';
  backdrop.setAttribute('role', 'dialog');
  backdrop.setAttribute('aria-modal', 'true');
  backdrop.innerHTML = `
    <div class="wa-modal" role="document">
      <div class="wa-modal-header">
        <h3 class="wa-modal-title">Chat with us on WhatsApp</h3>
        <button class="wa-modal-close" aria-label="Close">×</button>
      </div>
      <div class="wa-modal-body">
        <input type="tel" class="wa-input" id="wa-number" placeholder="Phone number (optional)" value="+27 747 394 461" />
        <textarea class="wa-textarea" id="wa-message" rows="4" placeholder="Type your message...">Hi! I’d like a quick quote for cleaning services.</textarea>
        <div class="wa-actions">
          <button class="wa-cancel" type="button">Cancel</button>
          <button class="wa-send" type="button">Open WhatsApp</button>
        </div>
        <div class="wa-small">We’ll open WhatsApp with your message pre‑filled.</div>
      </div>
    </div>
  `;

  document.body.appendChild(fab);
  document.body.appendChild(backdrop);

  const modal = backdrop.querySelector('.wa-modal');
  const closeBtn = backdrop.querySelector('.wa-modal-close');
  const cancelBtn = backdrop.querySelector('.wa-cancel');
  const sendBtn = backdrop.querySelector('.wa-send');
  const numberInput = backdrop.querySelector('#wa-number');
  const messageInput = backdrop.querySelector('#wa-message');

  const open = () => {
    backdrop.classList.add('open');
    requestAnimationFrame(() => modal.classList.add('open'));
  };
  const close = () => {
    modal.classList.remove('open');
    backdrop.classList.remove('open');
  };

  const normalizeNumber = (raw) => {
    if (!raw) return DEFAULT_WA_NUMBER;
    const digits = String(raw).replace(/[^\d]/g, '');
    if (digits.startsWith('0')) {
      // Assume South Africa if leading 0 provided
      return '27' + digits.slice(1);
    }
    return digits || DEFAULT_WA_NUMBER;
  };

  const openWhatsApp = () => {
    const phone = normalizeNumber(numberInput.value || DEFAULT_WA_NUMBER);
    const text = encodeURIComponent(messageInput.value || 'Hello!');
    const url = `https://wa.me/${phone}?text=${text}`;
    window.open(url, '_blank');
    close();
  };

  fab.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  cancelBtn.addEventListener('click', close);
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });
  sendBtn.addEventListener('click', openWhatsApp);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
})();

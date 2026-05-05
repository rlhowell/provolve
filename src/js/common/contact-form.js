const ENDPOINT = 'https://europe-west2-provolve-01.cloudfunctions.net/contactEmail';

export function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const btn     = form.querySelector('[data-submit-btn]');
  const btnText = form.querySelector('[data-btn-text]');
  const success = document.getElementById('form-success');
  const error   = document.getElementById('form-error');

  form.addEventListener('submit', async e => {
    e.preventDefault();

    btn.disabled = true;
    btnText.textContent = 'Sending…';
    success.hidden = true;
    error.hidden   = true;

    const body = {
      name:    form.name.value.trim(),
      email:   form.email.value.trim(),
      company: form.company.value.trim(),
      service: form.service.value,
      message: form.message.value.trim(),
    };

    try {
      const res  = await fetch(ENDPOINT, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      });
      const data = await res.json();

      if (res.ok && data.ok) {
        form.reset();
        success.hidden = false;
        success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        error.textContent = data.error || 'Something went wrong. Please try again.';
        error.hidden = false;
      }
    } catch {
      error.textContent = 'Could not reach the server. Please try again.';
      error.hidden = false;
    } finally {
      btn.disabled = false;
      btnText.textContent = 'Send message';
    }
  });
}

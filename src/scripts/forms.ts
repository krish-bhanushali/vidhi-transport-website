// Honest enquiry handoff: the website has no server-side form endpoint, so nothing is stored or sent
// by the site. The visitor's details are formatted into a WhatsApp or email draft that THEY send.
type Action = 'whatsapp' | 'email' | 'copy';

function setStatus(form: HTMLFormElement, state: 'prepared' | 'error' | 'info', msg: string) {
  const el = form.querySelector<HTMLElement>('[data-form-status]');
  if (!el) return;
  el.dataset.state = state;
  el.textContent = msg;
}

function buildMessage(form: HTMLFormElement) {
  const heading = form.dataset.messageType || 'Website enquiry';
  const lines = Array.from(form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('[data-label]'))
    .map((f) => {
      const v = (f.value || '').trim();
      if (!v || (f instanceof HTMLSelectElement && f.selectedIndex === 0 && f.options[0]?.value === '')) return '';
      return `${f.dataset.label}: ${v}`;
    })
    .filter(Boolean);
  return [`VIDHI TRANSPORT: ${heading.toUpperCase()}`, '', ...lines, '', `Prepared on ${location.hostname || 'website'} – ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST`].join('\n');
}

async function copy(text: string) {
  if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
  const t = document.createElement('textarea');
  t.value = text; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0';
  document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove();
}

document.querySelectorAll<HTMLFormElement>('[data-message-form]').forEach((form) => {
  form.addEventListener('submit', (e) => e.preventDefault());
  form.querySelectorAll<HTMLButtonElement>('[data-form-action]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      form.classList.add('was-validated');
      if (!form.checkValidity()) {
        form.reportValidity();
        setStatus(form, 'error', 'Please complete the highlighted required fields. Nothing has been sent.');
        return;
      }
      const action = btn.dataset.formAction as Action;
      const msg = buildMessage(form);
      const subject = form.dataset.messageType || 'Website enquiry';
      if (action === 'whatsapp') {
        const url = `https://wa.me/${form.dataset.whatsapp}?text=${encodeURIComponent(msg)}`;
        const w = window.open(url, '_blank', 'noopener');
        if (!w) location.href = url;
        setStatus(form, 'prepared', 'Prepared in WhatsApp – not sent yet. Review the message in WhatsApp and tap Send to deliver it to Vidhi Transport.');
      } else if (action === 'email') {
        location.href = `mailto:${form.dataset.email}?subject=${encodeURIComponent('Website: ' + subject)}&body=${encodeURIComponent(msg)}`;
        setStatus(form, 'prepared', 'Prepared in your email app – not sent yet. Check the draft and press Send. If no email app opened, use "Copy details" and email ' + form.dataset.email + '.');
      } else {
        try { await copy(msg); setStatus(form, 'info', 'Details copied. Paste them into WhatsApp (+91 98253 21589) or an email to ' + form.dataset.email + '.'); }
        catch { setStatus(form, 'error', 'Your browser blocked copying. Please use the WhatsApp or email option.'); }
      }
    });
  });
});

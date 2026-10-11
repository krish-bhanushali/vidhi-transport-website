// LR tracking: preserves the live integration (GET https://vidhierp.in/service.aspx, Control=getLRWebsite).
// Only data returned by the Vidhi ERP is displayed. No sample or cached shipment data exists in this file.
const STATUS: Record<string, [string, string]> = {
  '0': ['Booked', 'The consignment has been booked and registered in the transport system.'],
  '1': ['On the way', 'The consignment is on the way through the Vidhi Transport network.'],
  '2': ['Delivered', 'The consignment is marked as delivered in the latest ERP record.'],
};
const fmt = new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' });
function erpDate(v: unknown, withTime = false) {
  if (!v) return 'Not provided';
  const m = String(v).match(/^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?/);
  if (!m) return String(v);
  const d = fmt.format(new Date(Date.UTC(+m[1], +m[2] - 1, +m[3])));
  if (!withTime || !m[4]) return d;
  const h = +m[4];
  return `${d}, ${h % 12 || 12}:${m[5]} ${h >= 12 ? 'pm' : 'am'}`;
}
function parse(raw: string) {
  const clean = raw.replace(/^\uFEFF/, '').trim();
  if (!clean) return null;
  let p: any = JSON.parse(clean);
  if (p && Object.prototype.hasOwnProperty.call(p, 'd')) p = typeof p.d === 'string' ? JSON.parse(p.d) : p.d;
  if (Array.isArray(p)) p = p[0];
  return p;
}

document.querySelectorAll<HTMLFormElement>('[data-tracking-form]').forEach((form) => {
  const input = form.querySelector<HTMLInputElement>('input[name="lr"]')!;
  const loading = form.querySelector<HTMLElement>('[data-track-loading]')!;
  const errBox = form.querySelector<HTMLElement>('[data-track-error]')!;
  const result = form.querySelector<HTMLElement>('[data-track-result]')!;
  const btn = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const set = (sel: string, v: unknown) => { const el = result.querySelector<HTMLElement>(sel); if (el) el.textContent = v ? String(v) : 'Not provided'; };
  const wa = (lr: string) => `https://wa.me/${form.dataset.whatsapp}?text=${encodeURIComponent(`Hello Vidhi Transport, please share the latest status of LR ${lr}.`)}`;

  function showError(lr: string, title: string, detail: string) {
    result.hidden = true;
    errBox.querySelector('strong')!.textContent = title;
    errBox.querySelector('span')!.textContent = detail;
    (errBox.querySelector('a') as HTMLAnchorElement).href = wa(lr);
    errBox.hidden = false;
  }

  async function track(lr: string) {
    errBox.hidden = true; result.hidden = true; loading.hidden = false;
    btn.disabled = true; form.setAttribute('aria-busy', 'true');
    const ctrl = new AbortController();
    const t = window.setTimeout(() => ctrl.abort(), Number(form.dataset.timeout) || 15000);
    try {
      const url = new URL(form.dataset.apiUrl!);
      url.search = new URLSearchParams({
        ApiVer: form.dataset.apiVersion || '1', DeviceId: form.dataset.deviceId || '', AppId: form.dataset.appId || '',
        Lat: '0', Lng: '0', Control: form.dataset.control || 'getLRWebsite', data: JSON.stringify({ lrno: lr }),
      }).toString();
      const res = await fetch(url.toString(), { method: 'GET', mode: 'cors', credentials: 'omit', cache: 'no-store', headers: { Accept: 'application/json' }, signal: ctrl.signal });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const rec = parse(await res.text());
      if (!rec || typeof rec !== 'object' || !rec.lrno) {
        showError(lr, 'No matching LR was found.', 'Check the LR number on your receipt and try again, or ask customer care to check it.');
        return;
      }
      const code = String(rec.consignmentstatus ?? rec.consignmentStatus ?? rec.status ?? '').trim();
      const st = STATUS[code];
      set('[data-r-lr]', rec.lrno); set('[data-r-from]', rec.from); set('[data-r-to]', rec.to);
      set('[data-r-status]', st ? st[0] : code ? `Status code ${code}` : 'Status unavailable');
      set('[data-r-status-copy]', st ? st[1] : 'The latest consignment status returned by the Vidhi Transport ERP is shown above.');
      set('[data-r-date]', erpDate(rec.lrdate)); set('[data-r-eta]', erpDate(rec.estimatedDelivery)); set('[data-r-updated]', erpDate(rec.statusUpdated, true));
      const contact = [rec.contactName, rec.contactNumber].filter(Boolean).join(' · ');
      const row = result.querySelector<HTMLElement>('[data-r-contact-row]'); if (row) row.hidden = !contact;
      if (contact) set('[data-r-contact]', contact);
      result.querySelectorAll<HTMLElement>('[data-step]').forEach((s) => {
        const n = Number(s.dataset.step); const c = st ? Number(code) : -1;
        s.classList.toggle('is-complete', c >= 0 && n <= c); s.classList.toggle('is-current', n === c);
      });
      result.hidden = false; result.focus({ preventScroll: true });
      result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (e: any) {
      const timeout = e && e.name === 'AbortError';
      showError(lr, timeout ? 'The tracking request timed out.' : 'Live tracking is temporarily unavailable.',
        timeout ? 'Please retry, or ask customer care to check this LR.' : 'Please retry. If the issue continues, ask customer care to check this LR.');
    } finally {
      window.clearTimeout(t); loading.hidden = true; btn.disabled = false; form.removeAttribute('aria-busy');
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const lr = input.value.trim();
    if (!/^\d+$/.test(lr)) {
      showError(lr, 'Enter a valid LR number.', 'Use the numeric LR number printed on your consignment receipt.');
      input.focus(); return;
    }
    if (form.dataset.resultsPage) {
      const dest = new URL(form.dataset.resultsPage, location.href); dest.searchParams.set('lr', lr); location.assign(dest.toString()); return;
    }
    const u = new URL(location.href); u.searchParams.set('lr', lr); history.replaceState(null, '', u.toString());
    track(lr);
  });
  if (form.dataset.apiUrl) {
    const lr = new URLSearchParams(location.search).get('lr');
    if (lr && /^\d+$/.test(lr)) { input.value = lr; track(lr); }
  }
});

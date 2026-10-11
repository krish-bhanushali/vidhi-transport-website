// Progressive enhancement only: every page is fully readable and navigable without this file.
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<T>(s as any)) as T[];

/* ---------- Mega navigation ---------- */
const items = $$('[data-nav-item]');
let closeTimer: number | undefined;
const setOpen = (li: HTMLElement, open: boolean) => {
  li.classList.toggle('is-open', open);
  li.querySelector('[data-nav-trigger]')?.setAttribute('aria-expanded', String(open));
};
const closeAll = (except?: HTMLElement) => items.forEach((li) => li !== except && setOpen(li, false));
items.forEach((li) => {
  li.addEventListener('mouseenter', () => { window.clearTimeout(closeTimer); closeAll(li); setOpen(li, true); });
  li.addEventListener('mouseleave', () => { closeTimer = window.setTimeout(() => setOpen(li, false), 160); });
  li.addEventListener('focusin', () => { closeAll(li); setOpen(li, true); });
  li.addEventListener('focusout', (e) => { if (!li.contains((e as FocusEvent).relatedTarget as Node)) setOpen(li, false); });
});
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  const open = items.find((li) => li.classList.contains('is-open'));
  if (open) { setOpen(open, false); (open.querySelector('[data-nav-trigger]') as HTMLElement)?.focus(); }
  if (document.documentElement.classList.contains('menu-open')) toggleMenu(false);
});

/* ---------- Mobile menu ---------- */
const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
const panel = document.querySelector<HTMLElement>('[data-mobile-panel]');
function toggleMenu(force?: boolean) {
  const open = force ?? !document.documentElement.classList.contains('menu-open');
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (header && panel) panel.style.setProperty('--mobile-top', header.getBoundingClientRect().bottom + 'px');
  document.documentElement.classList.toggle('menu-open', open);
  toggle?.setAttribute('aria-expanded', String(open));
  if (open) panel?.querySelector<HTMLElement>('summary')?.focus();
  else toggle?.focus();
}
toggle?.addEventListener('click', () => toggleMenu());
panel?.addEventListener('click', (e) => { if ((e.target as HTMLElement).closest('a')) toggleMenu(false); });

/* ---------- Reveal on scroll ---------- */
const io = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
  entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io!.unobserve(en.target); } });
}, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }) : null;
$$('.reveal').forEach((el) => (io ? io.observe(el) : el.classList.add('is-in')));

/* ---------- Hero entrance + restrained parallax ---------- */
const hero = document.querySelector<HTMLElement>('[data-hero]');
if (hero) {
  requestAnimationFrame(() => hero.classList.add('is-ready'));
  const img = hero.querySelector<HTMLElement>('.hero-media img');
  if (img && !reduce) {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return; ticking = true;
      requestAnimationFrame(() => {
        const y = Math.min(window.scrollY, hero.offsetHeight);
        img.style.transform = `translate3d(0, ${y * 0.18}px, 0) scale(1.06)`;
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }
}

/* ---------- Count-up (only elements with data-count; values come from verified data) ---------- */
const countIO = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (!en.isIntersecting) return;
    const el = en.target as HTMLElement; countIO!.unobserve(el);
    const to = Number(el.dataset.count); const suffix = el.dataset.suffix || '';
    if (reduce || !to) return;
    const start = performance.now(); const dur = 1400;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / dur); const e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(to * e) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}, { threshold: 0.6 }) : null;
$$('[data-count]').forEach((el) => countIO?.observe(el));

/* ---------- Network map ---------- */
$$('[data-network]').forEach((root) => {
  const card = root.querySelector<HTMLElement>('[data-map-card]');
  const routes = $$<SVGPathElement>('.route', root);
  routes.forEach((r) => r.style.setProperty('--len', String(Math.ceil(r.getTotalLength()))));
  const mio = new IntersectionObserver((en) => { if (en[0].isIntersecting) { root.classList.add('is-visible'); mio.disconnect(); } }, { threshold: 0.25 });
  mio.observe(root);
  const list = document.querySelectorAll<HTMLAnchorElement>(`[data-network-list="${root.id}"] a[data-branch]`);
  const show = (id: string | null) => {
    $$('.node', root).forEach((n) => n.classList.toggle('is-active', n.getAttribute('data-branch') === id));
    list.forEach((a) => a.classList.toggle('is-active', a.dataset.branch === id));
    if (!card) return;
    const n = id ? root.querySelector<SVGGElement>(`.node[data-branch="${id}"]`) : null;
    if (!n) { card.classList.remove('is-visible'); return; }
    card.innerHTML = '';
    const s = document.createElement('strong'); s.textContent = n.dataset.name || '';
    const sm = document.createElement('small'); sm.textContent = (n.dataset.region || '') + ' · ' + (n.dataset.phone || '');
    const a = document.createElement('a'); a.href = n.dataset.href || '#'; a.textContent = 'View branch & route details →';
    card.append(s, sm, a); card.classList.add('is-visible');
  };
  $$('.node', root).forEach((n) => {
    const id = n.getAttribute('data-branch');
    n.addEventListener('mouseenter', () => show(id));
    n.addEventListener('focus', () => show(id));
    n.addEventListener('click', (e) => { if (window.matchMedia('(hover: none)').matches && !n.classList.contains('is-active')) { e.preventDefault(); show(id); } });
  });
  list.forEach((a) => { a.addEventListener('mouseenter', () => show(a.dataset.branch!)); a.addEventListener('focus', () => show(a.dataset.branch!)); });
});

/* ---------- Scrollytelling process ---------- */
$$('[data-process]').forEach((root) => {
  const steps = $$('.process-step', root);
  const bar = root.querySelector<HTMLElement>('.process-progress');
  const pio = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const idx = steps.indexOf(en.target as HTMLElement);
      steps.forEach((s, i) => s.classList.toggle('is-active', i === idx));
      bar?.style.setProperty('--p', ((idx + 1) / steps.length) * 100 + '%');
    });
  }, { rootMargin: '-45% 0px -45% 0px' });
  steps.forEach((s) => pio.observe(s));
  steps[0]?.classList.add('is-active');
});

/* ---------- Article TOC highlighting ---------- */
const toc = $$<HTMLAnchorElement>('[data-toc] a');
if (toc.length) {
  const tio = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) toc.forEach((a) => a.classList.toggle('is-active', a.hash === '#' + en.target.id)); });
  }, { rootMargin: '-20% 0px -70% 0px' });
  toc.forEach((a) => { const t = document.getElementById(a.hash.slice(1)); if (t) tio.observe(t); });
}

/* ---------- Branch filter (directory stays complete in HTML) ---------- */
$$('[data-branch-filter]').forEach((root) => {
  const cards = $$('[data-branch-card]');
  const buttons = $$<HTMLButtonElement>('button[data-state]', root);
  const input = root.querySelector<HTMLInputElement>('input');
  const status = root.querySelector<HTMLElement>('[data-filter-status]');
  let state = 'all';
  const apply = () => {
    const q = (input?.value || '').trim().toLowerCase();
    let n = 0;
    cards.forEach((c) => {
      const ok = (state === 'all' || c.dataset.state === state) && (!q || (c.dataset.search || '').includes(q));
      c.hidden = !ok; if (ok) n++;
    });
    if (status) status.textContent = `${n} of ${cards.length} branches shown`;
  };
  buttons.forEach((b) => b.addEventListener('click', () => { state = b.dataset.state!; buttons.forEach((x) => x.setAttribute('aria-pressed', String(x === b))); apply(); }));
  input?.addEventListener('input', apply);
  root.hidden = false;
});

/* ---------- Back to top ---------- */
const btt = document.querySelector<HTMLButtonElement>('[data-back-to-top]');
if (btt) {
  const onS = () => btt.classList.toggle('is-visible', window.scrollY > 900);
  window.addEventListener('scroll', onS, { passive: true }); onS();
  btt.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); (document.getElementById('main') as HTMLElement)?.focus({ preventScroll: true }); });
}

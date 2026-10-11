"""One-off importer: converts the live-site crawl (www.vidhitransport.com, 11 Oct 2026)
into editable JSON data files under src/data/. Re-running overwrites src/data/pages/*.json,
src/data/branches.json and src/data/articles.json. After import, the JSON files are the
source of truth and can be edited by hand."""
import json, re, sys, os, posixpath
from bs4 import BeautifulSoup, Tag
sys.path.insert(0, os.path.dirname(__file__))
CRAWL = sys.argv[1] if len(sys.argv) > 1 else '/workspace/live-crawl'
OUT = os.path.join(os.path.dirname(__file__), '..', 'src', 'data')

def T(el):
    t = el.get_text(' ', strip=True) if isinstance(el, Tag) else str(el)
    t = re.sub(r'\s+', ' ', t)
    t = re.sub(r"\{svg\('[a-z-]+'\)\}", '', t)
    t = t.replace(' ,', ',').replace(' .', '.').replace(' →', '').replace('→', '').replace('( ', '(').replace(' )', ')')
    return t.strip()

def norm(href, page):
    if not href or href.startswith(('http', 'mailto:', 'tel:', '#')):
        return href
    base = posixpath.dirname('/' + page)
    p = posixpath.normpath(posixpath.join(base, href.split('#')[0])) if href.split('#')[0] else '/' + page
    frag = ('#' + href.split('#')[1]) if '#' in href else ''
    if p == '/index.html': p = '/'
    return p + frag

DROP = ('credential-strip', 'proof-bar', 'company-proof-section', 'support-stat-strip', 'tool-trust', 'tracking-contact')

def walk(sec, page):
    S = {'kicker': None, 'title': None, 'subtitle': None, 'intro': [], 'list': [], 'chips': [], 'cards': [], 'faqs': [], 'ctas': [], 'cls': ' '.join(sec.get('class') or [])}
    if sec.get('id'): S['id'] = sec['id']
    skip = set(); cur = None; pend = []
    def mark(e):
        for d in e.descendants: skip.add(id(d))
    for el in sec.descendants:
        if not isinstance(el, Tag) or id(el) in skip: continue
        cls = el.get('class') or []
        if el.name in ('nav',) or 'breadcrumb' in cls or ('sr-only' in cls and el.name != 'h2'):
            mark(el); continue
        if el.name == 'details':
            sm = el.find('summary'); q = T(sm) if sm else ''
            a = ' '.join(T(p) for p in el.find_all(['p', 'li']) if not p.find_parent('summary')) or T(el)[len(q):].strip()
            S['faqs'].append({'q': q, 'a': a}); mark(el); continue
        if 'section-kicker' in cls or 'eyebrow' in cls:
            t = T(el)
            if cur is not None: cur['kicker'] = t
            elif S['title'] is None: S['kicker'] = t
            mark(el); continue
        if el.name in ('h1', 'h2'):
            if S['title'] and el.name == 'h2':
                S['subtitle'] = T(el); mark(el); continue
            S['title'] = T(el); mark(el); cur = None; continue
        if el.name in ('h3', 'h4'):
            cur = {'title': T(el), 'body': [], 'list': [], 'chips': []}
            if pend: cur['num'] = pend.pop()
            a = el.find_parent('a')
            if a and a.get('href'): cur['href'] = norm(a['href'], page)
            S['cards'].append(cur); mark(el); continue
        if el.name == 'p':
            t = T(el)
            if t: (cur['body'] if cur is not None else S['intro']).append(t)
            mark(el); continue
        if el.name in ('li', 'dd'):
            if el.find(['li', 'p', 'h3']): continue
            t = T(el)
            if t: (cur['list'] if cur is not None else S['list']).append(t)
            mark(el); continue
        if el.name == 'a':
            if el.find(['h3', 'h4', 'p']): continue
            t = T(el); h = norm(el.get('href', ''), page)
            if t and t not in ('Home',):
                if cur is not None and 'href' not in cur: cur['href'] = h; cur['linkText'] = t
                else: S['ctas'].append({'text': t, 'href': h})
            mark(el); continue
        if el.name in ('span', 'strong', 'b', 'em', 'div') and not el.find(['p', 'li', 'h2', 'h3', 'h4', 'a', 'div', 'span', 'strong']):
            t = T(el)
            if not t or t == '/': continue
            if re.fullmatch(r'\d{1,2}', t): pend.append(t); continue
            (cur['chips'] if cur is not None else S['chips']).append(t)
            mark(el); continue
    for k in ['intro', 'list', 'chips', 'cards', 'faqs', 'ctas']:
        if not S[k]: del S[k]
    return S

def soup(p):
    return BeautifulSoup(open(os.path.join(CRAWL, 'pages', p), encoding='utf8'), 'html.parser')

def meta(s):
    md = s.find('meta', attrs={'name': 'description'})
    return {'title': s.title.get_text(strip=True), 'description': md['content'] if md else ''}

pages = [l.strip().replace('https://www.vidhitransport.com/', '') or 'index.html' for l in open(os.path.join(CRAWL, 'urls.txt'))]
os.makedirs(os.path.join(OUT, 'pages'), exist_ok=True)
for p in pages:
    if p.startswith('blog/'): continue
    s = soup(p)
    m = s.find('main') or s.body
    for t in m(['svg', 'script', 'style', 'noscript', 'img', 'button', 'iframe']): t.decompose()
    for t in m.find_all(['input', 'select', 'textarea', 'label', 'fieldset', 'form']): t.decompose()
    secs = [walk(x, p) for x in m.find_all('section', recursive=False)]
    secs = [x for x in secs if not any(d in x['cls'] for d in DROP)]
    hero = secs.pop(0) if secs else {}
    closing = None
    if secs and 'closing' in secs[-1]['cls']:
        closing = secs.pop()
    for x in secs + [hero] + ([closing] if closing else []):
        x.pop('cls', None)
    hero.pop('chips', None)
    data = {'path': '/' + (p if p != 'index.html' else ''), **meta(s), 'hero': hero, 'sections': secs}
    if closing: data['closing'] = closing
    name = p.replace('/', '__').replace('.html', '') + '.json'
    json.dump(data, open(os.path.join(OUT, 'pages', name), 'w'), indent=1, ensure_ascii=False)

# ---------- branches ----------
s = soup('branch-locator.html')
branches = []
for art in s.select('article.static-branch-card'):
    bid = art['id'].replace('branch-', '')
    head = art.select_one('.static-branch-head')
    cols = art.select('.static-branch-columns > div')
    area_href = art.select_one('.static-branch-actions a.button')['href']
    b = {
        'id': bid,
        'name': T(head.find('h3')),
        'region': T(head.find('span')),
        'state': T(head.find('b')),
        'address': T(art.find('address')),
        'phones': [T(a) for a in art.select('.static-branch-phones a')],
        'capabilities': [T(li) for li in cols[0].find_all('li')],
        'serviceAreas': [T(li) for li in cols[1].find_all('li')],
        'areaPage': '/' + area_href,
    }
    a = soup(area_href)
    am = a.find('main')
    hero = am.find('section')
    b['areaH1'] = T(hero.find('h1'))
    b['areaIntro'] = T(hero.find('p'))
    at = a.title.get_text(strip=True); amd = a.find('meta', attrs={'name': 'description'})
    b['areaTitle'] = at; b['areaDescription'] = amd['content'] if amd else ''
    sec_sectors = am.find('section', class_='area-coverage')
    lis = [T(li) for li in sec_sectors.find_all('li')]
    b['sectors'] = lis[len(b['serviceAreas']):]
    routes = am.find('section', class_='area-routes')
    b['corridors'] = [re.sub(r'^\d+\s+', '', T(li)) for li in routes.find_all('li')]
    b['corridorsTitle'] = T(routes.find('h2'))
    faq = am.find('section', class_='faq-section')
    b['areaFaqs'] = []
    for d in faq.find_all('details'):
        q = T(d.find('summary')); d.find('summary').extract(); b['areaFaqs'].append({'q': q, 'a': T(d)})
    bp = 'branches/' + bid + '.html'
    if os.path.exists(os.path.join(CRAWL, 'pages', bp)):
        bs = soup(bp)
        bm = bs.find('main')
        sec = bm.find_all('section')[1]
        b['branchPage'] = '/' + bp
        b['branchTitle'] = bs.title.get_text(strip=True)
        md = bs.find('meta', attrs={'name': 'description'}); b['branchDescription'] = md['content'] if md else ''
        b['branchH1'] = T(bm.find('h1'))
        b['branchKicker'] = T(bm.find('section').find(class_='section-kicker')) if bm.find('section').find(class_='section-kicker') else ''
        b['branchLede'] = T(bm.find('section').find('p'))
        b['branchHeading'] = T(sec.find('h2'))
        b['branchIntro'] = T(sec.find('p'))
        def ul_after(label):
            h = sec.find(lambda t: t.name in ('h3', 'h4', 'strong', 'span') and label in t.get_text())
            u = h.find_next('ul') if h else None
            return [T(li) for li in u.find_all('li')] if u else []
        b['branchAreas'] = ul_after('Industrial areas')
        b['branchServices'] = ul_after('Services to discuss')
        ml = bs.find('a', href=re.compile('google.com/maps'))
        if ml: b['mapUrl'] = ml['href']
    branches.append(b)
json.dump(branches, open(os.path.join(OUT, 'branches.json'), 'w'), indent=1, ensure_ascii=False)

# ---------- articles ----------
arts = []
for p in pages:
    if not p.startswith('blog/'): continue
    s = soup(p)
    h = s.find(class_='article-hero')
    body = s.find(class_='article-body')
    blocks = []
    lead = body.find('p', class_='article-lead')
    for sec in body.find_all('section', recursive=False):
        blocks.append({'type': 'h2', 'id': sec.get('id'), 'text': T(sec.find('h2'))})
        for c in sec.find_all(['p', 'ul', 'ol', 'h3'], recursive=False):
            if c.name in ('ul', 'ol'):
                blocks.append({'type': 'list', 'ordered': c.name == 'ol', 'items': [T(li) for li in c.find_all('li')]})
            else:
                blocks.append({'type': c.name, 'text': T(c)})
    note = body.find(class_='article-note')
    tags = [T(x) for x in body.select('.article-tags span')]
    faqs = []
    fs = s.find('section', class_='faq-section')
    for d in fs.find_all('details'):
        q = T(d.find('summary')); d.find('summary').extract(); faqs.append({'q': q, 'a': T(d)})
    tm = h.find('time')
    md = s.find('meta', attrs={'name': 'description'})
    aside = s.find(class_='article-aside')
    arts.append({
        'path': '/' + p, 'slug': p.split('/')[-1].replace('.html', ''),
        'title': s.title.get_text(strip=True), 'description': md['content'] if md else '',
        'category': T(h.find(class_='article-category')), 'h1': T(h.find('h1')), 'lede': T(h.find('p')),
        'author': 'Vidhi Transport Editorial Team', 'datePublished': tm['datetime'] if tm else None,
        'readTime': T(h.select('.article-meta span')[-1]),
        'disclaimer': T(aside.find('p')) if aside and aside.find('p') else '',
        'lead': T(lead) if lead else '', 'blocks': blocks,
        'note': T(note.find('p')) if note else '', 'tags': tags, 'faqs': faqs,
    })
json.dump(arts, open(os.path.join(OUT, 'articles.json'), 'w'), indent=1, ensure_ascii=False)
print('pages', len(pages), 'branches', len(branches), 'articles', len(arts))

# ---------- services (dedicated template extractor) ----------
SERVICE_ORDER = ['full-truck-load', 'part-truck-load', 'reverse-logistics', 'chemical-industrial-freight',
                 'first-mile-last-mile', 'project-cargo', 'odc-construction-cargo', 'port-container-transport', 'warehousing']
services = []
def txt(e): return T(e) if e else ''
for slug in SERVICE_ORDER:
    p = f'services/{slug}.html'
    s = soup(p); m = s.find('main')
    for t in m(['svg']): t.decompose()
    hero = m.select_one('.service-page-hero')
    crumbs = hero.select('.breadcrumb span')
    d = {'slug': slug, 'path': '/' + p, **meta(s),
         'kicker': txt(hero.select_one('.section-kicker')), 'h1': txt(hero.find('h1')),
         'lede': txt(hero.select_one('.service-hero-copy > p')),
         'mark': txt(hero.select_one('.service-hero-mark strong')),
         'crumb': T(crumbs[-1]) if crumbs else ''}
    d['facts'] = [{'label': txt(f.find('span')), 'value': txt(f.find('strong'))} for f in m.select('.service-fact')]
    det = m.select_one('.service-detail-main')
    copy = det.select_one('.service-detail-copy')
    d['detail'] = {'kicker': txt(copy.select_one('.section-kicker')), 'title': txt(copy.find('h2')),
                   'paragraphs': [T(x) for x in copy.select('.detail-description p')] or [T(x) for x in copy.find_all('p', recursive=False)],
                   'includes': [T(li) for li in (copy.select_one('ul.feature-list') or copy.find('ul')).find_all('li')],
                   'suitable': [T(x) for x in copy.select('.tag-list span')]}
    subs = [T(h) for h in copy.select('h3.detail-subheading')]
    d['detail']['includesTitle'] = subs[0] if subs else 'What this service can include'
    d['detail']['suitableTitle'] = subs[1] if len(subs) > 1 else 'Often suitable for'
    side = det.select_one('aside')
    d['brief'] = {'kicker': txt(side.select_one('.section-kicker')), 'title': txt(side.find('h2')),
                  'intro': txt(side.find('p')), 'items': [T(li) for li in side.find_all('li')]}
    pr = m.select_one('.service-process-section')
    d['process'] = {'kicker': txt(pr.select_one('.section-kicker')), 'title': txt(pr.find('h2')),
                    'description': txt(pr.select_one('.section-description')),
                    'steps': [{'title': txt(c.find('h3')), 'text': txt(c.find('p'))} for c in pr.select('.service-process-card')],
                    'note': re.sub(r'^Important:\s*', '', txt(pr.select_one('.service-acceptance-note')))}
    op = m.select_one('.service-options-section')
    d['options'] = {'kicker': txt(op.select_one('.section-kicker')), 'title': txt(op.find('h2')),
                    'description': txt(op.select_one('.section-description')),
                    'groups': [{'title': txt(a.find('h3')), 'items': [T(li) for li in a.find_all('li')]} for a in op.find_all('article')]}
    fq = m.select_one('.service-faq-section') or m.select_one('.faq-section')
    faqs = []
    for det_ in fq.find_all('details'):
        q = T(det_.find('summary')); det_.find('summary').extract(); faqs.append({'q': q, 'a': T(det_)})
    d['faq'] = {'kicker': txt(fq.select_one('.section-kicker')), 'title': txt(fq.find('h2')),
                'description': txt(fq.select_one('.section-description')), 'items': faqs}
    rel = m.select_one('.related-services-section')
    d['related'] = [norm(a['href'], p).split('/')[-1].replace('.html', '') for a in rel.select('a.service-card')]
    services.append(d)
# summaries from the services hub
hub = soup('services.html')
summ = {}
for card in hub.select('.services-catalog article.service-overview-card'):
    href = card.find('a')['href'].split('/')[-1].replace('.html', '')
    summ[href] = {'tag': txt(card.select_one('.section-kicker')), 'name': txt(card.find('h3')),
                  'summary': txt(card.find('p')), 'highlights': [T(li) for li in card.find_all('li')],
                  'linkText': txt(card.find('a'))}
for d in services:
    d['card'] = summ.get(d['slug'], {})
json.dump(services, open(os.path.join(OUT, 'services.json'), 'w'), indent=1, ensure_ascii=False)
print('services', len(services))

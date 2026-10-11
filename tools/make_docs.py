"""Generate docs/*.csv and the page tables from live crawl + built publish/ output.
Run after `npm run build`:  python3 tools/make_docs.py"""
import csv, json, os, re, html as H
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUB = os.path.join(ROOT, 'publish')
LIVE = json.load(open('/workspace/live-crawl/pages.json')) if os.path.exists('/workspace/live-crawl/pages.json') else {}
SITE = 'https://www.vidhitransport.com'

def meta(path):
    t = open(os.path.join(PUB, path), encoding='utf8').read()
    g = lambda r: H.unescape((re.search(r, t, re.S) or [None, ''])[1]).strip()
    h1 = re.sub(r'<[^>]+>', '', g(r'<h1[^>]*>(.*?)</h1>'))
    types = sorted(set(re.findall(r'"@type":"([A-Za-z]+)"', t)))
    return dict(title=g(r'<title>(.*?)</title>'), desc=g(r'<meta name="description" content="([^"]*)"'),
                canonical=g(r'<link rel="canonical" href="([^"]*)"'), h1=re.sub(r'\s+', ' ', h1), schema=' '.join(types),
                robots=g(r'<meta name="robots" content="([^"]*)"'))

pages = []
for d, _, fs in os.walk(PUB):
    for f in fs:
        if f.endswith('.html'):
            pages.append(os.path.relpath(os.path.join(d, f), PUB).replace(os.sep, '/'))
pages.sort(key=lambda p: (p != 'index.html', p.count('/'), p))

def template(p):
    if p == 'index.html': return 'Homepage'
    if p.startswith('services/'): return 'Service detail'
    if p.startswith('branches/'): return 'Branch detail'
    if p.startswith('areas/'): return 'Area / local route guide'
    if p.startswith('blog/'): return 'Article'
    return {'services.html': 'Services hub', 'branch-locator.html': 'Branch locator', 'content.html': 'Insights hub',
            'contact_us.html': 'Contact + quote form', 'pickup-request.html': 'Pickup form', 'service-complaint.html': 'Complaint form',
            'inquiry.html': 'Inquiry form', 'lr-track.html': 'LR tracking tool', 'privacy.html': 'Legal', '404.html': 'Error'}.get(p, 'Corporate / support page')

THEMES = {
 'index.html': ('part load and chemical transport Gujarat Maharashtra', 'Commercial / navigational', 'P1'),
 'services.html': ('industrial transport services FTL PTL ODC container', 'Commercial', 'P1'),
 'services/full-truck-load.html': ('full truckload transport Gujarat Maharashtra', 'Commercial', 'P1'),
 'services/part-truck-load.html': ('part load transport Gujarat to Maharashtra', 'Commercial', 'P1'),
 'services/chemical-industrial-freight.html': ('chemical logistics / chemical transport Gujarat', 'Commercial', 'P1'),
 'services/reverse-logistics.html': ('reverse logistics industrial packaging', 'Commercial', 'P2'),
 'services/first-mile-last-mile.html': ('first mile last mile industrial freight', 'Commercial', 'P2'),
 'services/project-cargo.html': ('project cargo transport Gujarat', 'Commercial', 'P2'),
 'services/odc-construction-cargo.html': ('ODC transport / over dimensional cargo Gujarat', 'Commercial', 'P2'),
 'services/port-container-transport.html': ('container transport JNPT Nhava Sheva Hazira Mundra', 'Commercial', 'P1'),
 'services/warehousing.html': ('warehousing Bhiwandi industrial transport', 'Commercial', 'P2'),
 'branch-locator.html': ('transport branch Gujarat Maharashtra', 'Navigational / local', 'P1'),
 'lr-track.html': ('Vidhi Transport LR tracking', 'Navigational (brand)', 'P1'),
 'contact_us.html': ('Vidhi Transport contact / freight quote', 'Transactional', 'P1'),
 'content.html': ('industrial dispatch guides', 'Informational', 'P3'),
}
def theme(p, m):
    if p in THEMES: return THEMES[p]
    if p.startswith('areas/'):
        city = p.replace('areas/transporter-in-', '').replace('.html', '').replace('-', ' ')
        return (f'transporter in {city} / industrial transport {city}', 'Local commercial', 'P1')
    if p.startswith('branches/'):
        city = p.replace('branches/', '').replace('.html', '').replace('-', ' ')
        return (f'Vidhi Transport {city} branch / transport company {city}', 'Local navigational', 'P1')
    if p.startswith('blog/'): return (m['h1'].lower(), 'Informational', 'P3')
    return (m['h1'].lower()[:80], 'Navigational / trust', 'P3')

def links(p):
    if p.startswith('services/'): return 'services.html; related services; branch pages; contact_us.html#quote'
    if p.startswith('branches/'): return 'matching area page; branch-locator.html; contact_us.html#quote; same-state branches'
    if p.startswith('areas/'): return 'branch page (if exists); branch-locator.html; connected-corridor area pages; contact_us.html#quote'
    if p.startswith('blog/'): return 'related service pages; other articles; content.html; contact_us.html#quote'
    return 'header mega-menu; footer; contextual CTAs'

def verify(p):
    if p.startswith(('branches/', 'areas/')): return 'Owner to re-confirm address, phones, service areas; exact map pin (coordinates approximate)'
    if p in ('certifications.html',): return 'ISO standard number + certificate scope/expiry; IBA approval reference'
    if p in ('about-us.html', 'index.html'): return '"25+ years" and "14 branches" confirmed against live site; fleet size not published'
    if p == 'services/port-container-transport.html': return 'Ports named as on live site; confirm current port coverage'
    if p.startswith('blog/'): return 'Publish dates taken from live; editorial review of compliance wording'
    if p == 'privacy.html': return 'Legal review before relying on it as formal policy'
    return ''

os.makedirs(os.path.join(ROOT, 'docs'), exist_ok=True)
with open(os.path.join(ROOT, 'docs/seo-page-matrix.csv'), 'w', newline='') as fh:
    w = csv.writer(fh)
    w.writerow(['url', 'template', 'keyword_theme', 'search_intent', 'priority', 'title', 'title_len', 'meta_description', 'desc_len', 'h1', 'canonical', 'robots', 'json_ld_types', 'internal_links', 'live_title', 'verification_needs'])
    for p in pages:
        m = meta(p); k, i, pr = theme(p, m) if p != '404.html' else ('', '', '')
        live = LIVE.get(p, {})
        w.writerow(['/' + ('' if p == 'index.html' else p), template(p), k, i, pr, m['title'], len(m['title']), m['desc'], len(m['desc']), m['h1'], m['canonical'], m['robots'], m['schema'], links(p), live.get('title', '(new page)'), verify(p)])

REDIRECTS = [  # (old, new, reason, source)
 ('/credentials.html', '/certifications.html', 'Linked label "Credentials"; live page is certifications.html. URL returns 404 on live.', 'live 404 (NOTES.md 2026-09-27)'),
 ('/areas/ankleshwar.html', '/areas/transporter-in-ankleshwar.html', 'Older area URL, 404 on live', 'live 404'),
 ('/areas/dahej.html', '/areas/transporter-in-dahej.html', 'Older area URL still ranking in Google for "Transporter in Dahej"; 404 on live', 'live 404 + SERP'),
 ('/areas/vapi.html', '/areas/transporter-in-vapi.html', 'Older area URL still ranking for "transporter in Vapi"; 404 on live', 'live 404 + SERP'),
 ('/services/part-load.html', '/services/part-truck-load.html', 'Older service slug, 404 on live', 'live 404'),
]
OLD_REPO = {  # GitHub-repo-only URLs (pre-redesign-backup tag) that never served on www.vidhitransport.com
 '/industries.html': '/Clientele.html', '/insights.html': '/content.html', '/infrastructure.html': '/our-infrastructure.html',
 '/group-of-companies.html': '/group-companies.html', '/terms.html': '/privacy.html', '/services/billing-delivery-options.html': '/services.html#options',
 '/insights/choosing-ptl-vs-ftl.html': '/blog/ftl-vs-ptl-industrial-freight.html', '/insights/chemical-freight-checklist.html': '/blog/drum-carboy-transport-checklist.html',
 '/insights/smarter-greener-industrial-logistics.html': '/csr.html', '/locations/sachin.html': '/areas/transporter-in-sachin-surat.html',
 '/locations/sarigam-umergaon.html': '/areas/transporter-in-sarigam-umergam.html', '/locations/tarapur.html': '/areas/transporter-in-tarapur-boisar.html',
}
for c in ['ahmedabad', 'ankleshwar', 'bhiwandi', 'dahej', 'nandesari', 'navi-mumbai', 'panoli', 'rabale', 'vadodara', 'vapi', 'vasai']:
    OLD_REPO[f'/locations/{c}.html'] = f'/areas/transporter-in-{c}.html'

with open(os.path.join(ROOT, 'docs/url-migration-map.csv'), 'w', newline='') as fh:
    w = csv.writer(fh)
    w.writerow(['old_url', 'new_url', 'action', 'http_status', 'live_title', 'new_title', 'new_template', 'reason'])
    live_urls = [l.strip() for l in open(os.path.join(ROOT, 'scripts/live-urls.txt')) if l.strip()]
    for u in live_urls:
        p = 'index.html' if u == '/' else u.lstrip('/')
        m = meta(p)
        w.writerow([u, u, 'keep (same path, case and .html preserved)', '200', LIVE.get(p, {}).get('title', ''), m['title'], template(p), 'Existing indexed URL preserved exactly'])
    for o, n, r, s in REDIRECTS:
        w.writerow([o, n, '301 redirect (hosting .htaccess — see deploy/htaccess-redirects.txt)', '404 today', '', meta(n.lstrip('/'))['title'], template(n.lstrip('/')), f'{r} [{s}]'])
    for o, n in OLD_REPO.items():
        w.writerow([o, n, 'none needed on production (URL existed only in the old GitHub repo / Pages preview)', 'never live', '', '', '', 'Old repo structure, recoverable from tag pre-redesign-backup'])
    w.writerow(['(new)', '/privacy.html', 'new page', '200', '', meta('privacy.html')['title'], 'Legal', 'Website privacy notice describing form/tracking data flow'])
    w.writerow(['(new)', '/404.html', 'new page (noindex)', '404', '', '', 'Error', 'Configure as ErrorDocument on the host'])

with open(os.path.join(ROOT, 'deploy/htaccess-redirects.txt'), 'w') as fh:
    fh.write('# Optional: add to public_html/.htaccess on Apache/LiteSpeed hosting (cPanel). Owner action.\n')
    fh.write('# These old URLs return 404 on the live site today but still appear in search results.\n')
    fh.write('ErrorDocument 404 /404.html\n\n')
    fh.write('# Canonical host: force https + www (verify current hosting behaviour first; do not add if the panel already does this)\n')
    fh.write('# RewriteEngine On\n# RewriteCond %{HTTPS} off [OR]\n# RewriteCond %{HTTP_HOST} !^www\\. [NC]\n# RewriteRule ^(.*)$ https://www.vidhitransport.com/$1 [R=301,L]\n\n')
    for o, n, r, s in REDIRECTS:
        fh.write(f'Redirect 301 {o} {n}\n')

# page list for the QA report
with open(os.path.join(ROOT, 'docs/_pages.json'), 'w') as fh:
    json.dump([dict(path=p, template=template(p), **meta(p)) for p in pages], fh, indent=1, ensure_ascii=False)  # temp input for qa-report; deleted after use
print('docs written:', len(pages), 'pages')

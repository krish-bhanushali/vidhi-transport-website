"""Post-import cleanup of src/data/pages/*.json (run after import_live.py).
Removes icon glyph labels captured as text, turns card link labels into link text,
and fixes known extraction quirks. Safe to re-run."""
import json, glob, os, re
D = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'pages')
def fix_cta(c):
    t = c['text']
    t = re.sub(r'\s+Visit$', '', t); c['text'] = t
    m = re.match(r'^(.*?)\s+(Call|Open|Email)$', t)
    if m:
        c['text'] = f"{m.group(2)} {m.group(1)}" if m.group(2) != 'Open' else m.group(1)
        if c['text'].startswith('Email customercare'): c['text'] = 'Email customer care'
    return c
for f in glob.glob(os.path.join(D, '*.json')):
    d = json.load(open(f))
    for s in [d.get('hero', {})] + d['sections'] + ([d['closing']] if d.get('closing') else []):
        if 'chips' in s:
            s['chips'] = [c for c in s['chips'] if len(c) > 3]
            if not s['chips']: del s['chips']
        if 'ctas' in s: s['ctas'] = [fix_cta(c) for c in s['ctas']]
        for c in s.get('cards', []):
            ch = [x for x in c.get('chips', []) if len(x) > 3]
            if c.get('href') and not c.get('linkText') and len(ch) == 1:
                c['linkText'] = ch[0]; ch = []
            c['chips'] = ch
    for s in d['sections']:
        ch = s.get('chips') or []
        if len(ch) == 2 and ch[0].endswith('.'):
            s['callout'] = {'title': ch[0], 'text': ch[1]}; del s['chips']
        elif len(ch) >= 4 and len(ch) % 2 == 0 and any(re.match(r'^\d', x) for x in ch[1::2]):
            s['facts'] = [{'label': ch[i], 'value': ch[i + 1]} for i in range(0, len(ch), 2)]; del s['chips']
    name = os.path.basename(f)
    if name == 'certifications.json':
        sec = d['sections'][0]
        sec.pop('chips', None)
        labels = {'Go Green': ('go-green', 'Environmental initiative'), 'IBA Approved': ('iba-approved', 'Transporter approval'), 'ISO Certified': ('iso-certified', 'Management-system certification')}
        for c in sec['cards']:
            if c['title'] in labels:
                c['id'], c['kicker'] = labels[c['title']]; c['chips'] = []
    if name == 'about-us.json':
        for s in d['sections']:
            if s.get('kicker') == 'Our company story': s.pop('chips', None)
    json.dump(d, open(f, 'w'), indent=1, ensure_ascii=False)
print('cleaned')

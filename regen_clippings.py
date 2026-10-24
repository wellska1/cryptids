import os
import re
import html
from pathlib import Path

ROOT = Path('.')
DATA_PATH = ROOT / '_data' / 'evidence.yml'
OUT_ROOT = ROOT / 'evidence'

W, H = 1000, 1500
TEXT_X1, TEXT_X2 = 70, 930
FOOTER_TOP = 1360
CONTENT_BOTTOM = 1320


def clean_scalar(v: str) -> str:
    v = v.strip()
    if (len(v) >= 2 and ((v[0] == '"' and v[-1] == '"') or (v[0] == "'" and v[-1] == "'"))):
        v = v[1:-1]
    return v.strip()


def wrap_text(text: str, max_chars: int):
    text = re.sub(r'\s+', ' ', (text or '').strip())
    if not text:
        return []
    words = text.split(' ')
    lines = []
    cur = ''
    for w in words:
        if not cur:
            if len(w) <= max_chars:
                cur = w
            else:
                for i in range(0, len(w), max_chars):
                    chunk = w[i:i + max_chars]
                    if len(chunk) == max_chars:
                        lines.append(chunk)
                    else:
                        cur = chunk
        else:
            cand = cur + ' ' + w
            if len(cand) <= max_chars:
                cur = cand
            else:
                lines.append(cur)
                if len(w) <= max_chars:
                    cur = w
                else:
                    for i in range(0, len(w), max_chars):
                        chunk = w[i:i + max_chars]
                        if len(chunk) == max_chars:
                            lines.append(chunk)
                        else:
                            cur = chunk
    if cur:
        lines.append(cur)
    return lines


def truncate_last_with_ellipsis(lines):
    if not lines:
        return ['...']
    last = lines[-1].rstrip()
    if len(last) >= 3:
        last = last[:-3].rstrip()
    lines[-1] = (last + '...') if last else '...'
    return lines


def parse_records(path: Path):
    lines = path.read_text(encoding='utf-8').splitlines()
    records = []
    rec = None
    i = 0
    key_pat = re.compile(r'^\s{2}([a-z_]+):\s*(.*)$')

    while i < len(lines):
        line = lines[i]

        m_item = re.match(r'^\s*-\s*(.*)$', line)
        if m_item:
            if rec:
                records.append(rec)
            rec = {}
            rest = m_item.group(1).strip()
            if rest and ':' in rest:
                k, v = rest.split(':', 1)
                rec[k.strip()] = clean_scalar(v)
            i += 1
            continue

        if rec is not None:
            m_key = key_pat.match(line)
            if m_key:
                key = m_key.group(1).strip()
                val = m_key.group(2)

                if key in ('summary', 'citation'):
                    parts = []
                    marker = clean_scalar(val)
                    if marker and marker not in ('>', '|', '>-', '|-'):
                        parts.append(marker)
                    i += 1
                    while i < len(lines):
                        nxt = lines[i]
                        if re.match(r'^\s*-\s*', nxt) or key_pat.match(nxt):
                            break
                        if re.match(r'^\s{4,}\S', nxt):
                            parts.append(nxt.strip())
                            i += 1
                            continue
                        if nxt.strip() == '':
                            i += 1
                            continue
                        break
                    rec[key] = re.sub(r'\s+', ' ', ' '.join(parts)).strip()
                    continue
                else:
                    rec[key] = clean_scalar(val)

        i += 1

    if rec:
        records.append(rec)

    out = []
    wanted = ['id', 'title', 'type', 'date', 'summary', 'citation', 'source_url']
    for r in records:
        if any(k in r for k in wanted):
            out.append({k: r.get(k, '') for k in wanted})
    return out


def render_svg(record):
    title_lines = wrap_text(record.get('title', ''), 34)
    meta_text = ' | '.join([p for p in [record.get('type', '').strip(), record.get('date', '').strip()] if p])
    meta_lines = wrap_text(meta_text, 80)
    summary_lines = wrap_text(record.get('summary', ''), 62)
    citation_lines = wrap_text(record.get('citation', ''), 70)
    url_lines = wrap_text(record.get('source_url', ''), 68)

    elems = []
    y = 115

    for t in title_lines:
        elems.append((y, 42, '700', t))
        y += 50

    y += 8
    for m in meta_lines[:2]:
        elems.append((y, 20, '400', m))
        y += 29

    y += 18
    elems.append((y, 22, '700', 'Summary'))
    y += 34

    summary_limit = CONTENT_BOTTOM - 170
    kept = []
    for s in summary_lines:
        if y + 30 <= summary_limit:
            kept.append(s)
            y += 30
        else:
            break
    if len(kept) < len(summary_lines):
        kept = truncate_last_with_ellipsis(kept)
    if not kept:
        kept = ['...']
    sy = y - 30 * len(kept)
    for idx, s in enumerate(kept):
        elems.append((sy + idx * 30, 21, '400', s))
    y = sy + len(kept) * 30

    y += 18
    elems.append((y, 22, '700', 'Citation'))
    y += 34

    ckept = []
    for c in citation_lines:
        if y + 27 <= CONTENT_BOTTOM:
            ckept.append(c)
            y += 27
        else:
            break
    if len(ckept) < len(citation_lines):
        ckept = truncate_last_with_ellipsis(ckept)
    if citation_lines and not ckept and y + 27 <= CONTENT_BOTTOM:
        ckept = ['...']
    cy = y - 27 * len(ckept)
    for idx, c in enumerate(ckept):
        elems.append((cy + idx * 27, 19, '400', c))

    footer = []
    fy = FOOTER_TOP
    footer.append((fy, 16, '700', 'Source URL'))
    fy += 24
    for u in url_lines:
        if fy <= H - 55:
            footer.append((fy, 15, '400', u))
            fy += 20
        else:
            break

    parts = []
    parts.append('<?xml version="1.0" encoding="UTF-8"?>')
    parts.append(f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">')
    parts.append('  <rect x="0" y="0" width="1000" height="1500" fill="#f5f1e6"/>')
    parts.append('  <rect x="36" y="36" width="928" height="1428" fill="none" stroke="#222" stroke-width="3"/>')
    parts.append('  <rect x="52" y="52" width="896" height="1396" fill="none" stroke="#777" stroke-width="1.5"/>')

    for yy, fs, fw, txt in elems:
        esc = html.escape(txt, quote=False)
        parts.append(f'  <text x="{TEXT_X1}" y="{yy}" font-family="Georgia, Times New Roman, serif" font-size="{fs}" font-weight="{fw}" fill="#111">{esc}</text>')

    parts.append('  <line x1="70" y1="1342" x2="930" y2="1342" stroke="#777" stroke-width="1"/>')
    for yy, fs, fw, txt in footer:
        esc = html.escape(txt, quote=False)
        parts.append(f'  <text x="{TEXT_X1}" y="{yy}" font-family="Georgia, Times New Roman, serif" font-size="{fs}" font-weight="{fw}" fill="#222">{esc}</text>')

    parts.append('</svg>')
    return '\n'.join(parts) + '\n'


def main():
    records = parse_records(DATA_PATH)
    written = 0
    for r in records:
        rid = (r.get('id') or '').strip().lower()
        if not rid:
            continue
        rid = rid[1:] if rid.startswith('e') else rid
        out_dir = OUT_ROOT / f'e{rid}'
        out_dir.mkdir(parents=True, exist_ok=True)
        out_path = out_dir / 'clipping.svg'
        out_path.write_text(render_svg(r), encoding='utf-8')
        written += 1
    print(f'files_written={written}')


if __name__ == '__main__':
    main()

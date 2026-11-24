#!/usr/bin/env python3
"""Patch the existing UNDERCOVER V12 HTML WITHOUT redesigning any chapter."""
import argparse, base64, re
from pathlib import Path

p = argparse.ArgumentParser()
p.add_argument('--html', type=Path, required=True)
p.add_argument('--warrant', type=Path, required=True)
p.add_argument('--high-wire', type=Path, required=True)
p.add_argument('--output', type=Path, required=True)
a = p.parse_args()
html = a.html.read_text(encoding='utf-8')

def image_uri(path):
    raw = path.read_bytes()
    mime = ('image/png' if raw.startswith(b'\x89PNG\r\n\x1a\n')
            else 'image/jpeg' if raw.startswith(b'\xff\xd8') else None)
    if mime is None:
        raise ValueError(f'Unsupported image: {path}')
    return 'data:' + mime + ';base64,' + base64.b64encode(raw).decode('ascii')

def replace_image(text, cls, uri):
    regex = rf'(<img class="[^"]*\b{re.escape(cls)}\b[^"]*" src=")[^"]+("[^>]*>)'
    result, count = re.subn(regex, lambda m: m.group(1) + uri + m.group(2), text)
    if count != 1: raise ValueError(f'Expected 1 {cls} image, found {count}')
    return result

warrant, wire = image_uri(a.warrant), image_uri(a.high_wire)
html = replace_image(html, 'warrantCover', warrant)
html = replace_image(html, 'warrantCoverModal', warrant)
old_card = "':'<strong>'+x.art+'</strong>')+'<span class=\"num\">'"
new_card = ("':i===4?'<img class=\"europeCover highWireCover\" src=\""
            + wire + "\" alt=\"High Wire — supplied artwork\" loading=\"lazy\">':'<strong>'+x.art+'</strong>')+'<span class=\"num\">'")
if html.count(old_card) != 1: raise ValueError('Chapter 05 card markup changed')
html = html.replace(old_card, new_card, 1)
old_modal = "':x.art;document.getElementById('modalOrigin')"
new_modal = ("':i===4?'<img class=\"europeCoverModal highWireCoverModal\" src=\""
             + wire + "\" alt=\"High Wire — supplied artwork\">':x.art;document.getElementById('modalOrigin')")
if html.count(old_modal) != 1: raise ValueError('Chapter 05 modal markup changed')
html = html.replace(old_modal, new_modal, 1)
css = """<style id="undercover-artwork-validated">
.cardArt.warrant .warrantCover,.cardArt.wire .highWireCover{
 display:block;width:100%;height:100%;object-fit:contain;object-position:center;transform:none}
.modalVisual .warrantCoverModal,.modalVisual .highWireCoverModal{
 display:block;width:100%;height:100%;object-fit:contain;object-position:center;transform:none}
.cardArt.wire{position:relative;background:rgba(10,7,12,.86);padding:0}
.cardArt.wire .num{z-index:4}
</style>
"""
if '</head>' not in html: raise ValueError('Invalid HTML')
html = html.replace('</head>', css+'</head>', 1)
assert html.count(warrant) == 2 and html.count(wire) == 2
assert html.count('id="uc-stage-video"') == 1
assert html.count('id="uc-stage-ambient"') == 1
a.output.parent.mkdir(parents=True, exist_ok=True)
a.output.write_text(html, encoding='utf-8')
print('PASS: Original V12 preserved, Warrant and High Wire embedded in card + modal')

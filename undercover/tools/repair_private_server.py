#!/usr/bin/env python3
"""Make the supplied UNDERCOVER V12 private server match its actual HTML/FLAC files.

Local private development only. This does not grant streaming/publication rights.
"""
import argparse
from pathlib import Path

ap=argparse.ArgumentParser()
ap.add_argument('--server',type=Path,required=True)
ap.add_argument('--output',type=Path,required=True)
a=ap.parse_args()
s=a.server.read_text('utf-8')

def exact(old,new,expected=1):
    global s
    n=s.count(old)
    if n!=expected: raise ValueError(f'Expected {expected} occurrences, found {n}: {old[:100]!r}')
    s=s.replace(old,new)

exact("ROOT/'UNDERCOVER_V10_PRIVATE_PREVIEW.html'", "ROOT/'UNDERCOVER_V12.html'")
exact("('qualified_listen','heat-street'),('original_click'", "('qualified_listen','heat-street'),('qualified_listen','only-a-man'),('original_click'")
exact("'/media/europe-master-24bit-48khz.wav','/media/bon-jovi-deep-cuts-the-night-24bit-48khz.wav','/media/def-leppard-heat-street-24bit-48khz.wav'", "'/media/europe-master-24bit-48khz.flac','/media/bon-jovi-deep-cuts-the-night-24bit-48khz.flac','/media/def-leppard-heat-street-24bit-48khz.flac','/media/warrant-only-a-man-minus-2-24bit-48khz.flac'")
exact("'Content-Type','audio/wav'", "'Content-Type','audio/flac'",2)
exact("'heat-street':'Def Leppard — Heat Street','our-lost-dreams'", "'heat-street':'Def Leppard — Heat Street','only-a-man':'Warrant — Only a Man','our-lost-dreams'")
old="""        if path in ('/art/bon-jovi-deep-cuts-the-night.png','/art/def-leppard-heat-street.png'):
            return self.send_bytes((ROOT/path.lstrip('/')).read_bytes(),mime='image/png')
"""
exact(old,'')
assert "BIND=os.getenv('UNDERCOVER_BIND','127.0.0.1')" in s
assert "if not self.is_authenticated():" in s
assert "len(PASSWORD)<12" in s
assert s.count('only-a-man')>=3
assert 'UNDERCOVER_V10_PRIVATE_PREVIEW.html' not in s
assert 'audio/wav' not in s
assert '.wav' not in s
assert "if path=='/admin':" in s
a.output.parent.mkdir(parents=True,exist_ok=True)
a.output.write_text(s,'utf-8')
print('PASS: V12 local private server aligns with HTML + 4 FLAC tracks + Warrant analytics')

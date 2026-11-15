"""Snap the approved words to the selected take's Scribe word boundaries."""
from pathlib import Path
import difflib, importlib.util, json, re
from pypinyin import lazy_pinyin
SONG=Path(__file__).resolve().parent
TAKE=SONG/'takes'/json.loads((SONG/'master-source.json').read_text(encoding='utf-8'))['take']
HAN=re.compile(r'[㐀-鿿]')
def main():
 words=[w for w in json.loads((TAKE/'scribe.json').read_text(encoding='utf-8'))['words'] if w.get('type')=='word']
 patches=TAKE/'timing-patches.json'
 for patch in json.loads(patches.read_text(encoding='utf-8')) if patches.exists() else []:
  start,end,offset=patch['replace_start'],patch['replace_end'],patch['source_start']
  excerpt=json.loads((TAKE/patch['transcript']).read_text(encoding='utf-8'))['words']
  words=[w for w in words if w['start']<start or w['start']>=end]
  words += [{**w,'start':w['start']+offset,'end':w['end']+offset} for w in excerpt if w.get('type')=='word' and start<=w['start']+offset<end]
 words.sort(key=lambda w:w['start'])
 tokens=[]
 for w in words:
  chars=HAN.findall(w['text'])
  for i,ch in enumerate(chars):
   dur=(w['end']-w['start'])/len(chars)
   tokens.append((lazy_pinyin(ch)[0],w['start']+i*dur,w['start']+(i+1)*dur))
 rows=json.loads((SONG/'lines.json').read_text(encoding='utf-8'))
 written=[];owner=[]
 for n,row in enumerate(rows):
  for ch in HAN.findall(row['zh']):written.append(lazy_pinyin(ch)[0]);owner.append(n)
 matcher=difflib.SequenceMatcher(None,written,[x[0] for x in tokens],autojunk=False)
 hits={a+k:tokens[b+k] for a,b,num in matcher.get_matching_blocks() for k in range(num)}
 fix={}
 for n,row in enumerate(rows):
  cells=[hits[i] for i,j in enumerate(owner) if j==n and i in hits]
  assert cells,(n,row['zh'])
  fix[str(n)]=[round(min(x[1] for x in cells),3),round(max(x[2] for x in cells),3)]
  print(n,*fix[str(n)],row['zh'])
 assert all(fix[str(n)][0]<fix[str(n+1)][0] for n in range(len(rows)-1))
 (TAKE/'fix.json').write_text(json.dumps(fix,indent=1)+'\n',encoding='utf-8')
if __name__=='__main__':main()

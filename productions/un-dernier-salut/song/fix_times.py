"""Expand matching token midpoints to complete Scribe words; text alignment only."""
from pathlib import Path
import difflib,importlib.util,json
SONG=Path(__file__).resolve().parent
TAKE=SONG/'takes/suno-final'
def main():
 spec=importlib.util.spec_from_file_location('theatre_listen',SONG.parents[2]/'tools/listen.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
 rows=json.loads((TAKE/'lines.json').read_text(encoding='utf-8'));words=json.loads((TAKE/'scribe.json').read_text(encoding='utf-8'))['words']
 written=[];owner=[];heard=[];times=[]
 for i,l in enumerate(rows):
  ts=m.tokens(l['sung'],'fr');written+=ts;owner += [i]*len(ts)
 for w in words:
  if w.get('type')!='word':continue
  ts=m.tokens(w['text'],'fr');heard+=ts;times += [[w['start'],w['end']]]*len(ts)
 hit={}
 for a,b,n in difflib.SequenceMatcher(None,written,heard,autojunk=False).get_matching_blocks():
  for k in range(n):hit[a+k]=times[b+k]
 fixed={}
 for i,l in enumerate(rows):
  tt=[hit[k] for k,o in enumerate(owner) if o==i and k in hit]
  assert tt,(i,l)
  fixed[str(i)]=[round(min(p[0] for p in tt),2),round(max(p[1] for p in tt),2)]
 assert all(fixed[str(i)][0]<fixed[str(i+1)][0] for i in range(len(rows)-1))
 (TAKE/'fix.json').write_text(json.dumps(fixed,indent=1)+'\n')
 print(f'{len(fixed)} lyric spans from complete transcript words; no musical review')
if __name__=='__main__':main()

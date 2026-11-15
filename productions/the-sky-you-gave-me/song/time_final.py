"""Scribe timestamps for the selected song, without any listening model."""
from pathlib import Path
import importlib.util, json
SONG=Path(__file__).resolve().parent
TAKE=SONG/'takes'/json.loads((SONG/'master-source.json').read_text(encoding='utf-8'))['take']
ROOT=SONG.parents[2]
def main():
 spec=importlib.util.spec_from_file_location('theatre_listen',ROOT/'tools/listen.py');listen=importlib.util.module_from_spec(spec);spec.loader.exec_module(listen)
 path=TAKE/'scribe.json';state=TAKE/'scribe-submission.json'
 if not path.exists():
  if state.exists():raise RuntimeError('A transcription was already submitted; inspect the existing state before resubmitting.')
  state.write_text(json.dumps({'status':'submitted','purpose':'Mandarin lyric timestamps only'}),encoding='utf-8')
  result=listen.scribe(str(TAKE/'take.mp3'),'zh')
  path.write_text(json.dumps(result,ensure_ascii=False,indent=1)+'\n',encoding='utf-8')
  state.write_text(json.dumps({'status':'complete','purpose':'Mandarin lyric timestamps only'}),encoding='utf-8')
 transcript=json.loads(path.read_text(encoding='utf-8'));rows=json.loads((TAKE/'lines.json').read_text(encoding='utf-8'))
 aligned=listen.align(rows,listen.sung_tokens(transcript['words'],'zh'),'zh')
 summary={'take':TAKE.name,'lyric_match':round(sum(r['match'] for r in aligned)/len(aligned),3),'review':None,'musical_earcheck':'human producer','purpose':'transcription for stage timing and surtitles'}
 (TAKE/'check.json').write_text(json.dumps({'summary':summary,'lines':aligned},ensure_ascii=False,indent=1)+'\n',encoding='utf-8')
 for r in aligned:print(f"{r['n']:2d} {r['start']}..{r['end']} {r['match']:.2f} {r['text']}")
if __name__=='__main__':main()

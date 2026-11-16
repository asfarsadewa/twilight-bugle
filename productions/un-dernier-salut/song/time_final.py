"""Transcribe words for timing only; deliberately never call the listening model."""
from pathlib import Path
import importlib.util,json
SONG=Path(__file__).resolve().parent
TAKE=SONG/'takes/suno-final'
def main():
 spec=importlib.util.spec_from_file_location('theatre_listen',SONG.parents[2]/'tools/listen.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
 p=TAKE/'scribe.json';state=TAKE/'scribe-submission.json'
 if not p.exists():
  if state.exists():raise RuntimeError('Already submitted: inspect the existing request before retrying')
  state.write_text('{"status":"submitted","purpose":"French lyric timing only"}',encoding='utf-8')
  data=m.scribe(str(TAKE/'take.mp3'),'fr');p.write_text(json.dumps(data,ensure_ascii=False,indent=1),encoding='utf-8')
  state.write_text('{"status":"complete","purpose":"French lyric timing only"}',encoding='utf-8')
 data=json.loads(p.read_text(encoding='utf-8'));rows=json.loads((TAKE/'lines.json').read_text(encoding='utf-8'))
 lines=m.align(rows,m.sung_tokens(data['words'],'fr'),'fr')
 (TAKE/'check.json').write_text(json.dumps({'summary':{'lyric_match':round(sum(l['match'] for l in lines)/len(lines),3),'musical_earcheck':'human producer','review':None},'lines':lines},ensure_ascii=False,indent=1),encoding='utf-8')
 for l in lines:print(f"{l['n']:2} {l['start']}..{l['end']} {l['match']:.2f} {l['text']}")
if __name__=='__main__':main()

"""Validate selected Sunburst outputs, cut alpha silhouettes and retain URL-free provenance."""
from pathlib import Path
import argparse,hashlib,json,re,shutil,subprocess,sys
from PIL import Image
import numpy as np
HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[2]
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def main():
 ap=argparse.ArgumentParser();ap.add_argument('names',nargs='+');a=ap.parse_args()
 jobs=json.loads((HERE/'prompts/jobs.json').read_text())
 for name in a.names:
  j=jobs[name];raw=HERE/j['raw_output'];log=(HERE/'_work'/f'{name}.log').read_text(encoding='utf-8')
  assert raw.exists() and 'Wrote ' in log,(name,log[-300:])
  im=Image.open(raw);alpha=np.asarray(im.convert('RGBA'))[:,:,3]
  if j['background']=='transparent':assert float(np.mean(alpha<32))>.1,(name,'missing alpha')
  cmd=[sys.executable,str(ROOT/'tools/cutout.py'),str(raw),str(HERE/'cut'),'--name',name]
  if j['parts']:cmd+=['--parts']
  if j['background']=='opaque':cmd+=['--opaque']
  subprocess.run(cmd,check=True)
  meta=json.loads((HERE/'cut'/f'{name}.json').read_text())
  if j['parts']:assert len(meta['parts'])==(2 if name.endswith('core') else 4),(name,len(meta['parts']))
  receipt={**j,'generator':'bundled imagegen CLI','status':'complete','prompt':f'prompts/{name}.prompt','prompt_sha256':sha(HERE/'prompts'/f'{name}.prompt'),'reference_sha256':sha(HERE/j['reference']),'raw_sha256':sha(raw),'image_size':list(im.size),'alpha_transparent_fraction':round(float(np.mean(alpha<32)),4),'generation_seconds':float(re.search(r'(?:Edit|Generation) completed in ([0-9.]+)s',log).group(1)),'runtime_metadata':f'cut/{name}.json'}
  (HERE/'receipts'/f'{name}.json').write_text(json.dumps(receipt,indent=2)+'\n',encoding='utf-8')
 if not (HERE/'key-art.png').exists():shutil.copy2(HERE/'src/key-art.png',HERE/'key-art.png')
 log=(HERE/'_work/key-art.log').read_text(encoding='utf-8')
 (HERE/'receipts/key-art.json').write_text(json.dumps({'model':'gpt-image-2.6-sunburst','mode':'generate','quality':'high','size':'1536x1024','background':'opaque','status':'complete','selected':'key-art.png','prompt_sha256':sha(HERE/'prompts/key-art.prompt'),'raw_sha256':sha(HERE/'key-art.png'),'generation_seconds':float(re.search(r'completed in ([0-9.]+)s',log).group(1))},indent=2)+'\n')
if __name__=='__main__':main()

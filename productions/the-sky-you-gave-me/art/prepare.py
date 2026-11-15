"""Validate completed explicit-model images, record provenance, and cut stage cards."""
from pathlib import Path
import argparse,hashlib,json,re,subprocess,sys
from PIL import Image
import numpy as np
HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[2]
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def main():
 ap=argparse.ArgumentParser();ap.add_argument('names',nargs='+');args=ap.parse_args()
 jobs=json.loads((HERE/'prompts/jobs.json').read_text())
 for name in args.names:
  j=jobs[name];raw=HERE/j['raw_output'];log=(HERE/'_work'/f'{name}.log').read_text(encoding='utf-8')
  assert raw.exists() and 'Wrote ' in log,(name,log[-1000:])
  im=Image.open(raw);a=np.asarray(im.convert('RGBA'))[:,:,3]
  if j['background']=='transparent':assert np.mean(a<32)>.08,(name,'No usable alpha')
  command=[sys.executable,str(ROOT/'tools/cutout.py'),str(raw),str(HERE/'cut'),'--name',name,'--max','2048']
  if name.startswith('puppet-'):command+=['--parts']
  if j['background']=='opaque':command+=['--opaque']
  subprocess.run(command,check=True)
  meta=json.loads((HERE/'cut'/f'{name}.json').read_text())
  if name.startswith('puppet-'):assert len(meta['parts'])==4,(name,len(meta['parts']))
  receipt={**j,'generator':'bundled imagegen CLI','status':'complete','prompt':f'prompts/{name}.prompt','prompt_sha256':sha(HERE/'prompts'/f'{name}.prompt'),'reference_sha256':sha(HERE/'key-art.png'),'raw_sha256':sha(raw),'image_size':list(im.size),'alpha_transparent_fraction':round(float(np.mean(a<32)),4),'generation_seconds':float(re.search(r'(?:Edit|Generation) completed in ([0-9.]+)s',log).group(1)),'runtime_metadata':f'cut/{name}.json'}
  (HERE/'receipts'/f'{name}.json').write_text(json.dumps(receipt,indent=2)+'\n',encoding='utf-8')
if __name__=='__main__':main()

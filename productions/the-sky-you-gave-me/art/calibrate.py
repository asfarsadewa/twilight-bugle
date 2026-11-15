"""Measured part pins and collar-adjusted mounts on the selected Sunburst sheets."""
from pathlib import Path
import json
HERE=Path(__file__).resolve().parent
SOURCE_SIZE=1024

def meta(name,index=None):
 d=json.loads((HERE/'cut'/f'{name}.json').read_text())
 return d['parts'][index] if index is not None else d
def point(m,xy):
 x0,y0,x1,y1=[v*SOURCE_SIZE for v in m['box']]
 return [round((xy[0]-x0)/(x1-x0),5),round((xy[1]-y0)/(y1-y0),5)]
def joint(name,index,pin,body,attach,scale=1,z=1,string=None,rest=0):
 d={'index':index,'pivot':point(meta(name,index),pin),'attach':point(body,attach),'scale':scale,'z':z,'rest':rest,'source_pin':pin,'source_body_pin':attach}
 if string:d['string']=string
 return d
def main():
 daughter=meta('puppet-daughter',1);father=meta('puppet-father-seat',1);seat=meta('body-daughter-seat')
 d={
  'body':{'index':1,'pivot':[.5,1]},
  # Mount the head at collar/shoulder height, behind the scarf. The painted
  # head carries its own neck; pinning it to the body's top stub doubled it.
  'head':joint('puppet-daughter',0,[263,303],daughter,[551,95],.76,-.6,[.5,.04]),
  'armA':joint('puppet-daughter',3,[297,400],daughter,[454,116],1,1.1,[.04,.96]),
  'armB':joint('puppet-daughter',2,[829,398],daughter,[652,116],1,1,[.85,.92]),
 }
 f={
  'body':{'index':1,'pivot':[.5,1]},
  'head':joint('puppet-father-seat',0,[674,328],father,[286,264],.74,-.6,[.52,.04]),
  'armA':joint('puppet-father-seat',2,[528,417],father,[376,308],1,1.2,[.79,.43]),
  'armB':joint('puppet-father-seat',3,[654,625],father,[166,302],1,1,[.9,.86],-18),
 }
 k=(1.05/daughter['h'])/(.83/seat['h'])
 s={'body':{'pivot':[.5,1]},'reused_part_scale':k,
    'head_attach':point(seat,[508,108]),'armA_attach':point(seat,[390,147]),'armB_attach':point(seat,[638,147])}
 out={'daughter':d,'father':f,'daughterSeat':s,'body_heights':{'daughter':1.05,'father':.95,'daughterSeat':.83},'note':'Source pixels refer to 1024×1024 sheets; normalized pins account for each actual alpha crop. Daughter head mounts are lowered about 0.042 world units behind the collar to shorten the exposed neck. Verify hand contact in the rendered stage.'}
 (HERE/'rig.json').write_text(json.dumps(out,indent=2)+'\n')
 print('Measured source pins written to art/rig.json; seated reuse scale',round(k,4))
if __name__=='__main__':main()

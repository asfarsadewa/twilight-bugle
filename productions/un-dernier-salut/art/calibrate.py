"""Measured source pins, overlapping collars and two-bone contact points for the selected sheets."""
from pathlib import Path
import json
HERE=Path(__file__).resolve().parent
def meta(name,i):return json.loads((HERE/'cut'/f'{name}.json').read_text())['parts'][i]
def uv(n,i,p):
 m=meta(n,i);x0,y0,x1,y1=[x*1024 for x in m['box']]
 return [round((p[0]-x0)/(x1-x0),5),round((p[1]-y0)/(y1-y0),5)]
def actor(w,bodyheight,bodyoffset,headpin,collar,shoulders,hips,ap,fp,tp,sp):
 core=w+'-core';arms=w+'-arms';legs=w+'-legs'
 out={'height':bodyheight,'bodyOffset':bodyoffset,'parts':{'body':{'sheet':core,'index':0,'height':bodyheight,'pivot':[.5,1]}}}
 def part(key,n,i,height,pin,parent,attach,z=0.3,string=None,end=None):
  parentname=core if parent=='body' else out['parts'][parent]['sheet'];parentindex=0 if parent=='body' else out['parts'][parent]['index']
  p={'sheet':n,'index':i,'height':height,'pivot':uv(n,i,pin),'attach':uv(parentname,parentindex,attach),'z':z,'source_pin':pin,'source_attach':attach}
  if parent!='body':p['parent']=parent
  if string:p['string']=uv(n,i,string)
  if end:p['end']=uv(n,i,end)
  out['parts'][key]=p
 part('head',core,1,.252,headpin,'body',collar,-.7,string=[220,290] if w=='clown' else [245,292])
 for j,side in enumerate(['A','B']):
  upper,elbow=ap[j];fi,forepin,hand=fp[j];hip,knee=tp[j];si,shinpin,sole=sp[j]
  part('arm'+side,arms,j,.30,upper,'body',shoulders[j],.7+j*.25)
  part('fore'+side,arms,fi,.36,forepin,'arm'+side,elbow,.32,string=hand,end=hand)
  part('thigh'+side,legs,j,.29,hip,'body',hips[j],-.8+j*.2)
  part('shin'+side,legs,si,.34,shinpin,'thigh'+side,knee,.3,string=shinpin,end=sole)
 return out
def main():
 # A 23 px (0.0149 world-unit) lift keeps the jaw above the neckline during the bow,
 # while the lower neck card still overlaps the painted chest. Head scale is unchanged.
 dancer=actor('dancer',.50,.49,[260,590],[720,224],[[552,214],[914,214]],[[586,852],[823,852]],
  [([332,65],[332,395]),([682,72],[687,395])],[(3,[324,523],[281,905]),(2,[680,524],[713,896])],
  [([310,54],[313,417]),([690,54],[690,417])],[(3,[309,530],[238,993]),(2,[688,528],[761,982])])
 # The shirt's back neckline is much higher than its lapel tips. Mount the head
 # at that neckline so the jaw clears the collar; the lower neck still overlaps.
 clown=actor('clown',.53,.49,[231,649],[708,125],[[519,298],[941,298]],[[595,900],[852,900]],
  [([319,56],[319,392]),([711,56],[711,391])],[(2,[318,524],[342,925]),(3,[714,525],[686,929])],
  [([338,48],[327,401]),([672,48],[683,401])],[(2,[331,521],[271,994]),(3,[684,521],[726,994])])
 (HERE/'rig.json').write_text(json.dumps({'dancer':dancer,'clown':clown,'note':'All source pins are measured in the selected 1024 px sheets. Heights rescale separate sheets into one physical puppet. Head bases overlap collars, rather than stacking neck stubs. Contact endpoints are palms and soles, not image corners.'},indent=2)+'\n')
 print('Two articulated 10-part cast rigs calibrated')
if __name__=='__main__':main()

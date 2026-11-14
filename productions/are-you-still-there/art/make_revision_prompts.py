#!/usr/bin/env python3
"""Write the revision-2 set and poster prompts. No provider calls."""
import json
from pathlib import Path
import re

HERE=Path(__file__).resolve().parent
LOCKED=re.search(r"<!-- locked:start -->\n(.*?)\n<!-- locked:end -->",(HERE/'bible.md').read_text(encoding='utf-8'),re.S).group(1)
CUT="One single front-facing flat cardboard scenery cutout on a genuinely transparent alpha background. Clear empty margin. No background wash, sky, water, shadows, lettering, frame, rods or strings. The bottom edge is straight. The top follows the actual silhouette, with every gap transparent."
JOBS={
 'key-art-v2':{
  'transparent':False,
  'prompt':"Image 1 is the previous art: preserve its charcoal-and-hanji material and the elderly man's exact white-haired face, coat, scarf and cane. Replace the scenic concept completely. Images 2 and 3 are references for the two opposing wartime troop uniforms and their unmarked cloth banners. A wide key illustration of the physical toy-theatre stage. In the PRESENT at dusk, old Chol stands at the LEFT foreground on a paved concrete observation embankment with a steel railing and a streetlamp, looking RIGHT across a wide river. Behind his own LEFT bank are several mid- and high-rise apartment blocks with many warm lit windows and ordinary urban infrastructure. Across the water on the distant RIGHT bank are a few worn low farmhouses, fields, a dirt track, a plain small watchpost and just one or two dim lights. A closed wire access gate and the remains of the old crossing show that he cannot simply walk over. The asymmetry of development must be unmistakable. In a cool, rain-washed MEMORY across the lower middle of the stage, the original young brothers are torn apart by WAR: olive-drab troops with steel helmets and a plain blue banner behind the older brother; mustard-khaki troops in ear-flap caps and a plain red banner behind the younger. The plank bridge is broken between the groups, refugees fleeing, the younger staying at the rope. No shooting. The old man and the wartime figures belong to different eras. This is a family divided by war for decades, not an ordinary farewell or a peaceful village nostalgia scene. Beautiful, legible layered composition with real card edges and a simple dark proscenium. Lit cyclorama, not a painted sky. No country names or text. Landscape 1536 by 1024 or larger."
 },
 'flat-city':{
  'transparent':True,
  'prompt':"Image 1 is the revised key-art style and geography reference. One connected scenery flat for the relatively developed NEAR bank on the LEFT: a compact cluster of Korean urban apartment blocks of the late twentieth century, a few tall slab buildings behind lower residential blocks, balconies, rooftop water tanks, numerous small warm lit windows, a small elevated road edge and ordinary street infrastructure. No grand landmarks, brand names or text. Concrete grey, muted blue, a little warm window amber, hand-painted in charcoal and thin watercolour on hanji card. Broad calm shapes with clear depth layers, not busy. It should clearly read as decades later and materially more developed than a rural village. Entire buildings in frame. Wide landscape, roughly 2 to 1. No river, sky or people. " + CUT
 },
 'flat-far-bank':{
  'transparent':True,
  'prompt':"Image 1 is the revised key-art style and geography reference. One connected long LOW scenery flat for the poorer FAR bank of a divided river: just two or three small worn rural farmhouses with weathered low roofs and grey plaster, a little patchwork of farm fields, an unpaved track, a few thin utility poles, a short plain fence and a small unmarked utilitarian lookout post at the RIGHT end. Only one or two dim warm windows. No ornate palace roofs, decorative gardens, grand gate, modern towers, named symbols or people. A distant inhabited place with dignity and everyday humanity, materially sparse beside the developed near shore. Charcoal, grey ink and muted earth watercolour on hanji card. Little chimney, no painted smoke. Keep it low so the river and hills remain open above it. Wide landscape, roughly 3 to 1. " + CUT
 },
 'flat-promenade':{
  'transparent':True,
  'prompt':"Image 1 is the revised key-art style and geography reference. One long foreground scenery cutout of the developed near-bank observation embankment: a low straight strip of grey concrete paving and retaining wall, a simple steel handrail running along the river edge, one tall slender working streetlamp near the LEFT fifth, and at the RIGHT end a CLOSED unmarked chain-link access gate with a short fence, barring the approach to an old crossing. The gate remains closed. The railing is simple and open, with clear gaps; the streetlamp and gate must be fully in frame. The card must let a puppet behind it remain visible from the waist up. No road sign, writing, logo or people. Contemporary infrastructure painted in the same soft charcoal, ink and watercolour on textured hanji, not photo-real metal. A wide landscape cutout. " + CUT
 },
 'poster-v2':{
  'transparent':False,
  'prompt':"Image 1 is the revised key art. A tall portrait poster for this production, in exactly its charcoal-and-hanji painted-card style. Elderly white-haired Chol stands on the developed LEFT near bank, his cane beside a metal observation railing, a closed access gate and warm apartment windows behind him. He reaches across a broad dusk river towards a sparse, dimly lit rural far shore on the RIGHT. The river separates them. In the lower water and paper memory, clearly show the wartime reason: the two young brothers on opposite banks with the severed wooden bridge between them, each behind a different line of soldiers, olive steel helmets with plain blue cloth on one side and mustard khaki caps with plain red cloth on the other. No shooting or national symbols. The past is cold monsoon rain; the present is dusk amber and indigo. No real reunion. Strong, beautiful emotional composition; the contrast of eras and unequal development is essential. A slim painted border. Leave the top FIFTH and bottom SIXTH completely plain cream paper for printed titles. No generated text, country names, stage frame or curtains. Portrait 1024 by 1536 or larger."
 },
}

def main():
 p=HERE/'prompts'/'revision-2';p.mkdir(parents=True,exist_ok=True)
 for name,j in JOBS.items():
  (p/f'{name}.prompt').write_text(LOCKED+'\nUse case: illustration-story.\n'+j['prompt']+'\n',encoding='utf-8')
 (p/'jobs.json').write_text(json.dumps({n:{'transparent_background':j['transparent'],'reference':'key-art-v2.png' if n!='key-art-v2' else 'key-art-v1.png + Hyeong troop cards','generator':'built-in image_gen'} for n,j in JOBS.items()},indent=2)+'\n')
 print('Five revision-2 image prompts written.')

if __name__=='__main__': main()

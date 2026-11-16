# Paint and machinery

All selected artwork uses **gpt-image-2.6-sunburst**, with no fallback. The bundled imagegen CLI is invoked directly, `--quality high --no-augment`; every edit references the viewed key image in `src/key-art.png`. The selected `key-art.png` is also retained outside the ignored source folder. Eighteen URL-free receipts record settings and hashes.

Hand-painted gouache and ink on scuffed cardboard, from old French toy theatres and lithography. Slate, petrol blue, dusty ivory, oxblood and tarnished ochre. Paper grain and brass pins remain visible. Neutral painted shading leaves the actual lighting to the house. No photoreal people, plastic dolls, ghost reveal, magical replacement theatre or confetti.

The adult dancer has a chestnut bun, a short scalloped blue ballet dress, cream stockings and worn slippers. The adult clown has wavy dark hair, a tiny faded red nose, ivory rolled sleeves, patched waistcoat and charcoal trousers. Faces are sorrowful and alive. Short head bases overlap the collars, with the jaw visibly clear of the neckline in bows and turns. Do not shorten a neck by burying the chin in the chest. The clown's head mirrors at its pin to face his partner.

Each actor has three sheets: head/torso, four arm segments and four leg segments. `prepare.py` cuts the real alpha islands. `calibrate.py` measures cap centres, palms and soles in source pixels, normalizes to the actual crops and scales the separate sheets into one puppet. Forearms nest beneath upper arms, and shins beneath thighs. Threads tie to heads, palms and lower legs.

Canvas border, cloud wings on trucks, bolted support, ladder, five deep cardboard risers and a small step make the setting. Stool, broom, hat and case are handled by the cast. Code-native cloth geometry follows actual palm contacts; the generated folded-sash card replaces it in the coda. The storm acts through objects and performers. No particle curtain hides the cast. The damaged set is never restored.

## Preparation

`make_prompts.py` writes seventeen edit briefs and `prompts/jobs.json`. Provider calls use the bundled CLI directly. Preserve completed outputs/logs; inspect an uncertain request before resubmitting it.

```powershell
python productions/un-dernier-salut/art/prepare.py dancer-core dancer-arms dancer-legs clown-core clown-arms clown-legs canopy cloud-wing platform support ladder stool broom hat trunk ribbon-fold poster
python productions/un-dernier-salut/art/calibrate.py
```

Transparent outputs retain genuine RGBA. Preparation crops islands, traces contours and derives relief normals; it does not redraw the selected artwork.

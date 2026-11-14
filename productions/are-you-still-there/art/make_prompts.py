#!/usr/bin/env python3
"""Reproduce the original version-1 prompts; current revision uses make_revision_prompts.py."""
import json
from pathlib import Path
import re

HERE = Path(__file__).resolve().parent
LOCKED = re.search(r"<!-- locked:start -->\n(.*?)\n<!-- locked:end -->", (HERE / "bible-v1.md").read_text(encoding="utf-8"), re.S).group(1)
REF = "Image 1 is the production's key-art STYLE reference. Match its charcoal, ink, thin watercolour, hanji fibres, raw card edges, palette and figure style. Do not copy its composition."
CUT = "One single flat painted cardboard cutout, seen straight from the front, on a genuinely transparent background. Clean hand-cut outline. No cast shadow, stage, frame, rods, strings, stand, sky or lettering. Leave clear transparent margin all around."
JOBS = {
    "key-art": {
        "transparent": False,
        "prompt": "Use the attached Hyeong picture only as a reference for the charcoal-and-hanji toy-theatre style and the two brothers' faces. A new wide key-art illustration of the whole stage inside a simple dark proscenium at dusk. Near the front left stands Cheol, now an elderly Korean man with short white hair, a lined strong kind face, worn grey-brown coat, cream shirt, faded indigo scarf, dark trousers and shoes. He is a flat jointed card marionette, slightly stooped over a wooden cane, his free hand reaching towards the far bank. The river is made from two low rocking rows of cut card. A broken wooden bridgehead stands empty. At the back is the small Korean village with tiled roofs, a chimney and just a few amber windows beneath misty charcoal hills. The smooth cyclorama glows from deep blue above to muted amber at the horizon, with NO painted sky detail. Reeds frame the near bank. A small, cool, rain-washed memory of Min at nineteen, in off-white work clothes, is a separate faint card at the far left, clearly part of an earlier time; he does not answer or approach the older man. The feeling is the beauty of home remembered and the ache of an unanswered river. Strong, calm layered composition; rich amber light against indigo water. No generated text. Landscape, 1536 by 1024 or larger.",
    },
    "puppet-elder": {
        "transparent": True,
        "prompt": "The FOUR detached pieces of ONE elderly Cheol marionette, painted at one consistent scale, with at least 90 pixels of empty space between every piece. He faces three-quarters to the RIGHT. (1) A separate head with short WHITE hair, a lined strong kind Korean face, quiet sad eyes, and a bare neck with NO collar; one round brass pin at the bottom of the neck. (2) An ARMLESS and HEADLESS body from the neck base down to worn dark shoes: a worn grey-brown coat over a cream shirt, a faded indigo scarf draped down the chest, dark trousers, a slightly stooped standing pose. Three clearly visible round brass pins: neck base and both shoulders. (3) His RIGHT arm from shoulder to an open reaching hand, grey-brown coat sleeve, one brass shoulder pin. (4) His LEFT arm from shoulder to a hand holding a plain wooden walking cane extending down beside the hand, grey-brown sleeve, one brass shoulder pin. Do not put arms on the body. Do not let any pieces touch. Natural adult head-to-body proportions. Arrange head at upper left, body in centre, right arm at right, left arm at far left below the head. This is a production sprite-parts sheet, not an assembled character. Square image, 2048 pixels if possible.",
    },
    "flat-bank": {
        "transparent": True,
        "prompt": "One long LOW near-bank ground row of a Korean river: a narrow strip of dark earth and weathered rounded stones, a few sparse dry grasses, one short broken wooden mooring post near the left. Warm grey-brown ink and charcoal, a few last amber highlights. The upper silhouette is low and irregular. The lower edge is perfectly straight. No water painted behind it, no houses, no sky, no people. A wide low cutout, roughly 3 to 1.",
    },
    "prop-reeds": {
        "transparent": True,
        "prompt": "One single connected clump of tall river reeds and pampas-like seed heads, bending gently to the right in a breeze, attached to a small common mound of dark earth. Dry ochre stalks, muted olive leaves, cream seed heads, soft charcoal outlines. Elegant clear negative spaces between the stalks, no loose fragments. A portrait cutout, with every seed head and the entire base in frame.",
    },
    "flat-village-now": {
        "transparent": True,
        "prompt": "One wide distant Korean village scenery flat: a small cluster of humble tiled-roof houses, a low stone wall, one tall old pine and one bare persimmon tree. Two or three small windows glow quiet amber. One little chimney, with NO painted smoke. A small open gap between houses suggests the old lane. Empty of people. Thin charcoal, grey ink and a little dusk watercolour on warm hanji. Calm simple shapes, not busy. The base is straight, the top follows roofs and branches with transparent empty sky above. A wide landscape cutout, roughly 3 to 1. No hills or river painted behind it.",
    },
    "prop-bridgehead": {
        "transparent": True,
        "prompt": "One broken wooden bridgehead at the near bank of a river: two weathered low wooden posts, a few old plank ends and a slack broken rope hanging down between them, on a small piece of stony bank. It ends abruptly at the right, opening into empty space. No complete bridge, no far bank, no river, no people. A simple, poignant, low horizontal cardboard prop, its whole silhouette visible, charcoal and faded brown with a few amber edges.",
    },
    "prop-rice": {
        "transparent": True,
        "prompt": "One small cloth bundle opened around TWO simple half-round portions of a Korean rice ball: off-white rice painted in a few soft strokes, resting on a little square of worn cream cotton. A plain domestic object, delicate but bold enough to read on a toy-theatre stage. All one connected cutout, not scattered grains. Seen slightly from above, with an entire clean outline; no hands, plate, table or scenery. Square image.",
    },
    "poster": {
        "transparent": False,
        "prompt": "A tall portrait poster illustration for this production. A strong calm focal composition of elderly white-haired Cheol in his grey-brown coat and faded indigo scarf at a river at dusk, his hand raised towards a few tiny amber windows across the water. In the river's paper reflections is a cool, faint memory of two young brothers parting at a wooden bridge in the rain. They are memories, not a reunion. Charcoal, grey ink and thin watercolour on textured hanji, indigo and dusk amber. Slim painted dark ornamental border. Keep the top FIFTH and bottom SIXTH completely plain warm cream paper for the theatre's printed titles. No painted text, letters, numbers, theatre frame or curtains. Portrait 1024 by 1536 or larger.",
    },
}


def main():
    prompts = HERE / "prompts"
    prompts.mkdir(parents=True, exist_ok=True)
    for name, job in JOBS.items():
        composition = "" if name in ("key-art", "poster") else ("Transparent sprite-parts sheet, front view. No shadows, rods, strings, scenery or lettering." if name == "puppet-elder" else CUT)
        ref = "" if name == "key-art" else REF
        (prompts / f"{name}.prompt").write_text(f"{LOCKED}\nUse case: illustration-story.\n{ref}\nSUBJECT: {job['prompt']}\n{composition}\n", encoding="utf-8")
    (prompts / "jobs.json").write_text(json.dumps({name: {"transparent_background": job["transparent"], "prompt": f"{name}.prompt", "generator": "built-in image_gen"} for name, job in JOBS.items()}, indent=2) + "\n", encoding="utf-8")
    print(f"{len(JOBS)} built-in image generation prompts written")


if __name__ == "__main__":
    main()

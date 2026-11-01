#!/usr/bin/env python3
"""Write one prompt per art piece of The Daybreak Vow, and the job list for gen_art.sh.

  python productions/daybreak-vow/art/make_prompts.py

Every prompt starts with the locked text of bible.md. Every piece is an edit with key-art.png as Image 1,
so the whole production shares one look. prompts/<piece>.prompt is the exact prompt.
prompts/<piece>.txt adds the model, the settings and the input image.
"""
import os, re

HERE = os.path.dirname(os.path.abspath(__file__))
bible = open(os.path.join(HERE, "bible.md"), encoding="utf-8").read()
LOCKED = re.search(r"<!-- locked:start -->\n(.*?)\n<!-- locked:end -->", bible, re.S).group(1)

REF = ("REFERENCES: Image 1 is the look reference. Match its gouache paint, gold leaf, raw cardboard edges, "
       "palette and figure style. Do not copy its composition.")
CUT = ("COMPOSITION: One single cardboard cutout seen straight from the front, on a transparent background. "
       "Clean hand-cut outline. No shadow, no stand, no rod, no strings, no other pieces, no stage, no curtains, no frame.")
DROP = ("COMPOSITION: One painted cardboard backcloth that fills the whole frame edge to edge, seen straight on, "
        "evenly lit. No frame, no stage, no curtains, no proscenium, no figures.")
PARTS = ("COMPOSITION: A flat lay of the separate cardboard pieces of ONE jointed rod puppet, all at the same scale, "
         "seen straight from the front on a transparent background. Each piece is a separate cutout with clear empty "
         "space around it. No piece touches or overlaps another piece. Each joint end has a small brass split pin. "
         "No shadow, no rod, no strings, no stand, no stage.")

AUREL = ("Prince: short wavy chestnut hair, a thin gold circlet with a small sun, silver mail, "
         "a crimson surcoat with a gold sun.")

PIECES = {
    "drop-night": ("2048x1152", False, DROP,
        "The sky of the Long Night: deep night indigo painted in broad gouache strokes, darker at the top, a little "
        "lighter near the bottom. Many small gold-leaf stars of different sizes, some four-pointed. Faint deep slate "
        "wisps of cloud. No moon, no sun, no land, no buildings."),
    "drop-dawn": ("2048x1152", False, DROP,
        "A dawn sky: dawn rose and sun gold near the bottom, rising into soft pale blue at the top. Long soft clouds "
        "lit gold from below, painted in broad gouache strokes. A few fading stars at the very top. No sun disc, "
        "no moon, no land, no buildings."),
    "drop-map": ("2048x1152", False, DROP,
        "A painted map of the realm on a cardboard backcloth, like a treasure map in a storybook. In the south, the "
        "small walled city of Ilvara with its tall Lantern Spire. A road runs north through snowy hills and pine "
        "forests to mountain passes with tiny beacon towers. Beyond the passes in the far north, white ice fields "
        "and a small black crown with two red dots. A gold-leaf compass rose. No words and no letters on the map."),
    "flat-mountains": ("2304x768", True, CUT,
        "A long ground row of far snowy mountains of the north: deep slate and snow white peaks painted in gouache, "
        "with a small stone beacon tower on the highest peak. The bottom edge is straight."),
    "flat-city": ("2048x1152", True, CUT,
        "The walled city of Ilvara as one big flat: pale stone towers and houses with blue slate roofs and many warm "
        "lit windows, crowded together, and at the center the tall slender Lantern Spire with an empty silver lamp "
        "cage at its very top. The top edge follows the skyline. The bottom edge is straight."),
    "flat-rampart": ("2304x768", True, CUT,
        "A long front rampart of the city: pale stone wall with crenellations along the top, two deep blue banners "
        "with a silver crescent, and in the middle a big arched gate with two closed wooden doors with iron bands. "
        "The top edge follows the crenellations. The bottom edge is straight."),
    "flat-snow-hills": ("2304x768", True, CUT,
        "A long ground row of near snowy hills at the war front: rolling snow white hills with deep slate shadows, "
        "dark pine trees and a few rocks. The bottom edge is straight."),
    "flat-pines": ("1536x1152", True, CUT,
        "A tall cluster of dark pine trees with snow on the branches, deep slate and night indigo, a few touches "
        "of snow white. The bottom edge is straight."),
    "flat-clouds": ("2304x768", True, CUT,
        "A long row of heavy storm clouds: night indigo and deep slate billows with a few ember red edges, painted "
        "with dry-brush gouache. Rounded billowing top edge, flat bottom edge."),
    "flat-army": ("2304x768", True, CUT,
        "A long ground row of the prince's army marching to the left in side view: a tight column of foot soldiers "
        "in silver helmets and crimson surcoats with tall spears, and many tall crimson banners with a gold sun. "
        "The bottom edge is straight."),
    "prop-sun": ("1024x1024", True, CUT,
        "The sun as a stage prop: a round disc of gold leaf with long wavy painted rays, and a calm, kind painted "
        "face with closed eyes and a soft smile."),
    "prop-moon": ("1024x1024", True, CUT,
        "The moon as a stage prop: a slender crescent moon painted moon silver-blue and snow white with a little "
        "silver leaf, and a gentle sleeping face in profile on the inner curve."),
    "prop-hollow-crown": ("1536x1024", True, CUT,
        "The Hollow Crown: a huge black iron crown with tall jagged points, seen from the front, empty inside so the "
        "dark open interior shows. Two large red jewels on the front band glow like eyes. Soot black with dull iron "
        "grey highlights and a few ember red cracks."),
    "prop-umbral-knight": ("1024x1536", True, CUT,
        "One knight of the Umbral Host: a tall black cardboard silhouette of an armoured knight standing with a long "
        "jagged sword, painted soot black with dull slate edges, and two thin glowing red eye slits in the helmet."),
    "prop-campfire": ("1024x1024", True, CUT,
        "A small campfire: crossed logs and stones with tall painted cardboard flames in ember red, sun gold and "
        "snow white at the heart."),
    "prop-flame": ("1024x1536", True, CUT,
        "A single tall teardrop flame cut from cardboard: ember red outside, sun gold inside, a snow white core, "
        "painted with lively gouache strokes."),
    "prop-horse-aurel": ("1536x1536", True, CUT,
        "Prince Aurel on his white warhorse, galloping to the left in side view. The horse wears a crimson "
        "caparison with gold suns. The prince holds the sword Daybrand high. His ember red cape flies behind him. "
        + AUREL),
    "puppet-aurel": ("1536x1536", True, PARTS,
        "The four pieces of a puppet of Prince Aurel, a young heroic man, facing three-quarters to the right: "
        "(1) the head with short wavy chestnut hair, a thin gold circlet with a small sun, and the neck; "
        "(2) the body from the shoulders down to the boots, standing, with silver mail, a crimson surcoat with a "
        "gold sun emblem and an ember red cape, with NO arms; (3) the right arm from shoulder to hand, holding the "
        "long sword Daybrand with a gold sun on the cross-guard, pointing up; (4) the left arm from shoulder to an "
        "open hand."),
    "puppet-ilune": ("1536x1536", True, PARTS,
        "The four pieces of a puppet of Princess Ilune, a young woman, facing three-quarters to the left: "
        "(1) the head with long silver-white hair, a slender silver crescent-moon tiara, and the neck; (2) the body "
        "from the shoulders down to the hem, standing, in a deep blue gown with silver embroidery and a long "
        "moon-white cloak, with NO arms; (3) the right arm from shoulder to hand, holding up the Moonlamp, a silver "
        "lantern with a pale blue-white light; (4) the left arm from shoulder to an open hand."),
    "puppet-ilune-armour": ("1536x1536", True, PARTS,
        "The four pieces of a puppet of Princess Ilune in armour, facing three-quarters to the left: (1) the head "
        "with long silver-white hair tied back, no tiara, and the neck; (2) the body from the shoulders down to the "
        "hem, standing, with a silver breastplate over a deep blue gown and a long moon-white cloak, with NO arms; "
        "(3) the right arm in a silver vambrace from shoulder to hand, holding up the Moonlamp, a silver lantern "
        "with a pale blue-white light; (4) the left arm in a silver vambrace from shoulder to an open hand."),
}


def main():
    os.makedirs(os.path.join(HERE, "prompts"), exist_ok=True)
    jobs = []
    for name, (size, transparent, comp, subject) in PIECES.items():
        prompt = f"{LOCKED}\n{REF}\nSUBJECT: {subject}\n{comp}\n"
        bg = "transparent" if transparent else "opaque"
        open(os.path.join(HERE, "prompts", f"{name}.prompt"), "w", encoding="utf-8").write(prompt)
        open(os.path.join(HERE, "prompts", f"{name}.txt"), "w", encoding="utf-8").write(
            f"model: gpt-image-2.5-sunburst (edit)\nquality: high\nsize: {size}\nbackground: {bg}\n"
            f"input images: 1 = art/key-art.png\n\n{prompt}")
        jobs.append(f"{name} {size} {bg}")
    # Unix line ends: bash reads this file, and a carriage return would end up inside the last field.
    open(os.path.join(HERE, "prompts", "jobs.txt"), "w", newline="\n").write("\n".join(jobs) + "\n")
    print(f"{len(jobs)} prompts")


if __name__ == "__main__":
    main()

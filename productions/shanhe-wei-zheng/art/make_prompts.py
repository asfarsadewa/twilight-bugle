#!/usr/bin/env python3
"""Write one prompt per art piece of 山河为证, and the job list for gen_art.sh.

  python productions/shanhe-wei-zheng/art/make_prompts.py

Every prompt starts with the locked text of bible.md. The key art is a plain generation. Every other piece is an
edit with key-art.png as Image 1.
"""
import os, re

HERE = os.path.dirname(os.path.abspath(__file__))
LOCKED = re.search(r"<!-- locked:start -->\n(.*?)\n<!-- locked:end -->", open(os.path.join(HERE, "bible.md"), encoding="utf-8").read(), re.S).group(1)
REF = ("REFERENCES: Image 1 is the look reference. Match its woodcut carving, solid blacks with wood grain, warm paper, "
       "the single red, raw card edges and figure style. Do not copy its composition.")
CUT = ("COMPOSITION: One single cardboard cutout seen straight from the front, on a transparent background. "
       "Clean hand-cut outline. No shadow, no stand, no rod, no other pieces, no stage, no curtains, no frame.")
PARTS = ("COMPOSITION: A flat lay of the separate cardboard pieces of ONE jointed puppet, all at the same scale, "
         "seen straight from the front on a transparent background. Each piece is a separate cutout with clear empty "
         "space around it. No piece touches or overlaps another piece. Each joint end has a small brass split pin. "
         "No shadow, no rod, no strings, no stand, no stage.")

KEY_ART = (
    "SUBJECT: Key art for the production. Inside a grand old toy theatre at dawn. The sky behind is a smooth glow "
    "from pale gold at the horizon up to cold blue-grey, with no painted detail. Far behind, tall snow peaks carved "
    "in white and black. On the right, an iron chain bridge spans a deep gorge between two stone bridgeheads. Across "
    "the middle distance, a long column of soldiers with packs, rifles and plain red flags climbs over a mountain "
    "ridge toward the light. In front stands Shitou, a boy soldier of sixteen as a jointed card marionette: a "
    "grey-blue uniform too large for him, a soft cap with a red star, straw sandals, a rifle taller than he is. He "
    "looks up toward the dawn. Three wild geese fly north above him.\n"
    "COMPOSITION: The whole stage inside a toy theatre, seen from the audience, with a simple dark proscenium."
)

PIECES = {
    "puppet-shitou": ("1536x1536", PARTS,
        "The four pieces of a marionette of Shitou, a boy soldier of sixteen, facing three-quarters to the right: (1) "
        "the head with a soft grey-blue cap with a small red five-pointed star, a young earnest face with steady eyes, "
        "and the neck; (2) the body from the shoulders down to the feet, standing, in a grey-blue uniform too large for "
        "him, a cloth belt, a rolled blanket and a cloth pack on his back, leg wraps and straw sandals, with NO arms; "
        "(3) the right arm from shoulder to hand, holding an old rifle upright by its barrel, the rifle longer than the "
        "whole arm; (4) the left arm from shoulder to an open hand."),
    "prop-mother": ("1024x1536", CUT,
        "A village woman of Jiangxi, his mother, standing and facing three-quarters to the right, in a dark indigo "
        "jacket and trousers with a head cloth, holding out a pair of woven straw sandals in both hands."),
    "prop-zhao": ("1024x1536", CUT,
        "Old Zhao, a weathered squad leader of about fifty, standing and facing three-quarters to the left, in a worn "
        "grey-blue uniform and cap with a small red star, a grey stubble beard, a tin cup on his belt, holding out a "
        "small cloth bundle of food in one hand."),
    "flat-village": ("2048x1536", CUT,
        "A village of Jiangxi: two small houses with dark tiled roofs and white walls, and a great camphor tree with a "
        "broad crown. The bottom edge is straight."),
    "flat-villagers": ("2304x1024", CUT,
        "A group of six villagers, men and women, walking to the right and carrying wooden house doors on their "
        "shoulders toward a river, cut as one connected shape. The bottom edge is straight."),
    "flat-waves": ("2304x768", CUT,
        "A long ground row of river waves carved as a woodcut: bold black curling crests on warm paper with carved "
        "white foam lines, flat top edge of waves only. The bottom edge is straight."),
    "flat-pontoon": ("2304x768", CUT,
        "A long floating bridge seen from the side: a row of small wooden boats lashed together, with wooden house "
        "doors laid across them as the deck, and a rope rail. The bottom edge is straight."),
    "flat-mountains": ("2304x768", CUT,
        "A long range of rugged mountains carved as a woodcut, with bold black shadows and white ridges and a few "
        "pines. The bottom edge is straight."),
    "flat-column": ("2304x768", CUT,
        "A long ground row of soldiers marching to the right in single file, with packs, rifles and two plain red "
        "flags on poles, many figures overlapping as one bold connected shape, black in front fading to grey at the "
        "back. The bottom edge is straight."),
    "flat-chainbridge": ("2304x1024", CUT,
        "The Luding chain bridge over a deep gorge: two stone bridgeheads with small tiled gate houses at the left and "
        "right edges, and long iron chains that sag between them with no planks. Below, steep rock walls and a "
        "foaming torrent. The bottom edge is straight."),
    "prop-climbers": ("1536x768", CUT,
        "Four soldiers crawling forward along iron chains, hand over hand, with rifles on their backs, seen from the "
        "side, moving to the right, cut as one connected shape with a short length of chain."),
    "flat-snowpeak": ("2048x1536", CUT,
        "A tall snow mountain carved as a woodcut: white snow fields and black rock shadows, a steep path with tiny "
        "climbing figures. The bottom edge is straight."),
    "flat-grassland": ("2304x768", CUT,
        "A long ground row of grassland marsh: tussocks of wild grass, reeds and dark pools of water, carved in black "
        "with ochre touches. The bottom edge is straight."),
    "prop-fallen": ("2304x1024", CUT,
        "Five soldiers standing quietly side by side and facing the front, caps on, rifles at their sides, printed "
        "only in soft grey ink like a faded print, with no red. Cut as one connected shape."),
    "flat-loess": ("2304x1024", CUT,
        "Loess hills of northern China: layered terraced slopes of yellow earth in ochre and black, with arched cave "
        "dwellings cut into the hillside. The bottom edge is straight."),
    # No rays and no red: a red disc with red rays is the Rising Sun flag, an offensive image in this setting.
    "prop-sun": ("1024x1024", CUT,
        "A rising sun as a stage prop: a plain round disc of warm ochre gold, carved with fine concentric hatching "
        "and a slightly lighter rim. No rays, no stripes, no beams, no red."),
    "prop-moon": ("1024x1024", CUT,
        "A pale moon as a stage prop: a round warm-paper disc with carved grey hatching for its shadows."),
    "prop-geese": ("1536x768", CUT,
        "Three wild geese flying to the right in a line, wings spread, carved in black."),
    "prop-lanterns": ("2048x768", CUT,
        "A row of four small oil lanterns of paper and bamboo hanging from one cord, glowing warm from inside."),
}


def main():
    os.makedirs(os.path.join(HERE, "prompts"), exist_ok=True)
    open(os.path.join(HERE, "prompts", "key-art.prompt"), "w", encoding="utf-8", newline="\n").write(f"{LOCKED}\n{KEY_ART}\n")
    jobs = []
    for name, (size, comp, subject) in PIECES.items():
        prompt = f"{LOCKED}\n{REF}\nSUBJECT: {subject}\n{comp}\n"
        open(os.path.join(HERE, "prompts", f"{name}.prompt"), "w", encoding="utf-8", newline="\n").write(prompt)
        jobs.append(f"{name} {size} transparent")
    open(os.path.join(HERE, "prompts", "jobs.txt"), "w", newline="\n").write("\n".join(jobs) + "\n")
    print(f"{len(jobs)} prompts and the key art")


if __name__ == "__main__":
    main()

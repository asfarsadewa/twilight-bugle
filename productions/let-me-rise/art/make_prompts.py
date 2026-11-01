#!/usr/bin/env python3
"""Write one prompt per art piece of Let Me Rise, and the job list for gen_art.sh.

  python productions/let-me-rise/art/make_prompts.py

Every prompt starts with the locked text of bible.md. The key art is a plain generation. Every other piece is an
edit with key-art.png as Image 1.
"""
import os, re

HERE = os.path.dirname(os.path.abspath(__file__))
LOCKED = re.search(r"<!-- locked:start -->\n(.*?)\n<!-- locked:end -->", open(os.path.join(HERE, "bible.md"), encoding="utf-8").read(), re.S).group(1)
REF = ("REFERENCES: Image 1 is the look reference. Match its gouache paint, Art Nouveau outlines, gold leaf, raw "
       "cardboard edges, palette and figure style. Do not copy its composition.")
CUT = ("COMPOSITION: One single cardboard cutout seen straight from the front, on a transparent background. "
       "Clean hand-cut outline. No shadow, no stand, no rod, no other pieces, no stage, no curtains, no frame.")
PARTS = ("COMPOSITION: A flat lay of the separate cardboard pieces of ONE jointed rod puppet, all at the same scale, "
         "seen straight from the front on a transparent background. Each piece is a separate cutout with clear empty "
         "space around it. No piece touches or overlaps another piece. Each joint end has a small brass split pin. "
         "No shadow, no rod, no strings, no stand, no stage.")

KEY_ART = (
    "SUBJECT: Key art for the production. Inside a grand old toy theatre at sunrise. The sky behind is a smooth glow "
    "from lotus pink at the horizon up to lapis blue, with no painted detail. On the left, a small temple with two "
    "lotus-bud columns, a flat roof and a painted wall, with nine wide stone steps down to a river. A river of "
    "rolling Art Nouveau waves crosses the stage. On the river, a small gilded festival barge with a lamp shrine; "
    "at its prow stands Meret, a young woman as a jointed cardboard rod puppet in a white linen dress with a "
    "turquoise and gold collar and a long black braid, one arm raised toward a large rising sun disc of gold leaf. "
    "Papyrus reeds in the front. Far behind, low desert dunes with two small pyramids as flat pale silhouettes.\n"
    "COMPOSITION: The whole stage inside a toy theatre, seen from the audience, with a simple dark proscenium."
)

PIECES = {
    "puppet-meret": ("1536x1536", PARTS,
        "The four pieces of a puppet of Meret, a girl of seventeen, facing three-quarters to the right: (1) the head "
        "with black hair in a long braid with a small lotus flower, kohl-lined dark almond eyes, a reed pen behind "
        "her ear, and the neck; (2) the body from the shoulders down to the feet, standing, in a simple white linen "
        "dress to the ankles with a turquoise and gold broad collar and simple sandals, with NO arms; (3) the right "
        "arm from shoulder to hand, holding a small clay oil lamp with a tiny flame; (4) the left arm from shoulder "
        "to an open hand."),
    "flat-temple": ("2048x1536", CUT,
        "A small riverside temple seen from the front: a gate with two lotus-bud columns, a flat roof with a low "
        "parapet, a plain painted wall with one band of simple striding figures in faded ochre and turquoise, a "
        "doorway with warm lamplight, and nine wide stone steps that go down from its right side. Bold, simple "
        "shapes. The bottom edge is straight."),
    "flat-waves": ("2304x768", CUT,
        "A long ground row of river water: rolling Art Nouveau waves in lapis blue and turquoise with cream crests "
        "and a few fine gold lines, bold simple shapes. The bottom edge is straight."),
    "flat-papyrus": ("2304x768", CUT,
        "A long ground row of tall papyrus reeds with fan-shaped heads and a few pink lotus flowers, in Nile green "
        "and dark green with thin gold edges, bold simple shapes. The bottom edge is straight."),
    "flat-dunes": ("2304x768", CUT,
        "A long distant horizon of low, smooth desert dunes with two small pyramids, bold simple shapes. The bottom "
        "edge is straight."),
    "flat-sky-mother": ("2304x1152", CUT,
        "The Sky Mother: a tall, slender woman made of the night sky who arches over the whole world like a bridge, "
        "her hands touching the ground on the left and her feet on the right, her long hair falling down. Her body "
        "is a deep lapis blue dotted with small gold and white stars, drawn as one graceful Art Nouveau arch."),
    "flat-crowd": ("2304x768", CUT,
        "A ground row of townsfolk of an ancient river town seen from behind, cheering with raised arms, some "
        "holding small lamps, cut as one bold connected shape. The bottom edge is straight."),
    "prop-barge": ("2048x1024", CUT,
        "A small gilded festival barge in side view, its prow on the right curling up into a lotus flower and its "
        "stern on the left curling up into a papyrus head. A little shrine amidships holds a glowing lamp. A long "
        "steering oar hangs at the stern. Hull in gold leaf, turquoise and terracotta bands."),
    "prop-sailboat": ("1536x1024", CUT,
        "A small ancient river boat in side view sailing to the right, with one tall white square sail on a mast and "
        "a curved wooden hull with a lotus prow."),
    "prop-sun": ("1024x1024", CUT,
        "The rising sun as a stage prop: a large disc of gold leaf with a soft rose-gold rim, ringed by short Art "
        "Nouveau rays shaped like lotus petals."),
    "prop-hero": ("1024x1536", CUT,
        "A hero from a temple wall painting as a flat figure in side view, striding to the right with a spear and a "
        "round shield, in a white kilt and a broad collar, painted in terracotta, gold and turquoise and outlined in "
        "dark umber like a wall painting."),
    "prop-mother": ("1024x1536", CUT,
        "Meret's mother, a tall, gentle woman standing and facing three-quarters to the left, in an indigo shawl "
        "over white linen, holding a small clay oil lamp with a tiny flame in both hands."),
    "prop-ibis": ("1024x1024", CUT,
        "A white ibis in flight in side view, flying to the right with its wings raised in a graceful arc, a long "
        "curved dark beak, black wing tips and thin gold lines along the feathers."),
    "prop-jars": ("1024x1024", CUT,
        "Two tall clay water jars of terracotta with simple painted turquoise bands, standing side by side."),
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

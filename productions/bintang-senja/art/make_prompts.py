#!/usr/bin/env python3
"""Write one prompt per art piece of Bintang Senja, and the job list for gen_art.sh.

  python productions/bintang-senja/art/make_prompts.py

Every prompt starts with the locked text of bible.md. Every piece is an edit with key-art.png as Image 1.
"""
import os, re

HERE = os.path.dirname(os.path.abspath(__file__))
LOCKED = re.search(r"<!-- locked:start -->\n(.*?)\n<!-- locked:end -->", open(os.path.join(HERE, "bible.md"), encoding="utf-8").read(), re.S).group(1)
REF = ("REFERENCES: Image 1 is the look reference. Match its gouache paint, gold leaf, raw cardboard edges, "
       "palette and figure style. Do not copy its composition.")
CUT = ("COMPOSITION: One single cardboard cutout seen straight from the front, on a transparent background. "
       "Clean hand-cut outline. No shadow, no stand, no rod, no other pieces, no stage, no curtains, no frame.")
PARTS = ("COMPOSITION: A flat lay of the separate cardboard pieces of ONE jointed rod puppet, all at the same scale, "
         "seen straight from the front on a transparent background. Each piece is a separate cutout with clear empty "
         "space around it. No piece touches or overlaps another piece. Each joint end has a small brass split pin. "
         "No shadow, no rod, no strings, no stand, no stage.")
PIECES = {
    "puppet-bayu": ("1536x1536", PARTS,
        "The four pieces of a puppet of Bayu, a young bugler, facing three-quarters to the right: (1) the head with "
        "short dark hair and a kind, determined face, and the neck; (2) the body from the shoulders down to the boots, "
        "standing, in plain brown leather armour with a rust red cloak and a short sword at the hip, with NO arms; "
        "(3) the right arm from shoulder to hand, holding a brass bugle by its body, the bell pointing forward; "
        "(4) the left arm from shoulder to an open hand."),
    "puppet-kirana": ("1536x1536", PARTS,
        "The four pieces of a puppet of Kirana, a fallen star in the shape of a young woman, facing three-quarters to "
        "the left: (1) the head with skin of pale warm gold and long hair of pale gold light streaming behind like the "
        "tail of a comet, and the neck; (2) the body from the shoulders down to the hem, standing, in a simple gown of "
        "dusk blue that fades to pale gold at the hem, with NO arms; (3) the right arm from shoulder to an open hand "
        "reaching forward; (4) the left arm from shoulder to a hand held at the heart."),
    "flat-fort": ("2048x1536", CUT,
        "Emberhill, a small stone fort on a rocky hill: one round watchtower with a pointed slate roof and a small red "
        "pennant, a short crenellated wall walk in front of it, a wooden gate, a few warm lit windows. Bold, simple "
        "shapes. The bottom edge of the hill is straight."),
    "flat-reeds": ("2304x768", CUT,
        "A long ground row of tall reeds and grasses with feathery tops, in reed olive and dark green, bold simple "
        "blade shapes. The bottom edge is straight."),
    "flat-peak": ("1536x1536", CUT,
        "The Stair of Winds: one tall, steep, lonely mountain peak with a zigzag path climbing it, snow near the top, "
        "bold simple shapes. The bottom edge is straight."),
    "flat-summit": ("2304x768", CUT,
        "A ground row of the rough rock summit of a high mountain, a broad flat-topped outcrop of grey stone with "
        "patches of snow, bold simple shapes. The bottom edge is straight."),
    "prop-hound": ("1536x1024", CUT,
        "One of the Hollow Hounds: a lean wolf of shadow in side view facing left, head low, snarling, painted soot "
        "black with dull slate edges, with two small glowing ember orange eyes."),
    "prop-star": ("1024x1024", CUT,
        "A star as a stage prop: a six-pointed star of pale gold leaf with a star white heart, painted with soft "
        "brush strokes."),
}


def main():
    os.makedirs(os.path.join(HERE, "prompts"), exist_ok=True)
    jobs = []
    for name, (size, comp, subject) in PIECES.items():
        prompt = f"{LOCKED}\n{REF}\nSUBJECT: {subject}\n{comp}\n"
        open(os.path.join(HERE, "prompts", f"{name}.prompt"), "w", encoding="utf-8").write(prompt)
        jobs.append(f"{name} {size} transparent")
    open(os.path.join(HERE, "prompts", "jobs.txt"), "w", newline="\n").write("\n".join(jobs) + "\n")
    print(f"{len(jobs)} prompts")


if __name__ == "__main__":
    main()

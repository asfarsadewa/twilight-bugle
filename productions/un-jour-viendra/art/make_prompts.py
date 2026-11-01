#!/usr/bin/env python3
"""Write one prompt per art piece of Un jour viendra, and the job list for gen_art.sh.

  python productions/un-jour-viendra/art/make_prompts.py

Every prompt starts with the locked text of bible.md. The key art is a plain generation. Every other piece is an
edit with key-art.png as Image 1.
"""
import os, re

HERE = os.path.dirname(os.path.abspath(__file__))
LOCKED = re.search(r"<!-- locked:start -->\n(.*?)\n<!-- locked:end -->", open(os.path.join(HERE, "bible.md"), encoding="utf-8").read(), re.S).group(1)
REF = ("REFERENCES: Image 1 is the look reference. Match its ink-wash painting, brush strokes, gold leaf, raw card "
       "edges, palette and figure style. Do not copy its composition.")
CUT = ("COMPOSITION: One single cardboard cutout seen straight from the front, on a transparent background. "
       "Clean hand-cut outline. No shadow, no stand, no rod, no other pieces, no stage, no curtains, no frame.")
PARTS = ("COMPOSITION: A flat lay of the separate cardboard pieces of ONE jointed rod puppet, all at the same scale, "
         "seen straight from the front on a transparent background. Each piece is a separate cutout with clear empty "
         "space around it. No piece touches or overlaps another piece. Each joint end has a small brass split pin. "
         "No shadow, no rod, no strings, no stand, no stage.")

KEY_ART = (
    "SUBJECT: Key art for the production. Inside a grand old toy theatre at dawn. The sky behind is a smooth glow "
    "from pale gold at the horizon up to misty blue-grey, with no painted detail. Tall misty ink mountains rise on "
    "both sides with twisted pines on the cliffs. On the left, a small mountain village gate with a curved tile roof "
    "above rice terraces. In the middle distance a long wall winds over the ridges. In the middle stands Shan, a "
    "young man as a jointed card rod puppet in a plain grey tunic and straw sandals, holding a broom of twigs "
    "upright like a banner pole and looking up. Above, a long ink dragon with gold-leaf scales and whiskers of mist "
    "curls through stylised clouds. A branch of plum blossom hangs in from the top left corner.\n"
    "COMPOSITION: The whole stage inside a toy theatre, seen from the audience, with a simple dark proscenium."
)

PIECES = {
    "puppet-shan": ("1536x1536", PARTS,
        "The four pieces of a puppet of Shan, a young man of eighteen, facing three-quarters to the right: (1) the "
        "head with black hair in a topknot tied with a grey cloth, a determined young face, and the neck; (2) the body "
        "from the shoulders down to the feet, standing, in a plain grey tunic and trousers with a cloth belt, a sprig of "
        "plum blossom tucked in the belt, straw sandals, with NO arms; (3) the right arm from shoulder to hand, holding "
        "a long broom of twigs upright by its handle, the broom twice as long as the arm; (4) the left arm from "
        "shoulder to an open hand."),
    "prop-mei": ("1024x1536", CUT,
        "Mei, a young woman standing and facing three-quarters to the right, in a pale blue dress with a red ribbon in "
        "her hair, holding a sprig of plum blossom in both hands."),
    "prop-officer": ("1024x1536", CUT,
        "A stern army officer in dark lacquered armour and a plumed helmet, standing and facing three-quarters to the "
        "right, holding out a broom of twigs in one hand."),
    "flat-soldiers": ("2048x1024", CUT,
        "A small group of four soldiers in armour laughing and pointing to the right, cut as one connected shape."),
    "flat-mountains": ("2304x768", CUT,
        "A long range of tall misty ink mountains with soft peaks that fade into mist, pale ink grey washes. The bottom "
        "edge is straight."),
    "flat-cliff": ("1024x1536", CUT,
        "A tall ink cliff with a twisted pine tree clinging to its top, wet black ink and grey washes. The bottom edge "
        "is straight."),
    "flat-village": ("2048x1536", CUT,
        "A small mountain village gate with a curved tile roof and two small houses on stepped rice terraces, with a "
        "few vermilion touches on the gate posts. The bottom edge is straight."),
    "flat-wall": ("2304x768", CUT,
        "A long ancient wall that winds over a mountain ridge, with one watchtower. The bottom edge is straight."),
    "flat-camp": ("2048x1536", CUT,
        "The courtyard gate of an imperial army camp: a heavy wooden gate under a curved tile roof, two tall banner "
        "poles with vermilion flags, and a stone step. The bottom edge is straight."),
    "flat-army": ("2304x768", CUT,
        "A long ground row of an army marching to the right, with spears and tall banners, many soldiers overlapping "
        "as one bold connected shape, wet black ink in front fading to grey at the back. The bottom edge is straight."),
    "flat-clouds": ("2304x768", CUT,
        "A long row of stylised Chinese clouds with curling ruyi shapes, pale grey wash with fine ink outlines and a "
        "few gold leaf edges."),
    "flat-plum": ("2048x1024", CUT,
        "A branch of plum blossom that reaches in from the top left: a dark, twisted ink branch with pink and "
        "vermilion blossoms and a few gold-leaf stamens."),
    "prop-dragon": ("2304x1024", CUT,
        "A long Chinese dragon flying to the right in a graceful S curve. Its body is black ink and grey cloud, with "
        "scales and whiskers touched in gold leaf, golden eyes, four small claws and a flowing mane of mist."),
    "prop-crane": ("1024x1024", CUT,
        "A red-crowned crane in flight with its wings spread, flying to the right, painted in ink with a vermilion crown."),
    "prop-moon": ("1024x1024", CUT,
        "A full moon as a stage prop: a pale rice-paper disc with a soft ink-wash rim and faint grey shadows."),
    "prop-banner": ("1024x1536", CUT,
        "A tall war banner on a long pole: a long vermilion silk banner with a gold dragon on it, fluttering to the right."),
    "prop-buckets": ("1536x768", CUT,
        "A carrying pole across the shoulders, with a wooden water bucket hanging from each end."),
    "prop-lanterns": ("2048x768", CUT,
        "A row of five round red paper lanterns hanging from one cord, glowing warm from inside."),
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

#!/usr/bin/env python3
"""Write one prompt per art piece of Держись, лёд, and the job list for gen_art.sh.

  python productions/derzhis-lyod/art/make_prompts.py

Every prompt starts with the locked text of bible.md. The key art is a plain generation. Every other piece is an
edit with key-art.png as Image 1.
"""
import os, re

HERE = os.path.dirname(os.path.abspath(__file__))
LOCKED = re.search(r"<!-- locked:start -->\n(.*?)\n<!-- locked:end -->", open(os.path.join(HERE, "bible.md"), encoding="utf-8").read(), re.S).group(1)
REF = ("REFERENCES: Image 1 is the look reference. Match its Palekh lacquer miniature painting, black lacquer ground, "
       "gold hatching, palette, raw card edges and figure style. Do not copy its composition.")
CUT = ("COMPOSITION: One single cardboard cutout seen straight from the front, on a transparent background. "
       "Clean hand-cut outline. No shadow, no stand, no rod, no other pieces, no stage, no curtains, no frame.")
PARTS = ("COMPOSITION: A flat lay of the separate cardboard pieces of ONE jointed puppet, all at the same scale, "
         "seen straight from the front on a transparent background. Each piece is a separate cutout with clear empty "
         "space around it. No piece touches or overlaps another piece. No shadow, no rod, no strings, no stand, no stage.\n"
         "JOINTS: The body has three clearly visible round brass split pins: one at the centre of the base of the neck "
         "and one on each shoulder. The body ends at the neck base with no head and has no arms. The head piece ends in "
         "a bare neck with no collar, with one brass pin at the bottom of the neck. Each arm piece has one brass pin at "
         "the very top of the shoulder. One arm is a RIGHT arm and the other is a LEFT arm, each hanging straight down "
         "from its shoulder pin, with the thumbs on the correct sides. The head is drawn at a natural size for the body.")

KEY_ART = (
    "SUBJECT: Key art for the production. Inside a grand old toy theatre on a winter night. The sky behind is a "
    "smooth deep night blue glow with no painted detail. A wide frozen lake stretches to a far shore. A road of small "
    "lanterns on posts crosses the ice. An old unmarked 1940s canvas-covered truck drives across the ice with its cab "
    "door open and a dim gold light in the cab. A young driver in a quilted jacket and a plain fur cap with ear flaps and no badge leans "
    "out of the open door. A little girl wrapped in a big shawl sits beside him. A girl in a sheepskin coat stands on "
    "the ice and holds up a lantern.\n"
    "COMPOSITION: The whole stage inside a toy theatre, seen from the audience, with a simple dark proscenium."
)

PIECES = {
    "puppet-alyosha": ("1536x1536", PARTS,
        "The four pieces of a marionette of Alyosha, a thin young Russian truck driver of nineteen in the winter of "
        "1941, facing three-quarters to the right: (1) the head with a plain grey fur cap with ear flaps tied up and NO badge, a thin "
        "hollow-cheeked young face, and the bare neck; (2) the body from the neck base down to grey felt boots, in a "
        "dark quilted padded jacket belted at the waist, quilted trousers, standing, with NO arms; (3) his RIGHT arm "
        "from shoulder to a hand in a thick mitten, quilted sleeve; (4) his LEFT arm from shoulder to a hand in a thick "
        "mitten, quilted sleeve."),
    "puppet-masha": ("1536x1536", PARTS,
        "The four pieces of a marionette of Masha as a grown woman of thirty in the 1960s, facing three-quarters to "
        "the left: (1) the head with fair hair under a plain grey headscarf, a calm grave face, and the bare neck; (2) "
        "the body from the neck base down to plain boots, in a long grey wool coat buttoned down the front, standing, "
        "with NO arms; (3) her RIGHT arm from shoulder to an open bare hand, grey coat sleeve; (4) her LEFT arm from "
        "shoulder to an open bare hand, grey coat sleeve."),
    "prop-masha": ("1024x1536", CUT,
        "A thin little Russian girl of nine in the winter of 1941, wrapped from head to knees in a big brown and "
        "crimson patterned wool shawl, felt boots, a pale thin face with big eyes, standing and facing three-quarters "
        "to the right, her small hands holding the shawl closed."),
    "prop-mother": ("1536x1536", CUT,
        "A thin Russian mother of forty in the winter of 1941, in an old dark shawl over a quilted jacket, sitting on "
        "a wooden chair at the end of a small bare table, facing three-quarters to the right, cutting a small dark "
        "piece of bread into three with a knife. A small oil lamp burns on the table. The bottom edge is straight."),
    "prop-mother-still": ("1536x1536", CUT,
        "The same thin Russian mother in her old dark shawl, sitting still in the wooden chair at the end of the small "
        "bare table, her head bowed, her eyes closed, the shawl drawn round her, her hands in her lap. A small piece of "
        "dark bread lies untouched on the table beside a cold oil lamp. The bottom edge is straight."),
    "prop-scale": ("1024x1024", CUT,
        "A small old brass shop balance scale with two pans. A small square of dark bread lies on one pan, a little "
        "brass weight on the other."),
    "prop-carry": ("1024x1536", CUT,
        "The same young driver in a dark quilted jacket, plain fur cap with ear flaps and no badge and felt boots, walking to the right "
        "and carrying his little sister in his arms against his chest, she wrapped completely in a grey blanket with "
        "only her pale face showing, her head on his shoulder."),
    "flat-room": ("2304x1024", CUT,
        "The inside wall of a cold city room in the winter of 1941: tall window glazed with thick white frost and "
        "taped in crosses of paper strips, a cold tiled stove in the corner, faded wallpaper, a bare wooden shelf, "
        "no pictures and no portraits. The bottom edge is straight."),
    "flat-city": ("2304x768", CUT,
        "A long row of the dark buildings of a great snowy northern city along a frozen river embankment at night: "
        "classical facades, tall dark windows, snow on the roofs, NO church domes, NO spires, NO crosses, no lit "
        "windows. The bottom edge is straight."),
    "flat-lake": ("2304x768", CUT,
        "A wide frozen lake under snow running to a low far shore with a dark line of forest, the ice in pale frost "
        "blue and white with gold hatching, ridges of piled ice. The bottom edge is straight."),
    "prop-ice": ("2304x768", CUT,
        "A long low ground row of rough lake ice with pressure ridges, broken slabs and snow, fine cracks, frost blue "
        "and white with gold hatching. The top edge is uneven. The bottom edge is straight."),
    "prop-thaw": ("2304x768", CUT,
        "A long low ground row of thawing lake ice in spring: grey wet ice with wide pools of dark water on top, open "
        "black cracks, broken slabs tilting. The bottom edge is straight."),
    "prop-truck": ("1536x1024", CUT,
        "An old unmarked 1940s Russian one-and-a-half-ton truck seen exactly from the side, driving to the right: a "
        "rounded bonnet, round headlamps, a small wooden cab with its door wide open, a dim gold light inside the cab, "
        "a flat bed loaded with tied white flour sacks under a loose canvas, snow on the mudguards, chains on the "
        "wheels. NO markings, NO stars, no numbers, no number plate. The bottom edge is straight under the wheels."),
    "flat-convoy": ("2304x768", CUT,
        "A long line of small unmarked 1940s canvas-covered trucks far away on the ice, one behind the other, driving "
        "to the right, each with one dim gold light, snow blowing. No markings. The bottom edge is straight."),
    "prop-guard": ("1024x1536", CUT,
        "A young Russian woman traffic guard on the ice in a long sheepskin coat, a plain fur cap with no badge and felt boots, standing "
        "and facing three-quarters to the left, holding up a glowing oil lantern in her raised right hand. No badges, "
        "no insignia, no weapon."),
    "prop-posts": ("2304x768", CUT,
        "A long row of thin wooden posts standing in the snow on the ice at even spaces, each with a small oil lantern "
        "hanging from it, the lanterns glowing gold. The bottom edge is straight."),
    "flat-children": ("2304x768", CUT,
        "A long line of thin small Russian children of the winter of 1941 wrapped in blankets and shawls, holding "
        "hands, walking in single file to the right, seen from the side, cut as one connected shape. The bottom edge "
        "is straight."),
    "flat-shore": ("2304x1024", CUT,
        "The far shore of the lake in winter: white birch trees in snow, a small wooden railway platform with a low "
        "wooden station hut, a lamp post with a gold light. No signs, no writing. The bottom edge is straight."),
    "prop-train": ("2304x768", CUT,
        "A short old steam train seen exactly from the side, steaming to the right: a dark locomotive with smoke and "
        "three brown wooden wagons with small lit windows. NO markings, no stars, no numbers. The bottom edge is "
        "straight."),
    "flat-water": ("2304x768", CUT,
        "A wide open lake in summer under a pale evening sky glow: calm grey-blue water with gold hatching on the "
        "small waves, a low far shore of forest, reeds at the near edge. The bottom edge is straight."),
    "prop-clouds": ("2304x768", CUT,
        "A long row of heavy snow clouds in deep blue and grey with fine gold hatching, flat and decorative."),
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

#!/usr/bin/env python3
"""Write one prompt per art piece of ふるさとが見える, and the job list for gen_art.sh.

  python productions/furusato-ga-mieru/art/make_prompts.py

Every prompt starts with the locked text of bible.md. The key art is a plain generation. Every other piece is an
edit with key-art.png as Image 1.
"""
import os, re

HERE = os.path.dirname(os.path.abspath(__file__))
LOCKED = re.search(r"<!-- locked:start -->\n(.*?)\n<!-- locked:end -->", open(os.path.join(HERE, "bible.md"), encoding="utf-8").read(), re.S).group(1)
REF = ("REFERENCES: Image 1 is the look reference. Match its Meiji nishiki-e woodblock printing, black key lines, flat "
       "colour, bokashi, wood grain, palette, raw card edges and figure style. Do not copy its composition.")
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
CARRY = ("COMPOSITION: A flat lay of the three separate cardboard pieces of ONE jointed puppet, all at the same scale, "
         "seen straight from the front on a transparent background. Each piece is a separate cutout with clear empty "
         "space around it. No piece touches or overlaps another piece. No shadow, no rod, no strings, no stand, no stage.\n"
         "JOINTS: The body piece has two clearly visible round brass split pins: one at the base of the man's neck and "
         "one at the base of the girl's neck. The body piece has NO heads. Each head piece ends in a bare neck with one "
         "brass pin at the bottom of the neck. The heads are drawn at a natural size for the body.")

KEY_ART = (
    "SUBJECT: Key art for the production. Inside a grand old toy theatre on a winter night. The sky behind is a "
    "smooth deep indigo glow with no painted detail. Steep snowy mountains rise in layers, with a narrow path "
    "climbing to a pass. Snow falls. On the path a young Japanese peasant man in a straw rain cape and a wide bamboo "
    "hat climbs with his thin teenage sister on his back, her head on his shoulder, in a faded red and blue kimono. "
    "Far below in the valley, one thatched farmhouse has a small warm lit window. Snowy cedars stand at the front.\n"
    "COMPOSITION: The whole stage inside a toy theatre, seen from the audience, with a simple dark proscenium."
)

PIECES = {
    "puppet-hana": ("1536x1536", PARTS,
        "The four pieces of a marionette of Hana, a Japanese silk-mill girl of sixteen in the Meiji era, facing "
        "three-quarters to the right: (1) the head with black hair tied back plainly, a thin gentle pale face, and the "
        "bare neck; (2) the body from the neck base down to straw sandals, in a faded kasuri kimono of indigo with a "
        "red under-collar, a plain dark apron, sleeves tied back with a red cord, standing, with NO arms; (3) her RIGHT "
        "arm from shoulder to a thin open hand, the indigo sleeve tied back; (4) her LEFT arm from shoulder to a thin "
        "open hand, the indigo sleeve tied back."),
    "puppet-kichi": ("1536x1536", PARTS,
        "The four pieces of a marionette of Kichi, a strong young Japanese peasant man of twenty in the Meiji era, "
        "facing three-quarters to the left: (1) the head with short black hair, a wide flat bamboo sedge hat, a "
        "steady weathered face, and the bare neck; (2) the body from the neck base down to straw boots, in a thick "
        "straw rain cape over an indigo work jacket, dark leggings wrapped with cord, standing, with NO arms; (3) his "
        "RIGHT arm from shoulder to a strong open hand, indigo sleeve; (4) his LEFT arm from shoulder to a strong open "
        "hand, indigo sleeve."),
    "puppet-carry": ("1536x1536", CARRY,
        "The three pieces of a puppet of a young Japanese peasant man carrying his thin teenage sister on his back, "
        "seen from the side, walking and climbing to the right, bent forward: (1) the body piece: the man in a thick "
        "straw rain cape, indigo jacket, dark leggings and straw boots, his arms holding her legs at his sides; the "
        "girl on his back in a faded indigo kasuri kimono with a red under-collar, her arms hanging over his "
        "shoulders; NO heads; (2) the man's head facing right, in a wide bamboo sedge hat, with a steady face; (3) the "
        "girl's head with black hair tied back, eyes closed, a pale thin face, made to rest on his shoulder."),
    "prop-hana-sit": ("1024x1024", CUT,
        "The same thin Japanese girl of sixteen in a faded indigo kasuri kimono with a red under-collar, sitting in "
        "the snow with her legs to one side, leaning a little, her hands in her lap, her face turned up and to the "
        "left with a faint calm smile, a little snow on her shoulders. The bottom edge is straight."),
    "prop-yuki": ("1024x1536", CUT,
        "A small Japanese peasant girl of twelve in the Meiji era, in a short indigo and red kasuri kimono, straw "
        "sandals and a cloth bundle tied on her back, standing and facing three-quarters to the right."),
    "prop-mother": ("1024x1536", CUT,
        "A tired Japanese peasant mother of forty in the Meiji era, in a patched dark indigo kimono and a plain "
        "headcloth, standing and holding out a rice ball wrapped in a leaf with both hands, facing three-quarters to "
        "the right."),
    "flat-farmhouse": ("1536x1024", CUT,
        "A small poor thatched Japanese mountain farmhouse with a steep heavy thatched roof deep in snow, dark wooden "
        "walls, a sliding wooden door, and one small paper window glowing warm gold. The bottom edge is straight."),
    "flat-mill": ("2304x1024", CUT,
        "The inside wall of a great Meiji-era silk reeling mill: a long hall of red brick and white plaster with "
        "heavy wooden roof trusses, a row of tall arched windows, long iron drive shafts and pulleys along the top "
        "with belts hanging down, no signs. The bottom edge is straight."),
    "prop-reel": ("1024x1024", CUT,
        "One wooden silk reeling wheel of a Meiji mill, seen straight from the front: a hexagonal wooden reel with "
        "six spokes, a brass hub and white raw silk wound around its rim. A round shape."),
    "flat-reelers": ("2304x768", CUT,
        "A long row of young Japanese mill girls in indigo kimonos with sleeves tied back, sitting at a line of "
        "steaming copper basins full of white cocoons, drawing fine silk threads up to the reels, seen from the "
        "front, cut as one connected shape. The bottom edge is straight."),
    "flat-gate": ("1536x1536", CUT,
        "A tall heavy gate of a Meiji silk mill: two brick gate posts with plain stone caps and a pair of closed "
        "heavy wooden doors with iron studs, no signs and no writing. The bottom edge is straight."),
    "prop-porters": ("1536x1024", CUT,
        "Two Japanese porters in short indigo coats and headbands carrying a wooden door board between them on their "
        "shoulders, walking to the left. A thin girl lies on the board under a patched quilt, her face pale. The "
        "bottom edge is straight."),
    "flat-range": ("2304x768", CUT,
        "A long row of far snowy mountains in layers, in Prussian blue and white with bokashi, with a low notch of a "
        "pass in the middle. The bottom edge is straight."),
    "flat-slope": ("2304x1024", CUT,
        "The steep snowy slope of a mountain pass rising from the bottom left to a high summit at the right, with a "
        "narrow zigzag footpath in the snow, a few dark rocks and small bent pines, and one weathered stone marker "
        "with no writing at the summit. The bottom edge is straight."),
    "flat-valley": ("2304x768", CUT,
        "A small poor mountain valley seen from high above in snow: terraced rice fields under snow, a few scattered "
        "thatched farmhouses, a frozen stream and bare trees. The bottom edge is straight."),
    "flat-girls": ("2304x768", CUT,
        "A long line of small Japanese peasant girls of twelve to fifteen in straw rain capes and hats with bundles "
        "on their backs, walking in single file to the right through deep snow, tied to each other with one long "
        "rope at the waist, seen from the side, cut as one connected shape. The bottom edge is straight."),
    "flat-cedars": ("2304x768", CUT,
        "A long ground row of tall dark Japanese cedars heavy with snow, their branches bent, with drifts at their "
        "feet. The bottom edge is straight."),
    "prop-sun": ("1024x1024", CUT,
        "A dawn sun as a stage prop: a plain round disc of pale gold with a soft white rim. No rays, no red."),
    "prop-bell": ("1024x1024", CUT,
        "A small bronze bell hanging from a wooden post with a cross beam and a short rope pull."),
    "prop-lamp": ("1024x1024", CUT,
        "A small Japanese paper floor lamp, an andon, with a wooden frame and paper sides glowing warm gold."),
    "prop-clouds": ("2304x768", CUT,
        "A long row of heavy snow clouds in grey and Prussian blue with bokashi, flat and decorative in the woodblock "
        "manner."),
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

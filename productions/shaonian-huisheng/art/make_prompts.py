#!/usr/bin/env python3
"""Write one prompt per art piece of 少年回声, and the job list for gen_art.sh.

  python productions/shaonian-huisheng/art/make_prompts.py

Every prompt starts with the locked text of bible.md. The key art is a plain generation. Every other piece is an
edit with key-art.png as Image 1.
"""
import os, re

HERE = os.path.dirname(os.path.abspath(__file__))
LOCKED = re.search(r"<!-- locked:start -->\n(.*?)\n<!-- locked:end -->", open(os.path.join(HERE, "bible.md"), encoding="utf-8").read(), re.S).group(1)
REF = ("REFERENCES: Image 1 is the look reference. Match its ballpoint outlines, coloured pencil hatching, ruled exercise "
       "paper, palette, raw card edges and figure style. Do not copy its composition.")
CUT = ("COMPOSITION: One single cardboard cutout seen straight from the front, on a transparent background. "
       "Clean hand-cut outline. No shadow, no stand, no rod, no other pieces, no stage, no curtains, no frame.")
PARTS = ("COMPOSITION: A flat lay of the separate cardboard pieces of ONE jointed puppet, all at the same scale, "
         "seen straight from the front on a transparent background. Each piece is a separate cutout with clear empty "
         "space around it. No piece touches or overlaps another piece. No shadow, no rod, no strings, no stand, no stage.\n"
         "JOINTS: The body has three clearly visible round brass split pins: one at the centre of the base of the neck "
         "and one on each shoulder. The body ends at the neck base with no head and has no arms. The head piece ends in "
         "a bare neck with no collar, with one brass pin at the bottom of the neck. Each arm piece has one brass pin at "
         "the very top of the shoulder. One arm is a RIGHT arm and the other is a LEFT arm, with the thumbs on the "
         "correct sides. The head is drawn at a natural size for the body.")
ROW = "The bottom edge is straight."
SUIT = "a loose blue-and-white Chinese school tracksuit with white stripes down the sleeves and trousers, white sneakers"

KEY_ART = (
    "SUBJECT: Key art for the production. Inside a grand old toy theatre in the golden late afternoon. The sky behind "
    "is a smooth glow from warm gold to soft blue, with no painted detail. At the back, a Chinese middle school of the "
    "1990s: a three-storey building of pale tiles with long corridors, and two tall plane trees. In front, an outdoor "
    "concrete basketball court with an old metal hoop. Three Chinese boys of fourteen in " + SUIT + " run after a "
    "basketball, laughing. At the front, a grown man in a dark work jacket over a white shirt, as a jointed card "
    "marionette, holds an old dented biscuit tin and watches them with a soft smile.\n"
    "COMPOSITION: The whole stage inside a toy theatre, seen from the audience, with a simple dark proscenium."
)

PIECES = {
    "puppet-man": ("1536x1536", PARTS,
        "The four pieces of a marionette of Xiaoyu, a grown Chinese man in his thirties, facing three-quarters to the "
        "right: (1) the head with short black hair, a gentle tired face with a soft smile, and the bare neck; (2) the "
        "body from the neck base down to dark leather shoes, a dark grey work jacket open over a white shirt with no tie, "
        "dark trousers, standing, with NO arms; (3) his RIGHT arm from shoulder to an open hand, dark sleeve; (4) his "
        "LEFT arm from shoulder to a hand holding a small old dented round biscuit tin, dark sleeve."),
    "puppet-boy": ("1536x1536", PARTS,
        "The four pieces of a marionette of young Xiaoyu, a Chinese boy of fourteen, facing three-quarters to the left: "
        "(1) the head with messy short black hair, a bright cheeky face and the bare neck; (2) the body from the neck "
        "base down to white sneakers, in " + SUIT + ", standing, with NO arms; (3) his RIGHT arm from shoulder to a hand "
        "holding a small blank white envelope, blue-and-white sleeve; (4) his LEFT arm from shoulder to an open "
        "waving hand, blue-and-white sleeve."),
    "flat-city": ("2304x1024", CUT,
        "A Chinese city at night: rows of tall apartment blocks with many small lit windows, a few balconies with "
        "plants and laundry, and an overpass. No signs, no writing. " + ROW),
    "flat-school": ("2304x1024", CUT,
        "A Chinese middle school building of the 1990s: three storeys of pale tiles with long open corridors and blue "
        "railings, rows of windows, a clock with no numbers, and two tall plane trees in front. No signs, no writing, no "
        "flags. " + ROW),
    "flat-court": ("2304x768", CUT,
        "A long low ground row of an outdoor school basketball court: cracked concrete with faded painted lines, an old "
        "metal basketball hoop on a pole at the left, a low green fence, and three bicycles leaning at the right. " + ROW),
    "flat-tree": ("1536x1536", CUT,
        "A big old plane tree with a broad crown of green leaves, a thick mottled trunk, and a little mound of fresh "
        "earth at its foot. " + ROW),
    "flat-corridor": ("2304x1024", CUT,
        "A long old school corridor seen from the side: square pillars, a terrazzo floor, old wooden windows with "
        "green frames along a pale wall, and a blackboard on the wall with only chalk doodles of a sun and a paper "
        "plane, no writing. " + ROW),
    "flat-station": ("2304x1024", CUT,
        "A small Chinese railway station platform at night: a long platform roof on iron posts, a bench, old lamps "
        "glowing warm, and rails in front. No signs, no writing. " + ROW),
    "prop-train": ("2304x768", CUT,
        "An old green Chinese passenger train of the 1990s seen from the side, three green carriages with a yellow "
        "stripe and rows of lit windows, one boy in a blue-and-white tracksuit leaning out of a window waving. No "
        "writing, no numbers. " + ROW),
    "prop-desk": ("1536x1024", CUT,
        "An old wooden Chinese school desk for two, scratched and worn, with names scratched into the top shown only as "
        "scribbles with no readable characters, and a little carved star."),
    "prop-light": ("1024x1536", CUT,
        "A tall old court floodlight: a metal pole with one big lamp head at the top, glowing warm white."),
    "prop-boys-run": ("2048x1024", CUT,
        "Three Chinese boys of fourteen in " + SUIT + " running to the right after a basketball, laughing, cut as one "
        "connected shape: one stocky boy dribbling the ball, one tall thin boy with glasses, one boy with messy hair."),
    "prop-fall": ("1024x1024", CUT,
        "A stocky Chinese boy of fourteen in " + SUIT + " sitting on the ground holding a scraped knee with a little red "
        "scrape, laughing out loud, a basketball beside him."),
    "prop-girl": ("1024x1536", CUT,
        "A Chinese girl of fourteen with a high ponytail in " + SUIT + ", standing and facing three-quarters to the "
        "right, holding her exercise books to her chest, with a shy quiet smile."),
    "prop-bikes": ("2304x1024", CUT,
        "Three Chinese boys of fourteen in " + SUIT + " riding old black bicycles side by side to the right, school bags "
        "on their backs, laughing, cut as one connected shape. " + ROW),
    "prop-tin": ("1024x1024", CUT,
        "An old dented round biscuit tin with a faded flower pattern, its lid open, holding three folded letters with "
        "no visible writing."),
    "prop-reunion": ("2304x1024", CUT,
        "Two grown Chinese men in their thirties walking onto a court and smiling, in casual clothes: a stocky man in a "
        "worn jacket holding a basketball under his arm, and a tall thin man with glasses in a sweater, raising one hand "
        "in greeting. Cut as one connected shape. " + ROW),
    "prop-clouds": ("2304x768", CUT,
        "A long row of soft round clouds drawn in coloured pencil, white and pale blue, flat and decorative."),
    "prop-sun": ("1024x1024", CUT,
        "A low afternoon sun as a stage prop: a round disc of warm gold coloured pencil with soft hatching. No rays."),
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

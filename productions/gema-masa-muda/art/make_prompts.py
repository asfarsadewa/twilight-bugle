#!/usr/bin/env python3
"""Write one prompt per art piece of Gema Masa Muda, and the job list for gen_art.sh.

  python productions/gema-masa-muda/art/make_prompts.py

Every prompt starts with the locked text of bible.md. The key art is a plain generation. Every other piece is an
edit with key-art.png as Image 1.
"""
import os, re

HERE = os.path.dirname(os.path.abspath(__file__))
LOCKED = re.search(r"<!-- locked:start -->\n(.*?)\n<!-- locked:end -->", open(os.path.join(HERE, "bible.md"), encoding="utf-8").read(), re.S).group(1)
REF = ("REFERENCES: Image 1 is the look reference. Match its old textbook gouache and ink, halftone print, palette, "
       "raw card edges and figure style. Do not copy its composition.")
CUT = ("COMPOSITION: One single cardboard cutout seen straight from the front, on a transparent background. "
       "Clean hand-cut outline. No shadow, no stand, no rod, no other pieces, no stage, no curtains, no frame.")
PARTS = ("COMPOSITION: A flat lay of the separate cardboard pieces of ONE jointed puppet, all at the same scale, "
         "seen straight from the front on a transparent background. Each piece is a separate cutout with clear empty "
         "space around it. No piece touches or overlaps another piece. No shadow, no rod, no strings, no stand, no stage.\n"
         "JOINTS: The body has three clearly visible round brass split pins: one at the centre of the base of the neck "
         "and one on each shoulder. The body ends at the neck base with no head and has no arms. The head piece ends in "
         "a bare neck with no collar, with one brass pin at the bottom of the neck. Each arm piece has one brass pin at "
         "the very top of the shoulder. The head is drawn at the same scale as the body, a normal adult size for the body.")

KEY_ART = (
    "SUBJECT: Key art for the production. Inside a grand old toy theatre in the golden late afternoon. The sky behind "
    "is a smooth glow from warm gold to soft blue, with no painted detail. At the back stands a simple one-storey "
    "Indonesian junior high school building with a red tiled roof and white walls, and a big flame tree with red "
    "flowers. In front lies a dusty golden school field with a small football goal. Three school children in white "
    "shirts and navy shorts or skirts run across the field laughing, one boy with a cap, one girl with two braids. At "
    "the front stands a grown man in a white shirt with rolled sleeves and a loose tie, as a jointed card marionette, "
    "watching them with a tender smile, one hand on an old wooden school desk.\n"
    "COMPOSITION: The whole stage inside a toy theatre, seen from the audience, with a simple dark proscenium."
)

PIECES = {
    "puppet-dimas": ("1536x1536", PARTS,
        "The four pieces of a marionette of Dimas, a grown Indonesian man in his thirties, facing three-quarters to the "
        "right: (1) the head with short black hair, a gentle tired face with a soft smile, and the bare neck; (2) the body "
        "from the neck base down to dark shoes, a white work shirt with a loose dark red tie, dark grey trousers, and a "
        "worn canvas bag strap across the chest, standing, with NO arms; (3) the right arm from shoulder to an open hand, "
        "white sleeve rolled to the forearm; (4) the left arm from shoulder to a relaxed hand, white sleeve rolled to the "
        "forearm."),
    "puppet-kid": ("1536x1536", PARTS,
        "The four pieces of a marionette of young Dimas, an Indonesian boy of fourteen, facing three-quarters to the left: "
        "(1) the head with messy short black hair, a bright cheeky face and the bare neck; (2) the body from the neck base "
        "down to black school shoes and white socks, a white short-sleeved school shirt untucked, navy blue shorts, and a "
        "small school bag strap, standing, with NO arms; (3) the right arm from a short white sleeve to an open hand "
        "holding a small blank white envelope; (4) the left arm from a short white sleeve to an open waving hand. The head "
        "is a boy's size for this body."),
    "prop-desk": ("1536x1024", CUT,
        "An old wooden school desk for two, seen from the front at a slight angle, with a lifting lid, scratched and worn, "
        "with small carved scratches and a little carved heart on the top, and an old ink well hole."),
    "prop-lamp": ("1024x1024", CUT,
        "A single old enamel classroom lamp shade hanging from a short cord, dark green outside and glowing warm inside."),
    "flat-school": ("2304x1024", CUT,
        "A simple one-storey Indonesian junior high school building of the 1990s: white walls, a long red tiled roof, a "
        "row of green wooden doors and windows with louvres, a covered walkway, a small bell hanging at one end, and a "
        "plain empty flagpole. The bottom edge is straight."),
    "flat-field": ("2304x768", CUT,
        "A long low ground row of a dusty golden school field: worn grass and bare ochre earth, a small white football "
        "goal at the left, a pair of bicycles leaning at the right, low tufts of grass. The bottom edge is straight."),
    "flat-flametree": ("1536x1536", CUT,
        "A big flame tree, a flamboyan, with a wide umbrella crown full of bright red flowers and fine green leaves, and "
        "a thick trunk. The bottom edge is straight."),
    "flat-blackboard": ("2048x1024", CUT,
        "An old school blackboard on a wooden frame with a chalk ledge holding chalk and an eraser. On the board are only "
        "simple chalk doodles: a smiling sun, a paper plane, a little house, a star and a few swirls. No writing, no "
        "letters, no numbers."),
    "flat-corridor": ("2304x1024", CUT,
        "A long worn school corridor seen from the side: a row of square pillars, tiled floor, old louvred windows and "
        "doors along a white wall with peeling paint, and potted plants. The bottom edge is straight."),
    "prop-kids-run": ("2048x1024", CUT,
        "Three Indonesian school children running to the right across a field, laughing, cut as one connected shape: a "
        "boy with a backwards cap and white shirt and navy shorts, a girl with two braids in a white blouse and navy "
        "skirt, and a boy with messy hair and an untucked white shirt and navy shorts."),
    "prop-ardi-fall": ("1024x1024", CUT,
        "An Indonesian schoolboy with a backwards cap sitting on the ground, holding his scraped knee with a little red "
        "scrape, laughing out loud, in a white shirt and navy shorts."),
    "prop-sari": ("1024x1536", CUT,
        "An Indonesian schoolgirl of fourteen with two braids, in a white blouse and navy skirt, standing and facing "
        "three-quarters to the right, holding her school books to her chest, with a shy quiet smile."),
    "prop-ardi": ("1024x1536", CUT,
        "An Indonesian schoolboy of fourteen with a backwards cap, in a white shirt and navy shorts, a bag over one "
        "shoulder, standing and facing three-quarters to the left, waving goodbye with one raised hand and a brave smile."),
    "prop-class": ("2304x1024", CUT,
        "A class photo pose: two rows of Indonesian junior high school children in white shirts and navy shorts or "
        "skirts, the front row sitting on a bench and the back row standing, all smiling at the viewer, cut as one "
        "connected shape. The bottom edge is straight."),
    "prop-bus": ("2048x1024", CUT,
        "An old Indonesian intercity bus of the 1990s seen from the side, driving to the right, painted cream and red "
        "with stripes, luggage tied on the roof, a boy's hand waving from one open window. No writing."),
    "prop-planes": ("2048x768", CUT,
        "Five white paper planes folded from lined school paper, spread in a loose line as if flying to the right, cut "
        "as five separate small shapes joined by a thin thread."),
    "prop-clouds": ("2304x768", CUT,
        "A long row of soft round gouache clouds in cream and pale blue, flat and decorative."),
    "prop-sun": ("1024x1024", CUT,
        "A low afternoon sun as a stage prop: a round disc of warm gold with soft halftone dots and a lighter rim. No rays."),
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

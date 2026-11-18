#!/usr/bin/env python3
"""Write one prompt per art piece of Finché c'è luce, and the job list for gen_art.sh.

  python productions/finche-ce-luce/art/make_prompts.py

Every prompt starts with the locked text of bible.md. The key art is a plain generation. Every other piece is an
edit with key-art.png as Image 1. The tower is one painting that prepare.py cuts into four drums.
"""
import os, re

HERE = os.path.dirname(os.path.abspath(__file__))
LOCKED = re.search(r"<!-- locked:start -->\n(.*?)\n<!-- locked:end -->", open(os.path.join(HERE, "bible.md"), encoding="utf-8").read(), re.S).group(1)
REF = ("REFERENCES: Image 1 is the look reference. Match its naive ex-voto tempera, flat colour, curling waves, varnish "
       "patina, palette, raw card edges and figure style. Do not copy its composition.")
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
ROW = "The bottom edge is straight."

KEY_ART = (
    "SUBJECT: Key art for the production. Inside a grand old toy theatre at night in a storm. The sky behind is a "
    "smooth dark slate glow with no painted detail. On a rocky headland at the right stands a tall white stone "
    "lighthouse with an iron lantern room, and a long beam of warm light reaches out across the sea. Rows of "
    "curling waves with white crests fill the front. Small fishing boats with cream and red sails pitch on the "
    "waves, coming home towards the light. On the gallery of the lighthouse, a fisherman builder in a white shirt and "
    "brown waistcoat, as a jointed card marionette, turns a great wooden wheel. Below, a woman in a dark shawl climbs "
    "the stone steps carrying an oil can.\n"
    "COMPOSITION: The whole stage inside a toy theatre, seen from the audience, with a simple dark proscenium."
)

PIECES = {
    "puppet-matteo": ("1536x1536", PARTS,
        "The four pieces of a marionette of Matteo, a strong Italian fisherman and stonemason of about forty, facing "
        "three-quarters to the right: (1) the head with dark curly hair greying at the temples, a full moustache, a "
        "weathered steady face, and the bare neck; (2) the body from the neck base down to heavy boots, in a white "
        "shirt with rolled sleeves, a brown wool waistcoat, a red sash at the waist, dark trousers, standing, with NO "
        "arms; (3) his RIGHT arm from shoulder to a strong hand closed in a grip, as if on a rope or a wheel handle, "
        "white rolled sleeve; (4) his LEFT arm from shoulder to an open hand, white rolled sleeve."),
    "puppet-lucia": ("1536x1536", PARTS,
        "The four pieces of a marionette of Lucia, an Italian fisherman's wife of about thirty-five, facing "
        "three-quarters to the left: (1) the head with dark hair in a low knot under a faded red headscarf, a gentle "
        "strong face, and the bare neck; (2) the body from the neck base down to plain shoes, in a long dark blue "
        "skirt, a cream blouse, a brown shawl crossed over the chest and a white apron, standing, with NO arms; (3) "
        "her RIGHT arm from shoulder to a hand holding a small brass oil can by its handle, shawl sleeve; (4) her LEFT "
        "arm from shoulder to an open hand, shawl sleeve."),
    "flat-tower": ("1024x1536", CUT,
        "A tall, strong lighthouse tower of white limewashed stone with dressed grey stone bands, narrowing a little "
        "towards the top, with two small arched windows and a heavy wooden door at the base. It has NO lantern room "
        "and NO roof: the top is a flat stone platform with a low iron railing. The bottom edge is straight."),
    "prop-lantern": ("1024x1024", CUT,
        "The lantern room of a lighthouse: an iron gallery with a railing, a ring of tall glass panes in a dark iron "
        "frame, a domed copper roof turned green with a small vent ball on top, and inside a great glowing glass "
        "Fresnel lens shining warm gold."),
    "prop-wheel": ("1024x1024", CUT,
        "A large wooden and brass crank wheel of the clockwork that turns a lighthouse lens: a spoked wooden wheel "
        "with a brass rim and a brass hub, seen straight from the front. A round shape."),
    "prop-weight": ("1024x1536", CUT,
        "A heavy iron clockwork weight of a lighthouse: a tall dark iron cylinder hanging from a long iron chain that "
        "runs straight up to the top of the picture."),
    "flat-stair": ("1024x1536", CUT,
        "A cutaway of the inside of a stone lighthouse: a tall narrow shaft of whitewashed stone with a stone spiral "
        "stair winding up around the wall, small lamps in niches, seen from the front. The bottom edge is straight."),
    "prop-scaffold": ("1024x1536", CUT,
        "Tall wooden building scaffolding of poles lashed with rope, with plank platforms, two ladders and, at the "
        "very top, a wooden beam with a big pulley wheel and a rope hanging down."),
    "prop-stone": ("1024x1024", CUT,
        "One big dressed block of pale grey stone hanging in a rope cradle, with the rope going straight up."),
    "flat-cliff": ("2304x1024", CUT,
        "A rocky headland of dark grey and ochre rock rising from the sea at the right, with rough stone steps cut "
        "into it and tufts of sea grass, and lower rocks running to the left. The bottom edge is straight."),
    "flat-village": ("2304x1024", CUT,
        "A small southern Italian fishing village climbing a hillside: limewashed and ochre houses with terracotta "
        "roofs, a plain bell tower with no symbols, washing lines, and a harbour wall below. The bottom edge is "
        "straight."),
    "flat-quay": ("2304x768", CUT,
        "A long low stone quay with iron mooring rings and wooden mooring posts, coils of rope, nets and baskets, "
        "and two empty mooring places. The bottom edge is straight."),
    "flat-waves": ("2304x768", CUT,
        "A long ground row of curling sea waves in the ex-voto manner: rows of deep green and dark blue waves with "
        "white curling crests, flat top edge of waves only. The bottom edge is straight."),
    "flat-haulers": ("2304x768", CUT,
        "A long row of Italian villagers, men and women, hauling on one long rope, leaning back together with their "
        "feet braced, seen from the side, cut as one connected shape. The bottom edge is straight."),
    "flat-women": ("2304x768", CUT,
        "A long row of Italian fishermen's wives and old women in dark shawls standing on a quay at night, each "
        "holding up a small glowing lantern, looking out to sea, cut as one connected shape. The bottom edge is "
        "straight."),
    "prop-boat": ("1536x1024", CUT,
        "A small Italian fishing boat with a cream lateen sail, a dark green hull and a painted eye on the bow, two "
        "fishermen at the oars, sailing to the left. The bottom edge is straight."),
    "prop-ninoboat": ("1536x1024", CUT,
        "A small Italian fishing boat with a patched faded red lateen sail, a blue hull and a painted eye on the bow, "
        "with one young fisherman of twenty standing at the mast, sailing to the right. The bottom edge is straight."),
    "prop-empty": ("1536x768", CUT,
        "The same small fishing boat with a blue hull and a painted eye, empty, lying tilted on wet sand, its mast "
        "broken and its red sail gone, a tangle of rope over the side. The bottom edge is straight."),
    "prop-baby": ("1024x1024", CUT,
        "A baby sleeping in a small woven rope basket that hangs from four cords gathered at the top, as a cradle."),
    "prop-boy": ("1024x1536", CUT,
        "An Italian boy of eight, barefoot, in a white shirt and short brown trousers, standing and waving with one "
        "raised hand, facing three-quarters to the left."),
    "prop-clouds": ("2304x768", CUT,
        "A long row of heavy storm clouds in dark slate and grey, flat and decorative in the ex-voto manner."),
    "prop-sun": ("1024x1024", CUT,
        "A low sun as a stage prop: a round disc of warm ochre gold with a lighter rim. No rays."),
    "prop-moon": ("1024x1024", CUT,
        "A pale full moon as a stage prop: a round disc of cream with soft grey shadows."),
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

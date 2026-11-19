#!/usr/bin/env python3
"""Write one prompt per art piece of Cùm an Teine, and the job list for gen_art.sh.

  python productions/cum-an-teine/art/make_prompts.py

Every prompt starts with the locked text of bible.md. The key art is a plain generation. Every other piece is an
edit with key-art.png as Image 1.
"""
import os, re

HERE = os.path.dirname(os.path.abspath(__file__))
LOCKED = re.search(r"<!-- locked:start -->\n(.*?)\n<!-- locked:end -->", open(os.path.join(HERE, "bible.md"), encoding="utf-8").read(), re.S).group(1)
REF = ("REFERENCES: Image 1 is the look reference. Match its Victorian wood engraving line, hatching, thin hand-tinted "
       "watercolour, palette, raw card edges and figure style. Do not copy its composition.")
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
    "SUBJECT: Key art for the production. Inside a grand old toy theatre at night in a storm at sea. The sky behind is "
    "a smooth dark slate glow with no painted detail. Big engraved waves heave in rows. On the tilted deck of a small "
    "sailing ship, a young Scottish Highland crofter of the 1840s in a plain grey homespun plaid and a dark bonnet holds "
    "a small black iron pot high above his head with both arms, a glowing orange peat ember inside it. Behind him a "
    "young woman in a brown shawl holds a baby to her chest. Far off to one side, small on a dark hill, stand the "
    "roofless stone walls of a cottage.\n"
    "COMPOSITION: The whole stage inside a toy theatre, seen from the audience, with a simple dark proscenium."
)

PIECES = {
    "puppet-ewan": ("1536x1536", PARTS,
        "The four pieces of a marionette of Ewan, a young Scottish Highland crofter of twenty-six in the 1840s, facing "
        "three-quarters to the right: (1) the head with short dark hair, a soft dark blue bonnet, a steady weathered "
        "face with a short beard, and the bare neck; (2) the body from the neck base down to rough leather brogues, in a "
        "plain grey homespun belted plaid over a coarse shirt and a dark waistcoat, bare knees, wool hose, standing, "
        "with NO arms; (3) his RIGHT arm from shoulder to a strong open hand, shirt sleeve; (4) his LEFT arm from "
        "shoulder to a strong open hand, shirt sleeve."),
    "puppet-morag": ("1536x1536", PARTS,
        "The four pieces of a marionette of Morag, a young Scottish Highland crofter's wife of twenty-four in the "
        "1840s, facing three-quarters to the left: (1) the head with dark hair tied back under a plain linen kerchief, "
        "a gentle strong face, and the bare neck; (2) the body from the neck base down to bare feet, in a brown wool "
        "shawl crossed over a coarse bodice and a long dark heather-coloured skirt with a plain apron, standing, with NO "
        "arms; (3) her RIGHT arm from shoulder to an open hand, the sleeve rolled to the elbow; (4) her LEFT arm from "
        "shoulder to an open hand, the sleeve rolled to the elbow."),
    "puppet-seonag": ("1536x1536", PARTS,
        "The four pieces of a marionette of Seonag, an old Scottish Highland woman of seventy in the 1840s, a little "
        "stooped, facing three-quarters to the right: (1) the head with white hair under a white linen mutch cap, a "
        "deeply lined kind face, and the bare neck; (2) the body from the neck base down to bare feet, in a black wool "
        "shawl over a dark grey gown and a worn apron, standing, with NO arms; (3) her RIGHT arm from shoulder to a "
        "thin old open hand, dark sleeve; (4) her LEFT arm from shoulder to a thin old open hand, dark sleeve."),
    "prop-morag-baby": ("1024x1536", CUT,
        "The same young Highland woman in a brown wool shawl, a linen kerchief and a long heather-coloured skirt, "
        "standing and facing three-quarters to the left, holding a small baby wrapped in a grey blanket to her chest "
        "with both arms, the shawl drawn around them both."),
    "prop-seonag-sleep": ("1536x768", CUT,
        "The same old Highland woman in a white mutch cap and a black shawl, lying asleep on her side on a bed of "
        "heather, her eyes closed, her shawl drawn over her, one thin hand resting on a small black iron pot beside "
        "her. Seen from the side. The bottom edge is straight."),
    "prop-kneel": ("1536x1024", CUT,
        "A young Highland crofter in a grey plaid and dark bonnet and a young woman in a brown shawl kneeling close "
        "together in the snow, facing each other, both leaning down over a small heap of twigs at the centre, his "
        "hands cupped around it, the baby in a grey blanket in the crook of her arm. Seen from the side. The bottom "
        "edge is straight."),
    "flat-croft": ("1536x1024", CUT,
        "The thick dry-stone walls of a small Highland blackhouse of the 1840s WITHOUT ITS ROOF: low rounded walls of "
        "grey stones, two gable ends, a low dark wooden door in the middle, one tiny window, moss and grass on the "
        "stones, the top edge of the walls bare and open to the sky. The bottom edge is straight."),
    "prop-thatch": ("1536x768", CUT,
        "The separate thatched roof of a small Highland blackhouse, made as one piece to sit on top of low stone "
        "walls: a thick rounded roof of brown heather thatch held down by ropes weighted with hanging stones, a smoke "
        "hole near the top with a thin curl of smoke. The bottom edge is straight."),
    "prop-hearth": ("1024x1024", CUT,
        "A low central peat fire of a Highland blackhouse on a flat round hearthstone: a stack of dark peats glowing "
        "orange, a little smoke, an iron chain hanging from above with a black kettle over the fire. The bottom edge "
        "is straight."),
    "prop-pot": ("1024x1024", CUT,
        "A small round black cast-iron pot with a wire bail handle, a few glowing orange peat embers inside it with a "
        "thin curl of smoke."),
    "prop-notice": ("768x1024", CUT,
        "A single sheet of rough paper with a red wax seal at the top, nailed by one iron nail, its corners curling. "
        "The paper is blank, with only faint grey lines suggesting rows of print that cannot be read. No letters."),
    "prop-men": ("1536x1024", CUT,
        "Two estate men of the 1840s in long dark coats and tall black hats, their faces shadowed under the hat brims "
        "and not shown, hauling hard on a rope together and leaning back to the left, one holding a long iron hook. "
        "Seen from the side. The bottom edge is straight."),
    "flat-waulking": ("2304x768", CUT,
        "A long row of Highland women in shawls and kerchiefs sitting on both sides of a long wooden board, their "
        "sleeves rolled up, all leaning forward to beat and pass a long wet length of grey and brown woven wool cloth "
        "along the board, seen from the front, cut as one connected shape. The bottom edge is straight."),
    "flat-glen": ("2304x768", CUT,
        "A long row of rounded Highland hills of a quiet glen, in heather, moss and slate blue washes, a burn running "
        "down a corrie, a little mist in the folds. The bottom edge is straight."),
    "flat-folk": ("2304x768", CUT,
        "A long line of Highland families of the 1840s walking in single file to the right along a rough track: men "
        "with creels and bundles on their backs, women in shawls with children by the hand, an old man with a stick, "
        "seen from the side, cut as one connected shape. The bottom edge is straight."),
    "flat-shore": ("2304x768", CUT,
        "The shore of a Highland sea loch: grey rocks, a pebble beach with brown seaweed wrack, tufts of grass and "
        "thrift at the top of the shore. The bottom edge is straight."),
    "prop-cairn": ("1024x1024", CUT,
        "A low grave cairn of piled grey stones on the grass above a shore, a flat round smoke-blackened hearthstone "
        "laid on top. The bottom edge is straight."),
    "prop-ship": ("1536x1536", CUT,
        "A small two-masted emigrant brig of the 1840s with a black hull and furled grey sails, plain ropes and "
        "rigging, seen side on. NO flags, no pennants, no figurehead, no name on the hull. The bottom edge of the hull "
        "is straight at the waterline."),
    "flat-deck": ("2304x1024", CUT,
        "The deck of a small sailing ship seen from inside: a long wooden ship's rail along the front with its posts, "
        "the thick foot of a mast at the left with coiled ropes and a hatch cover, the planks running across. No flags. "
        "The bottom edge is straight."),
    "prop-waves": ("2304x768", CUT,
        "A long row of heaving storm waves of a grey-green sea, engraved with fine curving lines and white foam "
        "crests, flat and decorative like a toy theatre wave row. The bottom edge is straight."),
    "prop-wave": ("1536x1536", CUT,
        "One huge cresting storm wave curling over to the left, engraved with fine curving lines, grey-green with a "
        "thick white foam crest breaking into spray. The bottom edge is straight."),
    "flat-newshore": ("2304x1024", CUT,
        "A wild new shore in winter: dark rocks under deep snow, a row of tall bare black spruce and fir trees heavy "
        "with snow, no houses and no people. The bottom edge is straight."),
    "prop-clouds": ("2304x768", CUT,
        "A long row of heavy storm clouds in slate blue and grey, engraved with fine hatching, flat and decorative."),
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

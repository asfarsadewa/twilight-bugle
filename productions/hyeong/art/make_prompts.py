#!/usr/bin/env python3
"""Write one prompt per art piece of 형 먼저 가, and the job list for gen_art.sh.

  python productions/hyeong/art/make_prompts.py

Every prompt starts with the locked text of bible.md. The key art is a plain generation. Every other piece is an
edit with key-art.png as Image 1.
"""
import os, re

HERE = os.path.dirname(os.path.abspath(__file__))
LOCKED = re.search(r"<!-- locked:start -->\n(.*?)\n<!-- locked:end -->", open(os.path.join(HERE, "bible.md"), encoding="utf-8").read(), re.S).group(1)
REF = ("REFERENCES: Image 1 is the look reference. Match its charcoal and ink wash on hanji paper, the muted rain-washed "
       "colour, raw card edges and figure style. Do not copy its composition.")
CUT = ("COMPOSITION: One single cardboard cutout seen straight from the front, on a transparent background. "
       "Clean hand-cut outline. No shadow, no stand, no rod, no other pieces, no stage, no curtains, no frame.")
PARTS = ("COMPOSITION: A flat lay of the separate cardboard pieces of ONE jointed puppet, all at the same scale, "
         "seen straight from the front on a transparent background. Each piece is a separate cutout with clear empty "
         "space around it. No piece touches or overlaps another piece. No shadow, no rod, no strings, no stand, no stage.\n"
         "JOINTS: The body has three clearly visible round brass split pins: one at the centre of the base of the neck "
         "and one on each shoulder. The body ends at the neck base with no head and has no arms. The head piece ends in "
         "a bare neck with no collar, with one brass pin at the bottom of the neck. Each arm piece has one brass pin at "
         "the very top of the shoulder. The head is drawn at a natural size for the body.")
ROW = "The bottom edge is straight."

KEY_ART = (
    "SUBJECT: Key art for the production. Inside a grand old toy theatre in the rain at dawn. The sky behind is a "
    "smooth cold grey glow with no painted detail. Misty Korean hills far behind. Across the middle, a long narrow "
    "wooden plank bridge on rope and posts spans a swollen brown river. At the near bridgehead stands Min, a young "
    "Korean man of nineteen in soaked white cotton work clothes, as a jointed card marionette, holding the bridge "
    "rope, looking after his friend. Halfway across the bridge, Cheol, a taller young man of twenty-three in a dark "
    "worn jacket, looks back over his shoulder. Refugees with bundles and A-frame carriers walk away into the fog "
    "on the far side. Rain falls.\n"
    "COMPOSITION: The whole stage inside a toy theatre, seen from the audience, with a simple dark proscenium."
)

PIECES = {
    "puppet-min": ("1536x1536", PARTS,
        "The four pieces of a marionette of Min, a young Korean man of nineteen, facing three-quarters to the right: "
        "(1) the head with short black hair wet from the rain, a gentle brave face with sad eyes, and the bare neck; "
        "(2) the body from the neck base down to straw sandals, in soaked off-white cotton work clothes, a short "
        "jacket tied at the side and loose trousers bound at the ankles, a small cloth bundle slung across the back, "
        "standing, with NO arms; (3) the right arm from shoulder to an open hand, white sleeve; (4) the left arm from "
        "shoulder to a hand closed as if holding a rope, white sleeve."),
    "puppet-cheol": ("1536x1536", PARTS,
        "The four pieces of a marionette of Cheol, a young Korean man of twenty-three, taller and broader, facing "
        "three-quarters to the left: (1) the head with short black hair, a strong kind face, a little stubble, and "
        "the bare neck; (2) the body from the neck base down to worn rubber shoes, in a dark grey-brown worn wool "
        "jacket over a white shirt and dark trousers, a wooden A-frame carrier on his back, standing, with NO arms; "
        "(3) the right arm from shoulder to an open reaching hand, dark sleeve; (4) the left arm from shoulder to a "
        "relaxed hand, dark sleeve."),
    "prop-mother": ("1024x1536", CUT,
        "A Korean mother in a white hanbok of cotton, her hair in a low bun, standing and facing three-quarters to "
        "the right, holding out a small cloth-wrapped bundle of rice balls in both hands, with a worried tender face."),
    "flat-village": ("2304x1024", CUT,
        "A small Korean farming village in the rain: two thatched-roof houses with low stone walls, a persimmon tree, "
        "a stone wall with a wooden gate, and earthen yard. " + ROW),
    "flat-hills": ("2304x768", CUT,
        "A long row of misty Korean hills and pine ridges in grey ink wash, layered and soft. " + ROW),
    "flat-refugees": ("2304x768", CUT,
        "A long ground row of Korean refugees walking to the right in the rain: men with wooden A-frame carriers piled "
        "with bundles, women with bundles on their heads and babies on their backs, old people with sticks, children "
        "holding hands, a few umbrellas of oiled paper, many figures overlapping as one connected shape. " + ROW),
    "flat-bridge": ("2304x1024", CUT,
        "A long narrow Korean wooden plank footbridge on ropes and wooden posts spanning the whole width, with a "
        "bridgehead of stones and posts at each end, sagging slightly in the middle, rope hand rails, wet planks. "
        "Nothing below the bridge except the posts. " + ROW),
    "flat-river": ("2304x768", CUT,
        "A long ground row of a swollen monsoon river: churning brown and grey water with white foam crests and rain "
        "rings, flat top edge of waves only. " + ROW),
    "prop-fire": ("1024x1024", CUT,
        "A small campfire of sticks under a lean-to of straw mats in the rain, glowing warm orange inside, with a "
        "small iron pot."),
    "flat-gate": ("2048x1536", CUT,
        "The gate of a Korean farmhouse: a low stone wall with a small tiled roof over a wooden double gate standing "
        "wide open, a paper lantern glowing warm on a post beside it, and a persimmon tree with orange fruit leaning "
        "over the wall. " + ROW),
    "prop-boys": ("1024x1536", CUT,
        "Two Korean boys of about ten seen from behind, walking away hand in hand, in white cotton clothes, one taller "
        "than the other, the taller one's arm around the smaller one's shoulder, barefoot on a path."),
    "prop-far": ("1024x1536", CUT,
        "Cheol, a young Korean man of twenty-three, standing alone and facing the front, in a plain olive drab field "
        "jacket and trousers tucked into dark boots, bareheaded, holding a plain olive steel helmet at his side, a "
        "stubbled strong kind face full of grief, rain on his shoulders. No insignia, no badges."),
    # The two sides, as in the film: told apart by their clothes, each line with one plain banner. No violence.
    "prop-march-a": ("2304x768", CUT,
        "A column of young soldiers of 1950 marching to the left in single file through the rain, seen from the side, "
        "in plain olive drab field jackets and trousers, dark boots and plain olive steel helmets, rifles slung on "
        "their backs with the barrels pointing straight up, small canvas packs, tired plain faces, many overlapping "
        "as one connected shape. No insignia, no badges. " + ROW),
    "prop-line-a": ("2304x1024", CUT,
        "A line of six young soldiers of 1950 standing still in the rain and facing the front, in plain olive drab "
        "field jackets, dark boots and plain olive steel helmets, rifles slung on their backs pointing up, tired "
        "plain faces. The one at the right end holds a wooden pole with one plain unmarked blue cloth banner hanging "
        "wet. Cut as one connected shape. No insignia, no badges, no emblem on the banner. " + ROW),
    "prop-line-b": ("2304x1024", CUT,
        "A line of six young soldiers of 1950 standing still in the rain and facing the front, in quilted padded "
        "uniforms of faded mustard khaki and soft khaki caps with the ear flaps tied up, dark canvas shoes, rifles "
        "slung on their backs pointing up, tired plain faces. The one at the left end holds a wooden pole with one "
        "plain unmarked red cloth banner hanging wet. Cut as one connected shape. No insignia, no badges, no emblem "
        "on the banner. " + ROW),
    "prop-sun": ("1024x1024", CUT,
        "A pale rising sun seen through rain as a stage prop: a round disc of soft warm white and faint gold wash with "
        "a lighter rim. No rays."),
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

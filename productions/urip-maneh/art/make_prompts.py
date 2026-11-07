#!/usr/bin/env python3
"""Write one prompt per art piece of Urip Maneh, and the job list for gen_art.sh.

  python productions/urip-maneh/art/make_prompts.py

Every prompt starts with the locked text of bible.md. The key art is a plain generation. Every other piece is an
edit with key-art.png as Image 1.
"""
import os, re

HERE = os.path.dirname(os.path.abspath(__file__))
LOCKED = re.search(r"<!-- locked:start -->\n(.*?)\n<!-- locked:end -->", open(os.path.join(HERE, "bible.md"), encoding="utf-8").read(), re.S).group(1)
REF = ("REFERENCES: Image 1 is the look reference. Match its flat wayang beber paint, batik patterns, ink line, palette, "
       "raw card edges and figure style. Do not copy its composition.")
CUT = ("COMPOSITION: One single cardboard cutout seen straight from the front, on a transparent background. "
       "Clean hand-cut outline. No shadow, no stand, no rod, no other pieces, no stage, no curtains, no frame.")
PARTS = ("COMPOSITION: A flat lay of the separate cardboard pieces of ONE jointed puppet, all at the same scale, "
         "seen straight from the front on a transparent background. Each piece is a separate cutout with clear empty "
         "space around it. No piece touches or overlaps another piece. No shadow, no rod, no strings, no stand, no stage.\n"
         "JOINTS: The body has three clearly visible round brass split pins: one at the centre of the base of the neck "
         "and one on each shoulder. The body ends at the neck base with no head and has no arms. The head piece ends in "
         "a bare neck with no collar, with one brass pin at the bottom of the neck. Each arm piece has one brass pin at "
         "the very top of the shoulder.")
SHADOW = ("COMPOSITION: A flat lay of three separate pieces on a transparent background, with clear space between them. "
          "No piece touches another. Each is one solid flat black shape with no colour at all.")

KEY_ART = (
    "SUBJECT: Key art for the production. Inside a grand old toy theatre at dawn. The sky behind is a smooth glow from "
    "pale gold to cold blue-grey, with no painted detail. At the back stands an old Javanese red-brick Majapahit temple "
    "tower and frangipani trees. A tall kayon, the leaf-shaped wayang gunungan full of ornamental trees and animals, "
    "stands on its rod at the left. In front stand a young Javanese man in a dark blue headcloth and batik trousers and "
    "a young Javanese noblewoman in crimson and gold, as jointed card marionettes, looking toward each other with their "
    "hands not quite touching.\n"
    "COMPOSITION: The whole stage inside a toy theatre, seen from the audience, with a simple dark proscenium."
)

PIECES = {
    "puppet-carver": ("1536x1536", PARTS,
        "The four pieces of a marionette of a young Javanese stone carver of the 14th century, facing three-quarters to "
        "the right: (1) the head with a dark indigo headcloth, a kind serious face and the bare neck; (2) the body from "
        "the neck base down to bare feet, bare chest with a gold-brown batik sash, short dark batik trousers to the knee, "
        "with NO arms; (3) the right arm from shoulder to hand, gripping a wooden mallet; (4) the left arm from shoulder "
        "to hand, holding an iron chisel pointing forward."),
    "puppet-clerk": ("1536x1536", PARTS,
        "The four pieces of a marionette of a young Javanese man of the 1930s Dutch East Indies, facing three-quarters to "
        "the right: (1) the head with a dark batik blangkon headcloth, a longing face and the bare neck; (2) the body from "
        "the neck base down to dark shoes, a plain dark green buttoned high-collar jacket and dark trousers, in a walking "
        "stride, with NO arms; (3) the right arm from shoulder to an open hand with fingers spread; (4) the left arm from "
        "shoulder to a closed hand."),
    "puppet-man": ("1536x1536", PARTS,
        "The four pieces of a marionette of a young Javanese man of today, facing three-quarters to the right: (1) the "
        "head with short tidy black hair, a calm wondering face and the bare neck; (2) the body from the neck base down to "
        "dark shoes, a deep navy shirt with a batik pattern and charcoal trousers, standing, with NO arms; (3) the right "
        "arm from shoulder to an open offered hand, sleeve rolled to the forearm; (4) the left arm from shoulder to a "
        "relaxed hand, sleeve rolled to the forearm."),
    "puppet-woman": ("1536x1536", PARTS,
        "The four pieces of a marionette of a young Javanese woman of today, facing three-quarters to the left: (1) the "
        "head with black hair tied close, a graceful gentle face and the bare neck; (2) the body from the neck base down "
        "to flat shoes, a deep sage green blouse with a fine batik pattern and slim cream trousers, standing, with NO "
        "arms; (3) the right arm from shoulder to an open hand with fingers lifted; (4) the left arm from shoulder to a "
        "relaxed hand."),
    "shadow-he": ("1536x1536", SHADOW,
        "A Javanese wayang kulit shadow puppet of a slim young hero in strict side profile facing right, cut from black "
        "hide as lacework: long nose, long neck, tall ornamental headdress, with many small pierced holes in lace patterns. "
        "The three pieces: (1) the head and body down to the feet, with NO arms; (2) a long thin arm reaching out, with long "
        "fingers; (3) a second long thin arm. Each arm has one small round hole at the shoulder end. Solid black only."),
    "shadow-she": ("1536x1536", SHADOW,
        "A Javanese wayang kulit shadow puppet of a graceful princess in strict side profile facing left, cut from black "
        "hide as lacework: fine nose, long neck, hair in a curled knot with a small crown, a long wrapped skirt with pierced "
        "lace patterns and many small pierced holes. The three pieces: (1) the head and body down to the skirt hem, with NO "
        "arms; (2) a long thin arm reaching out, with long fingers; (3) a second long thin arm. Each arm has one small round "
        "hole at the shoulder end. Solid black only."),
    "prop-kayon": ("1024x1536", CUT,
        "A very large kayon, the leaf-shaped wayang gunungan: a tall pointed leaf outline filled with a tree of life, "
        "curling branches, two facing birds, a small temple gate at the base with two guardians, all in gold, madder red, "
        "indigo and soga brown, with pierced lace work in the outer edge. Symmetrical and magnificent."),
    "flat-kelir": ("2304x1024", CUT,
        "The stage of a Javanese shadow play: a very wide, plain, empty cream cotton screen, perfectly blank, with a thin "
        "madder red and black cloth border, carved dark wooden posts with gold ornament at both ends, and a carved top "
        "rail. A long green banana trunk lies along the bottom of the screen. The bottom edge is straight."),
    "flat-gamelan": ("2304x768", CUT,
        "A long low ground row of a Javanese gamelan seen from the audience: bronze gongs hanging in carved frames at the "
        "left and right, rows of bronze metallophones in carved red and gold cases, and a few seated players in batik and "
        "headcloths with their backs to us. In the centre, one seated dalang seen from behind. Low and wide, cut as one "
        "connected shape. The bottom edge is straight."),
    "flat-candi": ("2304x1536", CUT,
        "A newly built red-brick Javanese Majapahit temple courtyard of the 14th century: one tall stepped temple tower of "
        "clean red brick with pale carved stone at the centre, a low brick wall to each side, and a frangipani tree with "
        "white flowers at the left and the right. Clean, bright and new. The bottom edge is straight."),
    "flat-candi-old": ("2304x1536", CUT,
        "The same Javanese Majapahit red-brick temple six hundred years later: one tall stepped tower, worn and darkened, "
        "with moss, ferns and small cracks, its low brick walls partly fallen, a very large old frangipani tree with white "
        "flowers at the left and the right. The bottom edge is straight."),
    "prop-relief": ("1024x1024", CUT,
        "A square carved panel of pale limestone with a plain raised border. Carved in low relief in its middle is the "
        "face and shoulders of a graceful Javanese noblewoman in profile facing right, with a small crown and a long neck, "
        "in the manner of Majapahit temple carving. Only pale stone tones with ink line."),
    "prop-relief-old": ("1024x1024", CUT,
        "The same carved panel of limestone six hundred years old: darkened, worn and spotted with moss, with one fern at "
        "its corner. Carved in low relief in its middle is the same face and shoulders of a graceful Javanese noblewoman "
        "in profile facing right, with a small crown and a long neck, still clear."),
    "prop-blank": ("1024x1024", CUT,
        "A square plain panel of pale uncarved limestone with a plain raised border and a few chisel marks. Nothing is "
        "carved on it."),
    "prop-noble": ("1024x1536", CUT,
        "A young Javanese noblewoman of the 14th century walking to the left, seen in three-quarter view, with a graceful "
        "gentle face, black hair tied up with a small gold crown, a deep crimson and gold batik bodice, gold armbands, a "
        "long madder red wrapped skirt and two small attendants behind her holding a parasol, cut as one connected shape."),
    "flat-port": ("2304x1024", CUT,
        "A Javanese river port of the 1930s at night: white Dutch colonial warehouses with tiled roofs, tall shuttered "
        "windows with warm lit panes, and iron lamp posts, and a long stone quay running across the bottom. The bottom "
        "edge is straight."),
    "prop-ship": ("2048x1024", CUT,
        "A 1930s coastal steamship seen from the side, sailing to the right, with one tall funnel, two masts, a row of lit "
        "portholes, and on its deck one small young Javanese woman in a rose pink kebaya with a low bun, looking back over "
        "the stern with one hand raised. No water. The bottom edge is straight."),
    "flat-waves": ("2304x768", CUT,
        "A long ground row of river waves in the wayang beber manner: rows of curling ornamental indigo waves with cream "
        "line work, flat top edge of waves only. The bottom edge is straight."),
    "prop-lamps": ("2048x768", CUT,
        "A row of four warm paper and iron quay lamps hanging from one cord, glowing warm from inside."),
    "flat-street": ("2304x1024", CUT,
        "A busy Javanese shopping street at night in the 1990s: old two-storey shop houses, neon signs as plain glowing "
        "colour shapes with no writing, street food stalls with striped canvas tents and warm lamps, and two three-wheeled "
        "becak at the right, with no people. The bottom edge is straight."),
    "flat-crowd": ("2304x768", CUT,
        "A long ground row of a walking crowd of 1990s Javanese people seen from the side, some with umbrellas, shopping "
        "bags and a bicycle, many figures overlapping as one bold connected shape in dark muted tones. The bottom edge is "
        "straight."),
    "prop-man90": ("1024x1536", CUT,
        "A young Javanese man of the 1990s walking to the right, looking back over his shoulder, with short floppy black "
        "hair, a dark teal bomber jacket over a white T-shirt, dark blue jeans and white sneakers."),
    "prop-woman90": ("1024x1536", CUT,
        "A young Javanese woman of the 1990s walking to the left, looking back over her shoulder, with black hair tied "
        "close, a bright mustard yellow jacket, light blue jeans and white canvas shoes."),
    "prop-sun": ("1024x1024", CUT,
        "A rising sun as a stage prop: a plain round disc of warm ochre gold with small hand-drawn batik dots and a lighter "
        "rim. No rays, no stripes."),
    "prop-moon": ("1024x1024", CUT,
        "A pale full moon as a stage prop: a round cream disc with small hand-drawn batik scroll shadows."),
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

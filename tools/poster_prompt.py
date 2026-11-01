#!/usr/bin/env python3
"""Write the poster prompt of a production: the locked style text of its art bible, then the poster composition.

  python tools/poster_prompt.py productions/<id> "<subject>"

Writes productions/<id>/art/prompts/poster.prompt. Generate the poster as an edit with the key art as the look
reference, then cut it for the theatre wall:

  python $IMAGE_GEN edit --image productions/<id>/art/key-art.png
      --prompt-file productions/<id>/art/prompts/poster.prompt --size 1024x1536 --quality high
      --background opaque --output-format png --no-augment --out productions/<id>/art/src/poster.png
  python tools/poster_prompt.py productions/<id> --cut

The theatre prints the title over the plain bands at the top and the bottom.
"""
import os, re, sys

COMPOSITION = (
    "COMPOSITION: A tall portrait poster for this production, painted in the same gouache and gold-leaf style as "
    "Image 1, like a hand-printed poster from a grand old playhouse. One calm, strong composition with a single clear "
    "focal point. A slim ornamental painted border frames the picture. Keep a plain, quiet band of warm cream paper "
    "across the top fifth of the poster and across the bottom sixth: lettering goes there later, so nothing is "
    "painted in those bands. No text anywhere."
)
REF = ("REFERENCES: Image 1 is the look reference. Match its paint, gold leaf, palette and figure style. "
       "Do not copy its composition. Do not paint a theatre, a stage or curtains.")


def main():
    prod = sys.argv[1]
    art = os.path.join(prod, "art")
    if sys.argv[2] == "--cut":
        from PIL import Image
        im = Image.open(os.path.join(art, "src", "poster.png")).convert("RGB")
        im.save(os.path.join(art, "cut", "poster.webp"), quality=88, method=6)
        print("cut", im.size)
        return
    locked = re.search(r"<!-- locked:start -->\n(.*?)\n<!-- locked:end -->",
                       open(os.path.join(art, "bible.md"), encoding="utf-8").read(), re.S).group(1)
    os.makedirs(os.path.join(art, "prompts"), exist_ok=True)
    text = f"{locked}\n{REF}\n{COMPOSITION}\nSUBJECT: {sys.argv[2]}\n"
    open(os.path.join(art, "prompts", "poster.prompt"), "w", encoding="utf-8", newline="\n").write(text)
    print(text)


if __name__ == "__main__":
    main()

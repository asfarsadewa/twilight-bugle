# Theatre

The engine of the Twilight Bugle draws one stage in 3D with Three.js. Each production in `../productions` plays on this stage.

## Commands

Run these commands in this folder.

```bash
bun install
```

Open the live theatre:

```bash
bun run dev
```

Write review stills at show times in seconds:

```bash
node tools/render.mjs --p daybreak-vow --stills 4,58,128
```

Write the full video with the song:

```bash
node tools/render.mjs --p daybreak-vow --video
```

The renderer starts its own server. That server does not watch files. An edit during a render does not reload the page. The renderer writes to `../productions/<id>/render`.

Build the house in Blender. Run these commands from the repository root. The second command bakes the occlusion with Cycles and writes `public/house/house.glb`. Add `-- --preview` to the second command for a Cycles render at `blender/work/preview.png`.

```bash
python theatre/blender/prep_house.py
```

```bash
"C:/Program Files/Blender Foundation/Blender 5.2/blender.exe" -b --factory-startup --python theatre/blender/build_house.py
```

## In the theatre

The theatre opens on the house wall under the house lights. One poster hangs on the wall for each show in the repertoire. All posters have the same size, frame and lamp. They hang in show order, half on each side of the arch. If one side holds more than two shows, the posters hang in two rows.

Pick a poster to read its programme. The seal on the programme starts the show. The camera then moves from the wall to its seat.

| Action | Effect |
|---|---|
| Pick a poster | Opens the programme of that show. |
| Click outside the programme, or press Esc | Puts the programme down. |
| Click the seal | Raises the curtain, resumes the play or starts an encore. |
| Click the stage, or press Space | Intermission. Click again to resume. |
| "See the posters" on the intermission slip, or press Esc | Stops the play. The camera goes back to the wall. |
| Press E, or "Add English" on the programme | Turns the English line on or off. |

The seal reads "Raise the Curtain" for a new show. It reads "Resume the Play" for the show that is paused on stage. After the curtain call it reads "Encore".

If a different show is on stage, the crew changes the set in view first:

1. The curtain flies up on the old set.
2. The old set leaves.
3. The cyclorama goes white.
4. The new set comes in.
5. The traveller closes.
6. The board on the arch turns over.

The new show then opens with its own curtain.

Add `?p=<id>` to open the programme of one show. The dev server watches `../productions`. A new show folder appears on the wall without a restart.

### Phones

- A tap works as a click. The intermission slip has a "See the posters" link. A phone needs no Esc key.
- If a phone is upright, the surtitles move below the stage at a readable size. A slip suggests turning the phone sideways.
- If a phone is on its side, the programme sets in two columns.
- A phone draws the frame at 1440 by 810 pixels. The depth, light and grain passes keep their frame rate.
- A phone browser plays sound only from a tap. The seal unlocks the sound.

## The live site

The theatre runs on Cloudflare Workers at https://twilightbugle.asfarlab.fun. The Worker in `worker/index.ts` serves the build in `dist/`.

| Path | Content |
|---|---|
| `/` | The door of the theatre, then the house wall |
| `/show/<id>` | The house, with the programme of that show open. Its share card names the show. |
| `/og/site.jpg`, `/og/<id>.jpg` | Share cards, 1200 by 630 |
| `/api/gate`, `/api/enter` | The Turnstile gate |

The door is the loading screen. The neon sign lights one letter at a time, and a line of light grows under the doors. When the house is ready, a click on the doors opens it.

After a new show joins, write the share cards again:

```bash
node tools/og.mjs
```

Build, then deploy:

```bash
bun run build
```

```bash
wrangler deploy
```

The gate uses the Turnstile widget "orders". It is on: the Worker has the secrets `TURNSTILE_SECRET` and `PASS_KEY`. A visitor passes the check at the door, and the Worker then sets a pass for 12 hours. Without the pass, the Worker refuses the songs, the house and the art. If either secret is removed, the gate turns off and the door opens without a check.

## Page settings

| Setting | Effect |
|---|---|
| `?en=1` | Shows the English line in the surtitles. |
| `?py=1` | Shows the pinyin line in the surtitles. |
| `?render=1&p=<id>` | Render mode: no controls, one production, frames on request. |
| `?ssaa=2` | Render mode only: draws twice the pixels and scales the frame down. |

Each production names its two surtitle lines. The Daybreak Vow shows Mandarin over Indonesian. Bintang Senja shows Indonesian over Mandarin.

## Puppetry

The machinery stays in view. The audience sees how each figure moves.

| Rig | Spec | Effect |
|---|---|---|
| Rod | `rod: true` | A wooden dowel holds the piece from below. |
| Strings | `strings: [[u, v], …]` | Dark threads run from points on the piece up into the fly loft. |
| Marionette string | `string: [u, v]` on a puppet part | A thread tied to a head or a hand. It follows the joint. |
| Slide | `slide: 'left'` or `slide: 'right'` | A tin wire runs from the foot of the piece into that wing. |

A wave machine is a set of ground rows that rock against each other. The cue sheet drives the `x` channel of each row.

A toy theatre swaps figures for a new pose. A second cut of a figure, such as Shan with the water yoke, slides in while the first figure leaves.

Fireworks burst in the sky in front of the cyclorama. A cue sets `fw<k>.at`, `fw<k>.x`, `fw<k>.y`, `fw<k>.z` and `fw<k>.hue` for up to 16 shells. The shell rises for 0.75 seconds, then bursts. Sparks need a dark sky to show.

Each show uses more than one kind of rig. The README of each production lists its rigs.

## Depth and light

- The house comes from Blender: a carved proscenium in relief, stage boards, a brass fender and an orchestra rail. Cycles bakes their occlusion into their colour.
- The sky is a cyclorama. Its colour comes only from its lamps. A star cloth with pinholes hangs in front of it.
- Each piece is a cardboard solid with thickness. The outline comes from the alpha channel of its art. Far scenery can be cut as a flat-tone silhouette.
- Each piece stands at its own depth. Near pieces hide far pieces.
- Spotlights cast shadow maps. The footlights throw shadows up the scenery.
- Ambient occlusion darkens the places where flats meet the floor and each other.
- Depth of field softens layers far from the focus.
- A normal map from the brushwork gives the paint relief under moving light.
- Gold leaf in the paint is metallic. It catches the light when a lamp moves.

## Source

| Folder | Content |
|---|---|
| `src/core` | Timeline, production contract, cue helpers |
| `src/house` | House loader, masking, footlights, curtain, cyclorama, lighting rig |
| `blender` | The house build and bake for Blender |
| `src/stage` | Cardboard solids, pieces, jointed puppets, effects |
| `src/render` | Post-processing |
| `src/house/posters.ts` | The house wall: one poster for each show |
| `src/ui` | The door and its loading screen, the surtitles |
| `src/changeover.ts` | Strike and set between two productions |
| `src/main.ts` | The visit: door, house wall, programme, performance |
| `worker` | The Cloudflare Worker: show pages, share cards, Turnstile gate |
| `tools/render.mjs` | Stills and video through headless Chrome |
| `tools/og.mjs` | Share cards of the site and of each show |

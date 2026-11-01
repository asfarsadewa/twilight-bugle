# The Twilight Bugle

Status: the engine runs. The house, the curtain styles, the rig, the pieces, the puppets, the cue sheet and the changeover planner exist. The Blender house bake builds the proscenium relief, the stage boards and the orchestra rail.

## Idea

The Twilight Bugle is one puppet theatre. Each song is a production on its stage.

The theatre stays the same between songs. The house, the curtains, the fly system, the lights and the stagehands belong to the theatre.

Each production brings its own scenery, puppets, props, lighting looks and cue sheet.

When the audience changes the song, the theatre runs a changeover. The curtain moves. Stagehands strike the old show. The rig changes colour. The crew sets the new show. The curtain opens on the new production.

A changeover works between any two productions. The theatre plans it from the pieces of both shows.

## Outputs

| Output | Use |
|---|---|
| Theatre app | A web page. The audience picks a song from the programme. The theatre changes over live. |
| Production video | One MP4 per song. The renderer steps frames at a fixed rate. FFmpeg adds the song. |

Both outputs use the same engine. A frame depends only on the production and the time. The app and the video show the same frame for the same time.

## Parts of the theatre

| Part | Content |
|---|---|
| House | Proscenium arch, valance, legs and borders, stage floor, wings, orchestra pit, programme board on the arch |
| Curtains | House curtain, travellers, scrim, cyclorama |
| Fly system | Numbered battens above the stage. Each batten flies one flat, one drop or one light bar. |
| Floor machinery | Tracks cut in the floor, traps, a turntable |
| Lighting rig | Footlights, front spots, a follow spot, batten lights, cyclorama wash, practical lamps on the set |
| Crew | Stagehands dress in black. They carry props, push wagons and pull ropes. |
| Camera | A seat in the house by default. A production can move the camera inside the theatre. |

## Curtain styles

Each production names its curtain style for the open and the close. The changeover uses the close style of the old show and the open style of the new show.

| Style | Move |
|---|---|
| Fly | The whole curtain rises into the fly tower. |
| Traveller | Two halves part to the sides. |
| Tableau | Two halves lift up and out on diagonal lines. They hang in swags. |
| Roll | The curtain rolls up on a drum at its bottom edge. |
| Scrim reveal | Light moves from the front of a gauze to the back. The scene behind appears. |

## Production package

Each production lives in `productions/<id>/`.

| Path | Content |
|---|---|
| `production.json` | Manifest: title, song, cast, scenery, looks, curtain styles, cue sheet path |
| `story/` | Premise, world, characters, beats by song section |
| `song/` | Lyrics, brief, takes, the selected master, line times, beat grid |
| `art/` | Painted flats, puppet parts, props, with the prompts that made them |
| `cues/` | Cue sheet for the song |

## Pieces

Every object on stage is a piece. A piece has an id, a kind, a home position and an entry and exit move.

| Kind | Home position | Default entry and exit |
|---|---|---|
| Drop | A batten | Flies in and out |
| Flat | A batten or a track | Flies, or slides in from the wings |
| Ground row | A track near the floor | Slides in from the wings |
| Wagon | The floor | Stagehands push it on and off |
| Prop | A mark on the floor | Stagehands carry it on and off |
| Puppet | A track or a hand position | Enters on its rod from the wings, bows before it exits |
| Light look | The rig | Gels scroll to new colours, lamps refocus |

A piece is a cardboard cutout with real thickness. Its corrugated edge shows when it turns. Spotlights cast its shadow on the pieces behind it.

## Cue sheet

The cue sheet ties actions to the song. A cue starts at a time, a section, a lyric line or a beat.

| Cue | Action |
|---|---|
| `fly` | A batten moves a piece in or out. |
| `track` | A piece slides along a floor track. |
| `puppet` | A puppet moves, turns, gestures or swaps a part. |
| `look` | The rig changes to a named lighting look. |
| `curtain` | A curtain opens or closes in a named style. |
| `effect` | Paper snow, fire rain, smoke, confetti, a flash |
| `camera` | The camera moves to a named position. |
| `subtitle` | A lyric line appears in the two languages that the production names. English is on demand. |

Line times come from the song review. Beat times come from a beat grid of the selected master.

A cue moves a channel from the value that the channel has at the cue's start. If a cue starts while an earlier cue still moves the same channel, the later cue takes over at its start. The earlier move stops there, on its own curve. A cue never changes a channel before its own start. A `set` jumps at its own time. A cue written after a `set` at the same time moves on from the new value.

## Changeover

The changeover planner reads the old production and the new production. It writes a changeover cue sheet. The same engine plays it in view of the audience.

1. Room. The light and the sky start where the old show stopped.
2. Fly. The curtain flies up on the old set. The work light comes on. The cyclorama drops to a dim grey.
3. Curtain call. The old puppets in view bow. If no puppet is in view, the planner skips this step.
4. Strike. The old pieces in view leave by their routes. Deep pieces go first. Floor pieces go last.
5. Rig change. The cyclorama sweeps to white.
6. Set. The new pieces arrive by their routes. Deep pieces come first.
7. Close. The traveller closes on the new set.
8. Programme. The board on the arch turns to the new title.
9. Open. The new show's preroll runs. The house lights go down. The curtain opens in the open style of the new show.

The planner starts each moving piece 0.45 seconds after the one before it. An old piece in view stays until the crew strikes it, also when the new show has a piece with the same id. The new show brings its own copy. At an encore, the crew strikes the whole set in view and sets it again.

The theatre builds the new set before it touches the stage. If a file of the new show does not load, the old show stays on stage with its song. The seal then offers another attempt.

All pieces of a show load in parallel. When a programme opens, the theatre starts to load the art of its show. The song loads during the preroll. If the song is late, the stage waits for it at the first note.

The shaders compile in the background before the first frame. They compile for the render targets of the post-processing chain, because the frames render into those targets.

The entr'acte sound does not exist yet. The plan uses rope creaks, pulley clicks and wood knocks from ElevenLabs. A short instrumental bridge from Lyria can play under them.

## The house wall

The live theatre opens on the house wall. One framed poster hangs there for each show. All posters have the same size, and they hang in show order. A poster opens the programme of its show. The seal on the programme starts the show. If another show is on stage, the changeover runs first.

Each production gives its show number (`no`) and its poster art (`poster`). The theatre prints the titles on the poster in the playbill typefaces. The title in the sung language leads.

## Engine

| Layer | Choice |
|---|---|
| Language | TypeScript |
| Renderer | Three.js on WebGL2 |
| Build | Vite |
| Cardboard pieces | Alpha contour of the art, extruded to a thin solid, painted face, corrugated edge texture |
| Light | Spotlights with shadow maps, bloom on lamps, light dust in the beams |
| Time | One clock. The song drives it in the app. A frame counter drives it in the renderer. |
| Video export | Headless Chrome steps frames. FFmpeg encodes the frames with the song. |

Phaser is not part of the engine. The stage needs depth, light and shadows in 3D.

## Repository layout

```
theatre/          engine: house, curtains, machinery, lights, puppets, cues, changeover, render
productions/<id>/ one folder per song
tools/            shared pipelines: song, listening checks, art
docs/             architecture and conventions
```

## Asset pipeline

| Step | Tool |
|---|---|
| Painted flats, puppet parts, props | An image model with transparent output, then `tools/cutout.py` |
| House model: arch, boards, pit | Blender 5.2 with baked occlusion, exported as GLB |
| Songs | Lyria 3.5 |
| Lyric times | Scribe v2 and `tools/listen.py` |
| Beats and vocal loudness | Demucs and librosa in `tools/master.py` |

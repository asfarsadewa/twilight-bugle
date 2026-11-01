import type { Timeline } from './core/timeline.ts';
import type { CurtainStyle } from './core/types.ts';
import type { Piece } from './stage/piece.ts';
import { curtainStyleIndex } from './house/curtain.ts';

// The changeover between two productions, played in view of the audience. It works for any pair, because it
// reads only the pieces and their routes. The new show's own preroll (house lights down, curtain up) follows it.
//
//   0 the room starts with the old show's light and sky where it stopped
//   1 the curtain flies up on the old set under work light, and the cyclorama drops to a dim grey
//   2 curtain call   the old puppets in view bow (skipped if none are in view)
//   3 strike         the old pieces in view leave by their routes: deep pieces fly out first, floor pieces last
//   4 rig change     the cyclorama sweeps through white to the new show's colour, the house lights sit at half
//   5 set            the new pieces arrive: drops and far flats first, then near flats, props and puppets
//   6 close          the traveller closes
//   7 programme      the board on the arch turns over to the new title
//
// Returns the length in seconds. The changeover ends where the new show's preroll starts.

const STAGGER = 0.45;
const MOVE = 1.6;

const WORK_LIGHT = [['fohL', 0.5], ['fohR', 0.5], ['follow', 0], ['left', 0], ['right', 0], ['back', 0.3], ['spire', 0], ['lamp', 0], ['fire', 0], ['glowA', 0], ['glowB', 0], ['ray', 0]] as const;
const BANDS = ['cycTop', 'cycHz', 'cycBot'] as const;

export function planChangeover(
  tl: Timeline,
  o: {
    /** Old pieces still in view. */
    oldPieces: Piece[];
    newPieces: Piece[];
    oldClose: CurtainStyle;
    startAt: number;
    /** The old show's value of a room channel (light, sky) where it stopped. */
    was: (ch: string) => number | undefined;
  },
): number {
  const strikeOrder = [...o.oldPieces].sort((a, b) => a.spec.home.z - b.spec.home.z);
  const setOrder = [...o.newPieces].filter((p) => p.spec.startIn).sort((a, b) => a.spec.home.z - b.spec.home.z);
  const bowers = o.oldPieces.filter((x) => x.spec.kind === 'puppet');
  const bowLen = bowers.length ? 1.8 : 0;
  const strikeLen = strikeOrder.length ? strikeOrder.length * STAGGER + MOVE : 0;
  const setLen = setOrder.length * STAGGER + MOVE;
  const total = 2.6 + bowLen + strikeLen + 1.6 + setLen + 2.4 + 1.4;
  let t = o.startAt - total;

  // 0 the room starts as the old show left it: the same light and the same sky.
  const room = [
    ...WORK_LIGHT.flatMap(([name]) => ['i', 'r', 'g', 'b'].map((c) => `${name}.${c}`)),
    ...BANDS.flatMap((band) => ['i', 'r', 'g', 'b'].map((c) => `${band}.${c}`)),
    'cycHz.y',
    'stars.i',
  ];
  for (const ch of room) {
    const v = o.was(ch);
    if (v !== undefined) tl.set(ch, v, t - 0.01);
  }

  // 1 the curtain flies up on the old set. Work light: flat, cool and plain, as when the crew is on stage.
  // The cyclorama drops to a dim grey, so an empty stage still reads as a stage.
  tl.set('curtain.style', curtainStyleIndex('fly'), t);
  tl.hold('curtain.open', t).to('curtain.open', 1, t, 2.4, 'inOut');
  tl.to('house.i', 0.4, t, 1.6).to('foot.i', 0.2, t, 1.6);
  for (const [name, level] of WORK_LIGHT) {
    tl.hold(`${name}.i`, t).to(`${name}.i`, level, t, 1.4);
  }
  for (const c of ['fohL', 'fohR']) tl.to(`${c}.r`, 0.92, t, 1.4).to(`${c}.g`, 0.95, t, 1.4).to(`${c}.b`, 1.0, t, 1.4);
  for (const band of BANDS) {
    tl.hold(`${band}.i`, t).to(`${band}.i`, 0.16, t, 1.4);
    tl.to(`${band}.r`, 0.8, t, 1.4).to(`${band}.g`, 0.83, t, 1.4).to(`${band}.b`, 0.9, t, 1.4);
  }
  tl.hold('stars.i', t).to('stars.i', 0, t, 1.4);
  tl.hold('surtitles.i', t).to('surtitles.i', 0, t, 0.3);
  t += 2.6;

  // 2 curtain call: each old puppet in view dips forward on its rod and rises again.
  for (const p of bowers) {
    const dir = p.spec.puppet?.faces === 'left' ? 1 : -1;
    tl.hold(`${p.id}.rz`, t).to(`${p.id}.rz`, 20 * dir, t + 0.1, 0.6, 'inOut').to(`${p.id}.rz`, 0, t + 0.9, 0.6, 'inOut');
  }
  t += bowLen;

  // 3 strike, in view.
  strikeOrder.forEach((p, i) => {
    tl.hold(`${p.id}.out`, t + i * STAGGER).to(`${p.id}.out`, 1, t + i * STAGGER, MOVE, 'in');
  });
  t += strikeLen;

  // 4 rig change: the cyclorama sweeps through white light, as the gels scroll.
  for (const [band, level] of [['cycTop', 0.9], ['cycHz', 0.4], ['cycBot', 0.6]] as const) {
    tl.hold(`${band}.i`, t).to(`${band}.i`, level, t, 0.8);
    tl.to(`${band}.r`, 0.9, t, 0.8).to(`${band}.g`, 0.92, t, 0.8).to(`${band}.b`, 1, t, 0.8);
  }
  t += 1.6;

  // 5 set, in view. Every new piece that starts in place arrives by its route.
  setOrder.forEach((p, i) => {
    tl.base(`${p.id}.out`, 1);
    tl.to(`${p.id}.out`, 0, t + i * STAGGER, MOVE, 'out');
  });
  t += setLen;

  // 6 the traveller closes on the new set.
  tl.set('curtain.style', curtainStyleIndex('traveller'), t);
  tl.hold('curtain.open', t).to('curtain.open', 0, t, 2.2, 'inOut');
  t += 2.4;

  // 7 the programme board turns over.
  tl.base('programme.flip', 0);
  tl.to('programme.flip', 1, t, 1.2, 'inOut');
  return total;
}

import * as THREE from 'three';
import type { Ease, Timeline } from './timeline.ts';
import type { Master } from './types.ts';
import { STAGE } from '../stage/piece.ts';

// Helpers for writing a cue sheet. They only add keys to the timeline. Times are show seconds.

export type Look = Record<string, number | [number, number]>;

export function cueKit(tl: Timeline, master: Master) {
  const F = () => STAGE.floor;
  const kit = {
    /** A piece comes in by its route. */
    enter(id: string, t: number, dur = 1.4, e: Ease = 'out') {
      tl.hold(`${id}.out`, t).to(`${id}.out`, 0, t, dur, e);
    },
    /** A piece goes out by its route. */
    leave(id: string, t: number, dur = 1.4, e: Ease = 'in') {
      tl.hold(`${id}.out`, t).to(`${id}.out`, 1, t, dur, e);
    },
    /** Pop a piece in or out with no move, as a swap behind a turn. */
    pop(id: string, on: boolean, t: number) {
      tl.set(`${id}.out`, on ? 0 : 1, t);
    },
    move(ch: string, v: number, t: number, dur = 1, e: Ease = 'inOut') {
      tl.to(ch, v, t, dur, e);
    },
    set(ch: string, v: number, t: number) {
      tl.set(ch, v, t);
    },
    /**
     * A lighting state. Each entry is a level, or a [level, colour] pair. Instruments the look does not name keep
     * their level. Colours are hex.
     */
    look(t: number, dur: number, look: Look) {
      for (const [name, v] of Object.entries(look)) {
        const [level, hex] = Array.isArray(v) ? v : [v, undefined];
        tl.to(`${name}.i`, level, t, dur, 'inOut');
        if (hex !== undefined) {
          const c = new THREE.Color(hex);
          tl.to(`${name}.r`, c.r, t, dur).to(`${name}.g`, c.g, t, dur).to(`${name}.b`, c.b, t, dur);
        }
      }
    },
    /** Aim a spot at a point on stage. y is height above the stage floor. */
    aim(name: string, x: number, y: number, z: number, t: number, dur = 0.8, e: Ease = 'inOut') {
      tl.to(`${name}.tx`, x, t, dur, e).to(`${name}.ty`, F() + y, t, dur, e).to(`${name}.tz`, z, t, dur, e);
    },
    /** Move a lamp: a practical, or the lamp of a spot. y is height above the stage floor. */
    place(name: string, x: number, y: number, z: number, t: number, dur = 0.01, e: Ease = 'inOut') {
      tl.to(`${name}.px`, x, t, dur, e).to(`${name}.py`, F() + y, t, dur, e).to(`${name}.pz`, z, t, dur, e);
    },
    /** Camera: position and look point. y values are heights above the stage floor. */
    cam(t: number, dur: number, c: { x?: number; y?: number; z?: number; lx?: number; ly?: number; lz?: number; fov?: number }, e: Ease = 'inOut') {
      const map: Record<string, number | undefined> = {
        'cam.x': c.x, 'cam.y': c.y === undefined ? undefined : F() + c.y, 'cam.z': c.z,
        'cam.lx': c.lx, 'cam.ly': c.ly === undefined ? undefined : F() + c.ly, 'cam.lz': c.lz, 'cam.fov': c.fov,
      };
      for (const [ch, v] of Object.entries(map)) if (v !== undefined) tl.to(ch, v, t, dur, e);
    },
    /** A short burst on an instrument: up fast, down slow. */
    flash(name: string, t: number, peak = 1, back = 0, up = 0.05, down = 0.5) {
      tl.hold(`${name}.i`, t).to(`${name}.i`, peak, t, up, 'out').to(`${name}.i`, back, t + up, down, 'out');
    },
    /** The beats of the song between two times. */
    beats(a: number, b: number): number[] {
      return master.beats.filter((x) => x >= a && x < b);
    },
    /** The downbeats (first beat of each bar) between two times. */
    downbeats(a: number, b: number): number[] {
      return master.beats.filter((x, i) => x >= a && x < b && (i - master.downbeat_phase) % 4 === 0);
    },
  };
  return kit;
}

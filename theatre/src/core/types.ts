// The contract between the theatre and a production.
// A production names its pieces and writes its cue sheet. The theatre owns the house, the rig and the machinery.

import type { Timeline } from './timeline.ts';

export type Pt = [number, number];

export interface Shape {
  outer: Pt[];
  holes: Pt[][];
}

/** One cut art file, as tools/cutout.py writes it. */
export interface Art {
  url: string;
  /** Relief normal map from the brushwork. */
  normalUrl?: string;
  w: number;
  h: number;
  aspect: number;
  shapes?: Shape[];
  opaque?: boolean;
}

/** How a piece enters and leaves the stage. */
export type Route = 'fly' | 'left' | 'right' | 'trap' | 'none';

export interface PieceSpec {
  id: string;
  kind: 'drop' | 'flat' | 'prop' | 'puppet';
  art?: Art;
  puppet?: PuppetSpec;
  /** World width. Height follows the art aspect when only one is given. */
  width?: number;
  height?: number;
  /** In-position. y is the height above the stage floor of the bottom edge (anchor bottom) or the centre (anchor center). */
  home: { x: number; y?: number; z: number };
  anchor?: 'bottom' | 'center';
  route: Route;
  /** Starts on stage at show time 0 instead of out. */
  startIn?: boolean;
  /** Cardboard thickness in world units. */
  thick?: number;
  /** Paint that glows: lamps, flames, lit windows. 0 is plain paint. */
  glow?: number;
  /** A wooden rod from below, as a rod puppet has. */
  rod?: boolean;
  /** Black strings from the fly loft, as a marionette has. Each is an attach point in piece units (0..1). */
  strings?: Pt[];
  shadow?: boolean;
  /**
   * Cut the piece as a silhouette: one flat tone with paper grain. The art gives only the outline. Warm lit
   * windows in the art still glow, at the strength of `glow`.
   */
  silhouette?: { color: number };
  /** Mirror the art left to right. */
  mirror?: boolean;
  /** A toy-theatre slide: a tin wire from the foot of the piece into that wing, as if a hand pushes it on stage. */
  slide?: 'left' | 'right';
}

export interface PartSpec {
  art: Art;
  /** Size of the part on its source sheet, in pixels. Parts of one sheet share a scale. */
  sheet: Pt;
  /** Joint pin on the part, 0..1 of the part (x right, y down). */
  pivot: Pt;
  /** Where the pin sits on the body, 0..1 of the body. */
  attach?: Pt;
  /** In front of the body (positive) or behind it (negative). */
  z?: number;
  /** Rest angle in degrees, counter-clockwise. */
  rest?: number;
  /** Flip the part left to right about its pin, as when a prop was painted pointing the wrong way. */
  mirror?: boolean;
  /** A marionette string tied to this part, at a point of the part (0..1). It follows the joint. */
  string?: Pt;
}

export interface PuppetSpec {
  /** World height of the body part. */
  height: number;
  body: PartSpec;
  head?: PartSpec;
  /** The arm that holds the prop: sword, lamp. */
  armA?: PartSpec;
  armB?: PartSpec;
  /** Which way the figure faces as painted. */
  faces: 'left' | 'right';
}

export interface Line {
  section: string;
  /** The singer: a key of the production's voices. */
  who: string;
  who_sure: boolean;
  /** The sung text, and the line in each language the sheet has. */
  sung?: string;
  zh?: string;
  py?: string;
  en?: string;
  fr?: string;
  id?: string;
  start: number;
  end: number;
}

export interface Master {
  take: string;
  /** The sung language. */
  sung?: 'zh' | 'id' | 'en' | 'fr';
  duration: number;
  bpm: number;
  beats: number[];
  downbeat_phase: number;
  sections: { id: string; start: number; end: number }[];
  lines: Line[];
  /** Vocal loudness per singer at 30 frames a second, 0..1. Keys are the production's voices. */
  vox?: { fps: number } & Record<string, number[]>;
}

export type CurtainStyle = 'fly' | 'traveller' | 'tableau';

/** What a cue sheet gets: the timeline, the song facts and helpers. Show time 0 is the start of the song. */
export interface CueContext {
  tl: Timeline;
  master: Master;
  section(id: string): { start: number; end: number };
  line(n: number): Line;
}

export interface Production {
  id: string;
  /** The show number. The posters on the house wall hang in this order. */
  no: number;
  /** Titles. A song in French adds its French title. */
  title: { zh: string; en: string; id: string; fr?: string };
  /** Poster art for the house wall. Plain bands at the top and the bottom take the printed titles. */
  poster: string;
  audio: string;
  master: Master;
  pieces: PieceSpec[];
  curtain: { open: CurtainStyle; close: CurtainStyle };
  /** Seconds of show before the song starts: house lights down, curtain up. */
  preroll: number;
  /** Seconds of show after the song ends: curtain call. */
  postroll: number;
  /** Art for stage effects: the flame that falls in fire rain. */
  fx?: { flame?: string };
  /** The printed playbill in the lobby: a line about the show, the cast and the scenery. */
  bill: { about: string; cast: [string, string][]; scenes: string[] };
  /** Singer names and colours for the surtitles. */
  voices: Record<string, { name: string; color: string }>;
  /** Which language leads the surtitles and which follows. English and pinyin are on demand. */
  surtitles?: { main: 'zh' | 'id' | 'en'; second: 'zh' | 'id' | 'en' };
  cues(c: CueContext): void;
}

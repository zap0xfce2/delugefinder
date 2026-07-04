import type { SourceId } from "../sources/types";

export const COLOR = {
  bg: "#000000",
  accent: "#a78bfa",
  text: "#e9e4f5",
  alt: "#b9a7e6",
  good: "#86d6a2",
  warn: "#f0c560",
  bad: "#ee7d92",
  bright: "#d8b4fe",
} as const;

export const ICON = {
  done: "✓",
  error: "✗",
  pending: "·",
  pointer: "❯",
  dot: "·",
  warn: "⚠",
  bar: "▌",
  down: "↓",
  up: "↑",
  peer: "•",
  pause: "⏸",
} as const;

export const RULE = "#6b6577";

export const GUTTER = 2;

// All sources are now dynamically discovered (Prowlarr indexers), so there are no
// hand-picked entries left — every id resolves through the fallback below.
export const SOURCE_STYLE: Record<SourceId, { tag: string; color: string }> = {};

// Reused hues (no new gradient) for sources without a hand-picked SOURCE_STYLE entry,
// e.g. dynamically discovered Prowlarr indexers.
const FALLBACK_PALETTE: readonly string[] = [
  COLOR.accent,
  COLOR.good,
  COLOR.warn,
  COLOR.bright,
  "#5fd0c5",
  "#f6a55c",
  COLOR.bad,
];

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function fallbackTag(id: string, label?: string): string {
  const letters = (label || id).replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  return letters.slice(0, 4) || "•";
}

// Tolerant lookup: a source id may be absent (a pasted magnet / bare infohash) or
// no longer exist (a removed source persisted in old history/seeds). Fall back to a
// neutral tag rather than indexing SOURCE_STYLE and crashing on `undefined`. An id
// without a hand-picked entry (e.g. a Prowlarr indexer) gets a deterministic tag/color
// derived from its label/id instead of the generic dot.
export function sourceStyle(id?: SourceId, label?: string): { tag: string; color: string } {
  if (!id) return { tag: "•", color: COLOR.alt };
  const known = SOURCE_STYLE[id];
  if (known) return known;
  return {
    tag: fallbackTag(id, label),
    color: FALLBACK_PALETTE[hashString(id) % FALLBACK_PALETTE.length]!,
  };
}

function rgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function lerpHex(a: string, b: string, t: number): string {
  const [ar, ag, ab] = rgb(a);
  const [br, bg, bb] = rgb(b);
  const c = (x: number, y: number) =>
    Math.round(x + (y - x) * t)
      .toString(16)
      .padStart(2, "0");
  return `#${c(ar, br)}${c(ag, bg)}${c(ab, bb)}`;
}

export const ACCENT_RAMP: readonly [string, string] = [COLOR.accent, COLOR.bright];

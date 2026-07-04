import type { Source, SourceGroup } from "./types";

// Fixed priority order, reused by src/prowlarr/categories.ts for its tie-break and by
// Splash's category line. Purely conceptual (Games/Movies/TV/Anime) — independent of
// which sources are currently configured/reachable.
export const GROUP_ORDER: readonly SourceGroup[] = ["Games", "Movies", "TV", "Anime"];

// Currently a passthrough (all sources are dynamic, e.g. Prowlarr indexers). Kept as
// the single merge point so a second dynamic provider could be added later without
// touching call sites like App.tsx.
export function withDynamicSources(dynamic: readonly Source[]): Source[] {
  return [...dynamic];
}

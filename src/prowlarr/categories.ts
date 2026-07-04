import { GROUP_ORDER } from "../sources/registry";
import type { SourceGroup } from "../sources/types";

export interface ProwlarrCategory {
  id: number;
  name: string;
}

const GAMES_ID = 4050;

function categoryGroup(cat: ProwlarrCategory): SourceGroup | null {
  if (cat.id === 5070 || /anime/i.test(cat.name)) return "Anime";
  if ((cat.id >= 1000 && cat.id < 2000) || cat.id === GAMES_ID) return "Games";
  if (cat.id >= 2000 && cat.id < 3000) return "Movies";
  if (cat.id >= 5000 && cat.id < 6000) return "TV";
  return null;
}

// One Prowlarr indexer -> one virtual source -> one group. When an indexer's
// declared categories span multiple groups, the majority wins; ties break by
// GROUP_ORDER's fixed priority. No matching category at all excludes the indexer
// entirely, since SourceGroup has no catch-all "other" bucket.
export function mapCategoriesToGroup(categories: ProwlarrCategory[]): SourceGroup | null {
  const counts = new Map<SourceGroup, number>();
  for (const cat of categories) {
    const group = categoryGroup(cat);
    if (!group) continue;
    counts.set(group, (counts.get(group) ?? 0) + 1);
  }
  if (counts.size === 0) return null;

  let best: SourceGroup | null = null;
  let bestCount = 0;
  for (const group of GROUP_ORDER) {
    const count = counts.get(group) ?? 0;
    if (count > bestCount) {
      bestCount = count;
      best = group;
    }
  }
  return best;
}

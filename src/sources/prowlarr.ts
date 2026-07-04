import { fetchIndexers, searchIndexer, type ProwlarrSearchResult } from "../prowlarr/client";
import { mapCategoriesToGroup } from "../prowlarr/categories";
import { buildMagnet, parseMagnet } from "./magnet";
import type { ProwlarrConfig } from "../config/config";
import type { SearchOptions, Source, TorrentResult } from "./types";

export function prowlarrSourceId(indexerId: number): string {
  return `prowlarr:${indexerId}`;
}

// Fail-soft like the other sources: a release without any usable hash (neither an
// explicit infoHash field nor a parsable magnetUrl) is skipped rather than crashing.
export function mapSearchResult(r: ProwlarrSearchResult, sourceId: string): TorrentResult | null {
  const fromMagnet = r.magnetUrl ? parseMagnet(r.magnetUrl) : null;
  const infoHash = (r.infoHash || fromMagnet?.infoHash || "").toLowerCase();
  if (!infoHash) return null;
  const magnet = fromMagnet?.magnet ?? buildMagnet(infoHash, r.title);
  const added = r.publishDate ? Math.floor(new Date(r.publishDate).getTime() / 1000) : undefined;
  return {
    infoHash,
    name: r.title,
    sizeBytes: r.size ?? 0,
    seeders: r.seeders ?? 0,
    leechers: r.leechers ?? 0,
    source: sourceId,
    magnet,
    added,
  };
}

async function search(
  config: ProwlarrConfig,
  indexerId: number,
  sourceId: string,
  query: string,
  opts: SearchOptions,
): Promise<TorrentResult[]> {
  const results = await searchIndexer(config, indexerId, query, { signal: opts.signal });
  const out: TorrentResult[] = [];
  for (const r of results) {
    const mapped = mapSearchResult(r, sourceId);
    if (mapped) out.push(mapped);
  }
  return out;
}

export interface BuildProwlarrSourcesOptions {
  fetchIndexers?: typeof fetchIndexers;
}

// One Prowlarr indexer becomes one virtual Source: disabled indexers and indexers
// whose categories don't map to a known SourceGroup (see categories.ts) are excluded.
export async function buildProwlarrSources(
  config: ProwlarrConfig,
  opts: BuildProwlarrSourcesOptions = {},
): Promise<Source[]> {
  const fetch = opts.fetchIndexers ?? fetchIndexers;
  const indexers = await fetch(config);
  const sources: Source[] = [];
  for (const indexer of indexers) {
    if (!indexer.enable) continue;
    const group = mapCategoriesToGroup(indexer.categories);
    if (!group) continue;
    const id = prowlarrSourceId(indexer.id);
    sources.push({
      id,
      label: indexer.name,
      group,
      homepage: config.url,
      search: (query, searchOpts = {}) => search(config, indexer.id, id, query, searchOpts),
    });
  }
  return sources;
}

// Built-in sources use their fixed literal id; dynamically discovered sources
// (e.g. a Prowlarr indexer) use the `prowlarr:<indexerId>` convention, see
// prowlarrSourceId() in src/sources/prowlarr.ts.
export type SourceId = string;

export type SourceGroup = "Games" | "Movies" | "TV" | "Anime";

export interface TorrentResult {
  infoHash: string;
  name: string;
  sizeBytes: number;
  seeders: number;
  leechers: number;
  numFiles?: number;
  source: SourceId;
  magnet: string;
  added?: number;
}

export interface SearchOptions {
  signal?: AbortSignal;
}

export interface Source {
  id: SourceId;
  label: string;
  group: SourceGroup;
  homepage: string;
  search(query: string, opts?: SearchOptions): Promise<TorrentResult[]>;
}

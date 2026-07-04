import { fetchResilient, HttpError, USER_AGENT, type FetchImpl } from "../util/net";
import type { SearchOptions } from "../sources/types";
import type { ProwlarrConfig } from "../config/config";
import type { ProwlarrCategory } from "./categories";

export interface ProwlarrIndexer {
  id: number;
  name: string;
  enable: boolean;
  categories: ProwlarrCategory[];
}

export interface ProwlarrSearchResult {
  title: string;
  size?: number;
  seeders?: number;
  leechers?: number;
  publishDate?: string;
  magnetUrl?: string;
  infoHash?: string;
  downloadUrl?: string;
  indexerId?: number;
  guid?: string;
}

export interface ProwlarrRequestOptions extends SearchOptions {
  fetchImpl?: FetchImpl;
  retries?: number;
}

interface RawCategory {
  id?: number;
  name?: string;
}

interface RawIndexer {
  id?: number;
  name?: string;
  enable?: boolean;
  capabilities?: { categories?: RawCategory[] };
}

function headers(config: ProwlarrConfig): Record<string, string> {
  return { "User-Agent": USER_AGENT, "X-Api-Key": config.apiKey };
}

async function getJson<T>(
  url: string,
  config: ProwlarrConfig,
  opts: ProwlarrRequestOptions,
): Promise<T> {
  const res = await fetchResilient(url, {
    headers: headers(config),
    signal: opts.signal,
    fetchImpl: opts.fetchImpl,
    retries: opts.retries ?? 1,
  });
  if (!res.ok) throw new HttpError(res.status, `Prowlarr returned ${res.status}`);
  return (await res.json()) as T;
}

function mapCategories(raw: RawCategory[] | undefined): ProwlarrCategory[] {
  return (raw ?? [])
    .filter((c): c is Required<RawCategory> => typeof c.id === "number")
    .map((c) => ({ id: c.id, name: c.name ?? "" }));
}

export async function fetchIndexers(
  config: ProwlarrConfig,
  opts: ProwlarrRequestOptions = {},
): Promise<ProwlarrIndexer[]> {
  const raw = await getJson<RawIndexer[]>(`${config.url}/api/v1/indexer`, config, opts);
  return raw.map((r) => ({
    id: r.id ?? 0,
    name: r.name ?? `Indexer ${r.id ?? "?"}`,
    enable: r.enable ?? false,
    categories: mapCategories(r.capabilities?.categories),
  }));
}

export async function searchIndexer(
  config: ProwlarrConfig,
  indexerId: number,
  query: string,
  opts: ProwlarrRequestOptions = {},
): Promise<ProwlarrSearchResult[]> {
  const url = `${config.url}/api/v1/search?query=${encodeURIComponent(query)}&indexerIds=${indexerId}&type=search`;
  return getJson<ProwlarrSearchResult[]>(url, config, opts);
}

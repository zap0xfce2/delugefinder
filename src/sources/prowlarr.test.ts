import { describe, it, expect, vi } from "vitest";
import { buildProwlarrSources, prowlarrSourceId, mapSearchResult } from "./prowlarr";
import type { ProwlarrConfig } from "../config/config";
import type { ProwlarrIndexer } from "../prowlarr/client";

const config: ProwlarrConfig = { url: "http://localhost:9696", apiKey: "key123" };
const HASH = "abcdef0123456789abcdef0123456789abcdef01";

describe("prowlarrSourceId", () => {
  it("formats a stable id for an indexer", () => {
    expect(prowlarrSourceId(12)).toBe("prowlarr:12");
  });
});

describe("mapSearchResult", () => {
  it("uses the explicit infoHash when present, building a magnet from it", () => {
    const result = mapSearchResult(
      { title: "Some Release", infoHash: HASH.toUpperCase(), seeders: 3, leechers: 1, size: 100 },
      "prowlarr:1",
    );
    expect(result?.infoHash).toBe(HASH);
    expect(result?.magnet).toContain(`xt=urn:btih:${HASH}`);
    expect(result?.source).toBe("prowlarr:1");
    expect(result?.seeders).toBe(3);
  });

  it("derives the infoHash from magnetUrl when infoHash is absent", () => {
    const magnet = `magnet:?xt=urn:btih:${HASH}&dn=Some+Release`;
    const result = mapSearchResult({ title: "Some Release", magnetUrl: magnet }, "prowlarr:1");
    expect(result?.infoHash).toBe(HASH);
    expect(result?.magnet).toBe(magnet);
  });

  it("skips a result with neither infoHash nor a parsable magnetUrl", () => {
    expect(mapSearchResult({ title: "No Hash" }, "prowlarr:1")).toBeNull();
  });
});

describe("buildProwlarrSources", () => {
  const indexer = (overrides: Partial<ProwlarrIndexer>): ProwlarrIndexer => ({
    id: 1,
    name: "Test Indexer",
    enable: true,
    categories: [{ id: 2000, name: "Movies" }],
    ...overrides,
  });

  it("excludes a disabled indexer", async () => {
    const fetchIndexers = vi.fn(async () => [indexer({ enable: false })]);
    const sources = await buildProwlarrSources(config, { fetchIndexers });
    expect(sources).toEqual([]);
  });

  it("excludes an indexer with no mappable category", async () => {
    const fetchIndexers = vi.fn(async () => [
      indexer({ categories: [{ id: 3000, name: "Audio" }] }),
    ]);
    const sources = await buildProwlarrSources(config, { fetchIndexers });
    expect(sources).toEqual([]);
  });

  it("builds a virtual source with a prowlarr:<id> id and the mapped group", async () => {
    const fetchIndexers = vi.fn(async () => [indexer({ id: 42, name: "MovieHub" })]);
    const [source] = await buildProwlarrSources(config, { fetchIndexers });
    expect(source?.id).toBe("prowlarr:42");
    expect(source?.label).toBe("MovieHub");
    expect(source?.group).toBe("Movies");
  });
});

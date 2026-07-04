import { describe, it, expect } from "vitest";
import { fetchIndexers, searchIndexer } from "./client";
import type { ProwlarrConfig } from "../config/config";
import { HttpError } from "../util/net";

const config: ProwlarrConfig = { url: "http://localhost:9696", apiKey: "key123" };

function fakeRes(body: unknown, ok = true, status = 200): Response {
  return {
    ok,
    status,
    json: async () => body,
    headers: { get: () => null },
  } as unknown as Response;
}

describe("fetchIndexers", () => {
  it("sends the X-Api-Key header and requests the indexer list", async () => {
    let seenUrl = "";
    let seenHeaders: Record<string, string> = {};
    const fetchImpl = async (url: string, init?: RequestInit) => {
      seenUrl = url;
      seenHeaders = init?.headers as Record<string, string>;
      return fakeRes([]);
    };
    await fetchIndexers(config, { fetchImpl });
    expect(seenUrl).toBe("http://localhost:9696/api/v1/indexer");
    expect(seenHeaders["X-Api-Key"]).toBe("key123");
  });

  it("tolerates indexers missing optional fields", async () => {
    const fetchImpl = async () => fakeRes([{ id: 3, name: "MyIndexer" }]);
    const indexers = await fetchIndexers(config, { fetchImpl });
    expect(indexers).toEqual([{ id: 3, name: "MyIndexer", enable: false, categories: [] }]);
  });

  it("maps capability categories", async () => {
    const fetchImpl = async () =>
      fakeRes([
        {
          id: 5,
          name: "AnimeTracker",
          enable: true,
          capabilities: { categories: [{ id: 5070, name: "TV/Anime" }] },
        },
      ]);
    const indexers = await fetchIndexers(config, { fetchImpl });
    expect(indexers).toEqual([
      { id: 5, name: "AnimeTracker", enable: true, categories: [{ id: 5070, name: "TV/Anime" }] },
    ]);
  });

  it("throws HttpError on a non-2xx response", async () => {
    const fetchImpl = async () => fakeRes(null, false, 401);
    await expect(fetchIndexers(config, { fetchImpl })).rejects.toBeInstanceOf(HttpError);
  });
});

describe("searchIndexer", () => {
  it("requests the search endpoint scoped to one indexer with the X-Api-Key header", async () => {
    let seenUrl = "";
    let seenHeaders: Record<string, string> = {};
    const fetchImpl = async (url: string, init?: RequestInit) => {
      seenUrl = url;
      seenHeaders = init?.headers as Record<string, string>;
      return fakeRes([]);
    };
    await searchIndexer(config, 7, "dune part two", { fetchImpl });
    expect(seenUrl).toBe(
      "http://localhost:9696/api/v1/search?query=dune%20part%20two&indexerIds=7&type=search",
    );
    expect(seenHeaders["X-Api-Key"]).toBe("key123");
  });

  it("throws HttpError on a non-2xx response", async () => {
    const fetchImpl = async () => fakeRes(null, false, 500);
    await expect(
      searchIndexer(config, 7, "q", { fetchImpl, retries: 0 }),
    ).rejects.toBeInstanceOf(HttpError);
  });
});

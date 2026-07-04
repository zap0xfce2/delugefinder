import { describe, it, expect } from "vitest";
import { parseProwlarr } from "./config";

describe("parseProwlarr", () => {
  it("accepts a valid url and apiKey", () => {
    expect(parseProwlarr({ url: "http://localhost:9696", apiKey: "abc123" })).toEqual({
      url: "http://localhost:9696",
      apiKey: "abc123",
    });
  });

  it("rejects a missing url", () => {
    expect(parseProwlarr({ apiKey: "abc123" })).toBeNull();
  });

  it("rejects a missing apiKey", () => {
    expect(parseProwlarr({ url: "http://localhost:9696" })).toBeNull();
  });

  it("rejects non-object input", () => {
    expect(parseProwlarr("not-an-object")).toBeNull();
    expect(parseProwlarr(null)).toBeNull();
    expect(parseProwlarr(undefined)).toBeNull();
  });
});

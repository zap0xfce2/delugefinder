import { describe, it, expect } from "vitest";
import { sourceStyle, SOURCE_STYLE, COLOR } from "./theme";

describe("sourceStyle", () => {
  it("has no hand-picked entries left (all sources are dynamic)", () => {
    expect(SOURCE_STYLE).toEqual({});
  });

  it("falls back to a neutral dot when no id is given", () => {
    expect(sourceStyle()).toEqual({ tag: "•", color: COLOR.alt });
  });

  it("derives a deterministic style for an unknown id", () => {
    const a = sourceStyle("prowlarr:12", "Nyaa Anime Tracker");
    const b = sourceStyle("prowlarr:12", "Nyaa Anime Tracker");
    expect(a).toEqual(b);
  });

  it("derives the tag from the label when the id is unknown", () => {
    const style = sourceStyle("prowlarr:12", "Nyaa Anime Tracker");
    expect(style.tag).toBe("NYAA");
  });

  it("produces different colors for different unknown ids", () => {
    const a = sourceStyle("prowlarr:1", "Indexer One");
    const b = sourceStyle("prowlarr:2", "Indexer Two");
    expect(a.color).not.toBe(b.color);
  });
});

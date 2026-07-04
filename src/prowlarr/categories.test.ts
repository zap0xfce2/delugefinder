import { describe, it, expect } from "vitest";
import { mapCategoriesToGroup } from "./categories";

const cat = (id: number, name = ""): { id: number; name: string } => ({ id, name });

describe("mapCategoriesToGroup", () => {
  it("maps the Movies category range to Movies", () => {
    expect(mapCategoriesToGroup([cat(2000, "Movies")])).toBe("Movies");
  });

  it("maps the TV category range to TV", () => {
    expect(mapCategoriesToGroup([cat(5030, "TV/HD")])).toBe("TV");
  });

  it("maps the Games category ranges to Games", () => {
    expect(mapCategoriesToGroup([cat(1000, "Console")])).toBe("Games");
    expect(mapCategoriesToGroup([cat(4050, "PC/Games")])).toBe("Games");
  });

  it("maps the anime subcategory id to Anime instead of TV", () => {
    expect(mapCategoriesToGroup([cat(5070, "TV/Anime")])).toBe("Anime");
  });

  it("maps a TV-numbered category with 'anime' in its name to Anime", () => {
    expect(mapCategoriesToGroup([cat(5999, "Anime Series")])).toBe("Anime");
  });

  it("picks the majority group when categories span multiple groups", () => {
    expect(
      mapCategoriesToGroup([cat(2000, "Movies"), cat(2010, "Movies/HD"), cat(5030, "TV/HD")]),
    ).toBe("Movies");
  });

  it("breaks ties using the fixed group priority order", () => {
    expect(mapCategoriesToGroup([cat(2000, "Movies"), cat(5030, "TV/HD")])).toBe("Movies");
    expect(mapCategoriesToGroup([cat(5030, "TV/HD"), cat(5070, "TV/Anime")])).toBe("TV");
  });

  it("returns null when no category maps to a known group", () => {
    expect(mapCategoriesToGroup([cat(3000, "Audio"), cat(7000, "Books")])).toBeNull();
    expect(mapCategoriesToGroup([])).toBeNull();
  });
});

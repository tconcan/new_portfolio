import { describe, expect, it } from "vitest";
import { parseRange } from "./range";

describe("parseRange", () => {
  const size = 1000;

  it("parses a closed range", () => {
    expect(parseRange("bytes=0-1", size)).toEqual({ start: 0, end: 1 });
    expect(parseRange("bytes=100-199", size)).toEqual({ start: 100, end: 199 });
  });

  it("parses an open-ended range", () => {
    expect(parseRange("bytes=900-", size)).toEqual({ start: 900, end: 999 });
  });

  it("parses a suffix range", () => {
    expect(parseRange("bytes=-100", size)).toEqual({ start: 900, end: 999 });
    expect(parseRange("bytes=-5000", size)).toEqual({ start: 0, end: 999 });
  });

  it("clamps an end past the resource", () => {
    expect(parseRange("bytes=990-5000", size)).toEqual({ start: 990, end: 999 });
  });

  it("rejects unsatisfiable or malformed ranges", () => {
    expect(parseRange("bytes=1000-", size)).toBeNull();
    expect(parseRange("bytes=5-1", size)).toBeNull();
    expect(parseRange("bytes=-", size)).toBeNull();
    expect(parseRange("items=0-1", size)).toBeNull();
    expect(parseRange("bytes=0-1,5-6", size)).toBeNull();
    expect(parseRange("bytes=0-1", 0)).toBeNull();
  });
});

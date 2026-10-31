import { describe, expect, it } from "vitest";
import { TECH_COLORS } from "../data/projects";
import { readableTextColor } from "./color";

describe("readableTextColor", () => {
  it("uses dark text on light colors", () => {
    expect(readableTextColor("#F1E05A")).toBe("#111827"); // JavaScript yellow
    expect(readableTextColor("#ffffff")).toBe("#111827");
  });

  it("uses white text on dark colors", () => {
    expect(readableTextColor("#002A54")).toBe("#ffffff");
    expect(readableTextColor("#000000")).toBe("#ffffff");
  });

  it("only gives JavaScript dark text among the current tags", () => {
    const dark = Object.entries(TECH_COLORS)
      .filter(([, hex]) => readableTextColor(hex) === "#111827")
      .map(([tech]) => tech);
    expect(dark).toEqual(["JavaScript"]);
  });
});

import { describe, expect, it } from "vitest";
import { formatYearMonth } from "./date";

describe("formatYearMonth", () => {
  it("formats as short month and year", () => {
    expect(formatYearMonth("2025-08")).toBe("Aug 2025");
    expect(formatYearMonth("2024-12")).toBe("Dec 2024");
    expect(formatYearMonth("2023-01")).toBe("Jan 2023");
  });
});

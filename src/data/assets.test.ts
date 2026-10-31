import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { EXPERIENCES } from "./experience";
import { INVOLVEMENTS, ORGANIZATION_LOGOS } from "./involvement";
import { PROJECTS } from "./projects";

// Every image/video referenced by the content exists in public/.
const publicDir = fileURLToPath(new URL("../../public/", import.meta.url));
const publicFile = (path: string) => resolve(publicDir, path.replace(/^\//, ""));

const referenced = [
  ...PROJECTS.flatMap((p) => [p.image, p.video]),
  ...EXPERIENCES.map((e) => e.logo),
  ...INVOLVEMENTS.flatMap((i) => [i.logo, i.image]),
  ...ORGANIZATION_LOGOS.map((l) => l.image),
  ...PROJECTS.flatMap((p) => p.links.map((l) => l.url)).filter((url) => url.startsWith("/")),
].filter((path): path is string => Boolean(path));

describe("content assets", () => {
  it.each(referenced)("%s exists", (path) => {
    expect(existsSync(publicFile(path))).toBe(true);
  });
});

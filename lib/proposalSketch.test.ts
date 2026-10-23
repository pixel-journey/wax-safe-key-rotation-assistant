import { describe, expect, it } from "vitest";
import { demoSingleOwnerGraph } from "./rotationEngine";
import {
  buildUpdateAuthSketch,
  exportRotationJson,
  exportRotationMarkdown,
} from "./proposalSketch";

describe("proposalSketch", () => {
  it("builds active sketch with parent owner", () => {
    const s = buildUpdateAuthSketch(demoSingleOwnerGraph("a"), "active", [
      { key: "PUB_K1_new", weight: 1 },
    ]);
    expect(s.parent).toBe("owner");
    expect(s.keys).toHaveLength(1);
  });

  it("exports markdown with WharfKit note", () => {
    const md = exportRotationMarkdown(
      demoSingleOwnerGraph(),
      "owner",
      [{ key: "PUB_K1_x", weight: 1 }],
      [{ level: "warning", message: "test" }]
    );
    expect(md).toContain("WharfKit");
    expect(JSON.parse(exportRotationJson(demoSingleOwnerGraph(), "owner", [], [])).trustLabel).toBe(
      "educational-reference"
    );
  });
});

import { describe, expect, it } from "vitest";
import {
  demoSingleOwnerGraph,
  getMultiSigRequirements,
  validateRotation,
} from "./rotationEngine";

describe("validateRotation", () => {
  it("flags empty owner keys as danger", () => {
    const w = validateRotation(demoSingleOwnerGraph(), "owner", []);
    expect(w.some((x) => x.level === "danger")).toBe(true);
  });

  it("flags weight below threshold", () => {
    const g = demoSingleOwnerGraph();
    g.permissions.owner.threshold = 2;
    const w = validateRotation(g, "owner", [
      { key: "PUB_K1_onlyone", weight: 1 },
    ]);
    expect(
      w.some((x) => x.message.includes("below threshold"))
    ).toBe(true);
  });

  it("lists multi-sig requirements", () => {
    const req = getMultiSigRequirements(demoSingleOwnerGraph(), "owner");
    expect(req.length).toBeGreaterThan(0);
  });
});

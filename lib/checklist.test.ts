import { describe, expect, it } from "vitest";
import { postRotationChecklist } from "./checklist";

describe("postRotationChecklist", () => {
  it("mentions WharfKit and owner rule", () => {
    const steps = postRotationChecklist("owner", [{ key: "PUB_K1_a", weight: 1 }], []);
    expect(steps.some((s) => s.includes("WharfKit"))).toBe(true);
    expect(steps.some((s) => s.includes("owner"))).toBe(true);
  });
});

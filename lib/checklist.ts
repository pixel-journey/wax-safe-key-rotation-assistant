import type { ChangeWarning, KeyInput } from "./types";

export function postRotationChecklist(
  targetPerm: "owner" | "active",
  newKeys: KeyInput[],
  warnings: ChangeWarning[]
): string[] {
  const steps: string[] = [];
  const dangers = warnings.filter((w) => w.level === "danger");

  if (dangers.length > 0) {
    steps.push("Resolve all danger-level warnings before any on-chain updateauth.");
  }
  if (newKeys.length === 0) {
    steps.push("Do not submit an empty key set unless recovery is already proven.");
  }
  if (targetPerm === "owner") {
    steps.push("Confirm offline backup of new owner keys before broadcasting.");
    steps.push("Sign with current owner (or multi-sig) — active cannot change owner.");
  } else {
    steps.push("Keep owner recovery intact; test active after rotation with a low-value action.");
  }
  steps.push("Export MD/JSON plan for records.");
  steps.push("Implement broadcast only with WharfKit session.transact — not eosjs greenfield.");
  steps.push("Optional: re-audit with wax-account-permission-auditor after the change.");
  return steps;
}

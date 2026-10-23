import type { KeyInput, PermissionGraph, UpdateAuthSketch } from "./types";

/** Educational updateauth sketch — not for broadcast. */
export function buildUpdateAuthSketch(
  graph: PermissionGraph,
  targetPerm: "owner" | "active",
  newKeys: KeyInput[]
): UpdateAuthSketch {
  const node = graph.permissions[targetPerm];
  const parent =
    targetPerm === "owner"
      ? ""
      : (node?.parent ?? "owner") || "owner";

  return {
    account: graph.account,
    permission: targetPerm,
    parent,
    threshold: node?.threshold ?? 1,
    keys: newKeys.map((k) => ({ key: k.key, weight: k.weight })),
    note:
      "Map to eosio::updateauth with required_auth; sign via WharfKit. Never paste private keys here.",
  };
}

export function exportRotationMarkdown(
  graph: PermissionGraph,
  targetPerm: "owner" | "active",
  newKeys: KeyInput[],
  warnings: { level: string; message: string }[]
): string {
  const sketch = buildUpdateAuthSketch(graph, targetPerm, newKeys);
  const lines = [
    `# Key rotation plan — ${graph.account}@${targetPerm}`,
    "",
    "> Trust label: educational-reference · not broadcast",
    "",
    `**Threshold:** ${sketch.threshold} · **Parent:** ${sketch.parent || "(root)"}`,
    "",
    "## Proposed keys",
    "",
  ];
  if (newKeys.length === 0) lines.push("- (none — empty authority)");
  else
    for (const k of newKeys)
      lines.push(`- weight ${k.weight}: \`${k.key}\``);

  lines.push("", "## Warnings", "");
  for (const w of warnings) lines.push(`- **${w.level}**: ${w.message}`);

  lines.push(
    "",
    "## Sketch",
    "",
    "```json",
    JSON.stringify(sketch, null, 2),
    "```",
    "",
    "Prefer **WharfKit** session.transact for real updateauth.",
    ""
  );
  return lines.join("\n");
}

export function exportRotationJson(
  graph: PermissionGraph,
  targetPerm: "owner" | "active",
  newKeys: KeyInput[],
  warnings: { level: string; message: string }[]
): string {
  return JSON.stringify(
    {
      trustLabel: "educational-reference",
      sketch: buildUpdateAuthSketch(graph, targetPerm, newKeys),
      warnings,
    },
    null,
    2
  );
}

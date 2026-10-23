/**
 * Pure client-side key rotation safety engine (educational).
 * Does not broadcast updateauth — prefer WharfKit when implementing live flows.
 */

import type {
  ChangeWarning,
  KeyInput,
  PermissionGraph,
} from "./types";

const KEY_HINT =
  /^(PUB_K1_|PUB_R1_|EOS)[A-Za-z0-9]+$/;

export function validateRotation(
  current: PermissionGraph,
  targetPerm: "owner" | "active",
  newKeys: KeyInput[]
): ChangeWarning[] {
  const warnings: ChangeWarning[] = [];
  const ownerPerm = current.permissions.owner;
  const activePerm = current.permissions.active;
  const target = current.permissions[targetPerm];

  warnings.push({
    level: "warning",
    message:
      targetPerm === "owner"
        ? "Rotating owner must be authorized by current owner (or its multi-sig). Active cannot change owner."
        : "Active rotation is usually authorized by owner or active (depending on hierarchy). Confirm signing permission.",
    affectedPermission: targetPerm,
  });

  if (targetPerm === "owner" && newKeys.length === 0) {
    warnings.push({
      level: "danger",
      message:
        "Removing ALL owner keys is usually irreversible without a prior multi-sig recovery path.",
      affectedPermission: "owner",
    });
  }

  if (
    targetPerm === "active" &&
    newKeys.length === 0 &&
    (activePerm?.keys.length ?? 0) > 0
  ) {
    warnings.push({
      level: "danger",
      message:
        "Removing ALL active keys may block routine dApp actions until owner restores active.",
      affectedPermission: "active",
    });
  }

  const totalNewWeight = newKeys.reduce((s, k) => s + k.weight, 0);
  const threshold = target?.threshold ?? 1;
  if (newKeys.length > 0 && totalNewWeight < threshold) {
    warnings.push({
      level: "danger",
      message: `New ${targetPerm} keys total weight (${totalNewWeight}) is below threshold (${threshold}) — authority may be unsatisfiable.`,
      affectedPermission: targetPerm,
    });
  }

  if (newKeys.length === 1 && threshold === 1) {
    warnings.push({
      level: "warning",
      message: `Single-key ${targetPerm} with threshold 1 is a single point of failure.`,
      affectedPermission: targetPerm,
    });
  }

  for (const k of newKeys) {
    if (!k.key.trim()) {
      warnings.push({
        level: "danger",
        message: "Empty public key in proposal.",
        affectedPermission: targetPerm,
      });
    } else if (!KEY_HINT.test(k.key.trim())) {
      warnings.push({
        level: "warning",
        message: `Key format looks unusual: ${k.key.slice(0, 24)}… (expected PUB_K1_ / PUB_R1_ / EOS…).`,
        affectedPermission: targetPerm,
      });
    }
    if (k.weight <= 0) {
      warnings.push({
        level: "danger",
        message: `Key ${k.key.slice(0, 12)}… has non-positive weight.`,
        affectedPermission: targetPerm,
      });
    }
  }

  const existing = new Set((target?.keys ?? []).map((x) => x.key));
  for (const k of newKeys) {
    if (existing.has(k.key)) {
      warnings.push({
        level: "warning",
        message: `Key already present on ${targetPerm}: ${k.key.slice(0, 16)}…`,
        affectedPermission: targetPerm,
      });
    }
  }

  if (ownerPerm && targetPerm === "active") {
    const ownerKeys = new Set(ownerPerm.keys.map((k) => k.key));
    for (const k of newKeys) {
      if (ownerKeys.has(k.key)) {
        warnings.push({
          level: "warning",
          message:
            "Reusing an owner key on active increases blast radius if the hot key is compromised.",
          affectedPermission: "active",
        });
      }
    }
  }

  warnings.push({
    level: "safe",
    message:
      "Educational check only — does not broadcast. Prefer WharfKit session.transact for real updateauth.",
  });

  return warnings;
}

export function getMultiSigRequirements(
  current: PermissionGraph,
  targetPerm: "owner" | "active"
): string[] {
  const perm = current.permissions[targetPerm];
  if (!perm) return [`${targetPerm} permission missing from snapshot`];

  const requirements: string[] = [];
  requirements.push(
    `Threshold ${perm.threshold}; current keys ${perm.keys.length}; accounts ${perm.accounts.length}`
  );
  for (const k of perm.keys) {
    requirements.push(`key weight ${k.weight}: ${k.key.slice(0, 20)}…`);
  }
  for (const acc of perm.accounts) {
    requirements.push(
      `${acc.permission.actor}@${acc.permission.permission} (weight ${acc.weight})`
    );
  }
  return requirements;
}

export function demoSingleOwnerGraph(account = "demo"): PermissionGraph {
  return {
    account,
    permissions: {
      owner: {
        name: "owner",
        parent: null,
        threshold: 1,
        keys: [{ key: "PUB_K1_oldowner", weight: 1 }],
        accounts: [],
      },
      active: {
        name: "active",
        parent: "owner",
        threshold: 1,
        keys: [{ key: "PUB_K1_oldactive", weight: 1 }],
        accounts: [],
      },
    },
  };
}

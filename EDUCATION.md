# Safe key rotation (educational)

## Why this is high risk

A bad `updateauth` on **owner** can permanently lock an account. This blueprint is a **planning and validation** surface — not an auto-rotator.

## Owner vs active (locked teaching)

| Action | Who can authorize |
|--------|-------------------|
| Change `active` | Current `owner` (typical) or `active` when hierarchy allows |
| Change `owner` | **Only** current `owner` (or its multi-sig / weighted accounts) |
| `active` signs owner change | **Fails** — by design |

## Safe sequence

1. Visualize current structure (companion visualizer).
2. **Add** new keys/weights; keep old ones until verified.
3. Test new authority with a low-stakes action.
4. Only then remove compromised or retired weights.
5. Export checklist; coordinate multi-sig helpers if threshold > 1.

## Cluster

| Need | Repo |
|------|------|
| Rotate safely (this) | **safe-key-rotation-assistant** |
| See the tree | permission-visualizer |
| Batch risk | account-permission-auditor |
| Social owner design | social-recovery |
| Hardware cold owner | hardware-wallet-integration-patterns |
| msig lifecycle | multi-sig-proposal-builder |

Prefer **WharfKit** over eosjs / Anchor Link for greenfield signing.

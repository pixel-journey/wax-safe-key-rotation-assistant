# Education — safe key rotation (planning only)

> **Rung:** `npm test` passes. This plans a rotation. It does not broadcast `updateauth` and it must never ask for a private key.  
> **The test is the rule.** Official model: [WAX permissions](https://docs.wax.io/build/core-concepts/permissions). Recovery habits: [Security and recovery](https://docs.wax.io/learn/getting-started/security-and-recovery).

## Learning outcomes

| Level | After this file |
| --- | --- |
| Beginner | Never remove the last weight that reaches threshold |
| Intermediate | active cannot authorize an owner change |
| Masterclass | Add → verify → then remove; coordinate msig helpers |

---

## Beginner — predict, then run

| Call | Locked result |
| --- | --- |
| `validateRotation(demo, "owner", [])` | a warning at level `danger` |
| owner threshold 2, one key of weight 1 | a message containing `below threshold` |
| `getMultiSigRequirements(demo, "owner")` | a non-empty list |

```bash
npm test
```

---

## Intermediate — owner vs active

| Action | Who can authorize |
| --- | --- |
| Change `active` | Current `owner` (typical) or `active` when hierarchy allows |
| Change `owner` | **Only** current `owner` (or its multi-sig / weighted accounts) |
| `active` signs owner change | **Fails** — by design |

A bad `updateauth` on **owner** can permanently lock an account. This blueprint is a **planning and validation** surface — not an auto-rotator.

### Attack → test

| Attack | Lab behavior |
| --- | --- |
| Empty rotation plan on owner | danger warning |
| Drop below threshold | `below threshold` |
| Collect private key in UI | forbidden |
| Broadcast from unit tests | never |

---

## Masterclass — safe sequence

1. Visualize current structure ([visualizer](https://github.com/pixel-journey/wax-permission-visualizer-and-editor)).
2. **Add** new keys/weights; keep old ones until verified.
3. Test new authority with a low-stakes action.
4. Only then remove compromised or retired weights.
5. Export checklist; coordinate multi-sig helpers if threshold > 1 ([msig](https://github.com/pixel-journey/wax-multi-sig-proposal-builder-and-simulator)).

### Cluster

| Need | Repo |
| --- | --- |
| Rotate safely (this) | **safe-key-rotation-assistant** |
| See the tree | permission-visualizer |
| Batch risk | account-permission-auditor |
| Social owner design | social-recovery |
| Hardware cold owner | hardware-wallet-integration-patterns |
| msig lifecycle | multi-sig-proposal-builder |

Prefer **WharfKit** over eosjs / Anchor Link for greenfield signing.

### Exercises

1. Can `active` change `owner`? (**No**.)  
2. Remove-first or add-first? (**Add-first**.)  
3. Does this broadcast? (**No**.)

---

## What this course will not teach

- Auto-rotation of live authorities
- Private key collection
- That a plan is a signed proposal without WharfKit

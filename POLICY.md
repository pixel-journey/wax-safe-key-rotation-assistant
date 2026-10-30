# Policy — safe key rotation assistant

**Trust label:** `educational-reference`  
**Scope frozen:** Pass 10 (2026-10-30)

## In scope

- Guided 5-step wizard (select · keys · review · multi-sig surface · export)
- Pure `validateRotation` (owner/active asymmetry, empty sets, weight vs threshold, SPF, format hints)
- Soft-fail multi-RPC `get_account`
- Demos: single-owner · social 2-of-3 owner
- MD/JSON copy + download · post-rotation checklist
- Share `?a=` · myths · related blueprints

## Out of scope (by design)

- Auto-broadcast `updateauth` / `deleteauth`
- Full eosio.msig propose → approve → exec lifecycle → `wax-multi-sig-proposal-builder-and-simulator`
- Interactive permission tree / threshold lab → `wax-permission-visualizer-and-editor`
- Batch account risk scoring → `wax-account-permission-auditor`

## Hard rules

- Never collect private keys or seeds
- Prefer **WharfKit** for intentional live signing
- Active cannot change owner — always surface this asymmetry
- Add and verify new weights before removing old ones

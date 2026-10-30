# Policy — safe key rotation assistant

**Trust label:** `educational-reference`  
**Pass:** 9 (2026-10-30)

## In scope

- Guided wizard for proposing owner/active key sets
- Pure `validateRotation` warnings
- Soft-fail multi-RPC `get_account`
- MD/JSON export + post-rotation checklist
- Educational myths and demos (single-owner, social multi-party)

## Out of scope

- Auto-broadcast `updateauth`
- Full msig propose/approve/exec lifecycle → multi-sig blueprint
- Interactive permission tree → visualizer

## Rules

- Never collect private keys / seeds
- Prefer **WharfKit** for intentional live signing
- Active cannot change owner — always surface this asymmetry

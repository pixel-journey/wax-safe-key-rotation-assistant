# WharfKit + key rotation

**Trust label:** educational-reference

This assistant validates **proposed** owner/active key sets and exports educational `updateauth` sketches. It does **not** sign or broadcast.

1. Prefer **[@wharfkit/session](https://docs.wharfkit.com/)** for login and `session.transact`.
2. Avoid eosjs / UAL / standalone Anchor Link as primary greenfield stack.
3. Owner changes require owner authority; active cannot change owner.
4. Companions: auditor, permission visualizer, session-keys blueprint.

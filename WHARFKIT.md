# WharfKit + key rotation

**Trust label:** educational-reference

This assistant validates **proposed** owner/active key sets. It does **not** sign or broadcast `eosio::updateauth`.

When implementing live rotation:

1. Prefer **[@wharfkit/session](https://docs.wharfkit.com/)** for login and `session.transact`.
2. Do not start greenfield work on eosjs / UAL / standalone Anchor Link as the primary stack.
3. Owner changes require owner authority; active cannot elevate to change owner.
4. Companions: `wax-account-permission-auditor`, `wax-permission-visualizer-and-editor`, `wax-wharfkit-session-keys-and-linked-permissions`.

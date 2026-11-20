# Sources

| Source | Use |
| --- | --- |
| [WAX permissions](https://docs.wax.io/build/core-concepts/permissions) | Who may change owner/active |
| [Security and recovery](https://docs.wax.io/learn/getting-started/security-and-recovery) | Habits |
| [auditor](https://github.com/pixel-journey/wax-account-permission-auditor) | Batch risk |
| [visualizer](https://github.com/pixel-journey/wax-permission-visualizer-and-editor) | Tree before rotate |

## Product facts

- Empty owner keys → **danger**.
- Owner threshold unmet by proposed weights → "below threshold".
- Only **current owner** (or its multi-sig) can change owner; **active cannot**.
- Safe sequence: add → verify → then remove old weights.
- **Never** paste a private key. No `updateauth` broadcast in unit tests.

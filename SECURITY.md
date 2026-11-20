# Security — safe key rotation planner

## Closed in tests

| Issue | Behavior |
| --- | --- |
| Empty owner rotation | danger |
| Weight sum below threshold | warned |
| Private key input | never collected |
| Broadcast | not in tests |

## Not closed (production)

| Concern | Guidance |
| --- | --- |
| Live `updateauth` | WharfKit + explicit confirm only |
| Multi-sig coordination | helpers must sign before old weights drop |
| Compromised key still weighted | keep until new path verified |

## Attack angles

1. Remove-first rotation that locks the account.  
2. Letting `active` attempt an owner change.  
3. Auto-broadcasting from a "wizard."

## Honesty limits

[WAX permissions](https://docs.wax.io/build/core-concepts/permissions) · [Security and recovery](https://docs.wax.io/learn/getting-started/security-and-recovery) · [WharfKit](https://wharfkit.com/).

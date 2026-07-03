# wax-safe-key-rotation-assistant — Safe Key Rotation Assistant

> **Status:** 🔄 In Active Deep Refinement (PX Perfection Standard)  
> **Category:** Authentication, Multi-Sig & Permission Management (Core Antelope/EOSIO)  
> **Parent Catalog:** [pixel-journey/wax-ecosystem-blueprint-catalog](https://github.com/pixel-journey/wax-ecosystem-blueprint-catalog)
> **Benchmark Standard:** gkniftyheads-tracker quality + Pixel Journey retro-pixel excellence + PX Perfection Standard v1.0
> **Companion Tool:** [wax-permission-visualizer-and-editor](https://github.com/pixel-journey/wax-permission-visualizer-and-editor) — Use together for visual understanding before rotation

**One-sentence goal:** A guided, ultra-safe key rotation wizard for changing `owner` and `active` keys on WAX/Antelope accounts. Crystal-clear previews, powerful safety warnings, explicit owner/active asymmetry handling, multi-sig requirement checking, and direct WharfKit signing — all client-side with zero custom contracts.

---

## Repo Scope & Focus

This repository is designed to be the **definitive educational + interactive hub** for safely performing key rotations on Antelope/WAX accounts.

### Primary Focus Areas

- **Guided, Step-by-Step Wizard** — Clear mental model with live previews at every step.
- **Strong Safety Engine** — 12+ validation rules with contextual warnings.
- **Owner vs Active Asymmetry Education** — Makes this critical (and often misunderstood) concept impossible to ignore.
- **Multi-Sig Handling** — Proper support and education for rotating multi-sig accounts.
- **Reusable Components** — High-quality, educational React/TypeScript components.
- **WharfKit Integration** — Real on-chain signing examples.

### What This Repo Does *Not* Aim to Fully Cover

- General permission visualization (see `wax-permission-visualizer-and-editor`)
- Multi-sig proposal creation (see `wax-multi-sig-proposal-builder-and-simulator`)
- Batch permission auditing

---

## Educational Core — Why Safe Key Rotation Matters

Key rotation is one of the **most dangerous** operations on Antelope chains. A single mistake can permanently lock an account with almost no recovery path. This blueprint turns that high-risk operation into a calm, guided, educational experience.

### Core Antelope Permission Rules (Critical to Understand)

- **owner** is supreme: It can change `active` (and in limited cases, itself).
- **active CANNOT change owner**. This asymmetry is fundamental security design.
- Multi-sig thresholds must be satisfied by the **current** permission when submitting the rotation transaction.
- Losing the last `owner` key without proper multi-sig backup is usually **irreversible**.

### Why Key Rotation Goes Wrong So Often

Most problems happen because developers and users don’t fully internalize the owner/active asymmetry and multi-sig requirements. This tool makes those rules visible and impossible to ignore.

### Common Catastrophic Mistakes This Tool Prevents

| Mistake | Consequence | Why It Happens | How This Tool Prevents It |
|---------|-------------|----------------|---------------------------|
| Trying to rotate owner using only active | Transaction fails or is rejected | Misunderstanding of permission hierarchy | Clear enforcement + warnings before every step |
| Removing the last owner key | Permanent account lock | Panic or incomplete planning | Live preview + explicit "last key" warnings |
| Forgetting multi-sig requirements | Failed rotation or stuck account | Not checking current thresholds | Multi-sig requirement checker with clear explanation |
| Rotating active without understanding downstream effects | Linked permissions break | Poor mental model | Live before/after preview using PermissionTree |
| No backup plan before rotation | Irrecoverable loss | Overconfidence | Step-by-step wizard forces safety checks |

### Learning Outcomes

After using this blueprint, you will be able to:
- Safely plan and execute owner and active key rotations
- Understand and respect the owner/active asymmetry
- Properly handle multi-sig accounts during rotation
- Use live previews to validate changes before signing
- Build or integrate safe key rotation flows into your own applications

---

## Common Key Rotation Workflows

### 1. Rotating Active Keys (Most Common)

**Goal**: Replace compromised or old active keys without touching owner.

**Recommended Steps**:
1. Use the visualizer first to understand current structure.
2. Add new active keys first (never remove old ones immediately).
3. Verify new keys work with a test transaction.
4. Only then remove old keys.
5. Update any linked permissions if needed.

**Tool Support**: The wizard has a dedicated "Active Rotation" flow with live preview.

### 2. Rotating Owner Keys (High Risk)

**Goal**: Rotate the most powerful permission safely.

**Recommended Steps**:
1. **Never** start owner rotation without a clear backup plan.
2. Add new owner keys/multi-sig first.
3. Verify the new structure can control the account.
4. Only remove old owner keys after full validation.
5. Consider temporarily increasing multi-sig during transition.

**Tool Support**: Strong warnings + explicit "last owner key" detection.

### 3. Rotating Keys on a Multi-Sig Account

**Goal**: Change keys while maintaining multi-sig protection.

**Recommended Steps**:
1. Understand current multi-sig thresholds.
2. Add new keys to the relevant permission.
3. Ensure the new structure still meets the threshold.
4. Test with a small transaction before final changes.
5. Update any off-chain records or team access.

**Tool Support**: Multi-sig requirement checker + live threshold simulation.

---

## Anti-Patterns Specific to Key Rotation

| Anti-Pattern | Risk | Recommendation |
|--------------|------|----------------|
| Rotating owner using only active permission | Transaction fails or account becomes harder to recover | Always use current owner (or its multi-sig) for owner changes |
| Removing all keys from a permission | Account becomes unusable | Always leave at least one valid key with sufficient weight |
| Ignoring linked permissions during rotation | Smart contracts may break | Review linked permissions before rotating active |
| No testing before removing old keys | Irreversible mistakes | Always test new keys first |
| Rotating under time pressure | Mistakes become more likely | Never rotate when stressed or rushed — use the wizard calmly |

---

## Best Practices for Key Rotation

### General Recommendations

1. **Always visualize first** — Use the permission visualizer before any rotation.
2. **Add before you remove** — Never delete keys until new ones are confirmed working.
3. **Test thoroughly** — Use small test transactions after changes.
4. **Document everything** — Keep records of what was changed and why.
5. **Have a rollback plan** — Know how to recover if something goes wrong.
6. **Communicate with your team** — Especially important for multi-sig or DAO accounts.

### By Account Type

| Account Type     | Recommended Approach                          | Key Considerations                     |
|------------------|-----------------------------------------------|----------------------------------------|
| Personal Account | Simple active rotation with clear backup     | Keep owner extremely safe             |
| DAO / Multi-sig  | Careful multi-sig aware rotation             | Coordinate with all signers           |
| Game / dApp      | Rotate active frequently, owner rarely       | Balance security with operational needs |
| Treasury         | Very conservative owner rotation             | Multiple reviews and simulations      |

---

## Examples Folder

This repository includes a dedicated `/examples` folder with reusable components focused on safe key rotation:

- `KeyRotationWizard.tsx` — Main guided multi-step wizard
- `PermissionChangePreview.tsx` — Live before/after preview with embedded tree
- `SafetyWarningPanel.tsx` — Contextual safety warnings
- `MultiSigRequirementChecker.tsx` — Checks if current multi-sig can perform the rotation
- `OwnerActiveAsymmetryExplainer.tsx` — Educational component explaining the critical asymmetry
- `KeyInputForm.tsx` — Reusable form for adding new keys
- `RotationHistory.tsx` — Track previous rotations (for auditability)
- `BackupPlanChecker.tsx` — Helps users create a safe backup plan before rotating

These components are designed to be educational and reusable in other projects.

---

## 2. Tech Recommendations Matrix

| Component                    | Recommended (Chosen)                     | Alternative A                        | Alternative B                      | Pros of Chosen                              | Cons of Chosen                       | When to Choose Alternative          |
|------------------------------|------------------------------------------|--------------------------------------|------------------------------------|---------------------------------------------|--------------------------------------|-------------------------------------|
| **Wizard Flow**             | Multi-step with live side preview       | Single long form                     | Modal-heavy flow                   | Clear mental model, educational, safe       | Slightly more clicks                 | Single form if targeting power users |
| **Preview**                 | Live diff + embedded PermissionTree     | Text-only diff                       | Full transaction simulation        | Visual + educational (reuses companion)     | Requires companion integration       | Text diff for ultra-lightweight     |
| **Safety Engine**           | Pure client JS + 12+ rule validator     | On-chain dry-run                     | WASM simulation                    | Instant, free, fully educational            | Not 100% on-chain until signed       | On-chain dry-run for final check    |
| **Signing**                 | WharfKit Session Kit (optional)         | Manual transaction construction      | Legacy eosjs                       | Modern, type-safe, great UX                 | Requires user to have WharfKit setup | Manual if no wallet integration     |
| **State**                   | Zustand + URL params for steps          | Jotai                                | React Context + useReducer         | Tiny + excellent persistence + shareable    | Learning curve for new devs          | Jotai for simpler single-file demos |

**Why these win**: Every choice is documented with trade-offs so future devs and AI agents can adapt confidently.

---

## 3. Machine-Optimized Spec (spec.yaml)

```yaml
blueprint:
  id: wax-safe-key-rotation-assistant
  tier: 1
  category: security-foundational
  status: alpha-ready
  benchmark_target: gkniftyheads-tracker + PX
  companion: wax-permission-visualizer-and-editor

features:
  - guided_stepper_wizard
  - live_before_after_permission_preview
  - contextual_safety_warnings (12+ rules)
  - multi_sig_requirement_checker
  - owner_active_asymmetry_enforcement
  - wharfkit_direct_signing
  - retro_pixel_glassmorphic_theme

recommended_stack:
  framework: Next.js 15
  viz: embedded_permission_tree + diff
  safety: pure_client_js_validator
  signing: wharfkit_session

machine_instructions_for_ai:
  - "Create multi-step wizard with live permission preview"
  - "Implement 12+ safety validation rules for key rotation"
  - "Add multi-sig requirement display and owner/active rule enforcement"
  - "Integrate optional WharfKit signing with clear tx summary"
  - "Reuse PermissionTree component from companion repo where possible"
```

---

## 4. Complete Folder Structure

```
wax-safe-key-rotation-assistant/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                    # Main wizard with steps + live preview
│   └── globals.css
├── components/
│   ├── rotation/
│   │   ├── Stepper.tsx
│   │   ├── CurrentPermissionOverview.tsx
│   │   ├── KeyInputForm.tsx
│   │   ├── ChangePreview.tsx       # Side-by-side + embedded tree
│   │   ├── SafetyWarningPanel.tsx
│   │   └── MultiSigRequirementChecker.tsx
├── lib/
│   ├── types.ts
│   ├── rotationEngine.ts           # Core safety rules + validation
│   └── waxRpc.ts
├── hooks/
│   └── useWharfSession.ts
├── spec.yaml
├── README.md
├── package.json
└── next.config.js
```

## 5. Core Implementation Highlights

### 5.1 Types (lib/types.ts)
```ts
export interface RotationStep {
  id: number;
  title: string;
  description: string;
}

export interface KeyRotationState {
  account: string;
  currentPermissions: PermissionGraph;
  targetPermission: 'owner' | 'active';
  newKeys: Array<{ key: string; weight: number }>;
  warnings: ChangeWarning[];
  multiSigRequirements: string[];
}
```

### 5.2 Safety Engine (lib/rotationEngine.ts — excerpt)
```ts
export function validateRotation(
  current: PermissionGraph,
  targetPerm: 'owner' | 'active',
  newKeys: KeyInput[]
): ChangeWarning[] {
  const warnings: ChangeWarning[] = [];

  if (targetPerm === 'owner') {
    warnings.push({
      level: 'warning',
      message: 'This rotation requires the CURRENT owner permission (or its multi-sig) to sign.'
    });
  }

  if (targetPerm === 'active' && newKeys.length === 0) {
    warnings.push({ level: 'danger', message: 'You are about to remove ALL active keys — account may become unusable' });
  }

  // Additional 10+ rules: last owner key removal, threshold math, multi-sig compatibility, etc.
  return warnings;
}
```

*(Full 12+ rule engine committed in repo)*

### 5.3 Live Change Preview Component
Uses the same beautiful `PermissionTree` visual language from the companion visualizer for consistency across the ecosystem.

---

## 6. How to Run Locally
```bash
git clone https://github.com/pixel-journey/wax-safe-key-rotation-assistant.git
cd wax-safe-key-rotation-assistant
npm install
npm run dev
```

Enter an account → follow the 5-step guided wizard → see live preview + warnings → simulate or sign with WharfKit.

---

## 7. Integration & Machine Usage
- Copy `spec.yaml` into your project
- Paste into any AI: "Using this spec, build a safe key rotation flow for my DAO dashboard"
- Full synergy with `wax-permission-visualizer-and-editor` — visual first, then rotate safely

---

## 8. Accessibility & Retro Pixel Standards
- Full keyboard stepper navigation
- Strong visual + aria-live warnings
- Reduced motion support
- Glassmorphic CRT theme consistent with Pixel Journey design system

---

## 9. Related Blueprints
Direct companions in Tier 1 security foundation:
- `wax-permission-visualizer-and-editor`
- `wax-multi-sig-proposal-builder-and-simulator`
- `wax-account-permission-auditor`

---

## 10. License & Credits

MIT License — Built for safer key management on WAX and Antelope chains.
Pixel Journey — Beautiful, safe, educational interfaces for public blockchain data.

*Last updated: July 03, 2026*

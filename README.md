# wax-safe-key-rotation-assistant — Safe Key Rotation Assistant

> **Status:** 🔄 In Active Deep Refinement (PX Perfection Standard)  
> **Category:** Authentication, Multi-Sig & Permission Management (Core Antelope/EOSIO)  
> **Parent Catalog:** [pixel-journey/wax-ecosystem-blueprint-catalog](https://github.com/pixel-journey/wax-ecosystem-blueprint-catalog)
> **Benchmark Standard:** gkniftyheads-tracker quality + Pixel Journey retro-pixel excellence + PX Perfection Standard v1.0
> **Companion Tool:** [wax-permission-visualizer-and-editor](https://github.com/pixel-journey/wax-permission-visualizer-and-editor) — Use together for visual understanding before rotation

**One-sentence goal:** A guided, ultra-safe key rotation wizard for changing `owner` and `active` keys on WAX/Antelope accounts. Crystal-clear previews, powerful safety warnings, explicit owner/active asymmetry handling, multi-sig requirement checking, and direct WharfKit signing — all client-side with zero custom contracts.

---

## 1. Educational Core — Why Safe Key Rotation Matters

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

*Last updated: July 02, 2026 — Accelerated Deep Refinement Pass*
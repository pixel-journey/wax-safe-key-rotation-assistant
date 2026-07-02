# wax-safe-key-rotation-assistant — Safe Key Rotation Assistant

> **Status:** 🔒 Private (In Development) | Target Public Release: July 2026  
> **Category:** Authentication, Multi-Sig & Permission Management (Core Antelope/EOSIO)  
> **Parent Catalog:** [pixel-journey/wax-ecosystem-blueprint-catalog](https://github.com/pixel-journey/wax-ecosystem-blueprint-catalog)

**One-sentence goal:** A guided, safe key rotation assistant for changing owner and active keys on WAX/Antelope accounts, with clear previews, strong warnings, multi-sig support, and explicit handling of permission rules (owner can change active; active cannot change owner).

---

## 1. Overview & Goal

This blueprint provides a step-by-step, safety-first interface for rotating keys on Antelope-based accounts (WAX, EOS, etc.). It explains the critical rules, shows exactly what will happen before any transaction is signed, and supports multi-sig scenarios.

**Key Antelope/EOSIO Rules Highlighted:**
- The `owner` permission can change the `active` permission (and in some cases itself).
- The `active` permission **cannot** change the `owner` permission.
- Multi-sig setups (M-of-N) must be respected during rotation.
- Losing access to `owner` is usually irreversible without prior multi-sig planning.

**Why it matters for WAX/Antelope:**
- Key rotation is one of the most common and dangerous operations users perform.
- Poor tooling leads to permanent loss of account control.
- Beautiful, guided tooling dramatically improves security for individuals, teams, and DAOs.
- Pure client-side using standard Antelope RPCs and WharfKit.

**Target users:**
- Individual users who want to rotate keys safely
- Teams using multi-sig accounts
- Security-conscious projects and custodians
- Anyone recovering from compromised keys

**Success metrics:**
- Clear, step-by-step rotation flow with zero ambiguity
- Strong visual warnings and previews before signing
- 95+ Lighthouse scores
- Significant reduction in key rotation errors

---

## 2. Concepts & Inspiration

### Core Blockchain Concepts (Antelope/EOSIO)
- **owner vs active asymmetry**: Owner is supreme; active is for daily use. This asymmetry is by design for security.
- **Multi-sig during rotation**: If owner or active is multi-sig, the rotation transaction must satisfy the current threshold.
- **Weight and threshold mechanics**: Changing keys involves updating the permission structure with new public keys and weights.
- **Recovery planning**: Best practice is to set up multi-sig *before* needing it.

### User Pain Points Addressed
- Users often don't understand the owner/active distinction until it's too late.
- Existing tools (command line or basic explorers) provide little guidance or safety nets.
- Multi-sig key rotation is especially error-prone.

### Inspirations
- Traditional: Password managers with rotation wizards, enterprise key management systems with approval workflows.
- Web3: Gnosis Safe key rotation flows, hardware wallet key management UIs.
- Design: Stepper/wizard interfaces with clear warnings (like banking apps or password change flows).

**Related Blueprints (synergy):**
- Direct companion to `wax-permission-visualizer-and-editor`, `wax-multi-sig-proposal-builder-and-simulator`, and `wax-account-permission-auditor`.

---

## 3. Design Specifications (Pixel Journey Standards)

### 3.1 Visual & Interaction Design
- **Overall layout**: Clean wizard/stepper flow. Step 1: Current permission overview. Step 2: Choose what to rotate (active only, or owner). Step 3: Enter new keys. Step 4: Preview changes + warnings. Step 5: Review multi-sig requirements and sign.
- **Color palette**: Professional indigo with strong warning (amber/red) and success (emerald) accents. Dark mode first.
- **Micro-interactions**: Smooth step transitions, live preview of permission tree changes, animated warnings that expand on click.
- **Responsive**: Excellent desktop wizard experience; mobile-friendly simplified flow.

### 3.2 Key Views / Components
- `CurrentPermissionOverview.tsx` — Visual summary of current owner/active setup.
- `KeyInputForm.tsx` — Secure input for new public keys with validation.
- `ChangePreview.tsx` — Side-by-side or highlighted diff of before/after permission state.
- `SafetyWarningPanel.tsx` — Dynamic, context-aware warnings (e.g., "You are about to remove the only owner key").
- `MultiSigRequirementChecker.tsx` — Shows exactly which keys/accounts must sign the rotation transaction.
- `SigningStep.tsx` — WharfKit integration with clear transaction summary.

### 3.3 Accessibility (A11y) & Inclusive Design
- WCAG 2.2 AA: Full keyboard navigation through the wizard, high-contrast warnings, clear aria-live announcements of risks.
- Screen reader friendly: Structured reading of warnings and multi-sig requirements.

### 3.4 Performance & Optimization Targets
- Lighthouse 95+
- Instant previews of permission changes
- Smooth multi-step flow without page reloads

---

## 4. Technical Architecture

### 4.1 Core Tech Stack (Standardized)
- **Framework:** Next.js 15 (App Router) + TypeScript (strict)
- **Styling:** Tailwind CSS + shadcn/ui + framer-motion
- **State & Data:** @tanstack/react-query + zod + Jotai
- **Wallet & Signing:** @wharfkit/session (core to the signing step)
- **Blockchain Data:** Standard Antelope RPC calls (get_account, push_transaction)
- **Utilities:** date-fns, lucide-react, sonner

### 4.2 Data Flow Diagram
```
Enter account name
    ↓
Fetch current permissions (RPC)
    ↓
User selects what to rotate + enters new keys
    ↓
Live preview + safety analysis
    ↓
Check multi-sig requirements
    ↓
User reviews and signs via WharfKit
    ↓
Post-rotation verification
```

### 4.3 Folder Structure
```
app/
├── (rotation)/
│   └── page.tsx                 # Main key rotation wizard
├── components/
│   ├── rotation/
│   │   ├── CurrentPermissionOverview.tsx
│   │   ├── KeyInputForm.tsx
│   │   ├── ChangePreview.tsx
│   │   ├── SafetyWarningPanel.tsx
│   │   └── MultiSigRequirementChecker.tsx
├── hooks/
│   ├── useAccountPermissions.ts
│   └── useWharfkitSession.ts
├── lib/
│   ├── antelope/
│   │   ├── permission-analyzer.ts
│   │   └── rotation-validator.ts
│   └── utils.ts
├── types/
│   └── key-rotation.ts
public/
└── mock-accounts/               # Sample accounts with different permission setups
```

### 4.4 Security & Privacy Notes
- All analysis happens client-side until the final signing step
- Extremely strong warnings for irreversible or high-risk operations
- Clear separation between preview and actual transaction
- Support for multi-sig approval flows

---

## 5. Implementation Examples & Code Snippets

### 1. Permission change validation
```ts
// lib/antelope/rotation-validator.ts
export function canRotateOwner(currentPermissions, newOwnerKey) {
  // Check if the current active (or multi-sig) can authorize owner change
  // Enforce the rule that active cannot change owner
  if (!currentPermissions.ownerCanBeChangedByActive) {
    return { allowed: false, reason: "Active permission cannot modify owner" };
  }
  return { allowed: true };
}
```

### 2. Building the rotation transaction
```ts
// Use WharfKit to construct and sign the updateauth or similar action
```

---

## 6. Demo & Testing Strategy

- **Live Demo Toggle:** Mock accounts with various permission setups ↔ Live WAX accounts
- **Storybook** for wizard steps, previews, warnings
- **Playwright** e2e: view permissions → rotate active key → see warnings → sign
- **Vitest** for validation logic
- Vercel previews

---

## 7. Roadmap & Development Phases

**Phase 0 — Scaffold (1–2 days)**
- Next.js + Tailwind + permission fetching + basic wizard

**Phase 1 — Core Logic (4–5 days)**
- Permission analysis, rotation validation (owner/active rules), multi-sig requirement calculation

**Phase 2 — UI & Safety (4 days)**
- Stepper wizard, live previews, dynamic warning system, multi-sig checker

**Phase 3 — Polish (2–3 days)**
- Accessibility, performance, responsive design, edge case handling

**Phase 4 — Documentation & Release (2 days)**
- Full README, screenshots/GIFs, AI prompt pack, make public

**Future Enhancements**
- Batch rotation for multiple accounts
- Integration with hardware wallet flows
- Recovery planning templates (e.g., "Set up multi-sig before rotating")
- Support for custom permission structures

---

## 8. Visual References & Mockups

**Key Screen (Step 4 - Preview):**
Clean interface showing current permission tree on the left and proposed new state on the right with highlighted changes. Large warning banner if the operation would remove the last owner key or violate multi-sig rules. Clear "This transaction must be signed by the current owner (or its multi-sig)" notice.

> *Feels like a professional security key management tool — calm, clear, and extremely safety-focused.*

**ASCII Sketch:**
```
Current:                    Proposed:
Owner: [Key A]              Owner: [Key A] (unchanged)
Active: [Key B]             Active: [New Key C]

WARNING: You are about to replace the only active key.
This transaction requires the current owner permission.

[ Back ] [ Confirm & Sign with WharfKit ]
```

---

## 9. Related Blueprints & Ecosystem Fit

- `wax-permission-visualizer-and-editor` — Visual foundation for this rotation flow.
- `wax-multi-sig-proposal-builder-and-simulator` — Handles more complex multi-sig proposal scenarios.
- `wax-account-permission-auditor` — Can recommend rotation when risks are detected.

---

## 10. License, Contributing & Credits

- MIT License
- Built with ❤️ for safer key management on Antelope chains (WAX, EOS, etc.)
- Uses standard Antelope permission model
- Pixel Journey Design System for clarity and safety
- Special thanks to the detailed discussions on owner/active asymmetry and multi-sig best practices

**This blueprint turns one of the riskiest operations on Antelope chains into a guided, safe, and understandable process.**

*Pixel Journey — Beautiful interfaces for public blockchain data.*

---

*Last updated: July 02, 2026*
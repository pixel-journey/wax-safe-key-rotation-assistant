'use client';

import React, { useState } from 'react';
import { validateRotation, getMultiSigRequirements } from '@/lib/rotationEngine';
import { PermissionGraph } from '@/lib/types';

// Mock current permissions (in production: fetch from WAX RPC)
const mockPermissions: PermissionGraph = {
  account: 'pxjourney',
  lastUpdated: new Date().toISOString(),
  permissions: {
    owner: {
      name: 'owner',
      threshold: 1,
      keys: [{ key: 'EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV', weight: 1 }],
      accounts: [],
    },
    active: {
      name: 'active',
      threshold: 2,
      keys: [
        { key: 'EOS7r1n2v4v2v4v2v4v2v4v2v4v2v4v2v4v2v4v2v4v2v4v2v4v2', weight: 1 },
        { key: 'EOS8s3n2v4v2v4v2v4v2v4v2v4v2v4v2v4v2v4v2v4v2v4v2v4v2', weight: 1 },
      ],
      accounts: [{ permission: { actor: 'partneraccount', permission: 'active' }, weight: 1 }],
    },
  },
};

const steps = [
  { id: 1, title: 'Select Account & Permission', desc: 'Choose what you want to rotate' },
  { id: 2, title: 'Enter New Keys', desc: 'Add replacement public keys' },
  { id: 3, title: 'Review Changes & Warnings', desc: 'See exactly what will happen' },
  { id: 4, title: 'Multi-Sig Requirements', desc: 'Who must sign this rotation' },
  { id: 5, title: 'Confirm & Sign', desc: 'Review and submit via WharfKit' },
];

export default function SafeKeyRotationWizard() {
  const [account, setAccount] = useState('pxjourney');
  const [currentPermissions] = useState<PermissionGraph>(mockPermissions);
  const [targetPermission, setTargetPermission] = useState<'owner' | 'active'>('active');
  const [newKeys, setNewKeys] = useState<Array<{ key: string; weight: number }>>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [newKeyInput, setNewKeyInput] = useState('');

  const warnings = validateRotation(currentPermissions, targetPermission, newKeys);
  const multiSigReqs = getMultiSigRequirements(currentPermissions, targetPermission);

  const addKey = () => {
    if (!newKeyInput.trim()) return;
    setNewKeys([...newKeys, { key: newKeyInput.trim(), weight: 1 }]);
    setNewKeyInput('');
  };

  const removeKey = (index: number) => {
    setNewKeys(newKeys.filter((_, i) => i !== index));
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= 5) setCurrentStep(step);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="font-press-start text-2xl tracking-widest text-emerald-400">SAFE KEY ROTATION</div>
          <div className="text-xs opacity-60">Pixel Journey • WAX / Antelope • Companion to Permission Visualizer</div>
        </div>

        {/* Stepper */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {steps.map((step) => (
            <button
              key={step.id}
              onClick={() => goToStep(step.id)}
              className={`px-4 py-2 text-xs rounded-xl border whitespace-nowrap transition-all ${currentStep === step.id ? 'bg-emerald-600 border-emerald-400' : 'border-white/20 hover:bg-white/5'}`}
            >
              {step.id}. {step.title}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-7">
            {currentStep === 1 && (
              <div className="glassmorphic-crt pixel-border p-6 rounded-2xl">
                <h2 className="font-press-start text-sm mb-4">STEP 1: SELECT WHAT TO ROTATE</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs opacity-70">Account</label>
                    <input value={account} onChange={e => setAccount(e.target.value)} className="w-full mt-1 bg-black/60 border border-white/10 px-4 py-3 rounded-xl font-mono" />
                  </div>
                  <div>
                    <label className="text-xs opacity-70">Permission to Rotate</label>
                    <div className="flex gap-3 mt-2">
                      {(['active', 'owner'] as const).map(p => (
                        <button key={p} onClick={() => setTargetPermission(p)} className={`flex-1 py-3 rounded-xl border text-sm ${targetPermission === p ? 'bg-emerald-600 border-emerald-400' : 'border-white/20'}`}>
                          {p.toUpperCase()}
                        </button>
                      ))}
                    </div>
                    {targetPermission === 'owner' && <div className="mt-3 text-xs text-amber-400">⚠️ Owner rotation requires current owner (or multi-sig) authorization</div>}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="glassmorphic-crt pixel-border p-6 rounded-2xl">
                <h2 className="font-press-start text-sm mb-4">STEP 2: ENTER NEW KEYS</h2>
                <div className="flex gap-2 mb-4">
                  <input value={newKeyInput} onChange={e => setNewKeyInput(e.target.value)} placeholder="EOS6... or PUB_K1..." className="flex-1 bg-black/60 border border-white/10 px-4 py-3 rounded-xl font-mono text-sm" />
                  <button onClick={addKey} className="px-6 bg-emerald-600 rounded-xl">ADD KEY</button>
                </div>
                <div className="space-y-2">
                  {newKeys.length === 0 && <div className="text-xs opacity-60">No new keys added yet. Add at least one replacement key.</div>}
                  {newKeys.map((k, i) => (
                    <div key={i} className="flex justify-between items-center bg-black/40 px-4 py-2 rounded-lg text-xs font-mono">
                      <span>{k.key.slice(0, 30)}…</span>
                      <button onClick={() => removeKey(i)} className="text-red-400">Remove</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="glassmorphic-crt pixel-border p-6 rounded-2xl">
                <h2 className="font-press-start text-sm mb-4">STEP 3: REVIEW CHANGES & WARNINGS</h2>
                <div className="mb-4 text-xs opacity-70">Current → Proposed</div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="bg-black/40 p-4 rounded-xl">
                    <div className="font-mono mb-2 text-emerald-400">CURRENT {targetPermission.toUpperCase()}</div>
                    <pre className="text-[10px] opacity-80">{JSON.stringify(currentPermissions.permissions[targetPermission], null, 2)}</pre>
                  </div>
                  <div className="bg-black/40 p-4 rounded-xl">
                    <div className="font-mono mb-2 text-emerald-400">PROPOSED {targetPermission.toUpperCase()}</div>
                    <pre className="text-[10px] opacity-80">{JSON.stringify({ keys: newKeys, threshold: currentPermissions.permissions[targetPermission]?.threshold }, null, 2)}</pre>
                  </div>
                </div>

                {warnings.length > 0 && (
                  <div className="mt-6">
                    <div className="font-press-start text-xs mb-2">SAFETY WARNINGS</div>
                    {warnings.map((w, i) => (
                      <div key={i} className={`p-3 rounded-lg mb-2 text-xs ${w.level === 'danger' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'}`}>
                        {w.message}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {currentStep === 4 && (
              <div className="glassmorphic-crt pixel-border p-6 rounded-2xl">
                <h2 className="font-press-start text-sm mb-4">STEP 4: MULTI-SIG REQUIREMENTS</h2>
                <div className="text-xs opacity-80 mb-4">This rotation transaction must be signed by:</div>
                {multiSigReqs.length > 0 ? multiSigReqs.map((req, i) => (
                  <div key={i} className="px-4 py-2 bg-black/40 rounded-lg mb-2 text-sm font-mono">• {req}</div>
                )) : <div className="text-xs opacity-60">Single key — no additional multi-sig required.</div>}
              </div>
            )}

            {currentStep === 5 && (
              <div className="glassmorphic-crt pixel-border p-6 rounded-2xl">
                <h2 className="font-press-start text-sm mb-4">STEP 5: CONFIRM & SIGN</h2>
                <div className="text-sm mb-6 opacity-80">Review everything above. When ready, connect your wallet and sign the rotation transaction using WharfKit.</div>
                <button className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-medium tracking-wider">CONNECT WALLET & SIGN ROTATION</button>
                <div className="text-[10px] text-center mt-4 opacity-50">Transaction will be constructed client-side. No private keys ever leave your device.</div>
              </div>
            )}
          </div>

          {/* Live Preview Sidebar */}
          <div className="lg:col-span-5">
            <div className="glassmorphic-crt pixel-border p-5 rounded-2xl sticky top-6">
              <div className="font-press-start text-xs mb-3 tracking-widest">LIVE PREVIEW</div>
              <div className="text-xs opacity-70 mb-2">Current {targetPermission.toUpperCase()} Permission</div>
              <pre className="text-[10px] bg-black/60 p-3 rounded overflow-auto max-h-[280px]">{JSON.stringify(currentPermissions.permissions[targetPermission], null, 2)}</pre>
              <div className="mt-4 text-xs opacity-70">Proposed Changes</div>
              <div className="text-xs mt-1">New keys: {newKeys.length} | Warnings: {warnings.length}</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button onClick={() => goToStep(currentStep - 1)} disabled={currentStep === 1} className="px-6 py-3 border border-white/20 rounded-xl disabled:opacity-40">← Back</button>
          <button onClick={() => goToStep(currentStep + 1)} disabled={currentStep === 5} className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-xl">Next →</button>
        </div>

        <div className="mt-12 text-center text-[10px] opacity-50">Built to gkniftyheads-tracker + Pixel Journey standards • Companion to Permission Visualizer • Client-side only</div>
      </div>
    </div>
  );
}

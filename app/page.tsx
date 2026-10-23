'use client';

import React, { useMemo, useState } from 'react';
import {
  exportRotationJson,
  exportRotationMarkdown,
} from '@/lib/proposalSketch';
import {
  demoSingleOwnerGraph,
  getMultiSigRequirements,
  validateRotation,
} from '@/lib/rotationEngine';
import type { PermissionGraph } from '@/lib/types';

const steps = [
  { id: 1, title: 'Select', desc: 'Account & permission' },
  { id: 2, title: 'Keys', desc: 'Replacement keys' },
  { id: 3, title: 'Review', desc: 'Warnings' },
  { id: 4, title: 'Multi-sig', desc: 'Who must authorize' },
  { id: 5, title: 'Export', desc: 'Sketch only — no broadcast' },
];

export default function SafeKeyRotationWizard() {
  const [account, setAccount] = useState('demo');
  const [currentPermissions, setCurrentPermissions] = useState<PermissionGraph>(
    () => demoSingleOwnerGraph('demo')
  );
  const [targetPermission, setTargetPermission] = useState<'owner' | 'active'>(
    'active'
  );
  const [newKeys, setNewKeys] = useState<Array<{ key: string; weight: number }>>(
    []
  );
  const [currentStep, setCurrentStep] = useState(1);
  const [newKeyInput, setNewKeyInput] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const graph = useMemo(
    () => ({ ...currentPermissions, account }),
    [currentPermissions, account]
  );

  const warnings = validateRotation(graph, targetPermission, newKeys);
  const multiSigReqs = getMultiSigRequirements(graph, targetPermission);
  const dangerCount = warnings.filter((w) => w.level === 'danger').length;

  const addKey = () => {
    if (!newKeyInput.trim()) return;
    setNewKeys([...newKeys, { key: newKeyInput.trim(), weight: 1 }]);
    setNewKeyInput('');
  };

  const copy = async (text: string, ok: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus(ok);
    } catch {
      setStatus('Clipboard unavailable');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <div className="text-2xl tracking-widest text-emerald-400 font-bold">
            SAFE KEY ROTATION
          </div>
          <div className="text-xs opacity-60">
            Pixel Journey · Passes 1–4 frozen · educational-reference
          </div>
          <p className="text-xs opacity-50 mt-2 max-w-2xl">
            Validates proposed owner/active keys only. Prefer WharfKit for any real
            updateauth. Never paste private keys.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {steps.map((step) => (
            <button
              key={step.id}
              type="button"
              onClick={() => setCurrentStep(step.id)}
              className={`px-3 py-2 text-xs rounded-xl border ${
                currentStep === step.id
                  ? 'bg-emerald-600 border-emerald-400'
                  : 'border-white/20'
              }`}
            >
              {step.id}. {step.title}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              setCurrentPermissions(demoSingleOwnerGraph(account || 'demo'));
              setStatus('Loaded single-owner demo graph');
            }}
            className="px-3 py-2 text-xs rounded-xl bg-white/10"
          >
            Reset demo graph
          </button>
        </div>

        {status && (
          <p className="text-xs text-emerald-200/80 mb-4" role="status">
            {status}
          </p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-4">
            {currentStep === 1 && (
              <div className="border border-white/10 bg-black/40 p-6 rounded-2xl space-y-4">
                <h2 className="text-sm tracking-widest text-emerald-400">
                  STEP 1 · SELECT
                </h2>
                <input
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 px-4 py-3 rounded-xl font-mono text-sm"
                  placeholder="Account"
                />
                <div className="flex gap-3">
                  {(['active', 'owner'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setTargetPermission(p)}
                      className={`flex-1 py-3 rounded-xl border text-sm ${
                        targetPermission === p
                          ? 'bg-emerald-600 border-emerald-400'
                          : 'border-white/20'
                      }`}
                    >
                      {p.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="border border-white/10 bg-black/40 p-6 rounded-2xl">
                <h2 className="text-sm tracking-widest text-emerald-400 mb-4">
                  STEP 2 · KEYS
                </h2>
                <div className="flex gap-2 mb-4">
                  <input
                    value={newKeyInput}
                    onChange={(e) => setNewKeyInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addKey()}
                    placeholder="PUB_K1_… or EOS…"
                    className="flex-1 bg-black/60 border border-white/10 px-4 py-3 rounded-xl font-mono text-sm"
                  />
                  <button
                    type="button"
                    onClick={addKey}
                    className="px-6 bg-emerald-600 rounded-xl text-sm"
                  >
                    Add
                  </button>
                </div>
                <ul className="space-y-2 text-xs font-mono">
                  {newKeys.map((k, i) => (
                    <li
                      key={`${k.key}-${i}`}
                      className="flex justify-between bg-black/40 px-3 py-2 rounded-lg"
                    >
                      <span className="truncate">{k.key}</span>
                      <button
                        type="button"
                        className="text-red-400 shrink-0 ml-2"
                        onClick={() =>
                          setNewKeys(newKeys.filter((_, j) => j !== i))
                        }
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {currentStep === 3 && (
              <div className="border border-white/10 bg-black/40 p-6 rounded-2xl">
                <h2 className="text-sm tracking-widest text-emerald-400 mb-4">
                  STEP 3 · REVIEW ({dangerCount} danger)
                </h2>
                <ul className="space-y-2 text-xs">
                  {warnings.map((w, i) => (
                    <li
                      key={i}
                      className={
                        w.level === 'danger'
                          ? 'text-red-400'
                          : w.level === 'warning'
                            ? 'text-amber-400'
                            : 'text-emerald-400/80'
                      }
                    >
                      [{w.level}] {w.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {currentStep === 4 && (
              <div className="border border-white/10 bg-black/40 p-6 rounded-2xl">
                <h2 className="text-sm tracking-widest text-emerald-400 mb-4">
                  STEP 4 · AUTHORIZATION SURFACE
                </h2>
                <ul className="text-xs font-mono space-y-2">
                  {multiSigReqs.map((req) => (
                    <li key={req} className="bg-black/40 px-3 py-2 rounded-lg">
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {currentStep === 5 && (
              <div className="border border-white/10 bg-black/40 p-6 rounded-2xl space-y-3">
                <h2 className="text-sm tracking-widest text-emerald-400">
                  STEP 5 · EXPORT SKETCH (NOT SENT)
                </h2>
                <p className="text-xs opacity-60">
                  No wallet connect in this educational build. Copy a plan, then
                  implement with WharfKit when ready.
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      copy(
                        exportRotationMarkdown(
                          graph,
                          targetPermission,
                          newKeys,
                          warnings
                        ),
                        'Markdown plan copied'
                      )
                    }
                    className="px-4 py-2 rounded-xl bg-emerald-800 text-sm"
                  >
                    Copy MD
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      copy(
                        exportRotationJson(
                          graph,
                          targetPermission,
                          newKeys,
                          warnings
                        ),
                        'JSON sketch copied'
                      )
                    }
                    className="px-4 py-2 rounded-xl bg-sky-900 text-sm"
                  >
                    Copy JSON
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-5">
            <div className="border border-white/10 bg-black/40 p-5 rounded-2xl sticky top-6 text-xs">
              <div className="opacity-60 mb-2 tracking-widest">PREVIEW</div>
              <div className="font-mono mb-2">
                {account}@{targetPermission} · keys {newKeys.length} · dangers{' '}
                {dangerCount}
              </div>
              <pre className="bg-black/60 p-3 rounded overflow-auto max-h-64 text-[10px]">
                {JSON.stringify(
                  graph.permissions[targetPermission] ?? null,
                  null,
                  2
                )}
              </pre>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="px-6 py-3 border border-white/20 rounded-xl disabled:opacity-40"
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => setCurrentStep(Math.min(5, currentStep + 1))}
            disabled={currentStep === 5}
            className="px-8 py-3 bg-white/10 rounded-xl disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

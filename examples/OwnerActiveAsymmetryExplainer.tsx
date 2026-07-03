'use client';

import React from 'react';

interface OwnerActiveAsymmetryExplainerProps {
  className?: string;
}

/**
 * Educational component explaining the critical owner vs active asymmetry.
 */
export function OwnerActiveAsymmetryExplainer({ className = '' }: OwnerActiveAsymmetryExplainerProps) {
  return (
    <div className={`rounded-2xl border border-white/10 p-6 ${className}`}>
      <h3 className="font-semibold mb-4">Owner vs Active Asymmetry (Critical Concept)</h3>

      <div className="space-y-4 text-sm">
        <div className="bg-white/5 p-3 rounded">
          <div className="font-medium text-emerald-400 mb-1">Owner Permission</div>
          <ul className="text-xs space-y-1">
            <li>• Can change both owner and active permissions</li>
            <li>• Highest level of control</li>
            <li>• Should be extremely well protected (multi-sig recommended)</li>
            <li>• Losing it without backup is usually irreversible</li>
          </ul>
        </div>

        <div className="bg-white/5 p-3 rounded">
          <div className="font-medium text-amber-400 mb-1">Active Permission</div>
          <ul className="text-xs space-y-1">
            <li>• Can perform most actions on the account</li>
            <li>• <strong>CANNOT</strong> change the owner permission</li>
            <li>• Much safer to rotate than owner</li>
            <li>• Should still be protected, especially on high-value accounts</li>
          </ul>
        </div>

        <div className="text-xs text-muted-foreground border-l-2 border-emerald-400 pl-3">
          <strong>Key Rule:</strong> You can never use the active permission to rotate or recover the owner permission. 
          This asymmetry is one of the most important security features of Antelope.
        </div>
      </div>
    </div>
  );
}

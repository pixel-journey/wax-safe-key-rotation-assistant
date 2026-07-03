'use client';

import React from 'react';

interface MultiSigRequirementCheckerProps {
  currentThreshold: number;
  currentWeight: number;
  canPerformRotation: boolean;
  className?: string;
}

/**
 * Educational component that checks if the current multi-sig can perform a key rotation.
 */
export function MultiSigRequirementChecker({ currentThreshold, currentWeight, canPerformRotation, className = '' }: MultiSigRequirementCheckerProps) {
  return (
    <div className={`rounded-2xl border border-white/10 p-6 ${className}`}>
      <h3 className="font-semibold mb-4">Multi-Sig Requirement Checker</h3>

      <div className="text-sm mb-4">
        <span className="text-muted-foreground">Current Multi-Sig: </span>
        <span className="font-mono">{currentWeight} / {currentThreshold}</span>
      </div>

      <div className={`text-sm p-3 rounded ${canPerformRotation ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
        {canPerformRotation 
          ? '✓ Your current multi-sig has enough weight to perform this rotation.' 
          : '✗ Your current multi-sig does not have enough weight to perform this rotation.'}
      </div>

      {!canPerformRotation && (
        <p className="text-xs text-muted-foreground mt-3">
          You may need to use a higher permission (e.g. owner) or add more keys to the current permission before rotating.
        </p>
      )}
    </div>
  );
}

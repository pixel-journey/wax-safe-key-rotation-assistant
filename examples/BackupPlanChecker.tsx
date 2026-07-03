'use client';

import React from 'react';

interface BackupPlanCheckerProps {
  hasBackupPlan: boolean;
  backupMethods: string[];
  className?: string;
}

/**
 * Educational component that helps users think about backup plans before rotating keys.
 */
export function BackupPlanChecker({ hasBackupPlan, backupMethods, className = '' }: BackupPlanCheckerProps) {
  return (
    <div className={`rounded-2xl border border-white/10 p-6 ${className}`}>
      <h3 className="font-semibold mb-4">Backup Plan Checker</h3>

      <div className={`text-sm mb-4 ${hasBackupPlan ? 'text-emerald-400' : 'text-red-400'}`}>
        {hasBackupPlan 
          ? '✓ You have considered a backup plan' 
          : '⚠️ No backup plan detected — this is risky'}
      </div>

      {backupMethods.length > 0 && (
        <div>
          <div className="text-xs text-muted-foreground mb-2">Your planned backup methods:</div>
          <ul className="text-xs space-y-1">
            {backupMethods.map((method, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="text-emerald-400">→</span> {method}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!hasBackupPlan && (
        <p className="text-xs text-muted-foreground mt-3">
          Before rotating keys, always have at least one recovery method (another key, multi-sig, trusted contact, etc).
        </p>
      )}
    </div>
  );
}

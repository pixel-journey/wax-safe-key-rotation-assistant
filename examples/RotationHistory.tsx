'use client';

import React from 'react';

interface RotationRecord {
  id: string;
  date: string;
  permission: string;
  action: string;
  status: string;
}

interface RotationHistoryProps {
  records: RotationRecord[];
  className?: string;
}

/**
 * Educational component for showing previous key rotation history.
 */
export function RotationHistory({ records, className = '' }: RotationHistoryProps) {
  return (
    <div className={`rounded-2xl border border-white/10 p-6 ${className}`}>
      <h3 className="font-semibold mb-4">Rotation History</h3>

      {records.length > 0 ? (
        <div className="space-y-2">
          {records.map((record, index) => (
            <div key={index} className="flex justify-between items-center bg-white/5 p-2 rounded text-sm">
              <div>
                <span className="font-medium">{record.permission}</span> — {record.action}
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-muted-foreground">{record.date}</span>
                <span className="text-emerald-400">{record.status}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No rotation history available.</p>
      )}
    </div>
  );
}

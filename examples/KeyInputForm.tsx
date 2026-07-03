'use client';

import React, { useState } from 'react';

interface KeyInput {
  key: string;
  weight: number;
}

interface KeyInputFormProps {
  keys: KeyInput[];
  onAddKey: (key: KeyInput) => void;
  onRemoveKey: (index: number) => void;
  className?: string;
}

/**
 * Reusable form for adding new keys during rotation.
 */
export function KeyInputForm({ keys, onAddKey, onRemoveKey, className = '' }: KeyInputFormProps) {
  const [newKey, setNewKey] = useState('');
  const [newWeight, setNewWeight] = useState(1);

  const handleAdd = () => {
    if (newKey.trim()) {
      onAddKey({ key: newKey.trim(), weight: newWeight });
      setNewKey('');
      setNewWeight(1);
    }
  };

  return (
    <div className={`rounded-2xl border border-white/10 p-6 ${className}`}>
      <h3 className="font-semibold mb-4">Add New Keys</h3>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Public Key"
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
          className="flex-1 bg-black/50 border border-white/10 rounded px-3 py-2 text-sm"
        />
        <input
          type="number"
          min="1"
          value={newWeight}
          onChange={(e) => setNewWeight(parseInt(e.target.value) || 1)}
          className="w-20 bg-black/50 border border-white/10 rounded px-3 py-2 text-sm"
        />
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded text-sm"
        >
          Add
        </button>
      </div>

      {keys.length > 0 && (
        <div className="space-y-2">
          {keys.map((k, index) => (
            <div key={index} className="flex justify-between items-center bg-white/5 p-2 rounded text-sm">
              <span className="font-mono truncate">{k.key}</span>
              <div className="flex items-center gap-2">
                <span className="text-amber-400">{k.weight}</span>
                <button onClick={() => onRemoveKey(index)} className="text-red-400 text-xs hover:underline">Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

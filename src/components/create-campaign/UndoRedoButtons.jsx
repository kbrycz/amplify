import React from 'react';
import { Undo2, Redo2 } from 'lucide-react';

export function UndoRedoButtons({ canUndo, canRedo, onUndo, onRedo }) {
  return (
    <div className="fixed bottom-6 left-6 z-50 flex items-center gap-2">
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className={`rounded-lg p-2 transition-colors ${
          canUndo
            ? 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'
        } shadow-lg ring-1 ring-black/5 dark:ring-white/10`}
        title="Undo (Ctrl+Z)"
      >
        <Undo2 className="h-5 w-5" />
      </button>
      <button
        onClick={onRedo}
        disabled={!canRedo}
        className={`rounded-lg p-2 transition-colors ${
          canRedo
            ? 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'
        } shadow-lg ring-1 ring-black/5 dark:ring-white/10`}
        title="Redo (Ctrl+Y)"
      >
        <Redo2 className="h-5 w-5" />
      </button>
    </div>
  );
}
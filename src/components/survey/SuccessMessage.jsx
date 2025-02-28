import React from 'react';
import { CheckCircle } from 'lucide-react';

export function SuccessMessage({ theme, themes }) {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
        <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
      </div>
      <h2 className={`mt-4 text-2xl font-bold ${theme ? themes[theme].text : 'text-gray-900 dark:text-white'}`}>Thank You!</h2>
      <p className={`mt-2 text-base ${theme ? themes[theme].subtext : 'text-gray-600 dark:text-gray-400'}`}>
        Your video has been uploaded successfully. We appreciate your participation!
      </p>
      <button
        onClick={() => window.close()}
        className={`mt-8 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium ${
          theme 
            ? `${themes[theme].border} border-2 ${themes[theme].text} hover:bg-white/10` 
            : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800'
        }`}
      >
        Close Window
      </button>
    </div>
  );
}
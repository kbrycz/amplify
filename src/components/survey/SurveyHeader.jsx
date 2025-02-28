import React from 'react';
import { ChevronRight } from 'lucide-react';

export function SurveyHeader({ campaign, theme, themes, goToNextStep }) {
  return (
    <div className="text-center">
      <h1 className={`mt-4 text-3xl font-bold tracking-tight ${theme ? themes[theme].text : 'text-gray-900 dark:text-white'} sm:text-4xl`}>
        {campaign.name}
      </h1>
      <p className={`mt-4 text-base ${theme ? themes[theme].subtext : 'text-gray-600 dark:text-gray-400'}`}>
        {campaign.description}
      </p>
      <button
        onClick={goToNextStep}
        className={`mt-8 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium ${
          theme 
            ? `${themes[theme].border} border-2 ${themes[theme].text} hover:bg-white/10` 
            : 'bg-indigo-600 text-white hover:bg-indigo-700'
        }`}
      >
        Get Started
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
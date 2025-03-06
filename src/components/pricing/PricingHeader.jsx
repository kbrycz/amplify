import React from 'react';
import { ArrowLeft } from 'lucide-react';

export default function PricingHeader({ isFromSettings, handleBackToSettings }) {
  return (
    <>
      {isFromSettings && (
        <div className="mb-8">
          <button
            onClick={handleBackToSettings}
            className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Account Settings
          </button>
        </div>
      )}
      <div className="text-center">
        <h2 className="text-base font-semibold leading-7 text-indigo-600 dark:text-indigo-400">Pricing</h2>
        <p className="mt-2 text-4xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-5xl mx-auto max-w-4xl">
          Simple, transparent pricing
        </p>
        <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 mx-auto max-w-2xl">
          Choose the perfect plan for your needs. Save 20% with annual billing. All plans include unlimited storage for responses.
        </p>
      </div>
    </>
  );
}
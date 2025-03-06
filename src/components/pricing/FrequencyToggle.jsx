import React from 'react';
import { classNames } from './utils';

export default function FrequencyToggle({ frequency, setFrequency, isLoading, frequencies }) {
  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-2 gap-x-1 rounded-full bg-gray-100 p-1 text-center text-xs font-semibold text-gray-900 dark:bg-gray-800">
        {frequencies.map((option) => (
          <button
            key={option.value}
            onClick={() => !isLoading && setFrequency(option)}
            disabled={isLoading}
            className={classNames(
              option === frequency
                ? 'bg-white text-gray-900 dark:bg-gray-900 dark:text-white'
                : 'text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800/50',
              'cursor-pointer rounded-full px-2.5 py-1',
              isLoading ? 'opacity-60 cursor-not-allowed' : ''
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
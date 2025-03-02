import React, { useState } from 'react';
import { Tab } from '@headlessui/react';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function MobileFeatures({ features }) {
  const [selectedFeature, setSelectedFeature] = useState(0);

  return (
    <div className="lg:hidden">
      {/* Feature Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
        <img
          src={features[selectedFeature].image}
          alt={features[selectedFeature].title}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0" />
        
        {/* Feature Icon */}
        <div className="absolute bottom-4 left-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm">
            {React.createElement(features[selectedFeature].icon, {
              className: `h-5 w-5 ${features[selectedFeature].color}`
            })}
          </div>
          <div>
            <p className="text-sm font-medium text-white">
              {features[selectedFeature].title}
              <span className="block mt-1 text-xs text-gray-300">
                {features[selectedFeature].description}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Feature Buttons */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {features.map((feature, index) => (
          <button
            key={feature.title}
            onClick={() => setSelectedFeature(index)}
            className={classNames(
              selectedFeature === index
                ? 'border-indigo-600 bg-indigo-50 text-indigo-600 dark:border-indigo-400 dark:bg-indigo-900/20 dark:text-indigo-400'
                : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800',
              'flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-colors'
            )}
          >
            {React.createElement(feature.icon, {
              className: classNames(
                selectedFeature === index ? feature.color : 'text-gray-400 dark:text-gray-600',
                'h-6 w-6'
              )
            })}
            <span className="text-xs font-medium">{feature.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
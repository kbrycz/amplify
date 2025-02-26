import React from 'react';

export function FeatureGrid({ features }) {
  return (
    <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
      {features.map((feature, index) => (
        <div key={index} className="flex flex-col items-center">
          <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${feature.iconBg}`}>
            <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
          </div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">{feature.title}</h3>
          <p className="mt-1 text-center text-sm text-gray-500 dark:text-gray-400">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  );
}
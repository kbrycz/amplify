import React from 'react';

export function MetricGroup({ items }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mt-2">
      {items.map((item, index) => (
        <div key={index}>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            {item.icon}
            <span className="font-medium">{item.value}</span>
          </div>
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-500">{item.label}</div>
        </div>
      ))}
    </div>
  );
}
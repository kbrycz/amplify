import React from "react";
import { NumberTicker } from "./number-ticker";

export function MetricCard({ title, value, icon: Icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6
        transition-all duration-200 ease-in-out hover:scale-[1.02] hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-700
        cursor-pointer"
    >
      <div className="space-y-2">
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </div>
        
        <div className="flex items-baseline justify-between">
          <NumberTicker 
            value={value} 
            className="text-4xl font-semibold tracking-tight text-gray-900 dark:text-white"
          />
          {Icon && (
            <div className="rounded-md bg-gray-100/80 p-2 dark:bg-gray-800">
              <Icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
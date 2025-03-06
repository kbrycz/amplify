import React from 'react';
import { X, ArrowDown, MinusCircle } from 'lucide-react';
import { classNames } from './utils';

export default function DowngradeModal({
  show,
  onCancel,
  onConfirm,
  userPlan,
  planToDowngradeTo,
  frequency,
  getLostFeatures,
  getPlanPrice
}) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onCancel}
      />
      <div className="relative w-full max-w-lg transform overflow-hidden rounded-lg bg-white shadow-xl transition-all dark:bg-gray-900 sm:my-8">
        <div className="px-4 pb-4 pt-5 sm:p-6">
          <div className="absolute right-4 top-4">
            <button
              onClick={onCancel}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/50">
              <ArrowDown className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="mt-3 text-center sm:mt-5">
              <h3 className="text-lg font-semibold leading-6 text-gray-900 dark:text-white">
                Confirm Downgrade to {planToDowngradeTo === 'basic' ? 'Basic' : 'Pro'} Plan
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {userPlan === 'premium' && planToDowngradeTo === 'pro' ? (
                    <>Downgrading from Premium to Pro will cancel your current subscription immediately. You'll lose access to Premium features and your remaining subscription period won't be refunded.</>
                  ) : (
                    <>Downgrading to the {planToDowngradeTo === 'basic' ? 'Basic' : 'Pro'} plan will cancel your current subscription immediately. You'll lose access to {userPlan === 'premium' ? 'Premium' : 'Pro'} features and your remaining subscription period won't be refunded.</>
                  )}
                </p>
              </div>
            </div>
          </div>
          {/* Lost Features */}
          <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Features you'll lose with this downgrade:
            </h4>
            <ul className="mt-2 space-y-2">
              {getLostFeatures(userPlan, planToDowngradeTo).map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <MinusCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* Price Comparison */}
          <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Price change:
            </h4>
            <div className="mt-2 flex items-center justify-center gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Current</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {getPlanPrice(userPlan, frequency.value)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {frequency.label}
                </p>
              </div>
              <ArrowDown className="h-5 w-5 text-gray-400" />
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">New</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {getPlanPrice(planToDowngradeTo, frequency.value)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {frequency.label}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={onCancel}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Confirm Downgrade
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { Check, ArrowRight, Plus } from 'lucide-react';
import { classNames } from './utils';

export default function PricingPlans({ 
  pricing, 
  frequency, 
  isLoading, 
  selectedPlan, 
  handleSelectPlan, 
  isFromSettings, 
  userPlan 
}) {
  // getPlanPrice is defined in the container; here we can directly use tier.price[frequency.value]
  return (
    <div className="relative mx-auto mt-10">
      <div className="relative grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        {pricing.tiers.map((tier) => (
          <div
            key={tier.id}
            className={classNames(
              tier.featured
                ? 'z-10 bg-white shadow-xl ring-1 ring-gray-900/10 dark:bg-gray-800 dark:ring-white/10'
                : 'bg-gray-100/80 ring-1 ring-gray-900/10 dark:bg-gray-800/50 dark:ring-white/10',
              'relative rounded-2xl'
            )}
          >
            <div className="p-8 lg:pt-12 xl:p-10 xl:pt-14">
              <h2
                id={tier.id}
                className="text-sm font-semibold leading-6 text-gray-900 dark:text-white"
              >
                {tier.name}
              </h2>
              <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between lg:flex-col lg:items-stretch">
                <div className="mt-2 flex items-center gap-x-4">
                  <p className="text-4xl font-semibold tracking-tight text-gray-900 dark:text-white">
                    {tier.price[frequency.value]}
                  </p>
                  <div className="text-sm">
                    <p className="text-gray-900 dark:text-white">USD</p>
                    {tier.price[frequency.value] !== '$0' && (
                      <p className="text-gray-500 dark:text-gray-400">
                        {frequency.value === 'annually' ? 'Billed yearly (20% off)' : 'Billed monthly'}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleSelectPlan(tier)}
                  className={classNames(
                    tier.featured
                      ? 'bg-indigo-600 text-white hover:bg-indigo-500 dark:hover:bg-indigo-400'
                      : 'bg-gray-800 text-white hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100',
                    'rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
                    (isLoading && selectedPlan?.id !== tier.id) ? 'opacity-60 cursor-not-allowed' : '',
                    (isLoading && selectedPlan?.id === tier.id) ? 'opacity-75 cursor-not-allowed' : '',
                    (isFromSettings && tier.planId === userPlan) ? 'ring-2 ring-indigo-500 dark:ring-indigo-400 cursor-not-allowed' : ''
                  )}
                  disabled={isLoading || (isFromSettings && tier.planId === userPlan)}
                >
                  {isLoading && selectedPlan?.id === tier.id ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    isFromSettings && tier.planId === userPlan ? (
                      <span className="flex items-center justify-center">
                        <Check className="h-4 w-4 mr-1" />
                        Current Plan
                      </span>
                    ) : (
                      tier.name
                    )
                  )}
                </button>
              </div>
              {tier.noPaymentRequired && (
                <p className="mt-4 text-sm text-green-600 dark:text-green-400">
                  No payment information required
                </p>
              )}
              <div className="mt-8 flow-root sm:mt-10">
                <ul
                  role="list"
                  className={classNames(
                    tier.featured
                      ? 'divide-gray-900/5 border-gray-900/5 text-gray-600 dark:divide-white/5 dark:border-white/5 dark:text-gray-300'
                      : 'divide-gray-900/5 border-gray-900/5 text-gray-600 dark:divide-white/5 dark:border-white/5 dark:text-gray-300',
                    '-my-2 divide-y border-t text-sm leading-6'
                  )}
                >
                  {tier.mainFeatures.map((feature) => (
                    <li key={feature} className="flex gap-x-3 py-2">
                      <Check
                        className={classNames(
                          tier.featured ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400',
                          'h-6 w-5 flex-none'
                        )}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
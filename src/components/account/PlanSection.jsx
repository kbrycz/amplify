import React from 'react';
import { Check, Crown, Zap, ArrowRight } from 'lucide-react';

export default function PlanSection({ userPlan, planSuccessMessage, getPlanDisplayName, handleNavigateToPricing }) {
  return (
    <div className="grid max-w-7xl grid-cols-1 gap-x-8 md:grid-cols-[300px,1fr]">
      <div className="py-6">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">Current Plan</h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Manage your subscription and billing details.
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        {planSuccessMessage && (
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-400">
            <Check className="h-4 w-4" />
            {planSuccessMessage}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {getPlanDisplayName(userPlan)}
                </h3>
                <span className="inline-flex items-center rounded-full bg-primary-50 px-2 py-1 text-xs font-medium text-primary-700 ring-1 ring-inset ring-primary-600/20 dark:bg-primary-900/30 dark:text-primary-400 dark:ring-primary-500/20">
                  Current Plan
                </span>
              </div>
            </div>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {userPlan === 'basic'
                ? 'Free tier with basic features'
                : userPlan === 'pro'
                ? 'Professional tier with advanced features'
                : 'Premium tier with all features'}
            </p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-sm text-gray-600 dark:text-gray-400">Current billing period</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {userPlan === 'basic' ? 'N/A (Free plan)' : 'Monthly'}
            </p>
          </div>
        </div>
        <div className="mt-4 sm:hidden">
          <p className="text-sm text-gray-600 dark:text-gray-400">Current billing period</p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {userPlan === 'basic' ? 'N/A (Free plan)' : 'Monthly'}
          </p>
        </div>

        <div className="mt-8">
          <div className="rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
            <div className="flex flex-col p-6 sm:flex-row sm:items-start sm:gap-4">
              <div className="mx-auto mb-4 rounded-full bg-primary-100 p-2.5 dark:bg-primary-900/50 sm:mx-0 sm:mb-0">
                <Crown className="h-5 w-5 text-primary-text-600 dark:text-primary-text-400" />
              </div>
              <div className="flex-1">
                {userPlan === 'basic' && (
                  <h3 className="text-center text-lg font-semibold text-gray-900 dark:text-white sm:text-left">
                    Upgrade to Premium
                  </h3>
                )}
                {userPlan === 'pro' && (
                  <h3 className="text-center text-lg font-semibold text-gray-900 dark:text-white sm:text-left">
                    Upgrade to Premium
                  </h3>
                )}
                {userPlan === 'premium' && (
                  <h3 className="text-center text-lg font-semibold text-gray-900 dark:text-white sm:text-left">
                    Manage Your Subscription
                  </h3>
                )}

                <p className="mt-1 text-center text-sm text-gray-600 dark:text-gray-400 sm:text-left">
                  {userPlan === 'basic'
                    ? 'Get access to advanced features and unlimited campaigns'
                    : userPlan === 'pro'
                    ? 'Upgrade to our premium tier for even more features'
                    : 'View and manage your premium subscription'}
                </p>

                {userPlan === 'basic' && (
                  <>
                    <ul className="mt-6 space-y-4 sm:mt-4 sm:space-y-3">
                      <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Check className="h-4 w-4 text-primary-text-600 dark:text-primary-text-400" />
                        Unlimited video responses
                      </li>
                      <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Check className="h-4 w-4 text-primary-text-600 dark:text-primary-text-400" />
                        Advanced analytics and reporting
                      </li>
                      <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Check className="h-4 w-4 text-primary-text-600 dark:text-primary-text-400" />
                        Custom branding and white-labeling
                      </li>
                      <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Check className="h-4 w-4 text-primary-text-600 dark:text-primary-text-400" />
                        Priority support
                      </li>
                    </ul>
                    <div className="mt-8 flex flex-col items-center gap-4 sm:mt-6 sm:flex-row">
                      <button
                        onClick={handleNavigateToPricing}
                        className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
                      >
                        <Zap className="h-4 w-4" />
                        Upgrade Now
                      </button>
                      <div className="text-center sm:text-left">
                        <p className="font-medium text-gray-900 dark:text-white">$49/month</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Billed monthly</p>
                      </div>
                    </div>
                  </>
                )}

                {userPlan === 'pro' && (
                  <div className="mt-6">
                    <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                      You're currently on the Pro Plan. Upgrade to Premium for additional features:
                    </p>
                    <ul className="mt-4 mb-6 space-y-3">
                      <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Check className="h-4 w-4 text-primary-text-600 dark:text-primary-text-400" />
                        25 active campaigns (vs. 10 in Pro)
                      </li>
                      <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Check className="h-4 w-4 text-primary-text-600 dark:text-primary-text-400" />
                        250 video responses per campaign
                      </li>
                      <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Check className="h-4 w-4 text-primary-text-600 dark:text-primary-text-400" />
                        4K video quality available
                      </li>
                    </ul>
                    <button
                      onClick={handleNavigateToPricing}
                      className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
                    >
                      Upgrade to Premium
                    </button>
                  </div>
                )}

                {userPlan === 'premium' && (
                  <div className="mt-6">
                    <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                      You're currently on our Premium Plan. Enjoy all the premium features!
                    </p>
                    <button
                      onClick={handleNavigateToPricing}
                      className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
                    >
                      Manage Subscription
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
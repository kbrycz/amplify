import React, { useState } from 'react';
import { Check } from 'lucide-react';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const pricing = {
  frequencies: [
    { value: 'monthly', label: 'Monthly' },
    { value: 'annually', label: 'Annually' },
  ],
  tiers: [
    {
      name: 'Standard',
      id: 'tier-basic',
      href: '#',
      featured: false,
      description: 'Perfect for individuals and small organizations just getting started.',
      price: { monthly: '$0', annually: '$0' },
      highlights: [
        '1 active campaign',
        '5 video responses per campaign',
        '5 video enhancement credits',
        'Standard video quality (720p)',
        'Basic analytics dashboard',
        'Shareable campaign links',
        'Email support'
      ],
    },
    {
      name: 'Pro',
      id: 'tier-pro',
      href: '#',
      featured: true,
      description: 'For growing organizations who need more features and capacity.',
      price: { monthly: '$75', annually: '$720' },
      highlights: [
        '10 active campaigns',
        '100 video responses per campaign',
        '100 video enhancement credits',
        'HD video quality (1080p)',
        'Advanced AI video enhancement',
        'Advanced analytics & reporting',
        'AI-powered insights',
        'Custom branding',
        'Campaign templates',
        'Priority support',
        'Team collaboration tools'
      ],
    },
    {
      name: 'Premium',
      id: 'tier-premium',
      href: '#',
      featured: false,
      description: 'Premium solutions for organizations with advanced needs.',
      price: { monthly: '$150', annually: '$1440' },
      highlights: [
        '25 active campaigns',
        '250 video responses per campaign',
        '250 video enhancement credits',
        '4K video quality available',
        'Premium AI video enhancement',
        'Custom analytics solutions',
        'Advanced AI features',
        'Full white-labeling',
        'Custom integrations',
        'Dedicated support',
        'API access'
      ],
    },
  ]
};

export function PricingSection() {
  const [frequency, setFrequency] = useState(pricing.frequencies[0]);

  return (
    <div id="pricing" className="bg-white py-24 sm:py-32 dark:bg-gray-900 scroll-mt-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold leading-7 text-primary-text-600 dark:text-primary-text-400 text-center">Pricing</h2>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-5xl mx-auto max-w-4xl">
            Simple, transparent pricing
          </p>
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 mx-auto max-w-2xl">
            Choose the perfect plan for your needs. Save 20% with annual billing. All plans include unlimited storage for responses.
          </p>
        </div>
        <div className="mt-16">
          <div className="flex justify-center">
            <div className="grid grid-cols-2 gap-x-1 rounded-full bg-gray-100 p-1 text-center text-xs font-semibold text-gray-900 dark:bg-gray-800">
              {pricing.frequencies.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFrequency(option)}
                  className={classNames(
                    option === frequency
                      ? 'bg-white text-gray-900 dark:bg-gray-900 dark:text-white'
                      : 'text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800/50',
                    'cursor-pointer rounded-full px-2.5 py-1'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="relative mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
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
                    className={classNames(
                      tier.featured ? 'text-gray-900 dark:text-white' : 'text-gray-900 dark:text-white',
                      'text-sm font-semibold leading-6'
                    )}
                  >
                    {tier.name}
                  </h2>
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between lg:flex-col lg:items-stretch">
                    <div className="mt-2 flex items-center gap-x-4">
                      <p
                        className={classNames(
                          tier.featured ? 'text-gray-900 dark:text-white' : 'text-gray-900 dark:text-white',
                          'text-4xl font-semibold tracking-tight'
                        )}
                      >
                        {tier.price[frequency.value]}
                      </p>
                      <div className="text-sm">
                        <p className={tier.featured ? 'text-gray-900 dark:text-white' : 'text-gray-900 dark:text-white'}>USD</p>
                        <p className={tier.featured ? 'text-gray-500 dark:text-gray-400' : 'text-gray-500 dark:text-gray-400'}>
                          {frequency.value === 'annually' ? 'Billed yearly (20% off)' : 'Billed monthly'}
                        </p>
                      </div>
                    </div>
                    <a
                      href={tier.href}
                      aria-describedby={tier.id}
                      className={classNames(
                        tier.featured
                          ? 'bg-primary-600 text-white hover:bg-primary-500 dark:hover:bg-primary-400'
                          : 'bg-gray-800 text-white hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100',
                        'rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'
                      )}
                    >
                      Buy this plan
                    </a>
                  </div>
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
                      {tier.highlights.map((feature) => (
                        <li key={feature} className="flex gap-x-3 py-2">
                          <Check
                            className={classNames(
                              tier.featured ? 'text-primary-text-600 dark:text-primary-text-400' : 'text-gray-500 dark:text-gray-400',
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
      </div>
    </div>
  );
}
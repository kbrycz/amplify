// src/pages/PricingPage.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { createCheckoutSession, redirectToCheckout, verifySubscription } from '../services/stripeService';
import { auth } from '../lib/firebase';

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
      planId: 'basic',
      featured: false,
      description: 'Perfect for individuals and small organizations just getting started.',
      price: { monthly: '$0', annually: '$0' },
      mainFeatures: [
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
      planId: 'pro',
      featured: true,
      description: 'For growing organizations who need more features and capacity.',
      price: { monthly: '$75', annually: '$720' },
      mainFeatures: [
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
      planId: 'premium',
      featured: false,
      description: 'Premium solutions for organizations with advanced needs.',
      price: { monthly: '$150', annually: '$1440' },
      mainFeatures: [
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

export default function PricingPage() {
  const [frequency, setFrequency] = useState(pricing.frequencies[0]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, updateUserPlan, completeNewSignup, newSignup } = useAuth();
  const checkoutInProgress = useRef(false);

  // Reset loading state when there's an error
  useEffect(() => {
    if (error) {
      setIsLoading(false);
      checkoutInProgress.current = false;
    }
  }, [error]);

  const handleSelectPlan = async (tier) => {
    // If checkout is already in progress, don't allow selecting another plan
    if (isLoading) return;
    
    setSelectedPlan(tier);
    const planId = tier.planId;
    setError('');
    
    try {
      setIsLoading(true);
      checkoutInProgress.current = true;
      
      // If user is not authenticated, redirect to signup
      if (!user) {
        localStorage.setItem('selectedPlan', planId);
        navigate('/signup');
        return;
      }
      
      if (planId === 'basic') {
        try {
          // If this is a new signup, complete the signup process
          if (newSignup) {
            await completeNewSignup();
          } else {
            await updateUserPlan('basic');
          }
          navigate('/app/dashboard');
        } catch (error) {
          console.error('Error setting basic plan:', error);
          setError(error.message || 'Failed to set up your basic plan. Please try again.');
          setIsLoading(false);
          checkoutInProgress.current = false;
        }
      } else {
        // For Pro or Premium plan, initiate the Stripe checkout flow
        try {
          const idToken = await auth.currentUser.getIdToken();
          const { sessionId } = await createCheckoutSession(planId, idToken);
          
          // Important: Don't set isLoading to false here
          // Keep the loading state active until redirect happens
          
          // Redirect to Stripe checkout
          await redirectToCheckout(sessionId);
          
          // Note: The code below will only run if the redirect fails
          // In normal cases, the page will be redirected to Stripe
          console.error('Redirect to Stripe checkout failed to execute');
          setError('Failed to redirect to checkout page. Please try again.');
          setIsLoading(false);
          checkoutInProgress.current = false;
        } catch (error) {
          console.error('Error creating checkout session:', error);
          setError(error.message || 'Failed to create checkout session. Please try again.');
          setIsLoading(false);
          checkoutInProgress.current = false;
        }
      }
    } catch (err) {
      console.error('Error handling plan selection:', err);
      setError(err.message || 'Failed to process your request. Please try again.');
      setIsLoading(false);
      checkoutInProgress.current = false;
    }
  };

  return (
    <div className="bg-white min-h-screen py-24 sm:py-32 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600 dark:text-indigo-400 text-center">Pricing</h2>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-5xl mx-auto max-w-4xl">
            Simple, transparent pricing
          </p>
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 mx-auto max-w-2xl">
            Choose the perfect plan for your needs. Save 20% with annual billing. All plans include unlimited storage for responses.
          </p>
        </div>
        
        {error && (
          <div className="mt-6 mx-auto max-w-md rounded-md bg-red-50 dark:bg-red-900/50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                  {error}
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-16">
          <div className="flex justify-center">
            <div className="grid grid-cols-2 gap-x-1 rounded-full bg-gray-100 p-1 text-center text-xs font-semibold text-gray-900 dark:bg-gray-800">
              {pricing.frequencies.map((option) => (
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
                        {tier.price[frequency.value] !== '$0' && (
                          <p className={tier.featured ? 'text-gray-500 dark:text-gray-400' : 'text-gray-500 dark:text-gray-400'}>
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
                        (isLoading && selectedPlan?.id === tier.id) ? 'opacity-75 cursor-not-allowed' : ''
                      )}
                      disabled={isLoading}
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
                        tier.name
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
      </div>
    </div>
  );
}
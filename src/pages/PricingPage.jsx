import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { createCheckoutSession, redirectToCheckout } from '../services/stripeService';
import { auth } from '../lib/firebase';
import { SERVER_URL } from '../lib/api';
import PricingHeader from '../components/pricing/PricingHeader';
import FrequencyToggle from '../components/pricing/FrequencyToggle';
import PricingPlans from '../components/pricing/PricingPlans';
import DowngradeModal from '../components/pricing/DowngradeModal';

// Helper function to define CSS classes
function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

// Pricing data
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
  const [showDowngradeConfirm, setShowDowngradeConfirm] = useState(false);
  const [planToDowngradeTo, setPlanToDowngradeTo] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, updateUserPlan, completeNewSignup, newSignup } = useAuth();
  const checkoutInProgress = useRef(false);

  // Determine the user's current plan.
  const userPlan = user?.subscription?.plan || user?.plan || 'basic';

  // Check if user is coming from settings.
  const isFromSettings = location.state?.fromSettings || false;

  // Go back to settings.
  const handleBackToSettings = () => {
    navigate('/app/account');
  };

  // Reset loading state when error changes.
  useEffect(() => {
    if (error) {
      setIsLoading(false);
      checkoutInProgress.current = false;
    }
  }, [error]);

  // Handle selecting a plan.
  const handleSelectPlan = async (tier) => {
    if (isLoading) return;
    setSelectedPlan(tier);
    const planId = tier.planId;
    setError('');

    try {
      if (!user) {
        localStorage.setItem('selectedPlan', planId);
        navigate('/signup');
        return;
      }
      if (userPlan === planId && isFromSettings) {
        navigate('/app/account');
        return;
      }

      const planRank = { basic: 1, pro: 2, premium: 3 };
      const currentRank = planRank[userPlan] || 1;
      const targetRank = planRank[planId] || 1;

      if (targetRank < currentRank && isFromSettings) {
        setShowDowngradeConfirm(true);
        setPlanToDowngradeTo(planId);
        return;
      }

      await processPlanSelection(planId);
    } catch (err) {
      console.error('Error handling plan selection:', err);
      setError(err.message || 'Failed to process your request. Please try again.');
      setIsLoading(false);
      checkoutInProgress.current = false;
    }
  };

  // Process plan selection (upgrade/downgrade).
  const processPlanSelection = async (planId) => {
    setIsLoading(true);
    checkoutInProgress.current = true;
    const planRank = { basic: 1, pro: 2, premium: 3 };
    const currentRank = planRank[userPlan] || 1;
    const targetRank = planRank[planId] || 1;
    const isDowngrade = targetRank < currentRank;

    if (newSignup) {
      await completeNewSignup();
      if (isFromSettings) {
        navigate('/app/account', { state: { planUpdated: true, plan: planId } });
      } else {
        navigate('/app/dashboard');
      }
      return;
    }
    if (isDowngrade) {
      await updateUserPlan(planId);
      if (isFromSettings) {
        navigate('/app/account', { 
          state: { 
            planUpdated: true, 
            plan: planId,
            previousPlan: userPlan 
          } 
        });
      } else {
        navigate('/app/dashboard');
      }
      return;
    }
    if (planId === 'basic' && !isDowngrade) {
      await updateUserPlan('basic');
      if (isFromSettings) {
        navigate('/app/account', { state: { planUpdated: true, plan: 'basic' } });
      } else {
        navigate('/app/dashboard');
      }
      return;
    }
    try {
      const idToken = await auth.currentUser.getIdToken();
      const { sessionId } = await createCheckoutSession(planId, idToken);
      if (isFromSettings) {
        localStorage.setItem('returnToSettings', 'true');
        localStorage.setItem('previousPlan', userPlan);
      }
      await redirectToCheckout(sessionId);
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
  };

  const handleDowngradeConfirm = async () => {
    setShowDowngradeConfirm(false);
    if (planToDowngradeTo) {
      await processPlanSelection(planToDowngradeTo);
    }
  };

  const handleDowngradeCancel = () => {
    setShowDowngradeConfirm(false);
    setPlanToDowngradeTo(null);
    setSelectedPlan(null);
  };

  // Returns lost features when downgrading.
  const getLostFeatures = (currentPlan, targetPlan) => {
    if (currentPlan === 'premium' && targetPlan === 'pro') {
      return [
        '25 active campaigns → 10 active campaigns',
        '250 video responses per campaign → 100 video responses',
        '250 video enhancement credits → 100 credits',
        '4K video quality → HD video quality (1080p)',
        'Custom analytics solutions → Advanced analytics',
        'API access & custom integrations',
        'Full white-labeling'
      ];
    } else if (currentPlan === 'premium' && targetPlan === 'basic') {
      return [
        '25 active campaigns → 1 active campaign',
        '250 video responses per campaign → 5 video responses',
        '250 video enhancement credits → 5 credits',
        '4K video quality → Standard video quality (720p)',
        'Custom analytics solutions → Basic analytics',
        'API access & custom integrations',
        'Full white-labeling',
        'Team collaboration tools'
      ];
    } else if (currentPlan === 'pro' && targetPlan === 'basic') {
      return [
        '10 active campaigns → 1 active campaign',
        '100 video responses per campaign → 5 video responses',
        '100 video enhancement credits → 5 credits',
        'HD video quality (1080p) → Standard video quality (720p)',
        'Advanced analytics & reporting → Basic analytics',
        'Team collaboration tools',
        'Custom branding'
      ];
    }
    return [];
  };

  // Returns price info from pricing tiers.
  const getPlanPrice = (planName, frequencyValue) => {
    const tier = pricing.tiers.find((t) => t.planId === planName);
    return tier ? tier.price[frequencyValue] : '$0';
  };

  return (
    <div className="bg-white min-h-screen py-24 sm:py-32 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <PricingHeader 
          isFromSettings={isFromSettings} 
          handleBackToSettings={handleBackToSettings} 
        />
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
        <FrequencyToggle 
          frequency={frequency} 
          setFrequency={setFrequency} 
          isLoading={isLoading} 
          frequencies={pricing.frequencies} 
        />
        <PricingPlans 
          pricing={pricing} 
          frequency={frequency} 
          isLoading={isLoading} 
          selectedPlan={selectedPlan} 
          handleSelectPlan={handleSelectPlan} 
          isFromSettings={isFromSettings} 
          userPlan={userPlan} 
        />
        {showDowngradeConfirm && (
          <DowngradeModal 
            show={showDowngradeConfirm}
            onCancel={handleDowngradeCancel}
            onConfirm={handleDowngradeConfirm}
            userPlan={userPlan}
            planToDowngradeTo={planToDowngradeTo}
            frequency={frequency}
            getLostFeatures={getLostFeatures}
            getPlanPrice={getPlanPrice}
          />
        )}
      </div>
    </div>
  );
}
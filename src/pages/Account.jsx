import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Crown, Trash2, AlertTriangle, Check, Zap, ArrowRight } from 'lucide-react';
import { ConfirmationModal } from '../components/ui/confirmation-modal';
import { auth, SERVER_URL } from '../lib/firebase';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Account() {
  const { user } = useAuth();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState({
    plan: { success: '' }
  });
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the current user's plan
  const userPlan = user?.plan || 'basic';
  
  console.log("Account - Current user:", user);
  console.log("Account - Current plan:", userPlan);
  
  // Check if plan was just updated
  useEffect(() => {
    if (location.state?.planUpdated) {
      const planName = location.state.plan;
      const previousPlan = location.state.previousPlan;
      const isDowngrade = previousPlan && 
        ((previousPlan === 'premium' && (planName === 'pro' || planName === 'basic')) || 
         (previousPlan === 'pro' && planName === 'basic'));
      
      setMessages(prev => ({
        ...prev,
        plan: { 
          success: isDowngrade 
            ? `Your subscription has been successfully downgraded to the ${getPlanDisplayName(planName)}.`
            : `Your subscription has been successfully upgraded to the ${getPlanDisplayName(planName)}!` 
        }
      }));
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setMessages(prev => ({
          ...prev,
          plan: { success: '' }
        }));
      }, 5000);
      
      // Clear the location state
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Function to get plan display name
  const getPlanDisplayName = (plan) => {
    const plans = {
      'basic': 'Basic Plan',
      'pro': 'Pro Plan',
      'premium': 'Premium Plan'
    };
    return plans[plan] || 'Basic Plan';
  };

  // Function to navigate to pricing page
  const handleNavigateToPricing = () => {
    console.log("Navigating to pricing page");
    // Pass state to indicate we're coming from settings
    navigate('/pricing', { state: { fromSettings: true } });
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    setError('');

    try {
      const idToken = await auth.currentUser.getIdToken();
      console.log('Deleting account...');
      
      const response = await fetch(`${SERVER_URL}/auth/delete-account`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to delete account');
      
      console.log('Account deleted successfully');
      await auth.signOut();
      navigate('/');
    } catch (err) {
      console.error('Delete account error:', err);
      setError(err.message.includes('Firebase')
        ? 'We encountered an error while deleting your account. Please try again.'
        : err.message);
      setIsDeleteModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Plan Information */}
      <div className="grid max-w-7xl grid-cols-1 gap-x-8 md:grid-cols-[300px,1fr]">
        <div className="py-6">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Current Plan</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage your subscription and billing details.
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          {messages.plan.success && (
            <div className="mb-6 flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-400">
              <Check className="h-4 w-4" />
              {messages.plan.success}
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{getPlanDisplayName(userPlan)}</h3>
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-500/20">
                    Current Plan
                  </span>
                </div>
              </div>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {userPlan === 'basic' ? 'Free tier with basic features' : 
                 userPlan === 'pro' ? 'Professional tier with advanced features' : 
                 'Premium tier with all features'}
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
            <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:border-gray-700 dark:from-indigo-950/30 dark:via-gray-900 dark:to-purple-950/30">
              <div className="flex flex-col p-6 sm:flex-row sm:items-start sm:gap-4">
                <div className="mx-auto mb-4 rounded-full bg-indigo-100 p-2.5 dark:bg-indigo-900/50 sm:mx-0 sm:mb-0">
                  <Crown className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
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
                          <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                          Unlimited video responses
                        </li>
                        <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                          Advanced analytics and reporting
                        </li>
                        <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                          Custom branding and white-labeling
                        </li>
                        <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                          Priority support
                        </li>
                      </ul>
                      <div className="mt-8 flex flex-col items-center gap-4 sm:mt-6 sm:flex-row">
                        <button 
                          onClick={handleNavigateToPricing}
                          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-500"
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
                          <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                          25 active campaigns (vs. 10 in Pro)
                        </li>
                        <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                          250 video responses per campaign
                        </li>
                        <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                          4K video quality available
                        </li>
                      </ul>
                      <button 
                        onClick={handleNavigateToPricing}
                        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-500"
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
                        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-500"
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

      {/* Delete Account */}
      <div className="mt-16 grid max-w-7xl grid-cols-1 gap-x-8 md:grid-cols-[300px,1fr]">
        <div className="py-6">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Delete Account</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/50">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Warning</h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                  <p>Once you delete your account, there is no going back. Please be certain.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4" />
              Delete account
            </button>
          </div>

          <ConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteAccount}
            title="Delete Account"
            message="This action cannot be undone. This will permanently delete your account and remove your data from our servers."
            isLoading={isLoading}
          />
        </div>
      </div>
      <div className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; 2025 Shout. All rights reserved.
      </div>
    </div>
  );
}
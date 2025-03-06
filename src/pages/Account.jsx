import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth, SERVER_URL } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import PlanSection from '../components/account/PlanSection';
import DeleteAccountSection from '../components/account/DeleteAccountSection';

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
      const isDowngrade =
        previousPlan &&
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
      setError(
        err.message.includes('Firebase')
          ? 'We encountered an error while deleting your account. Please try again.'
          : err.message
      );
      setIsDeleteModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <PlanSection
        userPlan={userPlan}
        planSuccessMessage={messages.plan.success}
        getPlanDisplayName={getPlanDisplayName}
        handleNavigateToPricing={handleNavigateToPricing}
      />

      <DeleteAccountSection
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        isLoading={isLoading}
        error={error}
        handleDeleteAccount={handleDeleteAccount}
      />

      <div className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; 2025 Shout. All rights reserved.
      </div>
    </div>
  );
}
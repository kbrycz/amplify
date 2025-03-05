import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, Zap, Shield, BarChart2, Users, Video, Crown, Star } from 'lucide-react';
import { verifySubscription } from '../services/stripeService';
import { auth } from '../lib/firebase';

export default function CheckoutSuccess() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [planDetails, setPlanDetails] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, setUserProfile } = useAuth();
  const verificationAttempted = useRef(false);

  // Simple dark mode detection effect
  useEffect(() => {
    // Check localStorage for saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // Check system preference if no saved theme
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const verifyPayment = async () => {
      // Prevent multiple verification attempts
      if (verificationAttempted.current) return;
      verificationAttempted.current = true;

      try {
        const sessionId = searchParams.get('session_id');
        if (!sessionId) {
          setError('Invalid session ID');
          setIsLoading(false);
          return;
        }

        // Verify the payment and get the response
        const response = await verifySubscription(sessionId);
        if (response.success) {
          // Update the user profile in AuthContext
          setUserProfile(response.user);
          console.log('Updated user profile:', response.user);
          
          // Set plan details for display
          setPlanDetails({
            name: response.plan,
            features: getPlanFeatures(response.plan)
          });
        }

        setTimeout(() => {
          setIsLoading(false);
        }, 1500);
      } catch (err) {
        console.error('Error verifying payment:', err);
        setError(err.message || 'Failed to verify payment');
        setIsLoading(false);
      }
    };

    verifyPayment();
  }, [user, navigate, searchParams, setUserProfile]);

  // Helper function to get plan features based on plan name
  const getPlanFeatures = (planName) => {
    if (planName === 'pro') {
      return [
        { icon: <Zap className="h-5 w-5 text-blue-500" />, text: '10 active campaigns' },
        { icon: <Video className="h-5 w-5 text-blue-500" />, text: '100 video responses per campaign' },
        { icon: <Star className="h-5 w-5 text-blue-500" />, text: '100 video enhancement credits' },
        { icon: <Shield className="h-5 w-5 text-blue-500" />, text: 'HD video quality (1080p)' },
        { icon: <BarChart2 className="h-5 w-5 text-blue-500" />, text: 'Advanced analytics & reporting' },
        { icon: <Users className="h-5 w-5 text-blue-500" />, text: 'Team collaboration tools' }
      ];
    } else if (planName === 'premium') {
      return [
        { icon: <Zap className="h-5 w-5 text-purple-500" />, text: '25 active campaigns' },
        { icon: <Video className="h-5 w-5 text-purple-500" />, text: '250 video responses per campaign' },
        { icon: <Star className="h-5 w-5 text-purple-500" />, text: '250 video enhancement credits' },
        { icon: <Shield className="h-5 w-5 text-purple-500" />, text: '4K video quality available' },
        { icon: <BarChart2 className="h-5 w-5 text-purple-500" />, text: 'Custom analytics solutions' },
        { icon: <Users className="h-5 w-5 text-purple-500" />, text: 'API access & custom integrations' }
      ];
    }
    return [];
  };

  const handleContinue = () => {
    // Force a small delay to ensure state updates have propagated
    setTimeout(() => {
      navigate('/app/dashboard');
    }, 100);
  };

  const isPro = planDetails?.name === 'pro';
  const isPremium = planDetails?.name === 'premium';

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50 dark:from-gray-900 dark:to-indigo-950 flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full bg-white dark:bg-gray-800 shadow-xl rounded-xl p-8 text-center">
        {/* Success Icon */}
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 dark:bg-green-900">
          <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
        </div>

        {/* Plan Badge - Only show if verification succeeded */}
        {!isLoading && planDetails && !error && (
          <div className={`mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium 
            ${isPremium 
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
              : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'}`}>
            <Crown className="mr-1 h-4 w-4" />
            {isPremium ? 'Premium Plan' : 'Pro Plan'} Activated
          </div>
        )}

        <h1 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
          {error ? 'Payment Received!' : 'Welcome to the Next Level!'}
        </h1>

        <p className="mt-3 text-xl text-gray-600 dark:text-gray-300">
          {error 
            ? "We're processing your subscription upgrade." 
            : 'Thank you for upgrading your Shout subscription.'}
        </p>

        {error && (
          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-md">
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              We've received your payment, but we're still verifying your subscription details. 
              Your account will be upgraded shortly. You can continue to the dashboard in the meantime.
            </p>
          </div>
        )}

        {isLoading ? (
          <div className="mt-10">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
            </div>
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
              Setting up your enhanced account...
            </p>
          </div>
        ) : (
          <div className="mt-8">
            {/* Only show features section if verification succeeded */}
            {!error && planDetails && (
              <>
                <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-xl p-6 mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Your New Capabilities
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    {planDetails.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">{feature.icon}</div>
                        <p className="text-gray-700 dark:text-gray-300">{feature.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Your account has been upgraded successfully. You now have access to all the enhanced features 
                  and increased limits of your {isPremium ? 'Premium' : 'Pro'} plan. We're excited to see what you'll create!
                </p>
              </>
            )}

            {/* Different message for error state */}
            {error && (
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Your payment has been processed. Our system is currently finalizing your subscription details. 
                Your account will be updated with all the new features very soon.
              </p>
            )}

            <button
              onClick={handleContinue}
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white 
                ${isPremium && !error
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' 
                  : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'} 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-all duration-200`}
            >
              Continue to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
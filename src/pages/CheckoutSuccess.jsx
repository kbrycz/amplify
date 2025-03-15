import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, Zap, Shield, BarChart2, Users, Video, Crown, Star, ArrowRight } from 'lucide-react';
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
  
  // Check if user should return to settings
  const shouldReturnToSettings = localStorage.getItem('returnToSettings') === 'true';
  
  console.log("CheckoutSuccess - shouldReturnToSettings:", shouldReturnToSettings);
  console.log("CheckoutSuccess - current user:", user);

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
        console.log("CheckoutSuccess - Verifying payment with sessionId:", sessionId);
        const response = await verifySubscription(sessionId);
        console.log("CheckoutSuccess - Verification response:", response);
        
        if (response.success) {
          // Update the user profile in AuthContext
          console.log("CheckoutSuccess - Updating user profile with:", response.user);
          setUserProfile(response.user);
          
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
        { icon: <Zap className="h-5 w-5 text-primary-500" />, text: '10 active campaigns' },
        { icon: <Video className="h-5 w-5 text-primary-500" />, text: '100 video responses per campaign' },
        { icon: <Star className="h-5 w-5 text-primary-500" />, text: '100 video enhancement credits' },
        { icon: <Shield className="h-5 w-5 text-primary-500" />, text: 'HD video quality (1080p)' },
        { icon: <BarChart2 className="h-5 w-5 text-primary-500" />, text: 'Advanced analytics & reporting' },
        { icon: <Users className="h-5 w-5 text-primary-500" />, text: 'Team collaboration tools' }
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
    // Clear the returnToSettings flag
    const previousPlan = localStorage.getItem('previousPlan');
    localStorage.removeItem('returnToSettings');
    localStorage.removeItem('previousPlan');
    
    console.log("CheckoutSuccess - handleContinue called");
    console.log("CheckoutSuccess - shouldReturnToSettings:", shouldReturnToSettings);
    console.log("CheckoutSuccess - planDetails:", planDetails);
    console.log("CheckoutSuccess - previousPlan:", previousPlan);
    
    // Force a small delay to ensure state updates have propagated
    setTimeout(() => {
      // Redirect to account page if user came from there
      if (shouldReturnToSettings) {
        console.log("CheckoutSuccess - Redirecting to account page");
        navigate('/app/account', { 
          state: { 
            planUpdated: true, 
            plan: planDetails?.name || 'pro',
            previousPlan: previousPlan
          } 
        });
      } else {
        console.log("CheckoutSuccess - Redirecting to dashboard");
        navigate('/app/dashboard');
      }
    }, 100);
  };

  const isPro = planDetails?.name === 'pro';
  const isPremium = planDetails?.name === 'premium';

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg transform overflow-hidden rounded-xl bg-white shadow-xl transition-all dark:bg-gray-800 dark:border dark:border-gray-700 dark:shadow-[0_0_15px_rgba(0,0,0,0.5)] sm:my-8">
        <div className="px-6 py-8 sm:px-8 sm:py-10">
          <div className="text-center">
            {isLoading ? (
              <>
                <div className="mx-auto flex h-16 w-16 items-center justify-center mb-2">
                  <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-primary-600 dark:border-primary-400"></div>
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">
                  Setting Up Your Subscription
                </h3>
                <p className="mt-4 text-base text-gray-600 dark:text-gray-400 px-4">
                  Please wait while we verify your payment and activate your subscription...
                </p>
              </>
            ) : (
              <>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                
                {/* Plan Badge - Only show if verification succeeded */}
                {!error && planDetails && (
                  <div className={`mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium 
                    ${isPremium 
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' 
                      : 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'}`}>
                    <Crown className="mr-1 h-4 w-4" />
                    {isPremium ? 'Premium Plan' : 'Pro Plan'} Activated
                  </div>
                )}
                
                <h3 className="mt-5 text-lg font-semibold text-gray-900 dark:text-white">
                  {error ? 'Payment Received!' : 'Subscription Activated!'}
                </h3>
                
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                  {error 
                    ? "We're processing your subscription upgrade." 
                    : `Thank you for upgrading to the ${isPremium ? 'Premium' : 'Pro'} plan.`}
                </p>
                
                {error && (
                  <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      We've received your payment, but we're still verifying your subscription details. 
                      Your account will be upgraded shortly. You can continue to the dashboard in the meantime.
                    </p>
                  </div>
                )}
                
                {/* Only show features section if verification succeeded */}
                {!error && planDetails && (
                  <div className="mt-6 bg-gray-50 dark:bg-gray-700/40 rounded-xl p-5">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                      Your New Capabilities
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                      {planDetails.features.map((feature, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <div className="flex-shrink-0 mt-0.5">{feature.icon}</div>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{feature.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <button
                  onClick={handleContinue}
                  className={`mt-6 w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors
                    ${isPremium && !error
                      ? 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500' 
                      : 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500'} 
                    focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800`}
                >
                  Continue to Dashboard
                  <ArrowRight className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
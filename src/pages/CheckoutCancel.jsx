import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle, ArrowRight, CreditCard, Zap, Info, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function CheckoutCancel() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
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
  
  const handleRetry = () => {
    navigate('/pricing');
  };
  
  const handleContinue = () => {
    navigate('/app/dashboard');
  };
  
  // Basic plan features
  const basicFeatures = [
    { icon: <Zap className="h-5 w-5 text-gray-500" />, text: '1 active campaign' },
    { icon: <CreditCard className="h-5 w-5 text-gray-500" />, text: '5 video enhancement credits' },
    { icon: <Info className="h-5 w-5 text-gray-500" />, text: 'Standard video quality (720p)' },
  ];
  
  return (
    <div className="relative isolate min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center px-4 py-12">
      {/* Background gradient */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        />
      </div>

      <div className="w-full max-w-lg transform overflow-hidden rounded-xl bg-white shadow-xl transition-all dark:bg-gray-800 dark:border dark:border-gray-700 dark:shadow-[0_0_15px_rgba(0,0,0,0.5)] sm:my-8">
        <div className="px-6 py-8 sm:px-8 sm:py-10">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
              <XCircle className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            </div>
            
            <h3 className="mt-5 text-lg font-semibold text-gray-900 dark:text-white">
              Payment Cancelled
            </h3>
            
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              No worries! You'll continue with the Standard plan.
            </p>
            
            <div className="mt-6 bg-gray-50 dark:bg-gray-700/40 rounded-xl p-5">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 text-left">
                Your Standard Plan Includes:
              </h4>
              
              <div className="space-y-3 text-left">
                {basicFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="flex-shrink-0 mt-0.5">{feature.icon}</div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{feature.text}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-primary-50 dark:bg-primary-900/30 rounded-lg border border-primary-100 dark:border-primary-800/50">
                <div className="flex items-start">
                  <Settings className="h-5 w-5 text-primary-500 dark:text-primary-400 mt-0.5 mr-2 flex-shrink-0" />
                  <div className="text-left">
                    <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                      Need more features?
                    </h5>
                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                      You can upgrade your plan anytime from your account settings.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleContinue}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
              >
                Continue to Dashboard
                <ArrowRight className="h-4 w-4" />
              </button>
              
              <button
                onClick={handleRetry}
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
              >
                View Plans Again
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom background gradient */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
        />
      </div>
    </div>
  );
} 
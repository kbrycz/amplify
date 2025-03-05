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
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full bg-white dark:bg-gray-800 shadow-xl rounded-xl p-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gray-100 dark:bg-gray-700">
            <XCircle className="h-12 w-12 text-gray-500 dark:text-gray-400" />
          </div>
          
          <h1 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Payment Cancelled
          </h1>
          
          <p className="mt-3 text-xl text-gray-600 dark:text-gray-300">
            No worries! You'll continue with the Standard plan.
          </p>
        </div>
        
        <div className="mt-8 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Your Standard Plan Includes:
          </h2>
          
          <div className="space-y-4">
            {basicFeatures.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">{feature.icon}</div>
                <p className="text-gray-700 dark:text-gray-300">{feature.text}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <Settings className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  Need more features?
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  You can upgrade your plan anytime from your account settings.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleContinue}
            className="flex-1 flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
          >
            Continue to Dashboard
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
          
          <button
            onClick={handleRetry}
            className="flex-1 flex justify-center items-center py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-base font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
          >
            View Plans Again
          </button>
        </div>
      </div>
    </div>
  );
} 
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfService() {
  const navigate = useNavigate();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBack = () => {
    navigate(-1); // Go back to previous page (signup)
  };

  return (
    <div className="relative isolate min-h-screen bg-white dark:bg-gray-900">
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

      {/* Back button */}
      <button
        onClick={handleBack}
        className="absolute left-4 top-4 md:left-8 md:top-8 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to signup
      </button>

      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Terms of Service</h1>
          <p className="mt-4 text-base text-gray-600 dark:text-gray-400">
            Last updated: January 1, 2025
          </p>
          
          <div className="mt-10 space-y-8 text-base leading-7 text-gray-600 dark:text-gray-400">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">1. Introduction</h2>
              <p>
                Welcome to Shout ("Company", "we", "our", "us")! These Terms of Service ("Terms", "Terms of Service") govern your use of our website and services operated by Shout.
              </p>
              <p className="mt-4">
                By accessing or using our service, you agree to be bound by these Terms. If you disagree with any part of the terms, you do not have permission to access the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">2. Communications</h2>
              <p>
                By creating an account on our service, you agree to subscribe to newsletters, marketing or promotional materials and other information we may send. However, you may opt out of receiving any, or all, of these communications from us by following the unsubscribe link or instructions provided in any email we send.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">3. Subscriptions</h2>
              <p>
                Some parts of the service are billed on a subscription basis. You will be billed in advance on a recurring and periodic basis, depending on the type of subscription plan you select.
              </p>
              <p className="mt-4">
                At the end of each period, your subscription will automatically renew under the exact same conditions unless you cancel it or Shout cancels it.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">4. Content</h2>
              <p>
                Our service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material. You are responsible for the content that you post to the service, including its legality, reliability, and appropriateness.
              </p>
              <p className="mt-4">
                By posting content to the service, you grant us the right to use, modify, publicly perform, publicly display, reproduce, and distribute such content on and through the service. You retain any and all of your rights to any content you submit, post or display on or through the service and you are responsible for protecting those rights.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">5. Accounts</h2>
              <p>
                When you create an account with us, you guarantee that the information you provide us is accurate, complete, and current at all times. Inaccurate, incomplete, or obsolete information may result in the immediate termination of your account on the service.
              </p>
              <p className="mt-4">
                You are responsible for maintaining the confidentiality of your account and password, including but not limited to the restriction of access to your computer and/or account. You agree to accept responsibility for any and all activities or actions that occur under your account and/or password.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">6. Intellectual Property</h2>
              <p>
                The service and its original content (excluding content provided by users), features and functionality are and will remain the exclusive property of Shout and its licensors. The service is protected by copyright, trademark, and other laws of both the United States and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Shout.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">7. Termination</h2>
              <p>
                We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
              </p>
              <p className="mt-4">
                If you wish to terminate your account, you may simply discontinue using the service, or contact us to request account deletion.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">8. Limitation of Liability</h2>
              <p>
                In no event shall Shout, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">9. Changes</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">10. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at:
              </p>
              <p className="mt-2">
                <a href="mailto:support@shout.com" className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                  support@shout.com
                </a>
              </p>
            </section>
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
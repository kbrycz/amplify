import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
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
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Privacy Policy</h1>
          <p className="mt-4 text-base text-gray-600 dark:text-gray-400">
            Last updated: January 1, 2025
          </p>
          
          <div className="mt-10 space-y-8 text-base leading-7 text-gray-600 dark:text-gray-400">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">1. Introduction</h2>
              <p>
                Shout ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
              </p>
              <p className="mt-4">
                We use your data to provide and improve our service. By using our service, you agree to the collection and use of information in accordance with this policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">2. Information We Collect</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Personal Data</h3>
                  <p className="mt-2">
                    While using our service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). This may include, but is not limited to:
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Email address</li>
                    <li>First name and last name</li>
                    <li>Phone number</li>
                    <li>Address, State, Province, ZIP/Postal code, City</li>
                    <li>Cookies and Usage Data</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Usage Data</h3>
                  <p className="mt-2">
                    We may also collect information on how the service is accessed and used ("Usage Data"). This may include information such as your computer's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Tracking & Cookies Data</h3>
                  <p className="mt-2">
                    We use cookies and similar tracking technologies to track the activity on our service and hold certain information. Cookies are files with small amount of data which may include an anonymous unique identifier.
                  </p>
                  <p className="mt-2">
                    You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">3. Use of Data</h2>
              <p>
                Shout uses the collected data for various purposes:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>To provide and maintain our service</li>
                <li>To notify you about changes to our service</li>
                <li>To allow you to participate in interactive features of our service when you choose to do so</li>
                <li>To provide customer support</li>
                <li>To gather analysis or valuable information so that we can improve our service</li>
                <li>To monitor the usage of our service</li>
                <li>To detect, prevent and address technical issues</li>
                <li>To provide you with news, special offers and general information about other goods, services and events which we offer</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">4. Data Retention</h2>
              <p>
                Shout will retain your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your Personal Data to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our legal agreements and policies.
              </p>
              <p className="mt-4">
                We will also retain Usage Data for internal analysis purposes. Usage Data is generally retained for a shorter period of time, except when this data is used to strengthen the security or to improve the functionality of our service, or we are legally obligated to retain this data for longer time periods.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">5. Transfer of Data</h2>
              <p>
                Your information, including Personal Data, may be transferred to — and maintained on — computers located outside of your state, province, country or other governmental jurisdiction where the data protection laws may differ from those of your jurisdiction.
              </p>
              <p className="mt-4">
                If you are located outside the United States and choose to provide information to us, please note that we transfer the data, including Personal Data, to the United States and process it there.
              </p>
              <p className="mt-4">
                Your consent to this Privacy Policy followed by your submission of such information represents your agreement to that transfer.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">6. Disclosure of Data</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Legal Requirements</h3>
                  <p className="mt-2">
                    Shout may disclose your Personal Data in the good faith belief that such action is necessary to:
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>To comply with a legal obligation</li>
                    <li>To protect and defend the rights or property of Shout</li>
                    <li>To prevent or investigate possible wrongdoing in connection with the service</li>
                    <li>To protect the personal safety of users of the service or the public</li>
                    <li>To protect against legal liability</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">7. Security of Data</h2>
              <p>
                The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">8. Your Data Protection Rights</h2>
              <p>
                If you are a resident of the European Economic Area (EEA), you have certain data protection rights. Shout aims to take reasonable steps to allow you to correct, amend, delete, or limit the use of your Personal Data.
              </p>
              <p className="mt-4">
                If you wish to be informed what Personal Data we hold about you and if you want it to be removed from our systems, please contact us.
              </p>
              <p className="mt-4">
                In certain circumstances, you have the following data protection rights:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>The right to access, update or to delete the information we have on you</li>
                <li>The right of rectification</li>
                <li>The right to object</li>
                <li>The right of restriction</li>
                <li>The right to data portability</li>
                <li>The right to withdraw consent</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">9. Changes to This Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
              </p>
              <p className="mt-4">
                We will let you know via email and/or a prominent notice on our service, prior to the change becoming effective and update the "effective date" at the top of this Privacy Policy.
              </p>
              <p className="mt-4">
                You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">10. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <p className="mt-2">
                <a href="mailto:privacy@shout.com" className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                  privacy@shout.com
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
// src/pages/SignIn.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleAuthProvider } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import useDarkMode from '../hooks/useDarkMode';

// Subcomponents
import SignInHeader from '../components/signin/SignInHeader';
import SignInForm from '../components/signin/SignInForm';
import SocialSignIn from '../components/signin/SocialSignIn';

export default function SignIn() {
  const [error, setError] = useState('');
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const isDark = useDarkMode();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      await signIn(email, password);
      navigate('/app/dashboard', { replace: true });
    } catch (err) {
      setError(err.message.includes('Firebase') ? 'Invalid email or password' : err.message);
      throw err; // Re-throw to let the component handle loading state
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      const result = await signInWithPopup(auth, googleAuthProvider);
      await signInWithGoogle(result);
      navigate('/app/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
      throw err; // Re-throw to let the component handle loading state
    }
  };

  return (
    <div className="relative isolate flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
      {/* Top background shape */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem]
            -translate-x-1/2 rotate-[30deg]
            bg-gradient-to-tr from-[#ff80b5] to-[#9089fc]
            opacity-20 sm:left-[calc(50%-30rem)]
            sm:w-[72.1875rem]"
        />
      </div>

      <SignInHeader isDark={isDark} />

      <SignInForm error={error} handleSubmit={handleSubmit} />

      <SocialSignIn handleGoogleSignIn={handleGoogleSignIn} />

      {/* Bottom background shape */}
      <p className="mx-auto mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
        © 2025 Shout. All rights reserved.
      </p>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem]
            -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc]
            opacity-20 sm:left-[calc(50%+36rem)]
            sm:w-[72.1875rem]"
        />
      </div>
    </div>
  );
}
// src/pages/SignUp.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleAuthProvider } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import useDarkMode from '../hooks/useDarkMode';

// Subcomponents
import SignUpHeader from '../components/signup/SignUpHeader';
import SignUpForm from '../components/signup/SignUpForm';
import SocialSignUp from '../components/signup/SocialSignUp';

export default function SignUp() {
  const [error, setError] = useState('');
  const [loadingState, setLoadingState] = useState({ email: false, google: false });
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const isDark = useDarkMode();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirm-password');
    const firstName = formData.get('first-name');
    const lastName = formData.get('last-name');
    
    // Get the selected plan from localStorage
    const selectedPlan = localStorage.getItem('selectedPlan') || 'basic';

    setLoadingState({ email: true, google: false });
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoadingState({ email: false, google: false });
      return;
    }

    if (!firstName || !lastName) {
      setError('First name and last name are required');
      setLoadingState({ email: false, google: false });
      return;
    }

    try {
      await signUp(email, password, firstName, lastName, selectedPlan);
      navigate('/pricing', { replace: true });
    } catch (err) {
      console.error('Signup error:', err);
      if (err.message?.includes('timeout') || err.message?.includes('took too long')) {
        setError('The server is taking too long to respond. Please try again later.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('This email is already in use. Please try signing in instead.');
      } else if (err.code === 'auth/weak-password') {
        setError('Please use a stronger password (at least 6 characters).');
      } else {
        setError(err.message || 'An error occurred during signup. Please try again.');
      }
      setLoadingState({ email: false, google: false });
    }
  };

  const handleGoogleSignUp = async () => {
    setLoadingState({ email: false, google: true });
    setError('');
    
    // Get the selected plan from localStorage
    const selectedPlan = localStorage.getItem('selectedPlan') || 'basic';
    
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const user = result.user;
      const displayName = user.displayName || '';
      const nameParts = displayName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      await signInWithGoogle(result.credential, firstName, lastName, selectedPlan);
      navigate('/pricing', { replace: true });
    } catch (err) {
      console.error('Google signup error:', err);
      if (err.message?.includes('timeout') || err.message?.includes('took too long')) {
        setError('The server is taking too long to respond. Please try again later.');
      } else if (err.code === 'auth/account-exists-with-different-credential') {
        setError(
          'An account already exists with the same email address but different sign-in credentials.'
        );
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in popup was closed before completing the sign-in.');
      } else {
        setError(err.message || 'An error occurred during Google sign-up.');
      }
      setLoadingState({ email: false, google: false });
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

      <SignUpHeader isDark={isDark} />

      <SignUpForm
        error={error}
        loadingState={loadingState}
        handleSubmit={handleSubmit}
      />

      <SocialSignUp
        error={error}
        loadingState={loadingState}
        handleGoogleSignUp={handleGoogleSignUp}
      />

      {/* Bottom background shape */}
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
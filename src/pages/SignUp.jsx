import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { auth } from '../lib/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';

function useDarkMode() {
  const [isDark, setIsDark] = React.useState(() => {
    if (typeof window === 'undefined') return false;
    return document.documentElement.classList.contains('dark');
  });

  React.useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDark(document.documentElement.classList.contains('dark'));
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  return isDark;
}

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
      await signUp(email, password, firstName, lastName);
      navigate('/pricing', { replace: true });
    } catch (err) {
      console.error('Signup error:', err);
      if (err.message.includes('timeout') || err.message.includes('took too long')) {
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
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const displayName = user.displayName || '';
      const nameParts = displayName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      await signInWithGoogle(result.credential, firstName, lastName);
      navigate('/pricing', { replace: true });
    } catch (err) {
      console.error('Google signup error:', err);
      if (err.message.includes('timeout') || err.message.includes('took too long')) {
        setError('The server is taking too long to respond. Please try again later.');
      } else if (err.code === 'auth/account-exists-with-different-credential') {
        setError('An account already exists with the same email address but different sign-in credentials.');
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
      {/* Rest of the JSX remains unchanged */}
      <button onClick={() => navigate('/')} className="absolute left-4 top-4 md:left-8 md:top-8 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
        <ArrowLeft className="w-4 h-4" />
        Back to home
      </button>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <img src={isDark ? '/images/logo-white.png' : '/images/logo-color.png'} alt="Shout" className="h-12 w-auto" />
        </div>
        <h2 className="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-white">
          Create your account
        </h2>
      </div>
      <div className="mx-auto mt-10 w-[90%] sm:w-full sm:max-w-[480px]">
        <div className="bg-white dark:bg-gray-800 px-6 py-12 shadow sm:rounded-lg sm:px-12">
          <form action="#" method="POST" className="space-y-6" onSubmit={handleSubmit}>
            {/* Form fields remain unchanged */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="first-name" className="block text-sm/6 font-medium text-gray-900 dark:text-white">First name</label>
                <input id="first-name" name="first-name" type="text" required autoComplete="given-name" className="block w-full rounded-md bg-white dark:bg-gray-900 px-3 py-1.5 text-base text-gray-900 dark:text-white outline outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-700 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:focus:outline-indigo-500 sm:text-sm/6" />
              </div>
              <div>
                <label htmlFor="last-name" className="block text-sm/6 font-medium text-gray-900 dark:text-white">Last name</label>
                <input id="last-name" name="last-name" type="text" required autoComplete="family-name" className="block w-full rounded-md bg-white dark:bg-gray-900 px-3 py-1.5 text-base text-gray-900 dark:text-white outline outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-700 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:focus:outline-indigo-500 sm:text-sm/6" />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900 dark:text-white">Email address</label>
              <input id="email" name="email" type="email" required autoComplete="email" className="block w-full rounded-md bg-white dark:bg-gray-900 px-3 py-1.5 text-base text-gray-900 dark:text-white outline outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-700 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:focus:outline-indigo-500 sm:text-sm/6" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900 dark:text-white">Password</label>
              <input id="password" name="password" type="password" required autoComplete="new-password" className="block w-full rounded-md bg-white dark:bg-gray-900 px-3 py-1.5 text-base text-gray-900 dark:text-white outline outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-700 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:focus:outline-indigo-500 sm:text-sm/6" />
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-sm/6 font-medium text-gray-900 dark:text-white">Confirm password</label>
              <input id="confirm-password" name="confirm-password" type="password" required autoComplete="new-password" className="block w-full rounded-md bg-white dark:bg-gray-900 px-3 py-1.5 text-base text-gray-900 dark:text-white outline outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-700 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:focus:outline-indigo-500 sm:text-sm/6" />
            </div>
            <div className="flex items-center">
              <input id="terms" name="terms" type="checkbox" required className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900 dark:text-white">
                I agree to the <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">Terms of Service</a> and <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">Privacy Policy</a>
              </label>
            </div>
            {error && (
              <div className="rounded-md bg-red-50 dark:bg-red-900/50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
                    <div className="mt-2 text-sm text-red-700 dark:text-red-300">{error}</div>
                  </div>
                </div>
              </div>
            )}
            <button type="submit" disabled={loadingState.email} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70">
              {loadingState.email ? 'Creating account...' : 'Sign up'}
            </button>
          </form>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-300 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Or continue with</span>
              </div>
            </div>
            <button onClick={handleGoogleSignUp} disabled={loadingState.google} className="mt-6 w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70">
              {loadingState.google ? 'Signing in...' : (
                <>
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335" />
                    <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4" />
                    <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05" />
                    <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853" />
                  </svg>
                  Google
                </>
              )}
            </button>
          </div>
        </div>
        <p className="mx-auto mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account? <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
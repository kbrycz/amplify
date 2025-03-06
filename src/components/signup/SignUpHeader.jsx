// src/components/signup/SignUpHeader.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function SignUpHeader({ isDark }) {
  const navigate = useNavigate();

  return (
    <>
      <button
        onClick={() => navigate('/')}
        className="absolute left-4 top-4 md:left-8 md:top-8 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to home
      </button>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <img
            src={isDark ? '/images/logo-white.png' : '/images/logo-color.png'}
            alt="Shout"
            className="h-12 w-auto"
          />
        </div>
        <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Create your account
        </h2>
      </div>
    </>
  );
}
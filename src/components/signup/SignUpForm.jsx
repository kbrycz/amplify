// src/components/signup/SignUpForm.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function SignUpForm({ error, loadingState, handleSubmit }) {
  return (
    <div className="mx-auto mt-10 w-[90%] sm:w-full sm:max-w-[480px]">
      <div className="bg-white dark:bg-gray-800 px-6 py-12 shadow sm:rounded-lg sm:px-12">
        <form action="#" method="POST" className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="first-name"
                className="block text-sm font-medium text-gray-900 dark:text-white"
              >
                First name
              </label>
              <input
                id="first-name"
                name="first-name"
                type="text"
                required
                autoComplete="given-name"
                className="block w-full rounded-md bg-white dark:bg-gray-900 px-3 py-1.5 text-base text-gray-900 dark:text-white outline outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-700 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-primary-600 dark:focus:outline-primary-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="last-name"
                className="block text-sm font-medium text-gray-900 dark:text-white"
              >
                Last name
              </label>
              <input
                id="last-name"
                name="last-name"
                type="text"
                required
                autoComplete="family-name"
                className="block w-full rounded-md bg-white dark:bg-gray-900 px-3 py-1.5 text-base text-gray-900 dark:text-white outline outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-700 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-primary-600 dark:focus:outline-primary-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-900 dark:text-white"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="block w-full rounded-md bg-white dark:bg-gray-900 px-3 py-1.5 text-base text-gray-900 dark:text-white outline outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-700 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-primary-600 dark:focus:outline-primary-500 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-900 dark:text-white"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="new-password"
              className="block w-full rounded-md bg-white dark:bg-gray-900 px-3 py-1.5 text-base text-gray-900 dark:text-white outline outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-700 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-primary-600 dark:focus:outline-primary-500 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-900 dark:text-white"
            >
              Confirm password
            </label>
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              required
              autoComplete="new-password"
              className="block w-full rounded-md bg-white dark:bg-gray-900 px-3 py-1.5 text-base text-gray-900 dark:text-white outline outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-700 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-primary-600 dark:focus:outline-primary-500 sm:text-sm"
            />
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 rounded border-gray-300 text-primary-text-600 focus:ring-primary-500"
            />
            <label
              htmlFor="terms"
              className="ml-2 block text-sm text-gray-900 dark:text-white"
            >
              I agree to the{' '}
              <Link
                to="/terms"
                className="font-semibold text-primary-text-600 hover:text-primary-500"
              >
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link
                to="/privacy"
                className="font-semibold text-primary-text-600 hover:text-primary-500"
              >
                Privacy Policy
              </Link>
            </label>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
                  <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                    {error}
                  </div>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loadingState.email}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70"
          >
            {loadingState.email ? 'Creating account...' : 'Sign up'}
          </button>
        </form>
      </div>
    </div>
  );
}
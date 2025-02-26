import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sun, X } from 'lucide-react';

const scrollToSection = (e, id) => {
  e.preventDefault();
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
};

export default function LandingHeader() {
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    // If no saved preference, check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Apply theme on mount and when it changes
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav className="flex items-center justify-between p-6 lg:px-8 gap-4" aria-label="Global">
        <div className="flex">
          <Link to="/" className="-m-1.5 p-1.5 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Amplify
          </Link>
        </div>
        <div className="flex items-center gap-4 lg:hidden">
          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-400"
          >
            <span className="sr-only">Open main menu</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>

        {/* Mobile menu overlay */}
        <div
          className={`fixed inset-0 z-50 bg-gray-900/50 backdrop-blur-sm transition-opacity lg:hidden ${
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={closeMobileMenu}
        />

        {/* Mobile menu panel */}
        <div
          className={`fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white px-6 py-6 dark:bg-gray-900 transition-transform duration-300 lg:hidden ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="-m-1.5 p-1.5 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
              onClick={closeMobileMenu}
            >
              Amplify
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-gray-400"
              onClick={closeMobileMenu}
            >
              <span className="sr-only">Close menu</span>
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="space-y-2 py-6">
              <a
                href="#features"
                onClick={(e) => {
                  scrollToSection(e, 'features');
                  closeMobileMenu();
                }}
                className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Features
              </a>
              <a
                href="#pricing"
                onClick={(e) => {
                  scrollToSection(e, 'pricing');
                  closeMobileMenu();
                }}
                className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Pricing
              </a>
              <a
                href="#contact"
                onClick={(e) => {
                  scrollToSection(e, 'contact');
                  closeMobileMenu();
                }}
                className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Contact
              </a>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-800 py-6">
              <Link
                to="/login"
                className="block rounded-lg border border-gray-900 px-3 py-2 text-center text-base font-semibold leading-7 text-gray-900 hover:bg-gray-900 hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-gray-900"
                onClick={closeMobileMenu}
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="mt-2 block rounded-lg bg-gray-900 px-3 py-2 text-center text-base font-semibold leading-7 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                onClick={closeMobileMenu}
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex lg:items-center lg:gap-x-8">
          <a 
            href="#features" 
            onClick={(e) => scrollToSection(e, 'features')}
            className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Features
          </a>
          <a 
            href="#pricing" 
            onClick={(e) => scrollToSection(e, 'pricing')}
            className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Pricing
          </a>
          <a 
            href="#contact" 
            onClick={(e) => scrollToSection(e, 'contact')}
            className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Contact
          </a>
          <Link
            to="/login"
            className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-300"
          >
            Sign in
          </Link>
          <Link
            to="/signup"
            className="rounded-lg border border-gray-900 px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-900 hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-gray-900"
          >
            Sign up
          </Link>
          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </nav>
    </header>
  );
}
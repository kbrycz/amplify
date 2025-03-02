import React from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';

export function HeroSection() {
  return (
    <div className="relative isolate pt-14">
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
      <div className="py-24 sm:py-32 lg:pb-40">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-balance text-5xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-7xl mb-8">
              Share Stories That Matter
            </h1>
            <p className="text-pretty text-lg font-medium text-gray-600 dark:text-gray-400 sm:text-xl/8">
              Turn community feedback into powerful video stories. Whether it's political support, social causes, or community initiatives - let every voice be heard.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/login"
                className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
              >
                Get started
              </Link>
              <button
                onClick={() => {
                  const videoSection = document.querySelector('.video-preview-section');
                  if (videoSection) {
                    videoSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="text-sm/6 font-semibold text-gray-900 dark:text-white"
              >
                Learn more <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
          <div className="mt-16 sm:mt-24 video-preview-section">
            <div className="group relative aspect-video w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-100 shadow-2xl transition-all hover:shadow-xl dark:border-gray-800 dark:bg-gray-800/50 dark:hover:border-gray-700 cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2070"
                alt="App screenshot"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 will-change-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/30 backdrop-blur-sm transition-transform duration-500 will-change-transform group-hover:scale-[1.3]">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white">
                    <Play className="h-8 w-8 text-gray-900" />
                  </div>
                </div>
              </div>
              <div className="absolute inset-x-4 bottom-4 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                  <img
                    src="/images/logo-color.png"
                    alt="Logo"
                    className="h-6 w-6"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    Watch Demo
                  </p>
                  <p className="text-sm text-gray-300">
                    2:30
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
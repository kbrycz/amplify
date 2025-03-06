// src/components/support/FAQSection.jsx
import React from 'react';
import { Disclosure } from '@headlessui/react';
import { Plus, Minus } from 'lucide-react';

export default function FAQSection({ faqs }) {
  return (
    <div className="grid max-w-7xl grid-cols-1 gap-x-8 md:grid-cols-[300px,1fr]">
      <div className="py-6">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">Support Center</h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Find answers to commonly asked questions about using Amplify.
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
          Frequently asked questions
        </h2>
        <dl className="mt-8 space-y-6 divide-y divide-gray-200 dark:divide-gray-800">
          {faqs.map((faq) => (
            <Disclosure as="div" key={faq.question} className="pt-6 first:pt-0">
              {({ open }) => (
                <>
                  <dt>
                    <Disclosure.Button className="flex w-full items-start justify-between text-left">
                      <span className="text-base font-semibold text-gray-900 dark:text-white">
                        {faq.question}
                      </span>
                      <span className="ml-6 flex h-7 items-center">
                        {open ? (
                          <Minus className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        ) : (
                          <Plus className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        )}
                      </span>
                    </Disclosure.Button>
                  </dt>
                  <Disclosure.Panel as="dd" className="mt-2 pr-12">
                    <p className="text-base text-gray-600 dark:text-gray-400">
                      {faq.answer}
                    </p>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          ))}
        </dl>
      </div>
    </div>
  );
}
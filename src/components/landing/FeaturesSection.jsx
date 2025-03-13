import React from 'react';
import { Tab } from '@headlessui/react';
import { Video, BarChart3, Zap, Users, Sparkles } from 'lucide-react';
import { MobileFeatures } from './MobileFeatures';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const features = [
  {
    title: 'Authentic Stories',
    description: 'Capture genuine video testimonials from supporters and community members with our intuitive recording tools.',
    icon: Video,
    image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2070',
    color: 'text-primary-600 dark:text-primary-400',
    gridSpan: 'lg:col-span-3',
    rounded: 'max-lg:rounded-t-[2rem] lg:rounded-tl-[2rem]'
  },
  {
    title: 'Smart Video Magic',
    description: 'Let AI transform raw testimonials into polished, shareable content that amplifies your message.',
    icon: BarChart3,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070',
    color: 'text-primary-text-600 dark:text-primary-text-400',
    gridSpan: 'lg:col-span-3',
    rounded: 'lg:rounded-tr-[2rem]'
  },
  {
    title: 'Effortless Campaigns',
    description: 'Launch and manage feedback campaigns with beautiful themes and targeted questions.',
    icon: Zap,
    image: 'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?q=80&w=2070',
    color: 'text-yellow-600 dark:text-yellow-400',
    gridSpan: 'lg:col-span-2',
    rounded: 'lg:rounded-bl-[2rem]'
  },
  {
    title: 'Insights That Matter',
    description: 'Understand your community better with powerful analytics and engagement metrics.',
    icon: Users,
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070',
    color: 'text-green-600 dark:text-green-400',
    gridSpan: 'lg:col-span-2'
  },
  {
    title: 'Seamless Sharing',
    description: 'Reach your audience anywhere with easy-to-share campaign links and social integration.',
    icon: Sparkles,
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070',
    color: 'text-purple-600 dark:text-purple-400',
    gridSpan: 'lg:col-span-2',
    rounded: 'max-lg:rounded-b-[2rem] lg:rounded-br-[2rem]'
  }
];

export function FeaturesSection() {
  return (
    <section
      id="features"
      aria-label="Features for running your books"
      className="relative overflow-hidden bg-white dark:bg-gray-900 pt-20 pb-28 sm:py-32 scroll-mt-16"
    >
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl md:mx-auto md:text-center xl:max-w-none">
          <h2 className="text-base font-semibold leading-7 text-primary-text-600 dark:text-primary-text-400 text-center">Features</h2>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-5xl mx-auto max-w-4xl text-center">
            Transform Stories into Impact
          </p>
          <p className="mt-6 mb-16 text-lg text-gray-600 dark:text-gray-400 mx-auto max-w-2xl text-center">
            Powerful tools to collect, enhance, and share authentic stories from your community.
          </p>
        </div>

        {/* Mobile Features */}
        <MobileFeatures features={features} />

        {/* Desktop Features */}
        <Tab.Group
          as="div"
          className="hidden mt-16 grid-cols-1 items-center gap-y-2 pt-10 sm:gap-y-6 md:mt-20 lg:grid lg:grid-cols-12 lg:pt-0"
          vertical
        >
          {({ selectedIndex }) => (
            <>
              <div className="-mx-4 flex overflow-x-auto pb-4 sm:mx-0 sm:overflow-visible sm:pb-0 lg:col-span-5">
                <Tab.List className="relative z-10 flex gap-x-4 whitespace-nowrap px-4 sm:mx-auto sm:px-0 lg:mx-0 lg:block lg:gap-x-0 lg:gap-y-1 lg:whitespace-normal">
                  {features.map((feature, featureIndex) => (
                    <div
                      key={feature.title}
                      className={classNames(
                        selectedIndex === featureIndex
                          ? 'bg-gray-100 lg:bg-gray-100 dark:bg-gray-800 lg:ring-1 lg:ring-inset lg:ring-gray-200 dark:lg:ring-gray-800'
                          : 'hover:bg-gray-50 lg:hover:bg-gray-50 dark:hover:bg-gray-800/50',
                        'group relative rounded-full px-4 py-1 lg:rounded-l-xl lg:rounded-r-none lg:p-6'
                      )}
                    >
                      <h3>
                        <Tab
                          className={classNames(
                            selectedIndex === featureIndex
                              ? 'text-primary-text-600 lg:text-gray-900 dark:lg:text-white'
                              : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white',
                            'font-display text-lg [&:not(:focus-visible)]:focus:outline-none'
                          )}
                        >
                          <span className="absolute inset-0 rounded-full lg:rounded-l-xl lg:rounded-r-none" />
                          {feature.title}
                        </Tab>
                      </h3>
                      <p
                        className={classNames(
                          selectedIndex === featureIndex
                            ? 'text-gray-600 dark:text-gray-400'
                            : 'text-gray-500 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-400',
                          'mt-2 hidden text-sm lg:block'
                        )}
                      >
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </Tab.List>
              </div>
              <Tab.Panels className="lg:col-span-7">
                {features.map((feature) => (
                  <Tab.Panel key={feature.title} unmount={false}>
                    <div className="relative sm:px-6 lg:hidden">
                      <div className="absolute -inset-x-4 bottom-[-4.25rem] top-[-6.5rem] bg-gray-100/50 dark:bg-gray-800/50 ring-1 ring-inset ring-gray-200 dark:ring-gray-800 sm:inset-x-0 sm:rounded-t-xl" />
                      <p className="relative mx-auto max-w-2xl text-base text-gray-600 dark:text-gray-400 sm:text-center">
                        {feature.description}
                      </p>
                    </div>
                    <div className="mt-10 w-[45rem] overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-xl sm:w-auto lg:mt-0 lg:w-[67.8125rem]">
                      <img
                        className="w-full"
                        src={feature.image} 
                        alt=""
                        priority="true"
                        sizes="(min-width: 1024px) 67.8125rem, (min-width: 640px) 100vw, 45rem"
                      />
                    </div>
                  </Tab.Panel>
                ))}
              </Tab.Panels>
            </>
          )}
        </Tab.Group>
      </div>
    </section>
  );
}
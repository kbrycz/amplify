import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import { ChevronRight, Check, X, Video, BarChart2, Zap, Users, MessageSquare, Sparkles, ChevronDown, Facebook, Instagram, Twitter, Github, Youtube, Play } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import LandingHeader from '../components/LandingHeader';

// Scroll function for smooth navigation
const scrollToSection = (e, id) => {
  e.preventDefault();
  const element = document.getElementById(id);
  if (!element) return;

  // Basic header height
  const headerHeight = 80;
  // Choose a larger offset for mobile
  const isMobile = window.innerWidth < 768;
  const scrollPadding = isMobile ? -125 : -150;

  const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
  const offsetPosition = elementPosition - headerHeight - scrollPadding;
  
  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
};

const navigation = {
  main: [
    { name: 'About', href: '/about' },
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Contact', href: '#contact' }
  ],
  social: [
    { name: 'Facebook', href: '#', icon: Facebook },
    { name: 'Instagram', href: '#', icon: Instagram },
    { name: 'Twitter', href: '#', icon: Twitter },
    { name: 'GitHub', href: '#', icon: Github },
    { name: 'YouTube', href: '#', icon: Youtube },
  ],
};

const features = [
  {
    title: 'Authentic Stories',
    description: 'Capture genuine video testimonials from supporters and community members with our intuitive recording tools.',
    icon: Video,
    image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2070',
    color: 'text-blue-600 dark:text-blue-400',
    gridSpan: 'lg:col-span-3',
    rounded: 'max-lg:rounded-t-[2rem] lg:rounded-tl-[2rem]'
  },
  {
    title: 'Smart Video Magic',
    description: 'Let AI transform raw testimonials into polished, shareable content that amplifies your message.',
    icon: BarChart2,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070',
    color: 'text-indigo-600 dark:text-indigo-400',
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

const pricing = {
  frequencies: [
    { value: 'monthly', label: 'Monthly' },
    { value: 'annually', label: 'Annually' },
  ],
  tiers: [
    {
      name: 'Starter',
      id: 'tier-basic',
      href: '#',
      featured: false,
      description: 'Perfect for individuals and small organizations just getting started.',
      price: { monthly: '$20', annually: '$192' },
      highlights: [
        'Up to 3 active campaigns',
        'Up to 100 video responses/month',
        'Basic video enhancement',
        'Standard video quality (720p)',
        'Basic analytics dashboard',
        'Shareable campaign links',
        'Email support'
      ],
    },
    {
      name: 'Pro',
      id: 'tier-pro',
      href: '#',
      featured: true,
      description: 'For growing organizations who need more features and capacity.',
      price: { monthly: '$100', annually: '$960' },
      highlights: [
        'Up to 10 active campaigns',
        'Up to 1,000 video responses/month',
        'Advanced AI video enhancement',
        'HD video quality (1080p)',
        'Advanced analytics & reporting',
        'AI-powered insights',
        'Custom branding',
        'Campaign templates',
        'Priority support',
        'Team collaboration tools'
      ],
    },
    {
      name: 'Enterprise',
      id: 'tier-premium',
      href: '#',
      featured: false,
      description: 'Custom solutions for large organizations with advanced needs.',
      price: { monthly: '$500', annually: '$4,800' },
      highlights: [
        'Unlimited active campaigns',
        'Unlimited video responses',
        'Premium AI video enhancement',
        '4K video quality available',
        'Custom analytics solutions',
        'Advanced AI features',
        'Full white-labeling',
        'Custom integrations',
        'Dedicated support',
        'API access'
      ],
    },
  ],
  sections: [
    {
      name: 'Features',
      features: [
        { name: 'Active campaigns', tiers: { Starter: '3', Pro: '10', Enterprise: 'Unlimited' } },
        { name: 'Monthly responses', tiers: { Starter: '100', Pro: '1,000', Enterprise: 'Unlimited' } },
        { name: 'Video quality', tiers: { Starter: '720p', Pro: '1080p', Enterprise: '4K' } },
        { name: 'Team members', tiers: { Starter: '1', Pro: '5', Enterprise: 'Unlimited' } },
        { name: 'Custom branding', tiers: { Starter: false, Pro: true, Enterprise: true } },
        { name: 'White-labeling', tiers: { Starter: false, Pro: false, Enterprise: true } },
      ],
    },
    {
      name: 'Analytics',
      features: [
        { name: 'Response analytics', tiers: { Starter: 'Basic', Pro: 'Advanced', Enterprise: 'Custom' } },
        { name: 'AI video enhancement', tiers: { Starter: 'Basic', Pro: 'Advanced', Enterprise: 'Premium' } },
        { name: 'Custom dashboards', tiers: { Starter: false, Pro: true, Enterprise: true } },
        { name: 'Export capabilities', tiers: { Starter: 'CSV', Pro: 'CSV + API', Enterprise: 'Full API' } },
      ],
    },
    {
      name: 'Support',
      features: [
        { name: 'Support level', tiers: { Starter: 'Email', Pro: 'Priority', Enterprise: 'Dedicated' } },
        { name: 'Response time', tiers: { Starter: '48h', Pro: '24h', Enterprise: '4h' } },
        { name: 'Training sessions', tiers: { Starter: false, Pro: '2/month', Enterprise: 'Unlimited' } },
        { name: 'API access', tiers: { Starter: false, Pro: 'Read-only', Enterprise: 'Full' } },
      ],
    },
  ],
};

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Landing() {
  const [frequency, setFrequency] = useState(pricing.frequencies[0]);

  return (
    <div className="bg-white dark:bg-gray-900">
      <LandingHeader />
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
              <Dialog>
                <DialogTrigger asChild>
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
                          src="/images/splashLogoBlue.png"
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
                </DialogTrigger>
                <DialogContent className="sm:max-w-[800px] p-0 bg-black" aria-describedby="video-description">
                  <DialogTitle className="sr-only">Demo Video</DialogTitle>
                  <DialogDescription id="video-description" className="sr-only">
                    A demonstration video showing how Shout helps organizations capture and share authentic stories from their communities
                  </DialogDescription>
                  <video
                    className="w-full aspect-video"
                    controls
                    autoPlay
                    src="https://videos.ctfassets.net/e5382hct74si/78GSqHF8tBvSGwA2hV0GFk/76797f9586d2a04f13f2b5b098e0c2dd/Homepage_Video.mp4"
                    aria-label="Product demonstration video"
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
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

      {/* Features Grid */}
      <div id="features" className="bg-white py-24 sm:py-32 dark:bg-gray-900 scroll-mt-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600 dark:text-indigo-400 text-center">Features</h2>
            <p className="mt-2 text-4xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-5xl mx-auto max-w-4xl">
              Empower Your Community
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-16 lg:grid-cols-6 lg:grid-rows-2">
            {features.map((feature) => (
              <div key={feature.title} className={`relative ${feature.gridSpan}`}>
                <div className={`absolute inset-px rounded-lg bg-white dark:bg-gray-800 ${feature.rounded}`} />
                <div className={`relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] ${feature.rounded}`}>
                  <div className="relative h-80 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                    <img
                      alt={feature.title}
                      src={feature.image}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <feature.icon className={`absolute bottom-4 right-4 h-8 w-8 ${feature.color} z-20`} />
                  </div>
                  <div className="p-6">
                    <h3 className={`text-sm font-semibold ${feature.color}`}>{feature.title}</h3>
                    <p className="mt-2 text-lg font-medium tracking-tight text-gray-900 dark:text-white">{feature.title}</p>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
                  </div>
                </div>
                <div className={`pointer-events-none absolute inset-px rounded-lg shadow-lg ring-1 ring-black/5 dark:ring-white/10 ${feature.rounded}`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing section */}
      <div id="pricing" className="bg-white py-24 sm:py-32 dark:bg-gray-900 scroll-mt-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600 dark:text-indigo-400 text-center">Pricing</h2>
            <p className="mt-2 text-4xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-5xl mx-auto max-w-4xl">
              Simple, transparent pricing
            </p>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 mx-auto max-w-2xl">
              Choose the perfect plan for your needs. Save 20% with annual billing. All plans include unlimited storage for responses.
            </p>
          </div>
          <div className="mt-16">
            <div className="flex justify-center">
                <div className="grid grid-cols-2 gap-x-1 rounded-full bg-gray-100 p-1 text-center text-xs font-semibold text-gray-900 dark:bg-gray-800">
                  {pricing.frequencies.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFrequency(option)}
                      className={classNames(
                        option === frequency
                          ? 'bg-white text-gray-900 dark:bg-gray-900 dark:text-white'
                          : 'text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800/50',
                        'cursor-pointer rounded-full px-2.5 py-1'
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
            </div>

            <div className="relative mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
              {pricing.tiers.map((tier) => (
                <div
                  key={tier.id}
                  className={classNames(
                    tier.featured
                      ? 'z-10 bg-white shadow-xl ring-1 ring-gray-900/10 dark:bg-gray-800 dark:ring-white/10'
                      : 'bg-gray-100/80 ring-1 ring-gray-900/10 dark:bg-gray-800/50 dark:ring-white/10',
                    'relative rounded-2xl'
                  )}
                >
                  <div className="p-8 lg:pt-12 xl:p-10 xl:pt-14">
                    <h2
                      id={tier.id}
                      className={classNames(
                        tier.featured ? 'text-gray-900 dark:text-white' : 'text-gray-900 dark:text-white',
                        'text-sm font-semibold leading-6'
                      )}
                    >
                      {tier.name}
                    </h2>
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between lg:flex-col lg:items-stretch">
                      <div className="mt-2 flex items-center gap-x-4">
                        <p
                          className={classNames(
                            tier.featured ? 'text-gray-900 dark:text-white' : 'text-gray-900 dark:text-white',
                            'text-4xl font-semibold tracking-tight'
                          )}
                        >
                          {tier.price[frequency.value]}
                        </p>
                        <div className="text-sm">
                          <p className={tier.featured ? 'text-gray-900 dark:text-white' : 'text-gray-900 dark:text-white'}>USD</p>
                          <p className={tier.featured ? 'text-gray-500 dark:text-gray-400' : 'text-gray-500 dark:text-gray-400'}>
                            {frequency.value === 'annually' ? 'Billed yearly (20% off)' : 'Billed monthly'}
                          </p>
                        </div>
                      </div>
                      <a
                        href={tier.href}
                        aria-describedby={tier.id}
                        className={classNames(
                          tier.featured
                            ? 'bg-indigo-600 text-white hover:bg-indigo-500 dark:hover:bg-indigo-400'
                            : 'bg-gray-800 text-white hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100',
                          'rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                        )}
                      >
                        Buy this plan
                      </a>
                    </div>
                    <div className="mt-8 flow-root sm:mt-10">
                      <ul
                        role="list"
                        className={classNames(
                          tier.featured
                            ? 'divide-gray-900/5 border-gray-900/5 text-gray-600 dark:divide-white/5 dark:border-white/5 dark:text-gray-300'
                            : 'divide-gray-900/5 border-gray-900/5 text-gray-600 dark:divide-white/5 dark:border-white/5 dark:text-gray-300',
                          '-my-2 divide-y border-t text-sm leading-6'
                        )}
                      >
                        {tier.highlights.map((feature) => (
                          <li key={feature} className="flex gap-x-3 py-2">
                            <Check
                              className={classNames(
                                tier.featured ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400',
                                'h-6 w-5 flex-none'
                              )}
                            />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contact section */}
      <div id="contact" className="relative isolate bg-white px-6 py-24 dark:bg-gray-900 sm:py-32 lg:px-8 scroll-mt-16">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
          />
        </div>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600 dark:text-indigo-400">Contact sales</h2>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Let's discuss your needs
          </p>
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-400">
            Get in touch with our team to learn how we can help amplify your community's voice.
          </p>
        </div>
        <form action="#" method="POST" className="mx-auto mt-16 max-w-xl sm:mt-20">
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            <div>
              <label htmlFor="first-name" className="block text-sm font-semibold leading-6 text-gray-900 dark:text-white">
                First name
              </label>
              <div className="mt-2.5">
                <input
                  id="first-name"
                  name="first-name"
                  type="text"
                  autoComplete="given-name"
                  className="block w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:ring-gray-700 dark:focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label htmlFor="last-name" className="block text-sm font-semibold leading-6 text-gray-900 dark:text-white">
                Last name
              </label>
              <div className="mt-2.5">
                <input
                  id="last-name"
                  name="last-name"
                  type="text"
                  autoComplete="family-name"
                  className="block w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:ring-gray-700 dark:focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="company" className="block text-sm font-semibold leading-6 text-gray-900 dark:text-white">
                Company
              </label>
              <div className="mt-2.5">
                <input
                  id="company"
                  name="company"
                  type="text"
                  autoComplete="organization"
                  className="block w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:ring-gray-700 dark:focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="email" className="block text-sm font-semibold leading-6 text-gray-900 dark:text-white">
                Email
              </label>
              <div className="mt-2.5">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="block w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:ring-gray-700 dark:focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="phone-number" className="block text-sm font-semibold leading-6 text-gray-900 dark:text-white">
                Phone number
              </label>
              <div className="mt-2.5">
                <div className="flex rounded-lg shadow-sm">
                  <div className="relative flex items-center">
                    <select
                      id="country"
                      name="country"
                      autoComplete="country"
                      className="h-full rounded-l-lg border border-r-0 border-gray-200 bg-white py-2 pl-3 pr-8 text-gray-900 dark:border-gray-800 dark:bg-gray-900 dark:text-white sm:text-sm"
                    >
                      <option>US</option>
                      <option>CA</option>
                      <option>EU</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="phone-number"
                    id="phone-number"
                    autoComplete="tel"
                    className="block w-full rounded-r-lg border border-l-0 border-gray-200 bg-white px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:ring-gray-700 dark:focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    placeholder="(555) 987-6543"
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="message" className="block text-sm font-semibold leading-6 text-gray-900 dark:text-white">
                Message
              </label>
              <div className="mt-2.5">
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="block w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:ring-gray-700 dark:focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  defaultValue={''}
                />
              </div>
            </div>
          </div>
          <div className="mt-10">
            <button
              type="submit"
              className="block w-full rounded-lg bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:hover:bg-indigo-400"
            >
              Let's talk
            </button>
          </div>
        </form>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
          <nav className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12" aria-label="Footer">
            {navigation.main.map((item, index) => (
              <div key={item.name} className="pb-6">
                {item.href.startsWith('#') ? (
                  <a
                    href={item.href}
                    onClick={(e) => scrollToSection(e, item.href.slice(1))}
                    className="text-sm leading-6 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  >
                    {item.name}
                  </a>
                ) : (
                  <Link
                    to={item.href}
                    className="text-sm leading-6 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>
          <div className="mt-10 flex justify-center space-x-10">
            {navigation.social.map((item) => (
              <a key={item.name} href={item.href} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <span className="sr-only">{item.name}</span>
                <item.icon className="h-6 w-6" aria-hidden="true" />
              </a>
            ))}
          </div>
          <p className="mt-10 text-center text-xs leading-5 text-gray-500 dark:text-gray-400">
            &copy; 2025 Shout. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
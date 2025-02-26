import React, { useState } from 'react';
import { Plus, Minus, Upload, X } from 'lucide-react';
import { Disclosure } from '@headlessui/react';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select } from '../components/ui/select';

const faqs = [
  {
    question: "How do I create my first campaign?",
    answer: "Creating your first campaign is easy! Navigate to the dashboard and click the 'Create Campaign' button. Follow the step-by-step guide to set up your campaign name, target audience, and customize your questions."
  },
  {
    question: "What types of responses can I collect?",
    answer: "Our platform supports various response types including video testimonials, written feedback, and audio recordings. You can customize the response format based on your campaign needs and audience preferences."
  },
  {
    question: "How do I share my campaign with participants?",
    answer: "Once your campaign is created, you'll receive a unique link that you can share via email, social media, or embed on your website. Participants can easily access and respond to your campaign through this link."
  },
  {
    question: "Can I customize the branding of my campaigns?",
    answer: "Yes! Premium and Enterprise users can fully customize their campaign's appearance including colors, logos, and themes to match their brand identity. Basic users have access to our standard templates."
  },
  {
    question: "How secure are the responses?",
    answer: "We take security seriously. All responses are encrypted and stored securely in our cloud infrastructure. You have full control over who can access your campaign data through our permission settings."
  }
];

export default function Support() {
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // TODO: Implement form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Support request submitted successfully!');
      e.target.reset();
      setPreviewImage(null);
    } catch (error) {
      console.error('Error submitting support request:', error);
      alert('Failed to submit support request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      {/* FAQ Section */}
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

      {/* Contact Support Section */}
      <div className="mt-10 grid max-w-7xl grid-cols-1 gap-x-8 md:grid-cols-[300px,1fr]">
        <div className="py-6">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Contact Support</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Get in touch with our support team for personalized assistance.
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    className="mt-2"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="mt-2"
                    placeholder="you@example.com"
                  />
                </div>

                <div className="sm:col-span-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select
                    id="subject"
                    name="subject"
                    required
                    className="mt-2"
                  >
                    <option value="">Select a subject</option>
                    <option value="technical">Technical Issue</option>
                    <option value="billing">Billing Question</option>
                    <option value="feature">Feature Request</option>
                    <option value="other">Other</option>
                  </Select>
                </div>

                <div className="sm:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    required
                    rows={4}
                    className="mt-2"
                    placeholder="Please describe your issue in detail..."
                  />
                </div>

                <div className="sm:col-span-2">
                  <Label>Screenshot or Image</Label>
                  <div className="mt-2">
                    <div className="flex items-center justify-center w-full">
                      <label className="relative flex items-center justify-center w-full h-32 border-2 border-gray-200 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          {previewImage ? (
                            <div className="relative w-full h-full p-2">
                              <img
                                src={previewImage}
                                alt="Preview"
                                className="h-24 object-contain rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <>
                              <Upload className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                              </p>
                            </>
                          )}
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Support Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      <div className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; 2025 Amplify. All rights reserved.
      </div>
    </div>
  );
}
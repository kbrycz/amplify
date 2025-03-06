// src/pages/Support.jsx
import React, { useState } from 'react';
import FAQSection from '../components/support/FAQSection';
import ContactSupportForm from '../components/support/ContactSupportForm';

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

  // Handle file selection
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

  // Remove selected image
  const handleRemoveImage = () => {
    setPreviewImage(null);
  };

  // Submit the form
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
      <FAQSection faqs={faqs} />

      <ContactSupportForm
        previewImage={previewImage}
        isSubmitting={isSubmitting}
        handleImageChange={handleImageChange}
        handleRemoveImage={handleRemoveImage}
        handleSubmit={handleSubmit}
      />

      <div className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; 2025 Shout. All rights reserved.
      </div>
    </div>
  );
}
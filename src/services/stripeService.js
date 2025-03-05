// stripeService.js
import { post } from '../lib/api';
import { auth } from '../lib/firebase';

/**
 * Creates a Stripe checkout session for the specified plan
 * @param {string} planName - The name of the plan (pro or premium)
 * @param {string} idToken - The Firebase ID token for authentication
 * @returns {Promise<{sessionId: string}>} - The Stripe checkout session ID
 */
export const createCheckoutSession = async (planName, idToken) => {
  try {
    return await post('/stripe/create-checkout-session', {
      plan: planName.toLowerCase()
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

export const verifySubscription = async (sessionId) => {
  try {
    console.log('Verifying subscription with session ID:', sessionId);
    // Use the post utility function instead of direct fetch
    const response = await post('/stripe/verify-payment', { sessionId });
    console.log('Subscription verification response:', response);
    return response;
  } catch (error) {
    console.error('Error verifying subscription:', error);
    throw error;
  }
};

/**
 * Redirects to Stripe Checkout with the given session ID
 * @param {string} sessionId - The Stripe checkout session ID
 */
export const redirectToCheckout = async (sessionId) => {
  try {
    console.log('Starting redirect to Stripe checkout with session ID:', sessionId);
    
    // Load Stripe.js dynamically with the environment variable
    const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
    
    if (!stripe) {
      throw new Error('Failed to load Stripe');
    }

    // Add a small delay to ensure the loading state is visible
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // This will redirect the user to Stripe Checkout
    const { error } = await stripe.redirectToCheckout({
      sessionId,
    });
    
    // If we get here, there was an error with the redirect
    if (error) {
      console.error('Stripe redirect error:', error);
      throw new Error(error.message || 'Failed to redirect to checkout');
    }
  } catch (error) {
    console.error('Error in redirectToCheckout:', error);
    throw error;
  }
};

/**
 * Loads the Stripe.js script and initializes Stripe
 * @param {string} publicKey - The Stripe public key
 * @returns {Promise<Stripe>} - The Stripe instance
 */
const loadStripe = (function() {
  let stripePromise = null;
  
  return function(publicKey) {
    if (!stripePromise) {
      stripePromise = new Promise((resolve) => {
        // Create script element
        const script = document.createElement('script');
        script.src = 'https://js.stripe.com/v3/';
        script.async = true;
        script.onload = () => {
          // Initialize Stripe with the public key
          resolve(window.Stripe(publicKey));
        };
        document.body.appendChild(script);
      });
    }
    return stripePromise;
  };
})();
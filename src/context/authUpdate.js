// src/context/authUpdate.js
import { auth } from '../lib/firebase';
import { post } from '../lib/api';
import { SERVER_URL } from '../lib/api';
import { 
  updatePassword, 
  EmailAuthProvider, 
  reauthenticateWithCredential 
} from 'firebase/auth';
import { fetchUserProfile } from './authProfile';

// Updates the user profile on the server and locally
export const updateUserProfile = async (updates, setUser) => {
  if (!auth.currentUser) return;
  try {
    const idToken = await auth.currentUser.getIdToken();
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/user/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
      body: JSON.stringify(updates)
    });
    if (!response.ok) throw new Error('Failed to update profile');
    const updatedProfile = await response.json();
    setUser(currentUser => ({ ...currentUser, ...updatedProfile }));
    return updatedProfile;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

// Changes the user's password
export const changePassword = async (currentPassword, newPassword, setUser) => {
  if (!auth.currentUser) throw new Error('No user logged in');
  try {
    const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
    await reauthenticateWithCredential(auth.currentUser, credential);
    await updatePassword(auth.currentUser, newPassword);
    const idToken = await auth.currentUser.getIdToken();
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/update-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
      body: JSON.stringify({ password: newPassword })
    });
    if (!response.ok) throw new Error('Failed to update password on server');
    await fetchUserProfile(auth.currentUser, setUser);
    return true;
  } catch (error) {
    if (error.code === 'auth/wrong-password') {
      throw new Error('Current password is incorrect');
    }
    throw error;
  }
};

// Updates the user's plan (using either downgrade or a checkout session)
export const updateUserPlan = async (planName, user, setUser) => {
  try {
    const planRank = { basic: 1, pro: 2, premium: 3 };
    const currentPlan = user?.subscription?.plan || user?.plan || 'basic';
    const currentRank = planRank[currentPlan];
    const targetRank = planRank[planName];
    
    if (targetRank < currentRank) {
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch(`${SERVER_URL}/stripe/downgrade`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ targetPlan: planName })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to downgrade subscription');
      }
      const data = await response.json();
      const updatedUser = { 
        ...user, 
        plan: data.plan,
        subscription: {
          plan: data.plan,
          period: 'N/A'
        },
        stripeSubscriptionId: null,
        stripeCustomerId: null
      };
      setUser(updatedUser);
      return updatedUser;
    } else if (planName === 'basic') {
      const response = await post('/auth/update-plan', { plan: planName });
      if (!response.success) {
        throw new Error('Failed to update to basic plan');
      }
      const updatedUser = { 
        ...user, 
        plan: planName,
        subscription: {
          plan: planName,
          period: 'N/A'
        }
      };
      setUser(updatedUser);
      return updatedUser;
    } else {
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch(`${SERVER_URL}/stripe/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ plan: planName })
      });
      if (!response.ok) {
        throw new Error(`Failed to update plan: ${response.status}`);
      }
      return await response.json();
    }
  } catch (error) {
    console.error('Error updating user plan:', error);
    throw error;
  }
};
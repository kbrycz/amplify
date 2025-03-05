import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleAuthProvider } from '../lib/firebase';
import { post, get, put } from '../lib/api';
import { SERVER_URL } from '../lib/api';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  updatePassword, 
  EmailAuthProvider, 
  reauthenticateWithCredential,
  signOut 
} from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [newSignup, setNewSignup] = useState(false);

  const createUserProfile = async (firebaseUser, firstName, lastName, plan = 'basic') => {
    try {
      const data = await post('/auth/signup', {
        uid: firebaseUser.uid,
        firstName,
        lastName,
        email: firebaseUser.email,
        plan
      });
      
      if (data.sessionId) {
        return {
          ...data,
          requiresPayment: true,
          sessionId: data.sessionId
        };
      }
      
      return data;
    } catch (error) {
      console.error('Failed to create user profile:', error);
      throw error;
    }
  };

  const fetchUserProfile = async (firebaseUser) => {
    try {
      console.log("AuthContext - fetchUserProfile called for user:", firebaseUser?.uid);
      const profileData = await get('/auth/profile');
      console.log("AuthContext - profile data received:", profileData);
      
      if (!profileData) {
        console.log("AuthContext - No profile data, setting basic user");
        setUser(firebaseUser);
        return;
      }
      
      // Make sure we preserve the plan information
      const mergedUser = { 
        ...firebaseUser, 
        ...profileData,
        // Ensure subscription data is properly structured
        subscription: profileData.subscription || {
          plan: profileData.plan,
          period: profileData.subscriptionPeriod
        }
      };
      
      console.log("AuthContext - setting merged user with profile:", mergedUser);
      setUser(mergedUser);
      return mergedUser;
    } catch (error) {
      console.warn('Profile fetch warning:', error.message);
      setUser(firebaseUser);
    }
  };

  // New function to directly set the user profile
  const setUserProfile = (profileData) => {
    console.log("AuthContext - setUserProfile called with data:", profileData);
    
    if (auth.currentUser) {
      // Make sure we preserve the plan information
      const mergedUser = { 
        ...auth.currentUser, 
        ...profileData,
        // Ensure subscription data is properly structured
        subscription: profileData.subscription || {
          plan: profileData.plan,
          period: profileData.subscriptionPeriod
        }
      };
      console.log("AuthContext - setting merged user:", mergedUser);
      setUser(mergedUser);
    } else {
      console.log("AuthContext - setUserProfile called but no current user");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        if (newSignup) {
          setUser(firebaseUser);
        } else {
          setUser(firebaseUser);
          fetchUserProfile(firebaseUser);
        }
      } else {
        setUser(null);
        setNewSignup(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [newSignup]);

  const signIn = async (email, password) => {
    setIsAuthenticating(true);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    await fetchUserProfile(userCredential.user);
    setIsAuthenticating(false);
    return userCredential.user;
  };

  const signUp = async (email, password, firstName, lastName, plan = 'basic') => {
    setIsSigningUp(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      await updateProfile(firebaseUser, {
        displayName: `${firstName} ${lastName}`.trim()
      });
      setNewSignup(true);
      await createUserProfile(firebaseUser, firstName, lastName, plan);
      return firebaseUser;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    } finally {
      setIsSigningUp(false);
      console.log('Signup process completed');
    }
  };

  const completeNewSignup = async () => {
    setNewSignup(false);
    await fetchUserProfile(auth.currentUser);
  };

  const signInWithGoogle = async (credential, firstName, lastName) => {
    setIsAuthenticating(true);
    try {
      const firebaseUser = auth.currentUser;
      await createUserProfile(firebaseUser, firstName, lastName, 'basic');
      await fetchUserProfile(firebaseUser);
      return firebaseUser;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    } finally {
      setIsAuthenticating(false);
      console.log('Google sign-in process completed');
    }
  };

  const updateUserProfile = async (updates) => {
    if (!user) return;
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

  const changePassword = async (currentPassword, newPassword) => {
    if (!user) throw new Error('No user logged in');

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

      await fetchUserProfile(auth.currentUser);
      return true;
    } catch (error) {
      if (error.code === 'auth/wrong-password') {
        throw new Error('Current password is incorrect');
      }
      throw error;
    }
  };

  const updateUserPlan = async (planName) => {
    console.log("AuthContext - updateUserPlan called with plan:", planName);
    console.log("AuthContext - current user:", user);
    
    try {
      // Define a ranking for the plans to determine if this is a downgrade
      const planRank = { basic: 1, pro: 2, premium: 3 };
      const currentPlan = user?.subscription?.plan || user?.plan || 'basic';
      const currentRank = planRank[currentPlan];
      const targetRank = planRank[planName];
      
      console.log("AuthContext - Current plan:", currentPlan, "Target plan:", planName);
      
      // Check if this is a downgrade (target rank is lower than current rank)
      if (targetRank < currentRank) {
        console.log("AuthContext - Downgrading from", currentPlan, "to", planName);
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
        console.log("AuthContext - downgrade response:", data);
        
        // Create a properly structured user object with subscription information
        const updatedUser = { 
          ...user, 
          plan: data.plan,
          subscription: {
            plan: data.plan,
            period: 'N/A'
          },
          // Clear subscription-related fields
          stripeSubscriptionId: null,
          stripeCustomerId: null
        };
        
        console.log("AuthContext - setting user with downgraded plan:", updatedUser);
        setUser(updatedUser);
        return updatedUser;
      } else if (planName === 'basic') {
        // For users not on paid plans, use the existing endpoint
        const response = await post('/auth/update-plan', { plan: planName });
        console.log("AuthContext - basic plan update response:", response);
        
        if (!response.success) {
          throw new Error('Failed to update to basic plan');
        }
        
        // Create a properly structured user object with subscription information
        const updatedUser = { 
          ...user, 
          plan: planName,
          subscription: {
            plan: planName,
            period: 'N/A'
          }
        };
        
        console.log("AuthContext - setting user with updated plan:", updatedUser);
        setUser(updatedUser);
        return updatedUser;
      } else {
        // For upgrades, use the Stripe checkout flow
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

  const value = {
    user,
    loading,
    isAuthenticating,
    signIn,
    signUp,
    signOut: () => auth.signOut(),
    signInWithGoogle,
    updateUserProfile,
    changePassword,
    updateUserPlan,
    completeNewSignup,
    newSignup,
    setUserProfile,
    fetchUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
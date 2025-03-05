import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../lib/firebase';
import { post, get } from '../lib/api';
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
      const profileData = await get('/auth/profile');
      if (!profileData) {
        setUser(firebaseUser);
        return;
      }
      const mergedUser = { ...firebaseUser, ...profileData };
      setUser(mergedUser);
      return mergedUser;
    } catch (error) {
      console.warn('Profile fetch warning:', error.message);
      setUser(firebaseUser);
    }
  };

  // New function to directly set the user profile
  const setUserProfile = (profileData) => {
    if (auth.currentUser) {
      const mergedUser = { ...auth.currentUser, ...profileData };
      setUser(mergedUser);
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
    try {
      if (planName === 'basic') {
        const response = await post('/auth/update-plan', { plan: planName });
        if (!response.success) {
          throw new Error('Failed to update to basic plan');
        }
        const updatedUser = { ...user, plan: planName };
        setUser(updatedUser);
        return updatedUser;
      } else {
        const idToken = await auth.currentUser.getIdToken();
        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/stripe/create-checkout-session`, {
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
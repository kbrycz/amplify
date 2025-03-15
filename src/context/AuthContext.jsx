// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import {
  createUserProfile,
  fetchUserProfile,
  setUserProfile
} from './authProfile';
import {
  signIn,
  signUp,
  completeNewSignup,
  signInWithGoogle
} from './authAuthentication';
import {
  updateUserProfile,
  changePassword,
  updateUserPlan
} from './authUpdate';

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        if (newSignup) {
          setUser(firebaseUser);
        } else {
          setUser(firebaseUser);
          await fetchUserProfile(firebaseUser, setUser);
        }
      } else {
        setUser(null);
        setNewSignup(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [newSignup]);

  const value = {
    user,
    loading,
    isAuthenticating,
    signIn: (email, password) => signIn(email, password, setUser),
    signUp: (email, password, firstName, lastName, plan = 'basic') =>
      signUp(email, password, firstName, lastName, plan, setNewSignup),
    signOut: () => signOut(auth),
    signInWithGoogle: (credential, firstName, lastName, plan = 'basic') =>
      signInWithGoogle(credential, firstName, lastName, plan, setUser),
    updateUserProfile: (updates) => updateUserProfile(updates, setUser),
    changePassword: (currentPassword, newPassword) =>
      changePassword(currentPassword, newPassword, setUser),
    updateUserPlan: (planName) => updateUserPlan(planName, user, setUser),
    completeNewSignup: () => completeNewSignup(setNewSignup, setUser),
    newSignup,
    setUserProfile: (profileData) => setUserProfile(profileData, setUser),
    fetchUserProfile: (firebaseUser) => fetchUserProfile(firebaseUser, setUser)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
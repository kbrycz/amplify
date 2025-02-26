import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, SERVER_URL } from '../lib/firebase';
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
  const [isSigningUp, setIsSigningUp] = useState(false);

  const createUserProfile = async (firebaseUser, firstName, lastName) => {
    const idToken = await firebaseUser.getIdToken();
    const response = await fetch(`${SERVER_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
      body: JSON.stringify({
        firstName,
        lastName
      })
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create user profile: ${errorText}`);
    }
    return response.json();
  };

  const fetchUserProfile = async (firebaseUser) => {
    const idToken = await firebaseUser.getIdToken();
    const response = await fetch(`${SERVER_URL}/auth/profile`, {
      headers: { 'Authorization': `Bearer ${idToken}` }
    });
    if (!response.ok) {
      throw new Error('User profile does not exist. Please complete signup.');
    }
    const profileData = await response.json();
    setUser({ ...firebaseUser, ...profileData });
    return profileData;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser && !isSigningUp) {
        try {
          await fetchUserProfile(firebaseUser);
        } catch (error) {
          console.error('Error fetching profile:', error.message);
          setUser(null);
          await signOut(auth); // Sign out if profile fetch fails
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [isSigningUp]);

  const signIn = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    await fetchUserProfile(userCredential.user);
    return userCredential.user;
  };

  const signUp = async (email, password, firstName, lastName) => {
    if (!firstName.trim() || !lastName.trim()) {
      throw new Error('First name and last name are required');
    }
    setIsSigningUp(true); // Prevent onAuthStateChanged from fetching during signup
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      const displayName = `${firstName} ${lastName}`.trim();

      await updateProfile(firebaseUser, { displayName });
      await createUserProfile(firebaseUser, firstName, lastName);
      await fetchUserProfile(firebaseUser);
      setIsSigningUp(false); // Allow onAuthStateChanged to proceed normally
      return firebaseUser;
    } catch (error) {
      setIsSigningUp(false); // Reset flag on error
      throw error;
    }
  };

  const signInWithGoogle = async (credential) => {
    await fetchUserProfile(credential.user);
    return credential.user;
  };

  const updateUserProfile = async (updates) => {
    if (!user) return;

    try {
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch(`${SERVER_URL}/user/update`, {
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
      const response = await fetch(`${SERVER_URL}/auth/update-password`, {
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

  const value = {
    user,
    loading,
    updateUserProfile,
    signIn,
    signUp,
    signInWithGoogle,
    changePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
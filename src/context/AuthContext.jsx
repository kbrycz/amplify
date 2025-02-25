import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, SERVER_URL } from '../lib/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (firebaseUser) => {
    try {
      const idToken = await firebaseUser.getIdToken();
      const response = await fetch(`${SERVER_URL}/auth/user`, {
        headers: { 'Authorization': `Bearer ${idToken}` }
      });
      
      if (response.ok) {
        const profileData = await response.json();
        // Update Firebase user profile
        await updateProfile(firebaseUser, {
          displayName: `${profileData.firstName} ${profileData.lastName}`
        });
        
        // Update local user state with all data
        setUser({
          ...firebaseUser,
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          ...profileData
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser); // Set initial Firebase user data
        await fetchUserProfile(firebaseUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    await fetchUserProfile(userCredential.user);
    return userCredential.user;
  };

  const signUp = async (email, password, firstName, lastName) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken();
    
    const response = await fetch(`${SERVER_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
      body: JSON.stringify({ 
        firstName,
        lastName,
        displayName: `${firstName} ${lastName}`
      })
    });
    
    const profileResponse = await fetch(`${SERVER_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
      body: JSON.stringify({
        email,
        password,
        firstName,
        lastName
      })
    });
    
    if (!response.ok || !profileResponse.ok) {
      throw new Error('Failed to complete registration with server');
    }
    
    await fetchUserProfile(userCredential.user);
    return userCredential.user;
  };

  const signInWithGoogle = async (credential) => {
    const idToken = await credential.user.getIdToken();
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
      // Update user state with new profile data while preserving Firebase user data
      setUser(currentUser => ({
        ...currentUser,
        ...updatedProfile
      }));
      return updatedProfile;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    if (!user) throw new Error('No user logged in');
    
    try {
      // Re-authenticate user before changing password
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      
      // Update password in Firebase
      await updatePassword(auth.currentUser, newPassword);
      
      // Update password in backend
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch(`${SERVER_URL}/auth/update-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ password: newPassword })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update password on server');
      }
      
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
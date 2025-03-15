// src/context/authAuthentication.js
import { auth, googleAuthProvider } from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  signInWithPopup 
} from 'firebase/auth';
import { createUserProfile, fetchUserProfile } from './authProfile';

// Signs in a user with email and password
export const signIn = async (email, password, setUser) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  await fetchUserProfile(userCredential.user, setUser);
  return userCredential.user;
};

// Signs up a new user and creates their profile on the server
export const signUp = async (email, password, firstName, lastName, plan, setNewSignup) => {
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
  }
};

// Completes the new signup flow by fetching the user profile
export const completeNewSignup = async (setNewSignup, setUser) => {
  setNewSignup(false);
  await fetchUserProfile(auth.currentUser, setUser);
};

// Signs in with Google using a popup credential
export const signInWithGoogle = async (credential, firstName, lastName, plan = 'basic', setUser) => {
  try {
    const firebaseUser = auth.currentUser;
    await createUserProfile(firebaseUser, firstName, lastName, plan);
    await fetchUserProfile(firebaseUser, setUser);
    return firebaseUser;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};
// src/context/authProfile.js
import { auth } from '../lib/firebase';
import { post, get } from '../lib/api';
import { SERVER_URL } from '../lib/api';

// Creates a new user profile on the server
export const createUserProfile = async (firebaseUser, firstName, lastName, plan = 'basic') => {
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

// Fetches the user profile from the server and updates state via setUser
export const fetchUserProfile = async (firebaseUser, setUser) => {
  try {
    console.log("authProfile - fetchUserProfile called for user:", firebaseUser?.uid);
    const profileData = await get('/auth/profile');
    console.log("authProfile - profile data received:", profileData);
    if (!profileData) {
      console.log("authProfile - No profile data, setting basic user");
      setUser(firebaseUser);
      return firebaseUser;
    }
    const mergedUser = { 
      ...firebaseUser, 
      ...profileData,
      subscription: profileData.subscription || {
        plan: profileData.plan,
        period: profileData.subscriptionPeriod
      }
    };
    console.log("authProfile - setting merged user with profile:", mergedUser);
    setUser(mergedUser);
    return mergedUser;
  } catch (error) {
    console.warn('Profile fetch warning:', error.message);
    setUser(firebaseUser);
    return firebaseUser;
  }
};

// Directly sets the user profile into state
export const setUserProfile = (profileData, setUser) => {
  console.log("authProfile - setUserProfile called with data:", profileData);
  if (auth.currentUser) {
    const mergedUser = { 
      ...auth.currentUser, 
      ...profileData,
      subscription: profileData.subscription || {
        plan: profileData.plan,
        period: profileData.subscriptionPeriod
      }
    };
    console.log("authProfile - setting merged user:", mergedUser);
    setUser(mergedUser);
  } else {
    console.log("authProfile - setUserProfile called but no current user");
  }
};
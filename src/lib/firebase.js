import { initializeApp } from 'firebase/app';
import { getAuth, browserSessionPersistence, setPersistence } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDU1L2RmFbL2APSbmTMDS4OAdXWQwzxMcY",
  authDomain: "amplify-dev-6b1c7.firebaseapp.com",
  projectId: "amplify-dev-6b1c7",
  storageBucket: "amplify-dev-6b1c7.appspot.com",
  messagingSenderId: "1077535838353",
  appId: "1:1077535838353:web:cf294eddfd39d85e5baf30",
  measurementId: "G-2S6GXVL1LW"
};

// Always use production server
export const SERVER_URL = "https://amplify-dev-6b1c7.uc.r.appspot.com";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Set auth persistence to session
setPersistence(auth, browserSessionPersistence)
  .catch((error) => {
    console.error('Error setting auth persistence:', error);
  });

export { auth };
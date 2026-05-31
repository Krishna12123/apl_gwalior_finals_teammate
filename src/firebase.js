import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Read configuration from environment variables or custom local storage keys
const getFirebaseConfig = () => {
  const localConfig = localStorage.getItem("schemeai_custom_firebase_config");
  if (localConfig) {
    try {
      const parsed = JSON.parse(localConfig);
      if (parsed.apiKey && parsed.projectId) {
        return parsed;
      }
    } catch (e) {
      console.error("Error parsing local Firebase config", e);
    }
  }

  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
  };
};

const firebaseConfig = getFirebaseConfig();

// A config is considered valid if it has apiKey and projectId filled with non-placeholder values
const isValidConfig = !!(
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== "" && 
  !firebaseConfig.apiKey.includes("YOUR_") &&
  firebaseConfig.projectId &&
  !firebaseConfig.projectId.includes("YOUR_")
);

let app = null;
let auth = null;
let db = null;

if (isValidConfig) {
  try {
    const apps = getApps();
    if (apps.length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = apps[0];
    }
    auth = getAuth(app);
    db = getFirestore(app);
    console.log("Firebase initialized successfully in Live Mode.");
  } catch (error) {
    console.warn("Firebase failed to initialize. Falling back to local/demo mode.", error);
  }
} else {
  console.log("No valid Firebase credentials found. Running in local/demo storage mode.");
}

export { app, auth, db, isValidConfig, getFirebaseConfig };

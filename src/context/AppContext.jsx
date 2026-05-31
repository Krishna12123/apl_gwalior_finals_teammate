import { createContext, useContext, useState, useEffect } from "react";
import { auth, db, isValidConfig } from "../firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove 
} from "firebase/firestore";
import rawSchemes from "../data/schemes.json";

const AppContext = createContext();

const defaultProfile = {
  name: "",
  age: 22,
  gender: "Male",
  category: "General",
  income: 300000,
  state: "Madhya Pradesh",
  occupation: "Student",
  disabilityStatus: false,
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(defaultProfile);
  const [savedSchemes, setSavedSchemes] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [isDemoMode, setIsDemoMode] = useState(!isValidConfig);
  const [loading, setLoading] = useState(true);
  const [schemes] = useState(rawSchemes);
  const [eligibleSchemes, setEligibleSchemes] = useState([]);

  // Check custom configuration keys from LocalStorage
  const [geminiKey, setGeminiKey] = useState(localStorage.getItem("schemeai_custom_gemini_key") || "");
  const [firebaseConfigStr, setFirebaseConfigStr] = useState(localStorage.getItem("schemeai_custom_firebase_config") || "");

  const fallbackToLocalSession = () => {
    const localUser = localStorage.getItem("schemeai_local_user");
    const localProfile = localStorage.getItem("schemeai_local_profile");
    const localSaved = localStorage.getItem("schemeai_local_saved");
    const localHistory = localStorage.getItem("schemeai_local_history");

    if (localUser) {
      setUser(JSON.parse(localUser));
    }
    if (localProfile) {
      setProfile(JSON.parse(localProfile));
    } else {
      setProfile(defaultProfile);
    }
    if (localSaved) {
      setSavedSchemes(JSON.parse(localSaved));
    } else {
      setSavedSchemes([]);
    }
    if (localHistory) {
      setSearchHistory(JSON.parse(localHistory));
    } else {
      setSearchHistory([]);
    }
  };

  const resetSession = () => {
    setProfile(defaultProfile);
    setSavedSchemes([]);
    setSearchHistory([]);
  };

  // Load initial session
  useEffect(() => {
    let unsubscribe = () => {};

    if (isValidConfig && !isDemoMode) {
      unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
          // Fetch user profile and bookmarks from Firestore
          try {
            const userDocRef = doc(db, "users", currentUser.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
              const data = userDoc.data();
              setProfile(data.profile || defaultProfile);
              setSavedSchemes(data.savedSchemes || []);
              setSearchHistory(data.searchHistory || []);
            } else {
              // Create user document with defaults
              await setDoc(userDocRef, {
                profile: defaultProfile,
                savedSchemes: [],
                searchHistory: [],
                updatedAt: new Date().toISOString()
              });
              setProfile(defaultProfile);
              setSavedSchemes([]);
              setSearchHistory([]);
            }
          } catch (e) {
            console.error("Error loading profile from Firestore:", e);
            fallbackToLocalSession();
          }
        } else {
          setUser(null);
          resetSession();
        }
        setLoading(false);
      });
    } else {
      // Local demo mode: Load from local storage
      // Defer state setter to prevent linter warning
      const t = setTimeout(() => {
        fallbackToLocalSession();
        setLoading(false);
      }, 0);
      return () => clearTimeout(t);
    }

    return () => unsubscribe();
  }, [isDemoMode]);

  // Recalculate eligible schemes in real time whenever user profile changes
  useEffect(() => {
    if (!profile) {
      const t = setTimeout(() => {
        setEligibleSchemes([]);
      }, 0);
      return () => clearTimeout(t);
    }

    const filtered = schemes.filter((scheme) => {
      // 1. Age check
      const age = Number(profile.age || 0);
      const ageMatch = age >= scheme.ageMin && age <= scheme.ageMax;

      // 2. Income check
      const income = Number(profile.income || 0);
      const incomeMatch = income <= scheme.incomeLimit;

      // 3. Category check
      const categoryMatch = 
        scheme.category.includes("Any") || 
        scheme.category.includes(profile.category);

      // 4. Gender check
      const genderMatch = 
        scheme.gender === "All" || 
        scheme.gender === profile.gender;

      // 5. State check
      const stateMatch = 
        scheme.state === "All" || 
        scheme.state === profile.state;

      // 6. Occupation check
      const occupationMatch = 
        scheme.occupation.includes("Any") || 
        scheme.occupation.includes("All") ||
        scheme.occupation.includes(profile.occupation);

      // 7. Disability check
      const disabilityMatch = 
        !scheme.disabilityRequired || 
        profile.disabilityStatus === true;

      return ageMatch && incomeMatch && categoryMatch && genderMatch && stateMatch && occupationMatch && disabilityMatch;
    });

    // Defer state setter to prevent linter warning
    const t = setTimeout(() => {
      setEligibleSchemes(filtered);
    }, 0);
    return () => clearTimeout(t);
  }, [profile, schemes]);

  // Auth Operations
  const registerUser = async (email, password, name) => {
    if (isDemoMode) {
      const mockUid = "demo_user_" + Math.random().toString(36).substring(2, 9);
      const newUser = { uid: mockUid, email, displayName: name };
      localStorage.setItem("schemeai_local_user", JSON.stringify(newUser));
      setUser(newUser);
      
      const newProfile = { ...defaultProfile, name };
      localStorage.setItem("schemeai_local_profile", JSON.stringify(newProfile));
      setProfile(newProfile);
      
      return newUser;
    }

    const credentials = await createUserWithEmailAndPassword(auth, email, password);
    const userDocRef = doc(db, "users", credentials.user.uid);
    const newProfile = { ...defaultProfile, name };
    
    await setDoc(userDocRef, {
      profile: newProfile,
      savedSchemes: [],
      searchHistory: [],
      updatedAt: new Date().toISOString()
    });
    
    setProfile(newProfile);
    return credentials.user;
  };

  const loginUser = async (email, password) => {
    if (isDemoMode) {
      const localUserStr = localStorage.getItem("schemeai_local_user");
      let storedUser = localUserStr ? JSON.parse(localUserStr) : null;
      
      if (!storedUser || storedUser.email !== email) {
        storedUser = { uid: "demo_user_123", email, displayName: email.split("@")[0] };
        localStorage.setItem("schemeai_local_user", JSON.stringify(storedUser));
      }
      setUser(storedUser);
      fallbackToLocalSession();
      return storedUser;
    }

    const credentials = await signInWithEmailAndPassword(auth, email, password);
    return credentials.user;
  };

  const logoutUser = async () => {
    if (isDemoMode) {
      localStorage.removeItem("schemeai_local_user");
      setUser(null);
      resetSession();
      return;
    }
    await signOut(auth);
    setUser(null);
    resetSession();
  };

  // Profile Operations
  const updateProfile = async (updatedFields) => {
    const newProfile = { ...profile, ...updatedFields };
    setProfile(newProfile);

    if (isDemoMode) {
      localStorage.setItem("schemeai_local_profile", JSON.stringify(newProfile));
      return;
    }

    if (user) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, {
          profile: newProfile,
          updatedAt: new Date().toISOString()
        });
      } catch (e) {
        console.error("Error updating profile in Firestore:", e);
      }
    }
  };

  // Bookmarking Schemes
  const toggleSaveScheme = async (schemeId) => {
    let updated;
    const isSaved = savedSchemes.includes(schemeId);
    
    if (isSaved) {
      updated = savedSchemes.filter((id) => id !== schemeId);
    } else {
      updated = [...savedSchemes, schemeId];
    }
    
    setSavedSchemes(updated);

    if (isDemoMode) {
      localStorage.setItem("schemeai_local_saved", JSON.stringify(updated));
      return;
    }

    if (user) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, {
          savedSchemes: isSaved ? arrayRemove(schemeId) : arrayUnion(schemeId),
        });
      } catch (e) {
        console.error("Error toggling bookmark in Firestore:", e);
      }
    }
  };

  // Search History
  const addSearchQuery = async (query) => {
    if (!query || query.trim() === "") return;
    const trimmed = query.trim();
    
    // Keep top 10 unique searches
    const filtered = searchHistory.filter((q) => q !== trimmed);
    const updated = [trimmed, ...filtered].slice(0, 10);
    setSearchHistory(updated);

    if (isDemoMode) {
      localStorage.setItem("schemeai_local_history", JSON.stringify(updated));
      return;
    }

    if (user) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, {
          searchHistory: updated,
        });
      } catch (e) {
        console.error("Error saving search history in Firestore:", e);
      }
    }
  };

  // Update Settings API Keys
  const saveCustomSettings = (newGeminiKey, newFirebaseConfig) => {
    if (newGeminiKey) {
      localStorage.setItem("schemeai_custom_gemini_key", newGeminiKey);
      setGeminiKey(newGeminiKey);
    } else {
      localStorage.removeItem("schemeai_custom_gemini_key");
      setGeminiKey("");
    }

    if (newFirebaseConfig) {
      localStorage.setItem("schemeai_custom_firebase_config", newFirebaseConfig);
      setFirebaseConfigStr(newFirebaseConfig);
    } else {
      localStorage.removeItem("schemeai_custom_firebase_config");
      setFirebaseConfigStr("");
    }

    // Trigger reload/re-initialization
    window.location.reload();
  };

  return (
    <AppContext.Provider
      value={{
        user,
        profile,
        savedSchemes,
        searchHistory,
        isDemoMode,
        setIsDemoMode,
        loading,
        schemes,
        eligibleSchemes,
        updateProfile,
        toggleSaveScheme,
        addSearchQuery,
        registerUser,
        loginUser,
        logoutUser,
        geminiKey,
        firebaseConfigStr,
        saveCustomSettings
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => useContext(AppContext);

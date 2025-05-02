
import React, { createContext, useState, useContext, useEffect } from "react";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut, 
  User 
} from "firebase/auth";
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp, 
  increment 
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { toast } from "sonner";

export interface UserData {
  uid: string;
  email: string;
  username: string;
  credits: number;
  createdAt: any;
  lastLogin: any;
  adsWatched: {
    rewarded: number;
    interstitial: number;
    lastReset: any;
  };
}

interface UserContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserCredits: (amount: number) => Promise<void>;
  resetDailyAdsCount: () => Promise<void>;
  incrementAdCount: (type: 'rewarded' | 'interstitial') => Promise<boolean>;
  canWatchAd: (type: 'rewarded' | 'interstitial') => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          setUserData(userDoc.data() as UserData);
          
          // Check if we need to reset daily ad counts
          const data = userDoc.data() as UserData;
          const lastReset = data.adsWatched?.lastReset?.toDate() || new Date(0);
          const today = new Date();
          
          if (lastReset.getDate() !== today.getDate() || 
              lastReset.getMonth() !== today.getMonth() || 
              lastReset.getFullYear() !== today.getFullYear()) {
            resetDailyAdsCount();
          }
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      const userDocRef = doc(db, "users", result.user.uid);
      
      // Update last login timestamp
      await updateDoc(userDocRef, {
        lastLogin: serverTimestamp()
      });
      
      toast.success("Signed in successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, username: string) => {
    try {
      setLoading(true);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      const userData: Partial<UserData> = {
        uid: result.user.uid,
        email,
        username,
        credits: 30, // Starting credits
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        adsWatched: {
          rewarded: 0,
          interstitial: 0,
          lastReset: serverTimestamp()
        }
      };
      
      await setDoc(doc(db, "users", result.user.uid), userData);
      toast.success("Account created successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      toast.success("Signed out successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign out");
      throw error;
    }
  };

  const updateUserCredits = async (amount: number) => {
    if (!user) return;
    
    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        credits: increment(amount)
      });
      
      // Update local state
      setUserData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          credits: prev.credits + amount
        };
      });
      
      if (amount > 0) {
        toast.success(`+${amount} credits added to your account!`);
      } else {
        toast.info(`${amount} credits used.`);
      }
    } catch (error: any) {
      toast.error("Failed to update credits");
      console.error(error);
    }
  };

  const resetDailyAdsCount = async () => {
    if (!user) return;
    
    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        'adsWatched.rewarded': 0,
        'adsWatched.interstitial': 0,
        'adsWatched.lastReset': serverTimestamp()
      });
      
      // Update local state
      setUserData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          adsWatched: {
            rewarded: 0,
            interstitial: 0,
            lastReset: new Date()
          }
        };
      });
    } catch (error) {
      console.error("Failed to reset daily ad counts:", error);
    }
  };

  const incrementAdCount = async (type: 'rewarded' | 'interstitial'): Promise<boolean> => {
    if (!user || !userData) return false;
    
    const currentCount = userData.adsWatched?.[type] || 0;
    const maxAllowed = type === 'rewarded' ? 3 : 5;
    
    if (currentCount >= maxAllowed) {
      return false;
    }
    
    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        [`adsWatched.${type}`]: increment(1)
      });
      
      // Update local state
      setUserData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          adsWatched: {
            ...prev.adsWatched,
            [type]: currentCount + 1
          }
        };
      });
      
      return true;
    } catch (error) {
      console.error(`Failed to increment ${type} ad count:`, error);
      return false;
    }
  };

  const canWatchAd = (type: 'rewarded' | 'interstitial'): boolean => {
    if (!userData) return false;
    
    const currentCount = userData.adsWatched?.[type] || 0;
    const maxAllowed = type === 'rewarded' ? 3 : 5;
    
    return currentCount < maxAllowed;
  };

  const value = {
    user,
    userData,
    loading,
    signIn,
    signUp,
    signOut,
    updateUserCredits,
    resetDailyAdsCount,
    incrementAdCount,
    canWatchAd
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

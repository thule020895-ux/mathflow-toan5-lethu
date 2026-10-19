import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export type UserRole = 'student' | 'teacher' | 'admin';

export interface AppUserProfile {
  uid: string;
  displayName: string;
  email: string;
  role: UserRole;
  photoURL?: string;
  createdAt: string;
  lastLogin: string;
}

interface FirebaseContextType {
  user: User | null;
  userProfile: AppUserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  signOutUser: () => Promise<void>;
  setUserRole: (role: 'student' | 'teacher') => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType>({ 
  user: null, 
  userProfile: null, 
  isAdmin: false, 
  loading: true,
  signOutUser: async () => {},
  setUserRole: async () => {},
  refreshProfile: async () => {}
});

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<AppUserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = !!user && !user.isAnonymous && (user.email === 'thule020895@gmail.com' || userProfile?.role === 'admin');

  const syncUserProfile = async (currentUser: User) => {
    if (currentUser.isAnonymous || !currentUser.email) {
      setUserProfile(null);
      return;
    }

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const userSnap = await getDoc(userRef);
      const isMasterAdmin = currentUser.email === 'thule020895@gmail.com';
      const now = new Date().toISOString();

      if (userSnap.exists()) {
        const data = userSnap.data() as AppUserProfile;
        const role: UserRole = isMasterAdmin ? 'admin' : (data.role || 'student');
        
        await updateDoc(userRef, {
          lastLogin: now,
          role,
          displayName: currentUser.displayName || data.displayName || currentUser.email.split('@')[0],
          photoURL: currentUser.photoURL || data.photoURL || ''
        });

        setUserProfile({
          ...data,
          lastLogin: now,
          role,
          displayName: currentUser.displayName || data.displayName || currentUser.email.split('@')[0],
          photoURL: currentUser.photoURL || data.photoURL || ''
        });
      } else {
        const initialRole: UserRole = isMasterAdmin ? 'admin' : 'student';
        const newProfile: AppUserProfile = {
          uid: currentUser.uid,
          displayName: currentUser.displayName || currentUser.email.split('@')[0] || 'Người dùng',
          email: currentUser.email,
          role: initialRole,
          photoURL: currentUser.photoURL || '',
          createdAt: now,
          lastLogin: now,
        };

        await setDoc(userRef, newProfile);
        setUserProfile(newProfile);
      }
    } catch (err) {
      console.error('Error syncing user profile:', err);
    }
  };

  const signOutUser = async () => {
    try {
      setUser(null);
      setUserProfile(null);
      await signOut(auth);
    } catch (err) {
      console.error('Error during signOut:', err);
      setUser(null);
      setUserProfile(null);
    }
  };

  const setUserRole = async (newRole: 'student' | 'teacher') => {
    if (!user || user.isAnonymous) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { role: newRole });
      setUserProfile(prev => prev ? { ...prev, role: newRole } : null);
    } catch (err) {
      console.error('Error updating user role:', err);
    }
  };

  const refreshProfile = async () => {
    if (user && !user.isAnonymous) {
      await syncUserProfile(user);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser && !currentUser.isAnonymous) {
        setUser(currentUser);
        await syncUserProfile(currentUser);
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <FirebaseContext.Provider value={{ 
      user, 
      userProfile, 
      isAdmin, 
      loading,
      signOutUser,
      setUserRole,
      refreshProfile
    }}>
      {children}
    </FirebaseContext.Provider>
  );
};

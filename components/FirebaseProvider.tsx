import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import LoginModal, { LoginRoleOption } from './LoginModal';

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
  openLoginModal: () => void;
  closeLoginModal: () => void;
  loginWithGoogle: (role: LoginRoleOption) => Promise<void>;
}

const PENDING_ROLE_STORAGE_KEY = 'mathflow_pending_login_role';

const FirebaseContext = createContext<FirebaseContextType>({ 
  user: null, 
  userProfile: null, 
  isAdmin: false, 
  loading: true,
  signOutUser: async () => {},
  setUserRole: async () => {},
  refreshProfile: async () => {},
  openLoginModal: () => {},
  closeLoginModal: () => {},
  loginWithGoogle: async () => {}
});

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<AppUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const pendingRoleRef = useRef<LoginRoleOption | null>(null);

  const isAdmin = !!user && !user.isAnonymous && (user.email === 'thule020895@gmail.com' || userProfile?.role === 'admin');

  const getPendingRole = (): LoginRoleOption | null => {
    if (pendingRoleRef.current) return pendingRoleRef.current;
    try {
      const stored = localStorage.getItem(PENDING_ROLE_STORAGE_KEY);
      if (stored === 'teacher' || stored === 'student') {
        return stored;
      }
    } catch {
      // ignore storage errors
    }
    return null;
  };

  const clearPendingRole = () => {
    pendingRoleRef.current = null;
    try {
      localStorage.removeItem(PENDING_ROLE_STORAGE_KEY);
    } catch {
      // ignore storage errors
    }
  };

  const syncUserProfile = async (currentUser: User, explicitRole?: LoginRoleOption) => {
    if (currentUser.isAnonymous || !currentUser.email) {
      setUserProfile(null);
      return;
    }

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const userSnap = await getDoc(userRef);
      const isMasterAdmin = currentUser.email === 'thule020895@gmail.com';
      const now = new Date().toISOString();
      const chosenRole = explicitRole || getPendingRole();

      if (userSnap.exists()) {
        const data = userSnap.data() as AppUserProfile;
        const role: UserRole = isMasterAdmin ? 'admin' : (chosenRole || data.role || 'student');
        
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
        const initialRole: UserRole = isMasterAdmin ? 'admin' : (chosenRole || 'student');
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

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const loginWithGoogle = async (selectedRole: LoginRoleOption) => {
    pendingRoleRef.current = selectedRole;
    try {
      localStorage.setItem(PENDING_ROLE_STORAGE_KEY, selectedRole);
    } catch {
      // ignore storage errors
    }

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        await syncUserProfile(result.user, selectedRole);
        setIsLoginModalOpen(false);
      }
    } finally {
      clearPendingRole();
    }
  };

  const signOutUser = async () => {
    try {
      clearPendingRole();
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
      refreshProfile,
      openLoginModal,
      closeLoginModal,
      loginWithGoogle
    }}>
      {children}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        onLoginWithGoogle={loginWithGoogle}
      />
    </FirebaseContext.Provider>
  );
};

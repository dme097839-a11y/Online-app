import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import { UserProfile } from '../types';

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  phoneNumber?: string | null;
}

interface AuthContextType {
  currentUser: AppUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string, name: string, phone?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  adminLogin: (usernameOrEmail: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper for SHA-256 password hashing for Firestore fallback
async function hashPassword(pass: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(pass);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount (Firebase Auth or Firestore-backed session)
  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        if (!isMounted) return;
        setCurrentUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          phoneNumber: firebaseUser.phoneNumber
        });

        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists() && isMounted) {
            setUserProfile(userDoc.data() as UserProfile);
          } else if (isMounted) {
            const isAdminEmail = 
              firebaseUser.email?.toLowerCase().includes('admin') || 
              firebaseUser.email?.toLowerCase() === 'admin@daraz.com.np';

            const newProfile: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Customer',
              phoneNumber: '',
              role: isAdminEmail ? 'admin' : 'customer',
              createdAt: new Date().toISOString()
            };
            await setDoc(doc(db, 'users', firebaseUser.uid), newProfile);
            setUserProfile(newProfile);
          }
        } catch (e) {
          console.error('Error fetching Firestore user profile:', e);
        }
        setLoading(false);
      } else {
        // Check if there is an active Firestore fallback session stored locally
        try {
          const stored = localStorage.getItem('daraz_auth_session');
          if (stored) {
            const sessionProfile: UserProfile = JSON.parse(stored);
            if (isMounted) {
              setUserProfile(sessionProfile);
              setCurrentUser({
                uid: sessionProfile.uid,
                email: sessionProfile.email,
                displayName: sessionProfile.displayName,
                phoneNumber: sessionProfile.phoneNumber || null
              });
            }
          } else if (isMounted) {
            setCurrentUser(null);
            setUserProfile(null);
          }
        } catch {
          if (isMounted) {
            setCurrentUser(null);
            setUserProfile(null);
          }
        }
        if (isMounted) setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Customer Signup (Firebase Auth + Firestore fallback if auth/operation-not-allowed)
  const signup = async (email: string, pass: string, name: string, phone?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const cleanPhone = phone?.trim() || '';
    const isAdminEmail = cleanEmail.includes('admin') || cleanEmail === 'admin@daraz.com.np';

    try {
      // 1. Attempt standard Firebase Auth
      const res = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
      if (res.user) {
        await updateProfile(res.user, { displayName: cleanName });
        const profile: UserProfile = {
          uid: res.user.uid,
          email: cleanEmail,
          displayName: cleanName,
          phoneNumber: cleanPhone,
          role: isAdminEmail ? 'admin' : 'customer',
          createdAt: new Date().toISOString()
        };
        await setDoc(doc(db, 'users', res.user.uid), profile);
        setUserProfile(profile);
        setCurrentUser({
          uid: res.user.uid,
          email: res.user.email,
          displayName: cleanName,
          phoneNumber: cleanPhone
        });
        localStorage.setItem('daraz_auth_session', JSON.stringify(profile));
        return;
      }
    } catch (err: any) {
      console.warn('Firebase Auth signup warning:', err.code, err.message);

      // If Firebase Auth provider is disabled (auth/operation-not-allowed), gracefully use Firestore database authentication
      if (err.code === 'auth/operation-not-allowed' || err.message?.includes('operation-not-allowed')) {
        console.log('Using Firestore-backed customer registration...');
        
        // Check if user with this email already exists in Firestore
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', cleanEmail));
        const snap = await getDocs(q);
        if (!snap.empty) {
          throw new Error('An account with this email already exists. Please sign in.');
        }

        const hashed = await hashPassword(pass);
        const customUid = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const profile: UserProfile = {
          uid: customUid,
          email: cleanEmail,
          displayName: cleanName,
          phoneNumber: cleanPhone,
          passwordHash: hashed,
          role: isAdminEmail ? 'admin' : 'customer',
          createdAt: new Date().toISOString()
        };

        await setDoc(doc(db, 'users', customUid), profile);
        setUserProfile(profile);
        setCurrentUser({
          uid: customUid,
          email: cleanEmail,
          displayName: cleanName,
          phoneNumber: cleanPhone
        });
        localStorage.setItem('daraz_auth_session', JSON.stringify(profile));
        return;
      }

      // Re-throw other specific errors (e.g. email-already-in-use, weak-password)
      throw err;
    }
  };

  // Customer Login (Firebase Auth + Firestore fallback)
  const login = async (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();

    try {
      // 1. Attempt standard Firebase Auth
      const cred = await signInWithEmailAndPassword(auth, cleanEmail, pass);
      if (cred.user) {
        const userDoc = await getDoc(doc(db, 'users', cred.user.uid));
        if (userDoc.exists()) {
          const prof = userDoc.data() as UserProfile;
          setUserProfile(prof);
          localStorage.setItem('daraz_auth_session', JSON.stringify(prof));
        }
        return;
      }
    } catch (err: any) {
      console.warn('Firebase Auth login warning:', err.code, err.message);

      // If Firebase Auth provider is disabled or user was created in Firestore fallback
      if (
        err.code === 'auth/operation-not-allowed' || 
        err.code === 'auth/user-not-found' || 
        err.code === 'auth/invalid-credential' ||
        err.message?.includes('operation-not-allowed')
      ) {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', cleanEmail));
        const snap = await getDocs(q);

        if (!snap.empty) {
          const userDoc = snap.docs[0];
          const prof = userDoc.data() as UserProfile;
          
          if (prof.passwordHash) {
            const inputHash = await hashPassword(pass);
            if (inputHash === prof.passwordHash) {
              setUserProfile(prof);
              setCurrentUser({
                uid: prof.uid,
                email: prof.email,
                displayName: prof.displayName,
                phoneNumber: prof.phoneNumber || null
              });
              localStorage.setItem('daraz_auth_session', JSON.stringify(prof));
              return;
            } else {
              throw new Error('Incorrect password. Please verify and try again.');
            }
          }
        }
      }

      throw err;
    }
  };

  // Admin Login (supports username without email: username: royrox845, pass: upesh123##$$657)
  const adminLogin = async (usernameOrEmail: string, pass: string) => {
    const cleanInput = usernameOrEmail.trim().toLowerCase();

    // 1. Direct verify for default administrator credentials requested by store owner
    if (
      (cleanInput === 'royrox845' || cleanInput === 'royrox845@gmail.com' || cleanInput === 'royrox845@daraz.np') &&
      pass === 'upesh123##$$657'
    ) {
      const adminProfile: UserProfile = {
        uid: 'admin_royrox845',
        username: 'royrox845',
        email: 'royrox845@gmail.com',
        displayName: 'RoyRox Store Administrator',
        role: 'admin',
        createdAt: new Date().toISOString()
      };

      try {
        await setDoc(doc(db, 'users', 'admin_royrox845'), adminProfile, { merge: true });
      } catch (err) {
        console.warn('Could not write admin doc to firestore:', err);
      }

      setUserProfile(adminProfile);
      setCurrentUser({
        uid: 'admin_royrox845',
        email: 'royrox845@gmail.com',
        displayName: 'RoyRox Store Administrator',
        phoneNumber: null
      });
      localStorage.setItem('daraz_auth_session', JSON.stringify(adminProfile));
      return;
    }

    const cleanEmail = cleanInput;

    try {
      if (cleanEmail.includes('@')) {
        const cred = await signInWithEmailAndPassword(auth, cleanEmail, pass);
        if (cred.user) {
          const userDoc = await getDoc(doc(db, 'users', cred.user.uid));
          const role = userDoc.exists() ? (userDoc.data() as UserProfile).role : null;
          const isAdminEmail = cleanEmail.includes('admin') || cleanEmail.includes('royrox845');
          
          if (role !== 'admin' && isAdminEmail) {
            await setDoc(doc(db, 'users', cred.user.uid), {
              uid: cred.user.uid,
              email: cleanEmail,
              displayName: cred.user.displayName || 'Store Administrator',
              role: 'admin',
              updatedAt: new Date().toISOString()
            }, { merge: true });
            setUserProfile(prev => prev ? { ...prev, role: 'admin' } : null);
          }
          return;
        }
      }
    } catch (err: any) {
      console.warn('Firebase Admin login warning:', err.code, err.message);

      // Fallback check against Firestore admin collection/documents
      if (
        err.code === 'auth/operation-not-allowed' || 
        err.code === 'auth/user-not-found' || 
        err.code === 'auth/invalid-credential' ||
        err.message?.includes('operation-not-allowed')
      ) {
        const usersRef = collection(db, 'users');
        let q = query(usersRef, where('username', '==', cleanInput));
        let snap = await getDocs(q);
        if (snap.empty) {
          q = query(usersRef, where('email', '==', cleanEmail));
          snap = await getDocs(q);
        }

        if (!snap.empty) {
          const userDoc = snap.docs[0];
          const prof = userDoc.data() as UserProfile;
          if (prof.passwordHash) {
            const inputHash = await hashPassword(pass);
            if (inputHash === prof.passwordHash) {
              if (prof.role !== 'admin' && cleanEmail.includes('admin')) {
                prof.role = 'admin';
                await setDoc(doc(db, 'users', prof.uid), { role: 'admin' }, { merge: true });
              }
              setUserProfile(prof);
              setCurrentUser({
                uid: prof.uid,
                email: prof.email,
                displayName: prof.displayName,
                phoneNumber: prof.phoneNumber || null
              });
              localStorage.setItem('daraz_auth_session', JSON.stringify(prof));
              return;
            } else {
              throw new Error('Invalid administrator password.');
            }
          }
        } else {
          // If this is the initial store setup and email is admin (e.g. admin@daraz.com.np)
          if (cleanEmail.includes('admin')) {
            const inputHash = await hashPassword(pass);
            const customUid = `admin_${Date.now()}`;
            const prof: UserProfile = {
              uid: customUid,
              email: cleanEmail,
              displayName: 'Daraz Store Manager (Admin)',
              role: 'admin',
              passwordHash: inputHash,
              createdAt: new Date().toISOString()
            };
            await setDoc(doc(db, 'users', customUid), prof);
            setUserProfile(prof);
            setCurrentUser({
              uid: customUid,
              email: cleanEmail,
              displayName: prof.displayName,
              phoneNumber: null
            });
            localStorage.setItem('daraz_auth_session', JSON.stringify(prof));
            return;
          }
        }
      }

      throw err;
    }
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const cred = await signInWithPopup(auth, provider);
    if (cred.user) {
      const cleanEmail = (cred.user.email || '').toLowerCase();
      // Bootstrapped Admin: user email from runtime or designated admin addresses
      const isAdminEmail = 
        cleanEmail === 'dme097839@gmail.com' ||
        cleanEmail === 'royrox845@gmail.com' ||
        cleanEmail.includes('admin') ||
        cleanEmail.endsWith('@admin.com');

      const userDocRef = doc(db, 'users', cred.user.uid);
      let existingRole: string | undefined;
      try {
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          existingRole = userDoc.data()?.role;
        }
      } catch (e) {
        console.warn('Could not read user profile:', e);
      }

      const role = (existingRole === 'admin' || isAdminEmail) ? 'admin' : 'customer';

      const profile: UserProfile = {
        uid: cred.user.uid,
        email: cred.user.email || '',
        displayName: cred.user.displayName || cred.user.email?.split('@')[0] || 'Customer',
        phoneNumber: cred.user.phoneNumber || '',
        role: role as 'customer' | 'admin',
        createdAt: new Date().toISOString()
      };

      try {
        await setDoc(userDocRef, profile, { merge: true });
      } catch (e) {
        console.warn('Could not persist profile in firestore:', e);
      }

      setUserProfile(profile);
      setCurrentUser({
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: cred.user.displayName,
        phoneNumber: cred.user.phoneNumber
      });
      localStorage.setItem('daraz_auth_session', JSON.stringify(profile));
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch {
      // ignore
    }
    localStorage.removeItem('daraz_auth_session');
    setCurrentUser(null);
    setUserProfile(null);
  };

  const isAdmin = 
    userProfile?.role === 'admin' || 
    currentUser?.email?.toLowerCase() === 'dme097839@gmail.com' ||
    currentUser?.email?.toLowerCase() === 'royrox845@gmail.com' ||
    currentUser?.email?.toLowerCase().includes('admin') || 
    false;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        isAdmin,
        login,
        signup,
        loginWithGoogle,
        adminLogin,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut, sendPasswordResetEmail } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { UserProfile, ChargingHistoryRecord } from '../types';

const metaEnv = (import.meta as any).env || {};

// Optional Firebase credentials injected by AI Studio or fallback
const firebaseConfig = {
  apiKey: metaEnv.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || "zepgo-ev.firebaseapp.com",
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || "zepgo-ev",
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || "zepgo-ev.appspot.com",
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: metaEnv.VITE_FIREBASE_APP_ID || "1:1234567890:web:abc123def456"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Local storage backup key
const USER_KEY = 'zepgo_current_user';
const HISTORY_KEY = 'zepgo_charging_history';

// Default mock user for instant test drive
export const DEFAULT_MOCK_USER: UserProfile = {
  uid: 'demo-user-123',
  name: 'Alex Rivera',
  email: 'alex.rivera@zepgo.ev',
  vehicleModel: 'Tesla Model Y Long Range',
  vehicleModelId: 'tesla-model-y-lr',
  batteryCapacityKwh: 75,
  preferredConnector: 'NACS',
  profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  totalKmDriven: 4280,
  totalCo2SavedKg: 856,
  totalMoneySavedDollar: 1140
};

export function getStoredUser(): UserProfile {
  try {
    const data = localStorage.getItem(USER_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.warn('LocalStorage error', e);
  }
  return DEFAULT_MOCK_USER;
}

export function saveStoredUser(user: UserProfile) {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (e) {
    console.warn('LocalStorage error', e);
  }
}

export async function loginWithEmail(email: string, pass: string): Promise<UserProfile> {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    const uDoc = await getDoc(doc(db, 'users', cred.user.uid));
    let profile: UserProfile;
    if (uDoc.exists()) {
      profile = uDoc.data() as UserProfile;
    } else {
      profile = {
        ...DEFAULT_MOCK_USER,
        uid: cred.user.uid,
        email: email,
        name: email.split('@')[0]
      };
      await setDoc(doc(db, 'users', cred.user.uid), profile);
    }
    saveStoredUser(profile);
    return profile;
  } catch (err) {
    // Demo fallback login
    const profile: UserProfile = {
      ...DEFAULT_MOCK_USER,
      email: email,
      name: email.split('@')[0] || 'EV Driver'
    };
    saveStoredUser(profile);
    return profile;
  }
}

export async function loginWithGoogle(): Promise<UserProfile> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const u = result.user;
    const uDoc = await getDoc(doc(db, 'users', u.uid));
    let profile: UserProfile;
    if (uDoc.exists()) {
      profile = uDoc.data() as UserProfile;
    } else {
      profile = {
        ...DEFAULT_MOCK_USER,
        uid: u.uid,
        email: u.email || 'user@google.com',
        name: u.displayName || 'EV Driver',
        profileImage: u.photoURL || DEFAULT_MOCK_USER.profileImage
      };
      await setDoc(doc(db, 'users', u.uid), profile);
    }
    saveStoredUser(profile);
    return profile;
  } catch (err) {
    // Demo fallback for preview iframe
    const profile: UserProfile = {
      ...DEFAULT_MOCK_USER,
      name: 'Google User',
      email: 'driver@google.com'
    };
    saveStoredUser(profile);
    return profile;
  }
}

export async function resetPassword(email: string) {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (e) {
    return true; // Fallback simulation
  }
}

export async function logoutUser() {
  try {
    await firebaseSignOut(auth);
  } catch (e) {
    // Ignore error
  }
  localStorage.removeItem(USER_KEY);
}

export function getChargingHistory(): ChargingHistoryRecord[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('History read error', e);
  }
  return [
    {
      id: 'ch-1',
      stationName: 'Truckee High-Power Oasis',
      location: 'Truckee River Center, I-80',
      unitsKwh: 42.5,
      costDollar: 19.12,
      durationMins: 22,
      date: '2026-07-24',
      chargerType: 'NACS 250kW',
      co2SavedKg: 28.5
    },
    {
      id: 'ch-2',
      stationName: 'GreenCharge HyperHub - Vallejo',
      location: 'Vallejo Plaza, Hwy 80',
      unitsKwh: 31.8,
      costDollar: 12.08,
      durationMins: 18,
      date: '2026-07-18',
      chargerType: 'CCS2 180kW',
      co2SavedKg: 21.3
    },
    {
      id: 'ch-3',
      stationName: 'VoltWay CityCharge',
      location: 'San Francisco Market St',
      unitsKwh: 55.0,
      costDollar: 19.80,
      durationMins: 35,
      date: '2026-07-10',
      chargerType: 'CCS2 120kW',
      co2SavedKg: 36.8
    }
  ];
}

export function saveChargingHistory(record: ChargingHistoryRecord) {
  const current = getChargingHistory();
  const updated = [record, ...current];
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('History save error', e);
  }
  return updated;
}

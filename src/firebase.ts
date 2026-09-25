import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeFirestore, getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const dbId = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? firebaseConfig.firestoreDatabaseId
  : undefined;

// Use initializeFirestore with auto-detect long-polling to prevent WebSocket/gRPC stream drops in iframe/proxies
export const db = (() => {
  try {
    return initializeFirestore(
      app,
      {
        experimentalAutoDetectLongPolling: true
      },
      dbId
    );
  } catch {
    // If already initialized, retrieve existing instance
    return dbId ? getFirestore(app, dbId) : getFirestore(app);
  }
})();

export const auth = getAuth(app);

// Safe test connection helper as specified in firebase-skill
export async function testFirebaseConnection(): Promise<boolean> {
  try {
    const testDoc = doc(db, 'test', 'connection');
    await getDoc(testDoc);
    return true;
  } catch (error: any) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Please check your Firebase configuration or network connection.");
      return false;
    }
    // Return true for permission or not-found as it indicates connection reached backend
    return true;
  }
}

// Run connection validation in background without blocking
testFirebaseConnection().catch(() => {});

export default app;

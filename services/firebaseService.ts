import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, onSnapshot, updateDoc, setDoc, collection, writeBatch, enableIndexedDbPersistence, getDocFromServer } from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { DashboardCardData, ClassDataMap, GalleryData } from '../types';
import firebaseAppletConfig from '../firebase-applet-config.json';

const CONFIG_KEY = 'school_management_firebase_config';

export const getStoredConfig = () => {
  // First try the applet config file
  if (firebaseAppletConfig && firebaseAppletConfig.apiKey) {
    return firebaseAppletConfig;
  }
  
  const stored = localStorage.getItem(CONFIG_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return null;
    }
  }
  return null;
};

export const saveConfig = (config: any) => {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  // Reload the page to apply the new config
  window.location.reload();
};

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

let db: any = null;
let app: any = null;
let auth: any = null;
let persistenceEnabled = false;

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
      isAnonymous: auth?.currentUser?.isAnonymous,
      tenantId: auth?.currentUser?.tenantId,
      providerInfo: auth?.currentUser?.providerData?.map((provider: any) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const initFirebase = () => {
  if (db && auth) return true;

  try {
    const config = getStoredConfig();
    if (!config) return false;

    if (!getApps().length) {
      app = initializeApp(config);
    } else {
      app = getApp();
    }
    
    if (!db) {
      db = getFirestore(app);
      
      // Enable offline persistence - only once
      if (!persistenceEnabled) {
        persistenceEnabled = true;
        enableIndexedDbPersistence(db).catch((err) => {
          if (err.code === 'failed-precondition') {
            console.warn("Multiple tabs open, persistence can only be enabled in one tab at a time.");
          } else if (err.code === 'unimplemented') {
            console.warn("The current browser does not support all of the features required to enable persistence.");
          } else {
            console.error("Persistence error:", err);
          }
        });
      }
    }

    if (!auth) {
      auth = getAuth(app);
      signInAnonymously(auth).catch((err) => console.error("Auth Error:", err));
    }
    
    // Test connection
    testConnection();
    
    return true;
  } catch (e) {
    console.error("Erro ao iniciar Firebase", e);
    return false;
  }
};

async function testConnection() {
  try {
    // Attempt to get a dummy doc to test connection
    await getDocFromServer(doc(db, '_connection_test_', 'ping'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Firebase mode offline: Please check your Firebase configuration if you want to use cloud syncing.");
    }
    // We don't throw here as this is just a health check
  }
}

export const onAuthChange = (callback: (user: any) => void) => {
  if (!auth) initFirebase();
  if (auth) {
    return onAuthStateChanged(auth, callback);
  }
  return () => {};
};

// --- REAL-TIME CLASSES SYNC ---

export const subscribeToClasses = (callback: (data: ClassDataMap) => void) => {
  if (!db) initFirebase();
  if (!db) return () => {};
  
  const path = 'classes';
  return onSnapshot(collection(db, path), (snapshot: any) => {
    const classes: ClassDataMap = {};
    if (snapshot.empty) {
        callback({});
        return;
    }
    snapshot.forEach((doc: any) => {
      classes[doc.id] = doc.data();
    });
    callback(classes);
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, path);
  });
};

export const saveClassesToFirestore = async (data: ClassDataMap) => {
  if (!db) initFirebase();
  if (!db) return;
  const batch = writeBatch(db);
  
  Object.values(data).forEach((cls) => {
    const ref = doc(db, 'classes', cls.id);
    batch.set(ref, cls);
  });
  
  try {
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'classes');
  }
};

// --- REAL-TIME GALLERY SYNC ---

export const subscribeToGallery = (callback: (data: GalleryData | null) => void) => {
  if (!db) initFirebase();
  if (!db) return () => {};
  const path = 'gallery/main';
  return onSnapshot(doc(db, 'gallery', 'main'), (doc: any) => {
    if (doc.exists()) {
      callback(doc.data() as GalleryData);
    } else {
      callback(null);
    }
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, path);
  });
};

export const saveGalleryToFirestore = async (data: GalleryData) => {
  if (!db) initFirebase();
  if (!db) return;
  const path = 'gallery/main';
  try {
    await setDoc(doc(db, 'gallery', 'main'), data);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

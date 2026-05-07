import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, onSnapshot, updateDoc, setDoc, collection, writeBatch, enableIndexedDbPersistence, getDocFromServer } from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { DashboardCardData, ClassDataMap, TournamentState, GalleryData } from '../types';
import firebaseAppletConfig from '../firebase-applet-config.json';

const CONFIG_KEY = 'chess_club_firebase_config';

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

// Inicializa cards padrão se não existirem
export const seedDatabase = async () => {
  if (!db) initFirebase();
  if (!db) return;
  
  const defaultCards: DashboardCardData[] = [
    { id: 'total_students', title: 'Total de Alunos', value: 124, type: 'number', trend: '+12% este mês', icon: 'users', lastUpdated: Date.now() },
    { id: 'active_classes', title: 'Turmas Ativas', value: 8, type: 'number', trend: '2 manhã / 6 tarde', icon: 'book', lastUpdated: Date.now() },
    { id: 'next_event', title: 'Próximo Torneio', value: '15 Mai - Interescolar', type: 'text', icon: 'trophy', lastUpdated: Date.now() },
    { id: 'club_status', title: 'Status do Clube', value: 'Aberto', type: 'status', icon: 'door', lastUpdated: Date.now() },
  ];

  try {
    const batch = writeBatch(db);
    for (const card of defaultCards) {
      const ref = doc(db, 'dashboard', card.id);
      batch.set(ref, card, { merge: true });
    }
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'dashboard');
  }
};

// Listener em tempo real Dashboard
export const subscribeToDashboard = (callback: (data: DashboardCardData[]) => void) => {
  if (!db) initFirebase();
  if (!db) {
    callback([]);
    return () => {};
  }

  const path = 'dashboard';
  const unsub = onSnapshot(collection(db, path), (snapshot: any) => {
    const cards: DashboardCardData[] = [];
    snapshot.forEach((doc: any) => {
      cards.push(doc.data() as DashboardCardData);
    });
    cards.sort((a, b) => a.id.localeCompare(b.id));
    callback(cards);
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, path);
  });

  return unsub;
};

// Atualizar valor Dashboard
export const updateCardValue = async (id: string, value: string | number) => {
  if (!db) initFirebase();
  if (!db) return;
  const path = `dashboard/${id}`;
  const docRef = doc(db, 'dashboard', id);
  try {
    await updateDoc(docRef, {
      value: value,
      lastUpdated: Date.now()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
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

// --- REAL-TIME TOURNAMENT SYNC ---

export const subscribeToTournament = (callback: (data: TournamentState | null) => void) => {
  if (!db) initFirebase();
  if (!db) return () => {};
  const path = 'tournaments/active';
  return onSnapshot(doc(db, 'tournaments', 'active'), (doc: any) => {
    if (doc.exists()) {
      callback(doc.data() as TournamentState);
    } else {
      callback(null);
    }
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, path);
  });
};

export const saveTournamentToFirestore = async (data: TournamentState) => {
  if (!db) initFirebase();
  if (!db) return;
  const path = 'tournaments/active';
  try {
    await setDoc(doc(db, 'tournaments', 'active'), data);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
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

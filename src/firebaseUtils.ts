import { collection, doc, setDoc, deleteDoc, onSnapshot, getDocs, writeBatch } from 'firebase/firestore';
import { db } from './firebase';

export const subscribeToCollection = <T>(collectionName: string, callback: (data: T[]) => void) => {
  return onSnapshot(collection(db, collectionName), (snapshot) => {
    const data = snapshot.docs.map(doc => ({ ...doc.data() } as unknown as T));
    callback(data);
  });
};

export const saveDocument = async (collectionName: string, id: string, data: any) => {
  try {
    await setDoc(doc(db, collectionName, id), data);
  } catch (error) {
    console.error(`Error saving document to ${collectionName}:`, error);
    throw error;
  }
};

export const removeDocument = async (collectionName: string, id: string) => {
  try {
    await deleteDoc(doc(db, collectionName, id));
  } catch (error) {
    console.error(`Error deleting document from ${collectionName}:`, error);
    throw error;
  }
};

// Helper to map localStorage keys to Firestore collection names
export const mapKeyToCollection = (key: string): string => {
  const mapping: Record<string, string> = {
    'medkom_submissions_db': 'submissions',
    'medkom_residents_db_v5': 'residents',
    'medkom_logs_db_v5': 'logs',
    'medkom_tasks_db_v5': 'tasks',
    'medkom_videos_db_v5': 'videos',
    'medkom_campaigns_db_v5': 'campaigns',
    'medkom_mous_db_v5': 'mous',
    'medkom_publications_db_v5': 'publications',
    'medkom_templates_db_v5': 'templates',
    'medkom_archives_db_v5': 'archives',
    'medkom_calendar_db_v5': 'events'
  };
  return mapping[key] || key;
};

// Syncs an entire array update to Firestore by performing batch per-document operations
export const syncArrayToFirestore = async (collectionName: string, oldArray: any[], newArray: any[]) => {
  try {
    const batch = writeBatch(db);
    const oldIds = new Set(oldArray.map(item => item.id));
    const newIds = new Set(newArray.map(item => item.id));

    // Items to delete
    for (const item of oldArray) {
      if (!newIds.has(item.id) && item.id) {
        batch.delete(doc(db, collectionName, item.id));
      }
    }

    // Items to add or update
    for (const item of newArray) {
      if (item.id) {
        batch.set(doc(db, collectionName, item.id), item);
      }
    }

    await batch.commit();
  } catch (error) {
    console.error(`Error syncing array to Firestore [${collectionName}]:`, error);
  }
};

export const seedDatabaseIfEmpty = async (mockDataMap: Record<string, any[]>) => {
  try {
    console.log("Checking if database needs seeding...");
    for (const [collectionName, dataArray] of Object.entries(mockDataMap)) {
      const colRef = collection(db, collectionName);
      const snapshot = await getDocs(colRef);
      
      if (snapshot.empty && dataArray.length > 0) {
        console.log(`Seeding collection: ${collectionName} with ${dataArray.length} items`);
        const batch = writeBatch(db);
        
        dataArray.forEach((item) => {
          const docId = item.id || crypto.randomUUID();
          const itemToSave = { ...item, id: docId };
          const docRef = doc(db, collectionName, docId);
          batch.set(docRef, itemToSave);
        });
        
        await batch.commit();
        console.log(`Successfully seeded ${collectionName}`);
      }
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

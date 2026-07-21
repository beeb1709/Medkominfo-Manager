require('dotenv').config();
const { initializeApp, getApps, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      privateKey: process.env.GOOGLE_PRIVATE_KEY ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
    }),
  });
}

const db = getFirestore();

const collectionsToClear = [
  'submissions',
  'logs',
  'tasks',
  'videos',
  'campaigns',
  'mous',
  'publications',
  'templates',
  'archives',
  'events'
];

async function clearCollections() {
  console.log("Mulai menghapus data dummy dari Firebase...");
  for (const collectionName of collectionsToClear) {
    const snapshot = await db.collection(collectionName).get();
    if (snapshot.size === 0) {
      console.log(`Koleksi ${collectionName} sudah kosong.`);
      continue;
    }
    
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    console.log(`Berhasil menghapus ${snapshot.size} dokumen dari koleksi ${collectionName}.`);
  }
  console.log("Semua data dummy berhasil dihapus dari Firebase!");
}

clearCollections().catch(console.error);

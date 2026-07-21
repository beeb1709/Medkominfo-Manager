import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAdminDb } from '../lib/firebase-admin';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const collectionName = req.query.collection as string;
      if (!collectionName) {
        return res.status(400).json({ success: false, message: 'Collection name is required.' });
      }

      const db = getAdminDb();
      const snapshot = await db.collection(collectionName).get();
      const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

      return res.status(200).json({ 
        success: true, 
        collection: collectionName, 
        count: docs.length, 
        data: docs 
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  return res.status(405).json({ success: false, message: 'Method tidak diizinkan.' });
}

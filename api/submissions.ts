import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAdminDb } from './lib/firebase-admin';
import { appendRowToSheet, ensureSheetHeader } from './lib/sheets';

const REQUIRED_FIELDS = [
  'id', 'timestamp', 'sender', 'department',
  'picHumas', 'programKerja', 'jenisPengajuan',
  'urgency', 'deadline', 'status',
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ── POST /api/submissions ──────────────────────────────────────────────────
  if (req.method === 'POST') {
    const submission = req.body as Record<string, any>;

    const missingFields = REQUIRED_FIELDS.filter((f) => !submission[f]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Field berikut wajib diisi: ${missingFields.join(', ')}`,
      });
    }

    try {
      await ensureSheetHeader();
      await appendRowToSheet(submission);
      console.log(`[Sheets] Baris "${submission.id}" berhasil ditambahkan.`);

      return res.status(201).json({
        success: true,
        message: 'Submission berhasil dikirim ke Google Sheets.',
        id: submission.id,
      });
    } catch (error: any) {
      console.error(`[Sheets] Gagal append "${submission.id}":`, error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // ── GET /api/submissions ───────────────────────────────────────────────────
  if (req.method === 'GET') {
    try {
      const db = getAdminDb();
      const snapshot = await db
        .collection('submissions')
        .orderBy('createdAt', 'desc')
        .get();
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      return res.status(200).json({ success: true, count: data.length, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  return res.status(405).json({ success: false, message: 'Method tidak diizinkan.' });
}

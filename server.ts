import express, { Request, Response } from 'express';
import path from 'path';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

// ─────────────────────────────────────────────────────────────────────────────
// 1. Firebase Admin SDK Initialization
// ─────────────────────────────────────────────────────────────────────────────
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      // Private key di .env disimpan dengan literal "\n" → perlu di-replace
      privateKey: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const adminDb = getFirestore();

// ─────────────────────────────────────────────────────────────────────────────
// 2. Google Sheets API Initialization
// ─────────────────────────────────────────────────────────────────────────────
const sheetsAuth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheetsClient = google.sheets({ version: 'v4', auth: sheetsAuth });

// ID Spreadsheet → set di .env sebagai GOOGLE_SHEET_ID
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID || '';
// Nama tab Sheet (default "Submissions")
const SHEET_NAME = process.env.GOOGLE_SHEET_NAME || 'Submissions';

// ─────────────────────────────────────────────────────────────────────────────
// 3. Helper: Append satu baris ke Google Sheets
// ─────────────────────────────────────────────────────────────────────────────
async function appendRowToSheet(submission: Record<string, any>): Promise<void> {
  if (!SPREADSHEET_ID) return;

  // Urutan kolom harus cocok dengan header baris ke-1 di Sheet Anda
  const rowValues = [
    submission.id,
    submission.timestamp,
    submission.sender,
    submission.department,
    submission.picHumas,
    submission.programKerja,
    submission.jenisPengajuan,
    submission.urgency,
    submission.deadline,
    submission.status,
    submission.details || '',
    submission.assetLink || '',
    submission.notes || '',
    submission.pic || '',
  ];

  await sheetsClient.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!A:N`,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values: [rowValues] },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Helper: Buat header di baris pertama jika Sheet masih kosong
// ─────────────────────────────────────────────────────────────────────────────
async function ensureSheetHeader(): Promise<void> {
  if (!SPREADSHEET_ID) return;
  try {
    const res = await sheetsClient.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A1:N1`,
    });

    if (!res.data.values || res.data.values.length === 0) {
      await sheetsClient.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A1:N1`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[
            'ID', 'Timestamp', 'Sender', 'Department', 'PIC Humas',
            'Program Kerja', 'Jenis Pengajuan', 'Urgency', 'Deadline',
            'Status', 'Details', 'Asset Link', 'Notes', 'PIC',
          ]],
        },
      });
      console.log('[Sheets] Header berhasil dibuat.');
    }
  } catch (err) {
    console.error('[Sheets] Gagal memeriksa/membuat header:', err);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. Express App
// ─────────────────────────────────────────────────────────────────────────────
const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

// ─────────────────────────────────────────────────────────────────────────────
// 6. POST /api/submissions
//    Alur: Validasi → Append ke Google Sheets
//    (Firestore sudah ditangani oleh Client SDK di browser)
// ─────────────────────────────────────────────────────────────────────────────
app.post('/api/submissions', async (req: Request, res: Response) => {
  const submission = req.body as Record<string, any>;

  // Validasi field wajib
  const requiredFields = [
    'id', 'timestamp', 'sender', 'department',
    'picHumas', 'programKerja', 'jenisPengajuan',
    'urgency', 'deadline', 'status',
  ];
  const missingFields = requiredFields.filter((f) => !submission[f]);
  if (missingFields.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Field berikut wajib diisi: ${missingFields.join(', ')}`,
    });
  }

  try {
    // Append ke Google Sheets
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
});

// ── GET /api/submissions/:id ─────────────────────────────────────────────────
app.get('/api/submissions/:id', async (req: Request, res: Response) => {
  try {
    const docSnap = await adminDb.collection('submissions').doc(req.params.id).get();
    if (!docSnap.exists) {
      return res.status(404).json({ success: false, message: 'Submission tidak ditemukan.' });
    }
    return res.json({ success: true, data: docSnap.data() });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// ── GET /api/submissions ─────────────────────────────────────────────────────
app.get('/api/submissions', async (_req: Request, res: Response) => {
  try {
    const snapshot = await adminDb
      .collection('submissions')
      .orderBy('createdAt', 'desc')
      .get();
    const submissions = snapshot.docs.map((d) => d.data());
    return res.json({ success: true, count: submissions.length, data: submissions });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// ── GET /api/check/:collection — Cek jumlah dokumen di koleksi manapun ───────
app.get('/api/check/:collection', async (req: Request, res: Response) => {
  try {
    const snapshot = await adminDb.collection(req.params.collection).get();
    const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    return res.json({ success: true, collection: req.params.collection, count: docs.length, data: docs });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 7. Start Server
// ─────────────────────────────────────────────────────────────────────────────
async function startServer() {
  await ensureSheetHeader();

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
}

startServer();

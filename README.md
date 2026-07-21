# 🚀 Medkominfo Submission Manager

Aplikasi web modern berbasis **React** dan **Vite** yang dirancang khusus untuk memfasilitasi dan mengelola alur pengajuan permohonan (submissions) ke Departemen Media, Komunikasi, dan Informasi (Medkominfo). 

Website ini terdiri dari dua bagian utama:
1. **Public Portal:** Halaman khusus bagi anggota himpunan/masyarakat umum untuk mengajukan permohonan desain, video, broadcast, hingga publikasi, serta melihat kalender kegiatan secara real-time.
2. **Admin Dashboard:** Halaman manajemen lengkap bagi internal pengurus Medkominfo (Kadept, Wakadept, Admin Humas, Admin Multimedia) untuk mengelola data pengajuan secara efisien.

## ✨ Fitur Utama

- **Sistem Pengajuan Mandiri:** Pemohon dapat melakukan request *Desain, Video, atau Publikasi* langsung melalui form di Public Portal.
- **Dual-Database Syncing:** Setiap data yang disubmit akan tersimpan otomatis ke dalam dua tempat sekaligus:
  - **Firebase Firestore:** Digunakan sebagai database utama yang *real-time* untuk website.
  - **Google Sheets:** Berfungsi sebagai *backup* dan rekapitulasi data agar mudah dipantau oleh pengurus.
- **Admin Dashboard Lengkap:** Terdapat tab khusus untuk memantau Daftar Warga/Pengurus, Rekapitulasi Tugas (Tasks & Video Projects), Manajemen Publikasi, Broadcast, dan MoU.
- **Sistem Kalender Otomatis:** Setiap request yang memiliki tenggat waktu (deadline) akan otomatis tersinkronisasi ke dalam Kalender Medkominfo.
- **Fitur Tema Gelap (Dark Mode):** Desain UI/UX yang modern dengan dukungan *Light Mode* dan *Dark Mode*.
- **Otomatisasi Log Operasional:** Seluruh pergerakan/perubahan status tugas dicatat secara real-time.

## 🛠️ Tech Stack

- **Frontend:** React (TSX), Vite, TailwindCSS v4, Lucide Icons.
- **Backend / Serverless:** Vercel Serverless Functions (`/api`).
- **Database:** Firebase Firestore (Client SDK & Admin SDK).
- **Integrasi Eksternal:** Google Sheets API v4.
- **Deployment:** Vercel (Ready).

## 📦 Panduan Instalasi Lokal (Development)

Jika ingin menjalankan website ini di komputer lokal Anda:

1. Clone repository ini:
   ```bash
   git clone https://github.com/[USERNAME-ANDA]/medkom-submission-manager.git
   cd medkom-submission-manager
   ```

2. Install semua *dependencies*:
   ```bash
   npm install
   ```

3. Buat file `.env` di direktori utama, lalu isi dengan format seperti `.env.example`. Masukkan *Credentials* dari Firebase dan Google Service Account milik Anda.

4. Jalankan server lokal:
   ```bash
   npm run dev
   ```

5. Buka `http://localhost:3000` di browser.

## 🌐 Panduan Deployment (Vercel)

Aplikasi ini sudah dikonfigurasi untuk berjalan mulus menggunakan layanan gratis **Vercel**.
1. Push kode ke GitHub.
2. Buka [Vercel](https://vercel.com/) dan import repository ini.
3. Di bagian **Environment Variables** pada dashboard Vercel, masukkan seluruh *key* yang ada pada file `.env`.
4. (Penting) `GOOGLE_PRIVATE_KEY` dapat dimasukkan apa adanya secara utuh (Vercel akan mengonversinya secara otomatis).
5. Klik **Deploy**.

## 👥 Pengembang / Kontak

Dikembangkan untuk kebutuhan internal organisasi (**Kabinet Citta Prakarsa - HMIF UPNVJ**).

*(Ubah atau tambahkan informasi kontak pengurus di sini)*

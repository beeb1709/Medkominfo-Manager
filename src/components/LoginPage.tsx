import React, { useState, useEffect } from 'react';
import { AppSettings } from '../types';
import { 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  User, 
  CheckCircle,
  HelpCircle,
  Clock,
  Heart,
  FileSpreadsheet
} from 'lucide-react';
import { initialAdmins, initialWarga } from '../mockData';

interface LoginPageProps {
  appSettings?: AppSettings;
  onLogin: (user: { id?: string; name: string; email?: string; role: 'admin' | 'public'; nim?: string; jabatan?: string }) => void;
  userEmail?: string; // We can pre-fill or list this as a registered email
}

export default function LoginPage({
  appSettings, onLogin, userEmail = 'habibiewibisono17@gmail.com' }: LoginPageProps) {
  const [activeTab, setActiveTab] = useState<'public' | 'admin'>('public');
  
  // Public (Warga) Form States
  const [wargaName, setWargaName] = useState('');
  const [wargaPassword, setWargaPassword] = useState('');
  const [wargaError, setWargaError] = useState<string | null>(null);

  // Admin (NIM) States
  const [adminName, setAdminName] = useState('');
  const [adminNim, setAdminNim] = useState('');
  const [adminError, setAdminError] = useState<string | null>(null);

  // List of registered Admin accounts
  const [registeredAdmins, setRegisteredAdmins] = useState<any[]>([]);
  const [registeredWarga, setRegisteredWarga] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('medkom_admin_users');
    if (saved) {
      const parsedAdmins = JSON.parse(saved);
      // Merge with initialAdmins to ensure jabatan and id are populated
      const mergedAdmins = parsedAdmins.map((savedAdmin: any) => {
        // Try to match by ID first, then by initial name, then by NIM
        const initialMatch = initialAdmins.find(a => 
          (savedAdmin.id && a.id === savedAdmin.id) || 
          (!savedAdmin.id && a.name === savedAdmin.name) ||
          (!savedAdmin.id && a.nim === savedAdmin.nim)
        );
        if (initialMatch) {
          return { ...savedAdmin, jabatan: savedAdmin.jabatan || initialMatch.jabatan, id: initialMatch.id };
        }
        return savedAdmin;
      });
      // Also add any new initialAdmins that aren't in local storage
      initialAdmins.forEach(initialAdmin => {
        if (!mergedAdmins.find((a: any) => (a.id === initialAdmin.id) || (!a.id && a.name === initialAdmin.name))) {
          mergedAdmins.push(initialAdmin);
        }
      });
      setRegisteredAdmins(mergedAdmins);
      localStorage.setItem('medkom_admin_users', JSON.stringify(mergedAdmins));
    } else {
      setRegisteredAdmins(initialAdmins);
      localStorage.setItem('medkom_admin_users', JSON.stringify(initialAdmins));
    }

    const savedWarga = localStorage.getItem('medkom_warga_users');
    if (savedWarga) {
      const parsedWarga = JSON.parse(savedWarga);
      // Merge with initialWarga
      const mergedWarga = parsedWarga.map((savedW: any) => {
        const initialMatch = initialWarga.find(w => w.id === savedW.id || w.name === savedW.name);
        if (initialMatch) {
          return { ...savedW, jabatan: savedW.jabatan || initialMatch.jabatan, id: initialMatch.id };
        }
        return savedW;
      });
      initialWarga.forEach(initialW => {
        if (!mergedWarga.find((w: any) => w.id === initialW.id || w.name === initialW.name)) {
          mergedWarga.push(initialW);
        }
      });
      setRegisteredWarga(mergedWarga);
      localStorage.setItem('medkom_warga_users', JSON.stringify(mergedWarga));
    } else {
      setRegisteredWarga(initialWarga);
      localStorage.setItem('medkom_warga_users', JSON.stringify(initialWarga));
    }
  }, []);

  const handleWargaLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wargaName.trim() || !wargaPassword.trim()) return;
    
    const matchedWarga = registeredWarga.find(
      (w) => w.name.toLowerCase() === wargaName.trim().toLowerCase() && w.password === wargaPassword.trim()
    );

    if (matchedWarga) {
      onLogin({
        id: matchedWarga.id,
        name: matchedWarga.name,
        jabatan: matchedWarga.jabatan,
        role: 'public'
      });
      setWargaError(null);
    } else {
      setWargaError("Kredensial tidak valid. Nama atau Password salah.");
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminName.trim() || !adminNim.trim()) return;

    const matchedAdmin = registeredAdmins.find(
      (a) => a.name.toLowerCase() === adminName.trim().toLowerCase() && a.nim === adminNim.trim()
    );

    if (matchedAdmin) {
      onLogin({
        id: matchedAdmin.id,
        name: matchedAdmin.name,
        nim: matchedAdmin.nim,
        jabatan: matchedAdmin.jabatan || 'Pengurus Medkom',
        role: 'admin'
      });
      setAdminError(null);
    } else {
      setAdminError("Kredensial tidak valid. Nama atau Password salah.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-200 dark:bg-[#020617] flex flex-col justify-between p-4 md:p-8 relative overflow-hidden text-slate-900 dark:text-slate-100"><div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-screen"></div><div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] bg-blue-900/40 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div><div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] bg-indigo-900/40 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
      
      {/* Background ambient lighting blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header identity */}
      <header className="relative z-10 max-w-6xl mx-auto w-full flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          {appSettings?.logoUrl ? (
            <img src={appSettings.logoUrl} alt="Logo Dept" className="w-10 h-10 object-contain rounded-xl" />
          ) : (
            <div className="w-10 h-10 bg-linear-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center font-black text-white text-lg tracking-wider shadow-md">
              H
            </div>
          )}
          {appSettings?.hmifLogoUrl && (
            <img src={appSettings.hmifLogoUrl} alt="Logo HMIF" className="w-10 h-10 object-contain rounded-xl" />
          )}
          <div>
            <h1 className="text-sm font-black tracking-tight text-slate-900 dark:text-white uppercase">{appSettings?.portalName || 'HMIF UPNVJ'}</h1>
            <p className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-widest">{appSettings?.portalSubtitle || 'Medkominfo Hub 2026'}</p>
          </div>
        </div>
        
        <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 bg-white/80 dark:bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-300 dark:border-slate-700/50 flex items-center gap-1">
          <Clock className="w-3 h-3 text-blue-600 dark:text-blue-400" />
          {appSettings?.cabinetName || 'Kabinet Sinergi Digital'}
        </span>
      </header>

      {/* Main Login Card container */}
      <main className="relative z-10 max-w-md w-full mx-auto my-auto py-8">
        <div className="bg-slate-50 dark:bg-slate-950/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-6 md:p-8 rounded-3xl shadow-2xl space-y-6">
          
          {/* Header title */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-4">
              {appSettings?.logoUrl ? (
                <img src={appSettings.logoUrl} alt="Logo Dept" className="w-16 h-16 object-contain rounded-2xl shadow-sm" />
              ) : (
                <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  <Sparkles className="w-6 h-6" />
                </div>
              )}
              {appSettings?.hmifLogoUrl && (
                <img src={appSettings.hmifLogoUrl} alt="Logo HMIF" className="w-16 h-16 object-contain rounded-2xl shadow-sm" />
              )}
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Portal {appSettings?.portalName || 'Medkominfo HMIF'}</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xs mx-auto">Silakan pilih jenis akses masuk untuk melanjutkan ke workspace pelayanan kami.</p>
          </div>

          {/* Tab buttons */}
          <div className="flex bg-white dark:bg-slate-900/80 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 gap-1">
            <button
              onClick={() => {
                setActiveTab('public');
                setAdminError(null);
              }}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'public'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <User className="w-4 h-4" />
              Anggota HMIF
            </button>
            <button
              onClick={() => {
                setActiveTab('admin');
              }}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'admin'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Pengurus MEDKOMINFO
            </button>
          </div>

          {/* Form rendering */}
          {activeTab === 'public' ? (
            <form onSubmit={handleWargaLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  placeholder="Masukkan nama Anda..."
                  value={wargaName}
                  onChange={(e) => setWargaName(e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white placeholder-slate-500 font-medium transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">Password</label>
                <input
                  type="password"
                  required
                  placeholder="Masukkan password Anggota Anda..."
                  value={wargaPassword}
                  onChange={(e) => setWargaPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white placeholder-slate-500 font-medium transition-colors"
                />
              </div>

              {wargaError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs text-center font-medium">
                  {wargaError}
                </div>
              )}

              <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl">
                <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  💡 Masuk sebagai Anggota memungkinkan Anda mengajukan desain pamflet, memantau kalender kegiatan, mengirim mading, serta memberikan pengajuan secara resmi.
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/10"
              >
                Masuk ke Portal Anggota
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">Nama Lengkap (Username)</label>
                <input
                  type="text"
                  required
                  placeholder="Masukkan nama terdaftar..."
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white placeholder-slate-500 font-medium transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">Password</label>
                <input
                  type="password"
                  required
                  placeholder="Masukkan Password..."
                  value={adminNim}
                  onChange={(e) => setAdminNim(e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white placeholder-slate-500 font-medium transition-colors"
                />
              </div>

              {adminError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-xl text-[11px] font-medium leading-relaxed">
                  ⚠️ {adminError}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
              >
                Masuk sebagai Pengurus
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

        </div>
      </main>

      {/* Footer system attributes */}
      <footer className="relative z-10 max-w-6xl mx-auto w-full text-center py-4 border-t border-slate-200 dark:border-slate-800/60 mt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-600 dark:text-slate-400 text-[10px] font-medium">
        <span>© 2026 Departemen Medkominfo HMIF UPNVJ. All Rights Reserved.</span>
        <div className="flex gap-4">
          <a href="#" className="hover:text-slate-900 dark:hover:text-slate-300">Panduan SOP</a>
          <a href="#" className="hover:text-slate-900 dark:hover:text-slate-300">Ketentuan Layanan</a>
          <a href="#" className="hover:text-slate-900 dark:hover:text-slate-300">Developer Team</a>
        </div>
      </footer>

    </div>
  );
}

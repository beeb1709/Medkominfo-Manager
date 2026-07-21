import React, { useState, useEffect } from 'react';
import { initialResidents } from '../mockData';
import { AppSettings } from '../types';
import { User, Bell, Lock, Shield, Smartphone, Mail, Camera, Save, ToggleLeft, ToggleRight, CheckCircle2, ClipboardList, Clock, Sparkles } from 'lucide-react';

interface SettingsTabProps {
  appSettings: AppSettings;
  onUpdateAppSettings: (settings: AppSettings) => void;
  currentUser: { id?: string; name: string; email?: string; role: 'admin' | 'public'; nim?: string; jabatan?: string; avatarUrl?: string } | null;
  submissions?: any[];
  onTriggerNotification: (msg: string) => void;
  onUpdateUser: (updatedUser: any) => void;
  onUpdateResidents?: (updatedResidents: any[]) => void;
  residents?: any[];
}

export default function SettingsTab({
  appSettings, residents,
  onUpdateAppSettings, currentUser, submissions = [], onTriggerNotification, onUpdateUser, onUpdateResidents, isDarkMode, onToggleTheme }: SettingsTabProps & { isDarkMode?: boolean; onToggleTheme?: () => void }) {
  const [localSettings, setLocalSettings] = useState({
      cabinetName: appSettings?.cabinetName || 'Kabinet Sinergi Digital',
      portalName: appSettings?.portalName || 'HMIF UPNVJ',
      portalSubtitle: appSettings?.portalSubtitle || 'Medkominfo Hub 2026',
      logoUrl: appSettings?.logoUrl || null,
      hmifLogoUrl: appSettings?.hmifLogoUrl || null
  });
  const hasAppIdentityAccess = currentUser?.jabatan === 'Super Admin';
  const handleSaveIdentity = () => {
    if(onUpdateAppSettings) onUpdateAppSettings(localSettings);
    alert('Pengaturan identitas berhasil disimpan');
  };
  const [activeSection, setActiveSection] = useState<'account' | 'appearance' | 'notifications' | 'submissions'>('account');
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Form states
  // Find resident data to pre-fill whatsapp if available
  const currentResident = (residents || initialResidents)?.find(r => r.adminId === currentUser?.id || r.name.toLowerCase() === currentUser?.name.toLowerCase());
  const [formData, setFormData] = useState({
    name: currentUser?.name || 'Administrator',
    email: currentUser?.email || 'admin@medkominfo.org',
    whatsapp: currentResident?.whatsapp || '+62 812-3456-7890',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    avatarUrl: currentUser?.avatarUrl || ''
  });

  // Notification states
  const [notifSettings, setNotifSettings] = useState({
    inApp: true,
    whatsapp: true,
    broadcast: true
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        onTriggerNotification('Ukuran file maksimal 100MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_SIZE = 256;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_SIZE) {
                height = Math.round(height * (MAX_SIZE / width));
                width = MAX_SIZE;
              }
            } else {
              if (height > MAX_SIZE) {
                width = Math.round(width * (MAX_SIZE / height));
                height = MAX_SIZE;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
              setFormData(prev => ({ ...prev, avatarUrl: dataUrl }));
            }
          };
          img.src = event.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setFormData(prev => ({ ...prev, avatarUrl: '' }));
  };

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      onTriggerNotification('Gagal: Kata sandi baru dan ulangi tidak cocok.');
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      // Update details in localStorage for admin
      if (currentUser?.role === 'admin') {
        const savedAdmins = localStorage.getItem('medkom_admin_users');
        if (savedAdmins) {
          const admins = JSON.parse(savedAdmins);
          const updatedAdmins = admins.map((a: any) => {
            const isMatch = (currentUser.id && a.id === currentUser.id) || (!currentUser.id && a.name.toLowerCase() === currentUser.name.toLowerCase());
            if (isMatch) {
              return { 
                ...a, 
                name: formData.name,
                nim: formData.newPassword ? formData.newPassword : a.nim 
              };
            }
            return a;
          });
          localStorage.setItem('medkom_admin_users', JSON.stringify(updatedAdmins));
        }
        
        // Also update residents db with new whatsapp and email
        const savedResidents = localStorage.getItem('medkom_residents_db_v5');
        if (savedResidents) {
           const resDb = JSON.parse(savedResidents);
           const updatedResDb = resDb.map((r: any) => {
              if (r.adminId === currentUser?.id || r.name.toLowerCase() === currentUser?.name?.toLowerCase()) {
                 return { ...r, whatsapp: formData.whatsapp, name: formData.name, email: formData.email };
              }
              return r;
           });
           localStorage.setItem('medkom_residents_db_v5', JSON.stringify(updatedResDb));
        }
        // Also sync email/whatsapp/name to Firebase residents collection
        if (residents && residents.length > 0) {
          let matched = false;
          const updatedResidents = residents.map((r: any) => {
            const isMatch = 
              (currentUser?.id && (r.adminId === currentUser.id || r.id === currentUser.id)) ||
              r.name.toLowerCase() === currentUser?.name?.toLowerCase();
            if (isMatch) {
              matched = true;
              return { ...r, whatsapp: formData.whatsapp, name: formData.name, email: formData.email };
            }
            return r;
          });
          if (matched && typeof onUpdateResidents === 'function') {
            onUpdateResidents(updatedResidents);
          }
        }
      } else if (currentUser?.role === 'public') {
        const savedWarga = localStorage.getItem('medkom_warga_users');
        if (savedWarga) {
          const wargas = JSON.parse(savedWarga);
          const updatedWarga = wargas.map((w: any) => {
            const isMatch = (currentUser.id && w.id === currentUser.id) || (!currentUser.id && w.name.toLowerCase() === currentUser.name.toLowerCase());
            if (isMatch) {
              return {
                ...w,
                name: formData.name,
                password: formData.newPassword ? formData.newPassword : w.password
              };
            }
            return w;
          });
          localStorage.setItem('medkom_warga_users', JSON.stringify(updatedWarga));
        }
      }

      if (currentUser) {
        onUpdateUser({
          ...currentUser,
          name: formData.name,
          email: formData.email,
          avatarUrl: formData.avatarUrl
        });
      }
      setIsSaving(false);
      onTriggerNotification('Pengaturan profil berhasil disimpan.');
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
    }, 800);
  };

  const toggleNotif = (key: keyof typeof notifSettings) => {
    setNotifSettings(prev => ({ ...prev, [key]: !prev[key] }));
    onTriggerNotification(`Preferensi notifikasi diperbarui.`);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-blue-100 dark:to-slate-300 tracking-tight">Pengaturan</h2>
        <p className="text-sm text-slate-500 mt-1">Kelola preferensi akun dan notifikasi aplikasi.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Settings Navigation Sidebar */}
        <div className="w-full md:w-64 space-y-1 shrink-0">
          <button
            onClick={() => setActiveSection('account')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeSection === 'account' 
                ? 'bg-slate-900 text-blue-700 shadow-sm border border-blue-100' 
                : 'text-slate-400 hover:bg-slate-800 border border-transparent'
            }`}
          >
            <User className="w-4.5 h-4.5" />
            Akun & Profil
          </button>
          

          <button
            onClick={() => setActiveSection('appearance')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeSection === 'appearance' 
                ? 'bg-slate-900 text-blue-700 shadow-sm border border-blue-100' 
                : 'text-slate-400 hover:bg-slate-800 border border-transparent'
            }`}
          >
            <Sparkles className="w-4.5 h-4.5" />
            Tampilan (Tema)
          </button>
          
          <button
            onClick={() => setActiveSection('notifications')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeSection === 'notifications' 
                ? 'bg-slate-900 text-blue-700 shadow-sm border border-blue-100' 
                : 'text-slate-400 hover:bg-slate-800 border border-transparent'
            }`}
          >
            <Bell className="w-4.5 h-4.5" />
            Notifikasi
          </button>
          
          {/* Submissions are visible to both Warga and Admin */}
          {hasAppIdentityAccess && (
            <button
              onClick={() => setActiveSection('app_identity' as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-colors ${
                activeSection === 'app_identity' as any
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <div className="p-1.5 bg-blue-500/20 rounded-lg"><Sparkles className="w-4 h-4" /></div>
              <div className="text-left">
                <span className="block">Identitas Portal</span>
                <span className="text-[9px] font-medium opacity-70">Ubah Logo & Nama</span>
              </div>
            </button>
          )}
          <button 
            onClick={() => setActiveSection('submissions')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeSection === 'submissions' 
                ? 'bg-slate-900 text-blue-700 shadow-sm border border-blue-100' 
                : 'text-slate-400 hover:bg-slate-800 border border-transparent'
            }`}
          >
            <ClipboardList className="w-4.5 h-4.5" />
            Pengajuan Saya
          </button>
        </div>

        {/* Settings Content Area */}
        <div className="flex-1 w-full min-w-0">
          
          {/* Account Section */}
          {activeSection === 'account' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              {/* Avatar Box */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-6">
                <div className="relative group">
                  {formData.avatarUrl ? (
                    <img src={formData.avatarUrl} alt="Avatar" className="w-20 h-20 rounded-full object-cover shadow-inner" />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-black shadow-inner">
                      {formData.name.charAt(0)}
                    </div>
                  )}
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                  >
                    <Camera className="w-6 h-6 text-white" />
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handlePhotoUpload} 
                    accept="image/*" 
                    className="hidden" 
                  />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg">Foto Profil</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm">
                    Gunakan foto persegi dengan ukuran maksimal 100MB. Format JPG, PNG, atau GIF.
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg transition-colors"
                    >
                      Ubah Foto
                    </button>
                    <button 
                      type="button"
                      onClick={handleRemovePhoto}
                      className="px-4 py-1.5 text-rose-600 hover:bg-rose-50 text-xs font-bold rounded-lg transition-colors"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>

              {/* Profile Details Form */}
              <form onSubmit={handleSaveAccount} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-500" />
                      Informasi Personal
                    </h3>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Nama Lengkap</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Email / Surel</label>
                        <div className="relative">
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="w-full pl-9 pr-3.5 py-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                          />
                          <Mail className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        </div>
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">No. WhatsApp</label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={formData.whatsapp}
                            onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                            className="w-full pl-9 pr-3.5 py-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                          />
                          <Smartphone className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <hr className="border-slate-200 dark:border-slate-800" />

                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-2">
                      <Lock className="w-4 h-4 text-amber-500" />
                      Ubah Kata Sandi
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 mb-4">Kosongkan jika tidak ingin mengubah kata sandi.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="md:col-span-2">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Kata Sandi Saat Ini</label>
                        <input
                          type="password"
                          value={formData.currentPassword}
                          onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                          className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Kata Sandi Baru</label>
                        <input
                          type="password"
                          value={formData.newPassword}
                          onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                          className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Ulangi Kata Sandi Baru</label>
                        <input
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                          className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-950 px-6 py-4 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                  <button type="button" className="px-4 py-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-sm font-bold transition-colors">
                    Batal
                  </button>
                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-sm disabled:opacity-70"
                  >
                    {isSaving ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Menyimpan...
                      </span>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Simpan Perubahan
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          
          {/* App Identity Section */}
          {activeSection === 'app_identity' as any && hasAppIdentityAccess && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-6">
                  <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-2 mb-6">
                    <Sparkles className="w-4 h-4 text-blue-500" />
                    Pengaturan Identitas Portal
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Nama Portal</label>
                      <input type="text" value={localSettings?.portalName || ''} onChange={e => setLocalSettings({...localSettings, portalName: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Subtitle Portal</label>
                      <input type="text" value={localSettings?.portalSubtitle || ''} onChange={e => setLocalSettings({...localSettings, portalSubtitle: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Nama Kabinet</label>
                      <input type="text" value={localSettings?.cabinetName || ''} onChange={e => setLocalSettings({...localSettings, cabinetName: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Logo Departemen (Kiri)</label>
                      <input type="file" accept="image/*" onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          setLocalSettings({...localSettings, logoUrl: URL.createObjectURL(e.target.files[0])});
                        }
                      }} className="w-full text-xs" />
                      {localSettings.logoUrl && <img src={localSettings.logoUrl} alt="Logo Preview" className="w-16 h-16 object-contain mt-2" />}
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Logo HMIF (Kanan)</label>
                      <input type="file" accept="image/*" onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          setLocalSettings({...localSettings, hmifLogoUrl: URL.createObjectURL(e.target.files[0])});
                        }
                      }} className="w-full text-xs" />
                      {localSettings.hmifLogoUrl && <img src={localSettings.hmifLogoUrl} alt="Logo HMIF Preview" className="w-16 h-16 object-contain mt-2" />}
                    </div>
                    <button onClick={handleSaveIdentity} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold">Simpan Perubahan</button>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-rose-200 dark:border-rose-900/50 shadow-sm overflow-hidden mt-6">
                <div className="p-6">
                  <h3 className="font-bold text-rose-600 dark:text-rose-400 text-sm flex items-center gap-2 mb-2">
                    <Save className="w-4 h-4 text-rose-500" />
                    Migrasi Database (Developer)
                  </h3>
                  <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                    Fitur ini digunakan untuk memindahkan data simulasi awal ke Firebase Firestore. Hanya gunakan tombol ini saat Firebase Anda masih kosong. Jangan ditekan berkali-kali jika data sudah masuk.
                  </p>
                  <button onClick={async () => {
                    if (window.confirm("Apakah Anda yakin ingin mengisi database Firebase dengan mock data? Ini mungkin memakan waktu beberapa detik.")) {
                      onTriggerNotification("Memulai migrasi ke Firebase...");
                      try {
                        const utils = await import('../firebaseUtils');
                        const mockData = await import('../mockData');
                        await utils.seedDatabaseIfEmpty({
                          'submissions': mockData.initialSubmissions,
                          'residents': mockData.initialResidents,
                          'logs': mockData.initialLogs,
                          'tasks': mockData.initialTasks,
                          'videos': mockData.initialVideos,
                          'campaigns': mockData.initialCampaigns,
                          'mous': mockData.initialMous,
                          'publications': mockData.initialPublications,
                          'templates': mockData.initialTemplates,
                          'archives': mockData.initialArchives,
                          'events': mockData.initialEvents,
                          'warga': mockData.initialWarga,
                          'admins': mockData.initialAdmins
                        });
                        onTriggerNotification("Migrasi data Firebase selesai! Silakan refresh halaman.");
                      } catch(e) {
                        onTriggerNotification("Terjadi kesalahan saat migrasi database.");
                      }
                    }
                  }} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-colors">
                    Upload Mock Data ke Firebase
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Submissions Section (Warga and Admin) */}
          {activeSection === 'submissions' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                  <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-2">
                    <ClipboardList className="w-4 h-4 text-blue-500" />
                    Riwayat Pengajuan Saya
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Daftar semua pengajuan design, video, publikasi, maupun broadcast yang pernah Anda buat.</p>
                </div>
                
                <div className="p-0">
                  {submissions.filter(s => s.sender.toLowerCase().includes(currentUser.name.toLowerCase())).length === 0 ? (
                    <div className="p-8 text-center">
                      <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center mx-auto mb-3">
                        <ClipboardList className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                      </div>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Belum Ada Pengajuan</p>
                      <p className="text-xs text-slate-500 mt-1">Anda belum pernah membuat pengajuan layanan ke Medkominfo.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {submissions.filter(s => s.sender.toLowerCase().includes(currentUser.name.toLowerCase())).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map(sub => (
                        <div key={sub.id} className="p-5 hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors flex items-start gap-4">
                          <div className={`p-2.5 rounded-xl shrink-0 ${
                            sub.jenisPengajuan === 'Design' ? 'bg-blue-100 text-blue-700' :
                            sub.jenisPengajuan === 'Konten Video' ? 'bg-emerald-100 text-emerald-700' :
                            sub.jenisPengajuan === 'Publikasi Konten' ? 'bg-purple-100 text-purple-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            <ClipboardList className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-4 mb-1">
                              <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                                {sub.programKerja}
                              </h4>
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold whitespace-nowrap ${
                                sub.status === 'Queue' ? 'bg-slate-800 text-slate-400' :
                                sub.status === 'Approved' ? 'bg-blue-100 text-blue-700' :
                                sub.status === 'Published' ? 'bg-emerald-100 text-emerald-700' :
                                'bg-amber-100 text-amber-700'
                              }`}>
                                {sub.status}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-slate-500 font-medium">
                              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                                {sub.jenisPengajuan}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {new Date(sub.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                              </span>
                              {sub.deadline && (
                                <span className="flex items-center gap-1 text-rose-600">
                                  Tenggat: {sub.deadline}
                                </span>
                              )}
                            </div>
                            {sub.notes && (
                              <p className="mt-3 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 line-clamp-2 leading-relaxed">
                                "{sub.notes}"
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}


          {/* Appearance Section */}
          {activeSection === 'appearance' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-6">
                  <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-2 mb-6">
                    <Sparkles className="w-4 h-4 text-blue-500" />
                    Preferensi Tampilan
                  </h3>
                  
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">Mode Gelap (Dark Mode)</div>
                      <p className="text-xs text-slate-500 max-w-md leading-relaxed">
                        Aktifkan mode gelap agar tampilan lebih nyaman di mata pada kondisi kurang cahaya.
                      </p>
                    </div>
                    <button 
                      onClick={onToggleTheme}
                      className={`transition-colors rounded-full shrink-0 ${isDarkMode ? 'text-blue-600' : 'text-slate-300'}`}
                    >
                      {isDarkMode ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Notifications Section */}
          {activeSection === 'notifications' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-6">
                  <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-2 mb-6">
                    <Bell className="w-4 h-4 text-blue-500" />
                    Preferensi Notifikasi
                  </h3>

                  <div className="space-y-6">
                    
                    {/* In-App Alerts */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">In-App Alerts</div>
                        <p className="text-xs text-slate-500 max-w-md leading-relaxed">
                          Tampilkan notifikasi toast di dalam aplikasi (pojok kanan atas) saat ada pembaruan data, tugas baru, atau status yang berubah.
                        </p>
                      </div>
                      <button 
                        onClick={() => toggleNotif('inApp')}
                        className={`transition-colors rounded-full shrink-0 ${notifSettings.inApp ? 'text-blue-600' : 'text-slate-300'}`}
                      >
                        {notifSettings.inApp ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10" />}
                      </button>
                    </div>

                    <hr className="border-slate-200 dark:border-slate-800" />

                    {/* Notifikasi WhatsApp */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">Notifikasi WhatsApp (PIC)</div>
                        <p className="text-xs text-slate-500 max-w-md leading-relaxed">
                          Kirim pesan WhatsApp otomatis ke nomor PIC terkait saat ada penugasan baru (Design / Video) atau H-1 sebelum tenggat waktu.
                        </p>
                        {notifSettings.whatsapp && (
                          <div className="inline-flex items-center gap-1.5 mt-2 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md text-[10px] font-bold border border-emerald-100">
                            <CheckCircle2 className="w-3 h-3" /> Aktif untuk peringatan tugas
                          </div>
                        )}
                      </div>
                      <button 
                        onClick={() => toggleNotif('whatsapp')}
                        className={`transition-colors rounded-full shrink-0 ${notifSettings.whatsapp ? 'text-emerald-500' : 'text-slate-300'}`}
                      >
                        {notifSettings.whatsapp ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10" />}
                      </button>
                    </div>

                    <hr className="border-slate-200 dark:border-slate-800" />

                    {/* Notifikasi Broadcast */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">Peringatan Broadcast</div>
                        <p className="text-xs text-slate-500 max-w-md leading-relaxed">
                          Kirim pengingat atau peringatan validasi ke WhatsApp PIC sebelum kampanye Broadcast / Publikasi dikirim.
                        </p>
                      </div>
                      <button 
                        onClick={() => toggleNotif('broadcast')}
                        className={`transition-colors rounded-full shrink-0 ${notifSettings.broadcast ? 'text-blue-600' : 'text-slate-300'}`}
                      >
                        {notifSettings.broadcast ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10" />}
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

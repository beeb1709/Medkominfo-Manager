import React from 'react';
import { AppSettings } from '../types';
import { 
  Database,
  LayoutDashboard, 
  TableProperties, 
  Link2, 
  Users, 
  Paintbrush, 
  Video, 
  CalendarDays, 
  Send, 
  FileText, 
  Calendar, 
  FolderHeart, 
  Archive,
  Settings,
  HelpCircle,
  PlusCircle,
  Sparkles,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  appSettings?: AppSettings;
  isSidebarOpen?: boolean;
  onCloseSidebar?: () => void;

  isDarkMode?: boolean;
  onToggleTheme?: () => void;

  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenNewProject?: () => void;
  userRole: 'admin' | 'public';
  onChangeRole: (role: 'admin' | 'public') => void;
  currentUser: { id?: string; name: string; email?: string; role: 'admin' | 'public'; nim?: string; jabatan?: string; avatarUrl?: string } | null;
  onLogout: () => void;
  onSelectCurrentUserProfile?: () => void;
}

export default function Sidebar({
  appSettings, 
  isSidebarOpen,
  onCloseSidebar,
  
 
 
  
  activeTab, 
  setActiveTab, 
  onOpenNewProject,
  userRole,
  onChangeRole,
  currentUser,
  onLogout,
  onSelectCurrentUserProfile
}: SidebarProps) {
  

  const adminMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'responses', label: 'Responses', icon: TableProperties },
    { id: 'links', label: 'Important Links', icon: Link2 },
    { id: 'residents', label: 'Medkom Residents', icon: Users },
    { id: 'design', label: 'Design', icon: Paintbrush },
    { id: 'video', label: 'Video Content', icon: Video },
    { id: 'publication', label: 'Content Publication', icon: CalendarDays },
    { id: 'broadcast', label: 'Broadcast', icon: Send },
    { id: 'mou', label: 'MoU', icon: FileText },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'archive', label: 'Archive', icon: Archive },
    { id: 'public_portal', label: 'Portal Publik Warga', icon: Sparkles },
  ];

  const publicMenuItems = [
    { id: 'public_portal', label: 'Portal Publik Warga', icon: Sparkles },
    { id: 'links', label: 'Important Links', icon: Link2 },
  ];

  const menuItems = userRole === 'admin' ? adminMenuItems : publicMenuItems;

  return (
    
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseSidebar}
        />
      )}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-slate-900 dark:bg-slate-950 backdrop-blur-2xl border-r border-slate-800 flex flex-col shrink-0 z-50 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)] transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>

      {/* Brand Logo Header */}
      <div className="p-6 border-b border-slate-800 relative overflow-hidden"><div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-bl-full pointer-events-none blur-2xl"></div>
        <div className="flex items-center gap-3">
          {appSettings?.logoUrl ? (
            <img src={appSettings.logoUrl} alt="Logo Dept" className="w-10 h-10 object-contain rounded-xl" />
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md shadow-blue-500/20">
              M
            </div>
          )}
          {appSettings?.hmifLogoUrl && (
            <img src={appSettings.hmifLogoUrl} alt="Logo HMIF" className="w-10 h-10 object-contain rounded-xl" />
          )}
          <div>
            <h2 className="font-extrabold text-white tracking-tight text-[15px] font-display leading-tight">{appSettings?.portalSubtitle || 'Medkominfo 2026'}</h2>
            <p className="text-[11px] text-slate-500 font-medium">Operations Portal</p>
          </div>
        </div>
      </div>

      {/* Role Switcher Pill Toggle */}
      <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/50">
        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 px-1">
          Pilih Akses Portal / Mode
        </label>
        <div className="flex bg-slate-800 p-1 rounded-xl gap-1 border border-slate-700">
          <button
            onClick={() => {
              if (currentUser?.role === 'public') {
                alert('Akses Admin memerlukan Google Sign-In Pengurus. Anda akan diarahkan ke halaman login Pengurus.');
                onLogout();
              } else {
                onChangeRole('admin');
                setActiveTab('dashboard');
              }
            }}
            className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${
              userRole === 'admin' 
                ? 'bg-slate-900 text-white shadow-xs border border-slate-800' 
                : 'text-slate-500 hover:text-slate-200'
            }`}
          >
            ⚙️ Admin
          </button>
          <button
            onClick={() => {
              onChangeRole('public');
              setActiveTab('public_portal');
            }}
            className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${
              userRole === 'public' 
                ? 'bg-blue-600 text-white shadow-xs' 
                : 'text-slate-500 hover:text-slate-200'
            }`}
          >
            👤 Warga HMIF
          </button>
        </div>
      </div>

      {/* Main Menu Nav Links */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5 scrollbar-hide">
        {userRole === 'public' ? (
          <>
            <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
              Layanan Publik
            </span>
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); if(onCloseSidebar) onCloseSidebar(); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <IconComponent className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </>
        ) : (
          <>
            <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
              Operations
            </span>
            {menuItems.filter(item => ['dashboard', 'responses', 'links', 'residents', 'public_portal'].includes(item.id)).map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id || (item.id === 'residents' && activeTab === 'profile');
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); if(onCloseSidebar) onCloseSidebar(); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <IconComponent className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}

            <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest block pt-4 mb-2">
              Production
            </span>
            {menuItems.filter(item => !['dashboard', 'responses', 'links', 'residents', 'public_portal'].includes(item.id)).map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); if(onCloseSidebar) onCloseSidebar(); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <IconComponent className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </>
        )}

        {/* Action Button */}
        <div className="pt-4">
          <button 
            onClick={() => { if(userRole === 'public') setActiveTab('public_portal'); else onOpenNewProject(); if(onCloseSidebar) onCloseSidebar(); }}
            className="w-full bg-[#1e293b] hover:bg-slate-800 text-white py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <PlusCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            {userRole === 'public' ? 'Ajukan Layanan' : 'New Project'}
          </button>
        </div>
      </nav>

      {/* Active User Session details & Log Out button */}
      {currentUser && (
        <>
      <div className="px-4 py-3.5 border-t border-slate-700/80 bg-slate-800/50 flex items-center justify-between gap-2.5">
          <button 
            onClick={() => {
              if (onSelectCurrentUserProfile && currentUser.role === 'admin') {
                onSelectCurrentUserProfile();
              }
            }}
            className={`flex items-center gap-2.5 truncate flex-1 text-left ${currentUser.role === 'admin' ? 'hover:opacity-80 cursor-pointer' : 'cursor-default'}`}
          >
            {currentUser.avatarUrl ? (
              <img src={currentUser.avatarUrl} alt="Avatar" className="w-8 h-8 rounded-xl object-cover shrink-0 shadow-sm" />
            ) : (
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black text-white shrink-0 uppercase shadow-inner ${
                currentUser.role === 'admin' ? 'bg-indigo-600' : 'bg-blue-600'
              }`}>
                {currentUser.name.charAt(0)}
              </div>
            )}
            <div className="truncate">
              <span className="text-[11px] font-bold text-slate-200 block leading-tight truncate">{currentUser.name}</span>
              <span className="text-[9px] text-slate-400 font-bold block truncate">
                {currentUser.role === 'admin' ? (currentUser.jabatan || currentUser.email || 'Admin') : (currentUser.jabatan || 'Warga HMIF')}
              </span>
            </div>
          </button>
          <button 
            onClick={onLogout}
            title="Log Out"
            className="p-1.5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 rounded-lg transition-colors shrink-0"
          >
            <LogOut className="w-4.5 h-4.5" />
          </button>
        </div>
      </>)}

      {/* Footer Controls */}
      <div className="p-4 border-t border-slate-700 bg-slate-900 space-y-1">
        

        <button 
          onClick={() => { setActiveTab('settings'); if(onCloseSidebar) onCloseSidebar(); }}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'settings' 
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' 
              : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Settings className={`w-4 h-4 ${activeTab === 'settings' ? 'text-white' : 'text-slate-400'}`} />
          Pengaturan
        </button>
        <button 
          onClick={() => { setActiveTab('links'); if(onCloseSidebar) onCloseSidebar(); }}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'links'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
              : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <HelpCircle className={`w-4 h-4 ${activeTab === 'links' ? 'text-white' : 'text-slate-400'}`} />
          Bantuan
        </button>
      </div>
    </aside>
    </>
  );
}

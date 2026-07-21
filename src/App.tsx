import React, { useState, useEffect, useMemo } from 'react';

import { 
  Zap, 
  HelpCircle, 
  PlusCircle, 
  Settings,
  Sparkles,
  RefreshCw,
  Bell
} from 'lucide-react';

// Import Types
import { 
  Submission, 
  Resident, 
  OperationalLog, 
  TaskItem, 
  VideoProject, 
  BroadcastCampaign, 
  MouAgreement, 
  PublicationItem, 
  BrandTemplate, 
  ArchiveItem,
  CalendarEvent
} from './types';

// Import Mock Data
import {
  initialSubmissions,
  initialResidents,
  initialLogs,
  initialTasks,
  initialVideos,
  initialCampaigns,
  initialMous,
  initialPublications,
  initialTemplates,
  initialArchives,
  initialEvents,
  initialAdmins
} from './mockData';

// Import Firebase Utils
import { subscribeToCollection, syncArrayToFirestore, mapKeyToCollection, seedDatabaseIfEmpty, saveDocument } from './firebaseUtils';

// Import Modular Tab Components
import Sidebar from './components/Sidebar';
import DashboardTab from './components/DashboardTab';
import ResponsesTab from './components/ResponsesTab';
import ImportantLinksTab from './components/ImportantLinksTab';
import ResidentsTab from './components/ResidentsTab';
import ProfileTab from './components/ProfileTab';
import DesignTab from './components/DesignTab';
import VideoTab from './components/VideoTab';
import PublicationTab from './components/PublicationTab';
import BroadcastTab from './components/BroadcastTab';
import MouTab from './components/MouTab';
import CalendarTab from './components/CalendarTab';
import ArchiveTab from './components/ArchiveTab';
import PublicPortalTab from './components/PublicPortalTab';
import SettingsTab from './components/SettingsTab';
import LoginPage from './components/LoginPage';

export default function App() {
  const [currentUser, setCurrentUser] = useState<{ id?: string; name: string; email?: string; role: 'admin' | 'public'; nim?: string; jabatan?: string; avatarUrl?: string } | null>(() => {
    const saved = localStorage.getItem('medkom_active_session');
    if (!saved) return null;
    const parsedSession = JSON.parse(saved);
    if (parsedSession.role === 'admin' && !parsedSession.jabatan) {
        const adminMatch = initialAdmins.find((a: any) => 
            (parsedSession.id && a.id === parsedSession.id) || 
            (!parsedSession.id && a.name === parsedSession.name) ||
            (!parsedSession.id && a.nim === parsedSession.nim)
        );
        if (adminMatch) {
            parsedSession.jabatan = adminMatch.jabatan;
            parsedSession.id = adminMatch.id;
        }
    }
    return parsedSession;
  });

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      const adminMatch = initialAdmins.find((a: any) => 
        (currentUser.id && a.id === currentUser.id) || 
        (!currentUser.id && a.name === currentUser.name) ||
        (!currentUser.id && a.nim === currentUser.nim)
      );
      if (adminMatch && (currentUser.jabatan !== adminMatch.jabatan || currentUser.id !== adminMatch.id)) {
        const updatedUser = { ...currentUser, jabatan: adminMatch.jabatan, id: adminMatch.id };
        setCurrentUser(updatedUser);
        localStorage.setItem('medkom_active_session', JSON.stringify(updatedUser));
      }
    }
  }, [currentUser]);
  
  const [activeTab, setActiveTab] = useState<string>(() => {
    const saved = localStorage.getItem('medkom_active_session');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.role === 'public' ? 'public_portal' : 'dashboard';
    }
    return 'public_portal';
  });

  const [userRole, setUserRole] = useState<'admin' | 'public'>(() => {
    const saved = localStorage.getItem('medkom_active_session');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.role;
    }
    return 'public';
  });


  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [appSettings, setAppSettings] = useState(() => {
    const saved = localStorage.getItem('medkom_app_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        cabinetName: parsed.cabinetName || 'Kabinet Sinergi Digital',
        portalName: parsed.portalName || 'HMIF UPNVJ',
        portalSubtitle: parsed.portalSubtitle || 'Medkominfo Hub 2026',
        logoUrl: parsed.logoUrl || null,
        hmifLogoUrl: parsed.hmifLogoUrl || null
      };
    }
    return {
      cabinetName: 'Kabinet Sinergi Digital',
      portalName: 'HMIF UPNVJ',
      portalSubtitle: 'Medkominfo Hub 2026',
      logoUrl: null,
      hmifLogoUrl: null
    };
  });

  const handleUpdateAppSettings = (newSettings) => {
    setAppSettings(newSettings);
    localStorage.setItem('medkom_app_settings', JSON.stringify(newSettings));
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const [showNotification, setShowNotification] = useState<string | null>(null);
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);

  // Core State Engines
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [logs, setLogs] = useState<OperationalLog[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [videos, setVideos] = useState<VideoProject[]>([]);
  const [campaigns, setCampaigns] = useState<BroadcastCampaign[]>([]);
  const [mous, setMous] = useState<MouAgreement[]>([]);
  const [publications, setPublications] = useState<PublicationItem[]>([]);
  const [templates, setTemplates] = useState<BrandTemplate[]>([]);
  const [archives, setArchives] = useState<ArchiveItem[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  // Firebase Sync Hook
  useEffect(() => {
    const unsubSubmissions = subscribeToCollection('submissions', setSubmissions);
    const unsubResidents = subscribeToCollection('residents', setResidents);
    const unsubLogs = subscribeToCollection('logs', setLogs);
    const unsubTasks = subscribeToCollection('tasks', setTasks);
    const unsubVideos = subscribeToCollection('videos', setVideos);
    const unsubCampaigns = subscribeToCollection('campaigns', setCampaigns);
    const unsubMous = subscribeToCollection('mous', setMous);
    const unsubPublications = subscribeToCollection('publications', setPublications);
    const unsubTemplates = subscribeToCollection('templates', setTemplates);
    const unsubArchives = subscribeToCollection('archives', setArchives);
    const unsubEvents = subscribeToCollection('events', setEvents);

    return () => {
      unsubSubmissions();
      unsubResidents();
      unsubLogs();
      unsubTasks();
      unsubVideos();
      unsubCampaigns();
      unsubMous();
      unsubPublications();
      unsubTemplates();
      unsubArchives();
      unsubEvents();
    };
  }, []);

  // Synchronized Calendar Events with latest PICs from tasks/videos/publications/campaigns/submissions
  const mappedEvents = useMemo(() => {
    return events
      .filter((e) => {
        // Hapus event jika entitas aslinya sudah selesai atau tidak ada (di-archive/delete)
        if (e.entityId) {
          if (e.type === 'design') {
            const t = tasks.find(x => x.id === e.entityId);
            if (!t || t.status === 'Done') return false;
          }
          if (e.type === 'video') {
            const v = videos.find(x => x.id === e.entityId);
            if (!v || v.status === 'Done') return false;
          }
          if (e.type === 'publication') {
            const p = publications.find(x => x.id === e.entityId);
            if (!p || p.status === 'Published') return false;
          }
          if (e.type === 'broadcast') {
            const c = campaigns.find(x => x.id === e.entityId);
            if (!c || c.status === 'Sent' || c.status === 'Cancelled') return false;
          }
        } else {
          // Fallback legacy filter (substring match)
          const cleanTitle = e.title.replace(/^(Design|Desain|Video|Publikasi|Broadcast|Campaign):\s*/i, '').trim().toLowerCase();
          if (cleanTitle) {
            if (e.type === 'design') {
              const t = tasks.find(x => x.title.toLowerCase().includes(cleanTitle) || cleanTitle.includes(x.title.toLowerCase()));
              if (!t || t.status === 'Done') return false;
            }
            if (e.type === 'video') {
              const v = videos.find(x => x.title.toLowerCase().includes(cleanTitle) || cleanTitle.includes(x.title.toLowerCase()));
              if (!v || v.status === 'Done') return false;
            }
          }
        }
        return true;
      })
      .map((e) => {
      // 1. Try matching by entityId
      if (e.entityId) {
        if (e.type === 'design') {
          const t = tasks.find(x => x.id === e.entityId);
          if (t) return { ...e, pic: t.pic };
        }
        if (e.type === 'video') {
          const v = videos.find(x => x.id === e.entityId);
          if (v) return { ...e, pic: v.pic };
        }
        if (e.type === 'publication') {
          const p = publications.find(x => x.id === e.entityId);
          if (p) return { ...e, pic: p.pic };
        }
        if (e.type === 'broadcast') {
          const c = campaigns.find(x => x.id === e.entityId);
          if (c) return { ...e, pic: c.pic };
        }
      }

      // 2. Fallback to name/title/programKerja substring matching (for backward compatibility / legacy localstorage data)
      const cleanTitle = e.title.replace(/^(Design|Desain|Video|Publikasi|Broadcast|Campaign):\s*/i, '').trim().toLowerCase();
      if (cleanTitle) {
        if (e.type === 'design') {
          const t = tasks.find(x => x.title.toLowerCase().includes(cleanTitle) || cleanTitle.includes(x.title.toLowerCase()));
          if (t) return { ...e, pic: t.pic };
        }
        if (e.type === 'video') {
          const v = videos.find(x => x.title.toLowerCase().includes(cleanTitle) || cleanTitle.includes(x.title.toLowerCase()));
          if (v) return { ...e, pic: v.pic };
        }
        if (e.type === 'publication') {
          const p = publications.find(x => x.title.toLowerCase().includes(cleanTitle) || cleanTitle.includes(x.title.toLowerCase()));
          if (p) return { ...e, pic: p.pic };
        }
        if (e.type === 'broadcast') {
          const c = campaigns.find(x => x.name.toLowerCase().includes(cleanTitle) || cleanTitle.includes(x.name.toLowerCase()));
          if (c) return { ...e, pic: c.pic };
        }

        // Also look in submissions for picHumas
        const sub = submissions.find(s => s.programKerja && (s.programKerja.toLowerCase().includes(cleanTitle) || cleanTitle.includes(s.programKerja.toLowerCase())));
        if (sub && sub.picHumas) {
          return { ...e, pic: sub.picHumas };
        }
      }

      return e;
    });
  }, [events, tasks, videos, publications, campaigns, submissions]);

  // Save changes wrapper (Sync to Firebase)
  const saveState = (key: string, data: any, setter: Function) => {
    let oldData: any[] = [];
    if (key === 'medkom_submissions_db') oldData = submissions;
    else if (key === 'medkom_residents_db_v5') oldData = residents;
    else if (key === 'medkom_logs_db_v5') oldData = logs;
    else if (key === 'medkom_tasks_db_v5') oldData = tasks;
    else if (key === 'medkom_videos_db_v5') oldData = videos;
    else if (key === 'medkom_campaigns_db_v5') oldData = campaigns;
    else if (key === 'medkom_mous_db_v5') oldData = mous;
    else if (key === 'medkom_publications_db_v5') oldData = publications;
    else if (key === 'medkom_templates_db_v5') oldData = templates;
    else if (key === 'medkom_archives_db_v5') oldData = archives;
    else if (key === 'medkom_calendar_db_v5') oldData = events;

    // Optimistic UI update
    setter(data);

    // Sync array to Firestore
    const collectionName = mapKeyToCollection(key);
    syncArrayToFirestore(collectionName, oldData, data);
  };

  // Sync submission to Google Sheets via backend API
  const syncToGoogleSheets = (submission: Submission) => {
    fetch('/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submission),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) console.log(`[Sheets Sync] ${submission.id} berhasil.`);
        else console.warn(`[Sheets Sync] ${submission.id} gagal:`, data.message);
      })
      .catch(err => console.error(`[Sheets Sync] Error:`, err));
  };

  // Toast Handler
  const triggerNotification = (message: string) => {
    setShowNotification(message);
    setTimeout(() => {
      setShowNotification(null);
    }, 4000);
  };

  // Navigation handlers
  const handleSelectResidentForProfile = (res: Resident) => {
    setSelectedResident(res);
    setActiveTab('profile');
    triggerNotification(`Displaying profile detail card for: ${res.name}`);
  };

  const handleOpenNewProjectForm = () => {
    setActiveTab('responses');
    triggerNotification("Form modal initialized. Fill in submission details.");
  };

  const handleLogout = () => {
    localStorage.removeItem('medkom_active_session');
    setCurrentUser(null);
    setUserRole('public');
    setActiveTab('public_portal');
    triggerNotification("Berhasil keluar dari sesi.");
  };

  // Auth gate check - Render LoginPage if there is no authenticated session
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900">
        {showNotification && (
          <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-4 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 animate-bounce">
            <Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
            <span className="font-semibold text-xs">{showNotification}</span>
          </div>
        )}
        <LoginPage appSettings={appSettings} 
          onLogin={(user) => {
            setCurrentUser(user);
            localStorage.setItem('medkom_active_session', JSON.stringify(user));
            setUserRole(user.role);
            setActiveTab(user.role === 'public' ? 'public_portal' : 'dashboard');
            triggerNotification(`Selamat datang, ${user.name}!`);
          }}
          userEmail="habibiewibisono17@gmail.com"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mesh text-slate-800 dark:text-slate-200 font-sans flex overflow-hidden relative">
      
      {/* Dynamic Toast Notifications */}
      {showNotification && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-4 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 animate-bounce">
          <Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
          <span className="font-semibold text-xs">{showNotification}</span>
        </div>
      )}

      {/* Main Sidebar Navigation */}
      <Sidebar 
        appSettings={appSettings}
        isSidebarOpen={isSidebarOpen} onCloseSidebar={() => setIsSidebarOpen(false)} 
        
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'profile') setSelectedResident(null);
        }} 
        onOpenNewProject={handleOpenNewProjectForm}
        userRole={userRole}
        onChangeRole={(role) => {
          setUserRole(role);
          triggerNotification(`Switched portal mode to: ${role === 'admin' ? 'Pengurus Medkom (Admin)' : 'Anggota HMIF (Public Portal)'}`);
        }}
        currentUser={currentUser}
        onLogout={handleLogout}
        onSelectCurrentUserProfile={() => {
          if (currentUser) {
            const res = residents.find(r => r.name === currentUser.name);
            if (res) {
              handleSelectResidentForProfile(res);
            } else {
              triggerNotification('Profile not found in Medkom Residents.');
            }
          }
        }}
      />


      {/* Main Content Workspace viewport */}
      <main className="flex-1 overflow-y-auto h-screen relative z-10 flex flex-col dark:bg-slate-950">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {appSettings?.logoUrl ? (
              <img src={appSettings.logoUrl} alt="Logo" className="w-8 h-8 object-contain rounded-lg" />
            ) : (
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 dark:from-blue-600 dark:to-indigo-700 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-md">
                M
              </div>
            )}
            <h2 className="font-extrabold text-slate-900 dark:text-white tracking-tight text-[13px] font-display">Medkominfo 2026</h2>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -mr-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
        </div>
        
        <div className="p-4 lg:p-8 flex-1 w-full max-w-full overflow-x-hidden">

        
        {/* Render Active View Tab */}
        <div className="max-w-6xl mx-auto space-y-6">
          
          {activeTab === 'dashboard' && (
            <DashboardTab 
              logs={logs}
              tasks={tasks}
              videos={videos}
              campaigns={campaigns}
              mous={mous}
              publications={publications}
              archives={archives}
              onTriggerNotification={triggerNotification}
              onNavigateToTab={setActiveTab}
              onOpenNewProject={handleOpenNewProjectForm}
            />
          )}

          {activeTab === 'responses' && (
            <ResponsesTab 
              submissions={submissions}
              onAddSubmission={(newSub) => {
                const updated = [newSub, ...submissions];
                saveState('medkom_submissions_db', updated, setSubmissions);
                // Sync ke Google Sheets via backend
                syncToGoogleSheets(newSub);
                // Prepend log to operations log too!
                const newLog: OperationalLog = {
                  id: `LOG-0${logs.length + 1}`,
                  task: `New request: ${newSub.jenisPengajuan} from ${newSub.sender}`,
                  department: newSub.department,
                  jenisPengajuan: newSub.jenisPengajuan,
                  status: 'Pending',
                  time: 'Just Now',
                  entityId: newSub.id
                };
                saveState('medkom_logs_db_v5', [newLog, ...logs], setLogs);
              }}
              onUpdateSubmission={(updatedSub) => {
                const index = submissions.findIndex(s => s.id === updatedSub.id);
                if (index !== -1) {
                  const copy = [...submissions];
                  copy[index] = updatedSub;
                  saveState('medkom_submissions_db', copy, setSubmissions);
                  
                  const logIndex = logs.findIndex(l => l.entityId === updatedSub.id);
                  let logStatus = 'In Progress';
                  if (updatedSub.status === 'Queue') logStatus = 'Pending';
                  else if (updatedSub.status === 'Designing' || updatedSub.status === 'Revision') logStatus = 'In Progress';
                  else if (updatedSub.status === 'Approved' || updatedSub.status === 'Published') logStatus = 'Completed';
                  
                  if (logIndex !== -1) {
                    const newLogs = [...logs];
                    newLogs[logIndex] = { ...newLogs[logIndex], status: logStatus as any };
                    saveState('medkom_logs_db_v5', newLogs, setLogs);
                  } else {
                    const newLog: OperationalLog = {
                      id: `LOG-0${logs.length + 1}`,
                      task: `${updatedSub.status}: ${updatedSub.jenisPengajuan}`,
                      department: updatedSub.department,
                      jenisPengajuan: updatedSub.jenisPengajuan,
                      status: logStatus as any,
                      time: 'Just Now',
                      entityId: updatedSub.id
                    };
                    saveState('medkom_logs_db_v5', [newLog, ...logs], setLogs);
                  }
                }
              }}
              onDeleteSubmission={(id) => {
                const subToArchive = submissions.find(s => s.id === id);
                if (subToArchive) {
                  const newArchive: ArchiveItem = {
                    id: subToArchive.id,
                    name: `Request: ${subToArchive.jenisPengajuan} from ${subToArchive.sender}`,
                    category: 'Submission',
                    dateCompleted: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
                    pic: subToArchive.picHumas || 'Unassigned',
                    originalData: subToArchive
                  };
                  saveState('medkom_archives_db_v5', [newArchive, ...archives], setArchives);
                  
                  const newLog: OperationalLog = {
                    id: `LOG-0${logs.length + 1}`,
                    task: `Archived Request: ${subToArchive.jenisPengajuan}`,
                    department: subToArchive.department || '-',
                    jenisPengajuan: 'Submission',
                    status: 'Cancelled',
                    time: 'Just Now',
                    entityId: subToArchive.id
                  };
                  saveState('medkom_logs_db_v5', [newLog, ...logs], setLogs);
                }
                const filtered = submissions.filter(s => s.id !== id);
                saveState('medkom_submissions_db', filtered, setSubmissions);
              }}
              onTriggerNotification={triggerNotification}
            />
          )}

          {activeTab === 'links' && (
            <ImportantLinksTab onTriggerNotification={triggerNotification} />
          )}

          {activeTab === 'residents' && (
            <ResidentsTab 
              residents={residents}
              onTriggerNotification={triggerNotification}
              onSelectResidentForProfile={handleSelectResidentForProfile}
              onDeleteResident={(id) => {
                const filtered = residents.filter(r => r.id !== id);
                saveState('medkom_residents_db_v5', filtered, setResidents);
              }}
              onAddResident={(newRes) => {
                const updated = [...residents, newRes];
                saveState('medkom_residents_db_v5', updated, setResidents);
              }}
            />
          )}

          {activeTab === 'profile' && selectedResident && (
            <ProfileTab 
              resident={selectedResident}
              tasks={tasks}
              videos={videos}
              publications={publications}
              campaigns={campaigns}
              mous={mous}
              onBackToRoster={() => {
                setActiveTab(userRole === 'admin' ? 'residents' : 'public_portal');
                setSelectedResident(null);
              }}
              onUpdateResident={(updatedResident) => {
                const oldResident = residents.find(r => r.id === updatedResident.id);
                const updatedResidents = residents.map(r => r.id === updatedResident.id ? updatedResident : r);
                saveState('medkom_residents_db_v5', updatedResidents, setResidents);
                setSelectedResident(updatedResident);

                // Also update admin users to prevent reverting
                if (updatedResident.adminId) {
                  const savedAdmins = localStorage.getItem('medkom_admin_users');
                  if (savedAdmins) {
                    const admins = JSON.parse(savedAdmins);
                    const updatedAdmins = admins.map((a: any) => {
                      if (a.id === updatedResident.adminId) {
                        return { ...a, name: updatedResident.name };
                      }
                      return a;
                    });
                    localStorage.setItem('medkom_admin_users', JSON.stringify(updatedAdmins));
                  }
                }
                
                // Update references in all databases if name changed
                if (oldResident && oldResident.name !== updatedResident.name) {
                  const oldName = oldResident.name;
                  const newName = updatedResident.name;
                  
                  const updatedVideos = videos.map(v => v.pic === oldName ? { ...v, pic: newName } : v);
                  saveState('medkom_videos_db_v5', updatedVideos, setVideos);

                  const updatedTasks = tasks.map(t => t.pic === oldName ? { ...t, pic: newName } : t);
                  saveState('medkom_tasks_db_v5', updatedTasks, setTasks);

                  const updatedPublications = publications.map(p => p.pic === oldName ? { ...p, pic: newName } : p);
                  saveState('medkom_publications_db_v5', updatedPublications, setPublications);

                  const updatedCampaigns = campaigns.map(c => c.pic === oldName ? { ...c, pic: newName } : c);
                  saveState('medkom_campaigns_db_v5', updatedCampaigns, setCampaigns);
                }
              }}
              onTriggerNotification={triggerNotification}
            />
          )}

          {activeTab === 'design' && (
            <DesignTab 
              currentUser={currentUser}
              tasks={tasks}
              residents={residents}
              onAddTask={(t) => {
                const updated = [...tasks, t];
                saveState('medkom_tasks_db_v5', updated, setTasks);
                // Write into logs
                const newLog: OperationalLog = {
                  id: `LOG-0${logs.length + 1}`,
                  task: `Assigned: ${t.title} to ${t.pic}`,
                  department: t.department || '-',
                  jenisPengajuan: 'Design',
                  status: 'In Progress',
                  time: 'Just Now',
                  entityId: t.id
                };
                saveState('medkom_logs_db_v5', [newLog, ...logs], setLogs);
              }}
              onUpdateTask={(updatedTask) => {
                const index = tasks.findIndex(t => t.id === updatedTask.id);
                if (index !== -1) {
                  const copy = [...tasks];
                  copy[index] = updatedTask;
                  saveState('medkom_tasks_db_v5', copy, setTasks);

                  const logIndex = logs.findIndex(l => l.entityId === updatedTask.id);
                  let logStatus = 'In Progress';
                  if (updatedTask.status === 'To Do') logStatus = 'Pending';
                  else if (updatedTask.status === 'In Progress' || updatedTask.status === 'Review') logStatus = 'In Progress';
                  else if (updatedTask.status === 'Done') logStatus = 'Completed';
                  
                  if (logIndex !== -1) {
                    const newLogs = [...logs];
                    newLogs[logIndex] = { ...newLogs[logIndex], status: logStatus as any, task: `${updatedTask.status}: ${updatedTask.title}` };
                    saveState('medkom_logs_db_v5', newLogs, setLogs);
                  } else {
                    const newLog: OperationalLog = {
                      id: `LOG-0${logs.length + 1}`,
                      task: `${updatedTask.status}: ${updatedTask.title}`,
                      department: updatedTask.department || '-',
                      jenisPengajuan: 'Design',
                      status: logStatus as any,
                      time: 'Just Now',
                      entityId: updatedTask.id
                    };
                    saveState('medkom_logs_db_v5', [newLog, ...logs], setLogs);
                  }
                }
              }}
              onDeleteTask={(id) => {
                const taskToArchive = tasks.find(t => t.id === id);
                if (taskToArchive) {
                  const newArchive = {
                    id: taskToArchive.id,
                    name: taskToArchive.title,
                    category: 'design',
                    dateCompleted: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
                    pic: taskToArchive.pic || 'Unassigned',
                    originalData: taskToArchive
                  };
                  saveState('medkom_archives_db_v5', [newArchive, ...archives], setArchives);
                }
                // Bersihkan log entry yang terkait agar tidak muncul lagi di dashboard
                const cleanedLogs = logs.filter(l => l.entityId !== id);
                saveState('medkom_logs_db_v5', cleanedLogs, setLogs);

                const filtered = tasks.filter(t => t.id !== id);
                saveState('medkom_tasks_db_v5', filtered, setTasks);
              }}
              onTriggerNotification={triggerNotification}
            />
          )}

          {activeTab === 'video' && (
            <VideoTab 
              currentUser={currentUser}
              videos={videos}
              residents={residents}
              onAddVideo={(v) => {
                const updated = [...videos, v];
                saveState('medkom_videos_db_v5', updated, setVideos);
                
                const newLog: OperationalLog = {
                  id: `LOG-0${logs.length + 1}`,
                  task: `New Video Project: ${v.title}`,
                  department: v.department || '-',
                  jenisPengajuan: 'Video',
                  status: 'Pending',
                  time: 'Just Now',
                  entityId: v.id
                };
                saveState('medkom_logs_db_v5', [newLog, ...logs], setLogs);
              }}
              onUpdateVideo={(updatedVid) => {
                const index = videos.findIndex(v => v.id === updatedVid.id);
                if (index !== -1) {
                  const copy = [...videos];
                  copy[index] = updatedVid;
                  saveState('medkom_videos_db_v5', copy, setVideos);
                  
                  const logIndex = logs.findIndex(l => l.entityId === updatedVid.id);
                  let logStatus = 'In Progress';
                  if (updatedVid.status === 'To Do') logStatus = 'Pending';
                  else if (updatedVid.status === 'In Progress' || updatedVid.status === 'Review') logStatus = 'In Progress';
                  else if (updatedVid.status === 'Done') logStatus = 'Completed';
                  
                  if (logIndex !== -1) {
                    const newLogs = [...logs];
                    newLogs[logIndex] = {
                      ...newLogs[logIndex],
                      task: `${updatedVid.status}: ${updatedVid.title}`,
                      status: logStatus as any
                    };
                    saveState('medkom_logs_db_v5', newLogs, setLogs);
                  } else {
                    const newLog: OperationalLog = {
                      id: `LOG-0${logs.length + 1}`,
                      task: `${updatedVid.status}: ${updatedVid.title}`,
                      department: updatedVid.department || '-',
                      jenisPengajuan: 'Video',
                      status: logStatus as any,
                      time: 'Just Now',
                      entityId: updatedVid.id
                    };
                    saveState('medkom_logs_db_v5', [newLog, ...logs], setLogs);
                  }
                }
              }}
              onDeleteVideo={(id) => {
                const vidToArchive = videos.find(v => v.id === id);
                if (vidToArchive) {
                  const newArchive = {
                    id: vidToArchive.id,
                    name: vidToArchive.title,
                    category: 'video',
                    dateCompleted: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
                    pic: vidToArchive.pic || 'Unassigned',
                    originalData: vidToArchive
                  };
                  saveState('medkom_archives_db_v5', [newArchive, ...archives], setArchives);
                }
                // Bersihkan log entry yang terkait
                const cleanedLogs = logs.filter(l => l.entityId !== id);
                saveState('medkom_logs_db_v5', cleanedLogs, setLogs);

                const filtered = videos.filter(v => v.id !== id);
                saveState('medkom_videos_db_v5', filtered, setVideos);
              }}
              onTriggerNotification={triggerNotification}
            />
          )}

          {activeTab === 'publication' && (
            <PublicationTab 
              currentUser={currentUser}
              residents={residents}
              publications={publications}
              onAddPublication={(p) => {
                const updated = [...publications, p];
                saveState('medkom_publications_db_v5', updated, setPublications);
                
                const newLog: OperationalLog = {
                  id: `LOG-0${logs.length + 1}`,
                  task: `Drafted Publication: ${p.title}`,
                  department: p.department || '-',
                  jenisPengajuan: 'Publikasi Konten',
                  status: 'Pending',
                  time: 'Just Now',
                  entityId: p.id
                };
                saveState('medkom_logs_db_v5', [newLog, ...logs], setLogs);
              }}
              onUpdatePublication={(updatedPub) => {
                const index = publications.findIndex(p => p.id === updatedPub.id);
                if (index !== -1) {
                  const copy = [...publications];
                  copy[index] = updatedPub;
                  saveState('medkom_publications_db_v5', copy, setPublications);
                  
                  const logIndex = logs.findIndex(l => l.entityId === updatedPub.id);
                  let logStatus = 'Pending';
                  if (updatedPub.status === 'Scheduled') logStatus = 'Scheduled';
                  else if (updatedPub.status === 'Published') logStatus = 'Completed';
                  else if (updatedPub.status === 'Draft') logStatus = 'Pending';
                  
                  if (logIndex !== -1) {
                    const newLogs = [...logs];
                    newLogs[logIndex] = {
                      ...newLogs[logIndex],
                      task: `${updatedPub.status}: ${updatedPub.title}`,
                      status: logStatus as any
                    };
                    saveState('medkom_logs_db_v5', newLogs, setLogs);
                  } else {
                    const newLog: OperationalLog = {
                      id: `LOG-0${logs.length + 1}`,
                      task: `${updatedPub.status}: ${updatedPub.title}`,
                      department: updatedPub.department || '-',
                      jenisPengajuan: 'Publikasi Konten',
                      status: logStatus as any,
                      time: 'Just Now',
                      entityId: updatedPub.id
                    };
                    saveState('medkom_logs_db_v5', [newLog, ...logs], setLogs);
                  }
                }
              }}
              onDeletePublication={(id) => {
                const pubToArchive = publications.find(p => p.id === id);
                if (pubToArchive) {
                  const newArchive: ArchiveItem = {
                    id: pubToArchive.id,
                    name: pubToArchive.title,
                    category: 'publication',
                    dateCompleted: new Date().toISOString().split('T')[0],
                    pic: pubToArchive.pic || 'Unassigned',
                    originalData: pubToArchive
                  };
                  saveState('medkom_archives_db_v5', [newArchive, ...archives], setArchives);
                }
                // Bersihkan log entry yang terkait
                const cleanedLogs = logs.filter(l => l.entityId !== id);
                saveState('medkom_logs_db_v5', cleanedLogs, setLogs);

                const filtered = publications.filter(p => p.id !== id);
                saveState('medkom_publications_db_v5', filtered, setPublications);
              }}
              onTriggerNotification={triggerNotification}
            />
          )}

          {activeTab === 'broadcast' && (
            <BroadcastTab 
              currentUser={currentUser}
              residents={residents}
              campaigns={campaigns}
              onAddCampaign={(c) => {
                const updated = [...campaigns, c];
                saveState('medkom_campaigns_db_v5', updated, setCampaigns);
                const newLog: OperationalLog = {
                  id: `LOG-0${logs.length + 1}`,
                  task: `Drafted Broadcast: ${c.name}`,
                  department: c.department || '-',
                  jenisPengajuan: 'Broadcast',
                  status: 'Pending',
                  time: 'Just Now',
                  entityId: c.id
                };
                saveState('medkom_logs_db_v5', [newLog, ...logs], setLogs);
              }}
              onUpdateCampaign={(updatedCamp) => {
                const logIndex = logs.findIndex(l => l.entityId === updatedCamp.id);
                let logStatus = 'In Progress';
                if (updatedCamp.status === 'Sent') logStatus = 'Completed';
                else if (updatedCamp.status === 'Cancelled') logStatus = 'Cancelled';
                else if (updatedCamp.status === 'Draft') logStatus = 'Pending';

                if (logIndex !== -1) {
                  const newLogs = [...logs];
                  newLogs[logIndex] = {
                    ...newLogs[logIndex],
                    task: `${updatedCamp.status}: ${updatedCamp.name}`,
                    status: logStatus as any
                  };
                  saveState('medkom_logs_db_v5', newLogs, setLogs);
                } else {
                  const newLog: OperationalLog = {
                    id: `LOG-0${logs.length + 1}`,
                    task: `${updatedCamp.status}: ${updatedCamp.name}`,
                    department: updatedCamp.department || '-',
                    jenisPengajuan: 'Broadcast',
                    status: logStatus as any,
                    time: 'Just Now',
                    entityId: updatedCamp.id
                  };
                  saveState('medkom_logs_db_v5', [newLog, ...logs], setLogs);
                }

                if (updatedCamp.status === 'Sent' || updatedCamp.status === 'Cancelled') {
                  const filtered = campaigns.filter(c => c.id !== updatedCamp.id);
                  saveState('medkom_campaigns_db_v5', filtered, setCampaigns);
                  
                  const newArchive = {
                    id: `ARC-${Date.now()}`,
                    name: updatedCamp.name + (updatedCamp.status === 'Cancelled' ? ' (Cancelled)' : ''),
                    category: 'Broadcast',
                    dateCompleted: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
                    pic: 'Unassigned',
                    originalData: updatedCamp
                  };
                  saveState('medkom_archives_db_v5', [...archives, newArchive], setArchives);
                } else {
                  const index = campaigns.findIndex(c => c.id === updatedCamp.id);
                  if (index !== -1) {
                    const copy = [...campaigns];
                    copy[index] = updatedCamp;
                    saveState('medkom_campaigns_db_v5', copy, setCampaigns);
                  }
                }
              }}
              onTriggerNotification={triggerNotification}
            />
          )}

          {activeTab === 'mou' && (
            <MouTab 
              mous={mous}
              currentUser={currentUser}
              onAddMou={(m) => {
                const updated = [...mous, m];
                saveState('medkom_mous_db_v5', updated, setMous);
                
                const newLog: OperationalLog = {
                  id: `LOG-0${logs.length + 1}`,
                  task: `New MoU: ${m.institution}`,
                  department: m.department || '-',
                  jenisPengajuan: 'MoU',
                  status: 'Pending',
                  time: 'Just Now',
                  entityId: m.id
                };
                saveState('medkom_logs_db_v5', [newLog, ...logs], setLogs);
              }}
              onUpdateMou={(updatedMou) => {
                const index = mous.findIndex(m => m.id === updatedMou.id);
                if (index !== -1) {
                  const copy = [...mous];
                  copy[index] = updatedMou;
                  saveState('medkom_mous_db_v5', copy, setMous);
                  
                  const logIndex = logs.findIndex(l => l.entityId === updatedMou.id);
                  let logStatus = 'In Progress';
                  if (updatedMou.status === 'Active') logStatus = 'Completed';
                  else if (updatedMou.status === 'Expired') logStatus = 'Cancelled';
                  
                  if (logIndex !== -1) {
                    const newLogs = [...logs];
                    newLogs[logIndex] = { ...newLogs[logIndex], status: logStatus as any, task: `${updatedMou.status}: ${updatedMou.institution}` };
                    saveState('medkom_logs_db_v5', newLogs, setLogs);
                  } else {
                    const newLog: OperationalLog = {
                      id: `LOG-0${logs.length + 1}`,
                      task: `${updatedMou.status}: ${updatedMou.institution}`,
                      department: updatedMou.department || '-',
                      jenisPengajuan: 'MoU',
                      status: logStatus as any,
                      time: 'Just Now',
                      entityId: updatedMou.id
                    };
                    saveState('medkom_logs_db_v5', [newLog, ...logs], setLogs);
                  }
                }
              }}
              onDeleteMou={(mouId) => {
                const mouToArchive = mous.find(m => m.id === mouId);
                if (mouToArchive) {
                  const newArchive = {
                    id: `ARC-${Date.now()}`,
                    name: `MoU: ${mouToArchive.institution}`,
                    category: 'MoU',
                    dateCompleted: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
                    pic: mouToArchive.pic || 'Unassigned',
                    originalData: mouToArchive
                  };
                  saveState('medkom_archives_db_v5', [newArchive, ...archives], setArchives);
                }
                const updated = mous.filter(m => m.id !== mouId);
                saveState('medkom_mous_db_v5', updated, setMous);
              }}
              onTriggerNotification={triggerNotification}
            />
          )}

          {activeTab === 'calendar' && (
            <CalendarTab 
              events={mappedEvents}
              onAddEvent={(e) => {
                const updated = [...events, e];
                saveState('medkom_calendar_db_v5', updated, setEvents);
              }}
              onDeleteEvent={(eventId) => {
                const updated = events.filter(e => e.id !== eventId);
                saveState('medkom_calendar_db_v5', updated, setEvents);
              }}
              onTriggerNotification={triggerNotification} 
            />
          )}

          {activeTab === 'archive' && (
            <ArchiveTab 
              currentUser={currentUser}
              archives={archives}
              onTriggerNotification={triggerNotification}
              onDeleteArchive={(id) => {
                const filtered = archives.filter(a => a.id !== id);
                saveState('medkom_archives_db_v5', filtered, setArchives);
              }}
              onRestoreArchive={(item) => {
                console.log("Restoring item:", item);
                console.log("Current archives:", archives);
                const filtered = archives.filter(a => a.id !== item.id);
                console.log("Filtered archives:", filtered);
                saveState('medkom_archives_db_v5', filtered, setArchives);
                
                const cat = item.category.toLowerCase();
                const now = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
                
                if (cat === 'broadcast') {
                  const restoredCampaign: BroadcastCampaign = item.originalData ? { ...item.originalData } : {
                    id: `BC-${Date.now()}`,
                    name: item.name.replace(' (Cancelled)', ''),
                    date: now,
                    platform: 'WhatsApp',
                    recipients: 'Semua Anggota',
                    status: 'Draft',
                    message: ''
                  };
                  saveState('medkom_campaigns_db_v5', [...campaigns, restoredCampaign], setCampaigns);
                } else if (cat === 'video') {
                  const restoredVideo: VideoProject = item.originalData ? { ...item.originalData } : {
                    id: `VID-${Date.now()}`,
                    title: item.name,
                    status: 'To Do',
                    platform: 'Instagram',
                    date: now,
                    pic: item.pic || 'Unassigned',
                    imageUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=400'
                  };
                  saveState('medkom_videos_db_v5', [...videos, restoredVideo], setVideos);
                } else if (cat === 'publication') {
                  const restoredPub: PublicationItem = item.originalData ? { ...item.originalData } : {
                    id: `PUB-${Date.now()}`,
                    title: item.name,
                    platform: 'Instagram',
                    date: now,
                    time: '12:00',
                    status: 'Draft'
                  };
                  saveState('medkom_publications_db_v5', [...publications, restoredPub], setPublications);
                } else if (cat === 'design') {
                  const restoredTask: TaskItem = item.originalData ? { ...item.originalData } : {
                    id: `TSK-${Date.now()}`,
                    title: item.name,
                    category: 'Design',
                    deadline: now,
                    status: 'To Do',
                    pic: item.pic || 'Unassigned'
                  };
                  saveState('medkom_tasks_db_v5', [...tasks, restoredTask], setTasks);
                } else if (cat === 'mou') {
                  const restoredMou: MouAgreement = item.originalData ? { ...item.originalData } : {
                    id: `MOU-${Date.now()}`,
                    institution: item.name.replace('MoU: ', ''),
                    mouType: 'MoU Satu Periode',
                    validity: `${now} - ${now}`,
                    pic: item.pic || 'Unassigned',
                    status: 'Active'
                  };
                  saveState('medkom_mous_db_v5', [...mous, restoredMou], setMous);
                } else if (cat === 'submission') {
                  const restoredSub: Submission = item.originalData ? { ...item.originalData } : {
                    id: `MDK-${Date.now()}`,
                    timestamp: now,
                    sender: 'Restored User',
                    department: 'Departemen Media Komunikasi dan Informasi',
                    picHumas: item.pic || 'Unassigned',
                    programKerja: item.name,
                    jenisPengajuan: 'Lainnya',
                    urgency: 'Medium',
                    deadline: now,
                    status: 'Queue',
                    details: 'Restored from archive'
                  };
                  saveState('medkom_submissions_db', [...submissions, restoredSub], setSubmissions);
                }
              }}
            />
          )}

          {activeTab === 'public_portal' && (
            <PublicPortalTab 
              events={mappedEvents}
              submissions={submissions}
              residents={residents}
              publications={publications}
              videos={videos}
              onSelectResidentForProfile={handleSelectResidentForProfile}
              onAddSubmission={(newSub) => {
                const updated = [newSub, ...submissions];
                saveState('medkom_submissions_db', updated, setSubmissions);
                // Sync ke Google Sheets via backend
                syncToGoogleSheets(newSub);
                
                // Prepend log to operations log too!
                const newLog: OperationalLog = {
                  id: `LOG-0${logs.length + 1}`,
                  task: `Pengajuan ${newSub.jenisPengajuan} dari ${newSub.sender}`,
                  department: newSub.department,
                  jenisPengajuan: newSub.jenisPengajuan,
                  status: 'Pending',
                  time: 'Just Now'
                };
                saveState('medkom_logs_db_v5', [newLog, ...logs], setLogs);

                // CONNECT TO SPECIFIC ADMIN SECTIONS & CALENDAR
                let parsedDate = Date.now();
                if (newSub.deadline) {
                  if (newSub.deadline.includes('/')) {
                    const parts = newSub.deadline.split(' ')[0].split('/');
                    if (parts.length === 3) {
                      parsedDate = new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10)).getTime();
                    }
                  } else {
                    parsedDate = new Date(newSub.deadline).getTime();
                  }
                }
                const dateObj = new Date(parsedDate);
                let newEvent: CalendarEvent | null = null;

                if (newSub.jenisPengajuan === 'Design') {
                  const newTask: TaskItem = {
                    id: `TSK-${Date.now()}`,
                    title: newSub.programKerja ? `${newSub.programKerja} - Design` : 'Design Request',
                    category: 'Design',
                    pic: 'Unassigned',
                    status: 'To Do',
                    deadline: newSub.deadline || 'TBD',
                    urgency: newSub.urgency,
                    progress: 0,
                    details: newSub.details || ''
                  };
                  saveState('medkom_tasks_db_v5', [...tasks, newTask], setTasks);

                  newEvent = {
                    id: `EV-${Date.now()}`,
                    year: dateObj.getFullYear(),
                    month: dateObj.getMonth(),
                    day: dateObj.getDate(),
                    title: `Design: ${newSub.programKerja}`,
                    type: 'design',
                    color: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/50 dark:text-blue-400 dark:border-blue-800',
                    entityId: newTask.id
                  };
                } else if (newSub.jenisPengajuan === 'Konten Video') {
                  const newVid: VideoProject = {
                    id: `VID-${Date.now()}`,
                    title: newSub.programKerja ? `${newSub.programKerja} - Video` : 'Video Request',
                    status: 'To Do',
                    platform: 'Instagram Reels',
                    date: newSub.deadline || 'TBD',
                    urgency: newSub.urgency,
                    pic: 'Unassigned',
                    imageUrl: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&q=80&w=2000',
                    details: newSub.details || ''
                  };
                  saveState('medkom_videos_db_v5', [...videos, newVid], setVideos);

                  newEvent = {
                    id: `EV-${Date.now()}`,
                    year: dateObj.getFullYear(),
                    month: dateObj.getMonth(),
                    day: dateObj.getDate(),
                    title: `Video: ${newSub.programKerja}`,
                    type: 'video',
                    color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-400 dark:border-emerald-800',
                    entityId: newVid.id
                  };
                } else if (newSub.jenisPengajuan === 'Publikasi Konten') {
                  const isTFormat = newSub.deadline && newSub.deadline.includes('T');
                  const newPub: PublicationItem = {
                    id: `PUB-${Date.now()}`,
                    title: newSub.programKerja ? `${newSub.programKerja} - Publikasi` : 'Publikasi',
                    platform: 'Instagram',
                    status: 'Scheduled',
                    date: newSub.deadline ? (isTFormat ? newSub.deadline.split('T')[0] : newSub.deadline.split(' ')[0]) : 'TBD',
                    time: newSub.deadline ? (isTFormat ? newSub.deadline.split('T')[1] : (newSub.deadline.split(' ')[1] || 'TBD')) : 'TBD',
                    details: newSub.details || '',
                    pic: 'Unassigned'
                  };
                  saveState('medkom_publications_db_v5', [...publications, newPub], setPublications);

                  newEvent = {
                    id: `EV-${Date.now()}`,
                    year: dateObj.getFullYear(),
                    month: dateObj.getMonth(),
                    day: dateObj.getDate(),
                    title: `Publikasi: ${newSub.programKerja}`,
                    type: 'publication',
                    color: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/50 dark:text-purple-400 dark:border-purple-800',
                    entityId: newPub.id
                  };
                } else if (newSub.jenisPengajuan === 'Publikasi Broadcast') {
                  const newCam: BroadcastCampaign = {
                    id: `BC-${Date.now()}`,
                    name: newSub.programKerja ? `${newSub.programKerja} - Broadcast` : 'Broadcast Request',
                    date: newSub.deadline || 'TBD',
                    platform: 'WhatsApp',
                    recipients: 'Anggota HMIF',
                    status: 'Draft',
                    message: newSub.rawBroadcastText || (newSub.details?.includes('Teks Broadcast:') ? newSub.details.split('Teks Broadcast:')[1].trim() : newSub.details) || '',
                    pic: 'Unassigned'
                  };
                  saveState('medkom_campaigns_db_v5', [...campaigns, newCam], setCampaigns);

                  newEvent = {
                    id: `EV-${Date.now()}`,
                    year: dateObj.getFullYear(),
                    month: dateObj.getMonth(),
                    day: dateObj.getDate(),
                    title: `Broadcast: ${newSub.programKerja}`,
                    type: 'broadcast',
                    color: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/50 dark:text-amber-400 dark:border-amber-800',
                    entityId: newCam.id
                  };
                }

                if (newEvent && newSub.deadline) {
                  const isTFormat = newSub.deadline.includes('T');
                  newEvent.time = isTFormat ? newSub.deadline.split('T')[1] : (newSub.deadline.split(' ')[1] || '');
                  newEvent.pic = 'Unassigned';
                  saveState('medkom_calendar_db_v5', [...events, newEvent], setEvents);
                }
              }}
              onTriggerNotification={triggerNotification}
              onNavigateToTab={setActiveTab}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsTab 
              residents={residents}
              appSettings={appSettings}
              onUpdateAppSettings={handleUpdateAppSettings}
              currentUser={currentUser}
              isDarkMode={isDarkMode}
              onToggleTheme={() => setIsDarkMode(!isDarkMode)}
              submissions={submissions}
              onTriggerNotification={triggerNotification}
              onUpdateUser={(updated) => {
                const oldName = currentUser?.name;
                setCurrentUser(updated);
                localStorage.setItem('medkom_active_session', JSON.stringify(updated));
                
                if (oldName && oldName.trim() !== updated.name.trim()) {
                  const oldNameStr = oldName.trim();
                  const newNameStr = updated.name.trim();

                  const updatedResidents = residents.map(r => {
                    const isMatch = (currentUser?.id && r.adminId === currentUser.id) || (r.name.trim().toLowerCase() === oldNameStr.toLowerCase());
                    if (isMatch) {
                      return { ...r, name: newNameStr };
                    }
                    return r;
                  });
                  saveState('medkom_residents_db_v5', updatedResidents, setResidents);
                  
                  // Also strictly update medkom_admin_users if they are an admin
                  if (updated.role === 'admin') {
                    const savedAdmins = localStorage.getItem('medkom_admin_users');
                    if (savedAdmins) {
                      const admins = JSON.parse(savedAdmins);
                      const updatedAdmins = admins.map((a: any) => {
                        if ((updated.id && a.id === updated.id) || a.name.trim().toLowerCase() === oldNameStr.toLowerCase()) {
                          return { ...a, name: newNameStr };
                        }
                        return a;
                      });
                      localStorage.setItem('medkom_admin_users', JSON.stringify(updatedAdmins));
                    }
                  } else if (updated.role === 'public') {
                    const savedWarga = localStorage.getItem('medkom_warga_users');
                    if (savedWarga) {
                      const wargas = JSON.parse(savedWarga);
                      const updatedWargas = wargas.map((w: any) => {
                        if ((updated.id && w.id === updated.id) || w.name.trim().toLowerCase() === oldNameStr.toLowerCase()) {
                          return { ...w, name: newNameStr };
                        }
                        return w;
                      });
                      localStorage.setItem('medkom_warga_users', JSON.stringify(updatedWargas));
                    }
                  }

                  // Update references in all databases
                  const updatedVideos = videos.map(v => v.pic === oldName ? { ...v, pic: updated.name } : v);
                  saveState('medkom_videos_db_v5', updatedVideos, setVideos);

                  const updatedTasks = tasks.map(t => t.pic === oldName ? { ...t, pic: updated.name } : t);
                  saveState('medkom_tasks_db_v5', updatedTasks, setTasks);

                  const updatedPublications = publications.map(p => p.pic === oldName ? { ...p, pic: updated.name } : p);
                  saveState('medkom_publications_db_v5', updatedPublications, setPublications);

                  const updatedCampaigns = campaigns.map(c => c.pic === oldName ? { ...c, pic: updated.name } : c);
                  saveState('medkom_campaigns_db_v5', updatedCampaigns, setCampaigns);

                  const updatedMous = mous.map(m => m.pic === oldName ? { ...m, pic: updated.name } : m);
                  saveState('medkom_mous_db_v5', updatedMous, setMous);
                  
                  const updatedEvents = events.map(e => e.pic === oldName ? { ...e, pic: updated.name } : e);
                  saveState('medkom_calendar_db_v5', updatedEvents, setEvents);

                  const updatedSubmissions = submissions.map(s => {
                    let sNew = { ...s };
                    if (s.sender === oldName) sNew.sender = updated.name;
                    if (s.picHumas === oldName) sNew.picHumas = updated.name;
                    return sNew;
                  });
                  saveState('medkom_submissions_db', updatedSubmissions, setSubmissions);
                }
              }}
              onUpdateResidents={(updatedResidents) => {
                // Optimistic UI update
                setResidents(updatedResidents);
                // Save each changed resident document directly to Firestore
                updatedResidents.forEach((r: any) => {
                  if (r.id) saveDocument('residents', r.id, r);
                });
              }}
            />
          )}

        </div>
        </div>

      </main>

    </div>
  );
}

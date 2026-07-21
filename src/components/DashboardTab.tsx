import React from 'react';
import { 
  Paintbrush, 
  Video, 
  Send, 
  FileText, 
  Activity, 
  Plus, 
  Sparkles, 
  Layers, 
  Server, 
  CheckCircle2, 
  Play,
  ArrowRight,
  ArrowUpDown
} from 'lucide-react';
import { OperationalLog, TaskItem, VideoProject, BroadcastCampaign, MouAgreement, PublicationItem, ArchiveItem } from '../types';

interface DashboardTabProps {
  logs: OperationalLog[];
  tasks: TaskItem[];
  videos: VideoProject[];
  campaigns: BroadcastCampaign[];
  mous: MouAgreement[];
  publications: PublicationItem[];
  archives: ArchiveItem[];
  onTriggerNotification: (msg: string) => void;
  onNavigateToTab: (tab: string) => void;
  onOpenNewProject: () => void;
}

export default function DashboardTab({ 
  logs, 
  tasks,
  videos,
  campaigns,
  mous,
  publications,
  archives,
  onTriggerNotification, 
  onNavigateToTab, 
  onOpenNewProject 
}: DashboardTabProps) {
    const [sortDesc, setSortDesc] = React.useState(true);

    const getLogStatusClass = (status: string) => {
    const s = status.toLowerCase().replace(/[\s_-]+/g, '');
    if (s === 'completed' || s === 'done') return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400';
    if (s === 'inprogress') return 'bg-blue-100 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400';
    if (s === 'failed' || s === 'cancelled') return 'bg-rose-100 text-rose-600 dark:bg-rose-400/10 dark:text-rose-400';
    if (s === 'scheduled') return 'bg-amber-100 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400';
    if (s === 'pending') return 'bg-slate-100 text-slate-500 dark:bg-slate-400/10 dark:text-slate-400';
    return 'bg-slate-100 text-slate-600 dark:bg-slate-400/10 dark:text-slate-400';
  };

  const handleLogClick = (log: OperationalLog) => {
    const textLower = (log.task + ' ' + log.department).toLowerCase();
    if (textLower.includes('design')) {
      onNavigateToTab('design');
      onTriggerNotification("Navigating to Design Workspace");
    } else if (textLower.includes('video')) {
      onNavigateToTab('video');
      onTriggerNotification("Navigating to Video Projects Pipeline");
    } else if (textLower.includes('publikasi broadcast')) {
      onNavigateToTab('broadcast');
      onTriggerNotification("Navigating to Broadcast Engine");
    } else if (textLower.includes('broadcast')) {
      onNavigateToTab('broadcast');
      onTriggerNotification("Navigating to Broadcast Engine");
    } else if (textLower.includes('publikasi konten')) {
      onNavigateToTab('publication');
      onTriggerNotification("Navigating to Publications");
    } else if (textLower.includes('mou')) {
      onNavigateToTab('mou');
      onTriggerNotification("Navigating to MoU Agreements");
    } else if (textLower.includes('pub') || textLower.includes('post')) {
      onNavigateToTab('publication');
      onTriggerNotification("Navigating to Publications");
    } else {
      onNavigateToTab('responses');
      onTriggerNotification("Navigating to Submissions Form");
    }
  };

  const archivedDesignTasks = archives.filter(a => a.category === 'design').length;
  const activeTasksCount = tasks.filter(t => t.status !== 'Done').length;
  const totalDesignTasks = tasks.length + archivedDesignTasks;
  const designProgressScore = tasks.reduce((acc, t) => {
    if (t.status === 'Done') return acc + 100;
    if (t.status === 'Review') return acc + 75;
    if (t.status === 'In Progress') return acc + 50;
    return acc;
  }, 0) + (archivedDesignTasks * 100);
  const designProgress = totalDesignTasks > 0 ? Math.round(designProgressScore / totalDesignTasks) : 0;

  const archivedVideos = archives.filter(a => a.category === 'video').length;
  const readyVideosCount = videos.filter(v => v.status === 'Done' || v.status === 'Review').length + archivedVideos;
  const totalVideos = videos.length + archivedVideos;
  const videoProgressScore = videos.reduce((acc, v) => {
    if (v.status === 'Done') return acc + 100;
    if (v.status === 'Review') return acc + 75;
    if (v.status === 'In Progress') return acc + 50;
    return acc;
  }, 0) + (archivedVideos * 100);
  const videoProgress = totalVideos > 0 ? Math.round(videoProgressScore / totalVideos) : 0;

  const scheduledBroadcastsCount = campaigns.filter(c => c.status === 'Draft' || c.status === 'In Progress').length;
  
  const activeMousCount = mous.filter(m => m.status === 'Active').length;

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div>
        <h2 className="text-3xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-blue-100 dark:to-slate-300 tracking-tight">Overview</h2>
        <p className="text-sm text-slate-500 mt-1">Welcome back. Click any card or operational activity row to navigate directly to its dedicated section.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {/* Metric 1 - Design */}
        <div 
          onClick={() => {
            onNavigateToTab('design');
            onTriggerNotification("Navigating to Design Workspace");
          }}
          className="bg-white dark:bg-slate-900 backdrop-blur-xl p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden flex flex-col justify-between h-40 cursor-pointer hover:border-blue-400 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 group"
        >
          <div>
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider group-hover:text-blue-600 transition-colors">Tugas Design Berjalan</span>
              <span className="p-2 bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Paintbrush className="w-4 h-4" />
              </span>
            </div>
            <div className="text-4xl font-display font-black text-slate-800 dark:text-slate-100 mt-2 tracking-tight group-hover:scale-105 transform origin-left transition-transform duration-300">{activeTasksCount}</div>
            <p className="text-[11px] text-slate-500/80 font-semibold mt-0.5 uppercase tracking-wider">Active Tasks</p>
          </div>
          <div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mb-1">
              <div className="bg-blue-600 h-full rounded-full transition-all" style={{ width: `${designProgress}%` }}></div>
            </div>
            <div className="flex justify-between text-[10px] font-bold text-blue-600">
              <span>{designProgress}% Progress</span>
              <span className="flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                Manage <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>

        {/* Metric 2 - Video */}
        <div 
          onClick={() => {
            onNavigateToTab('video');
            onTriggerNotification("Navigating to Video Projects Pipeline");
          }}
          className="bg-white dark:bg-slate-900 backdrop-blur-xl p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden flex flex-col justify-between h-40 cursor-pointer hover:border-emerald-400 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 group"
        >
          <div>
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider group-hover:text-emerald-600 transition-colors">Video Siap Rilis</span>
              <span className="p-2 bg-emerald-50 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Video className="w-4 h-4" />
              </span>
            </div>
            <div className="text-4xl font-display font-black text-slate-800 dark:text-slate-100 mt-2 tracking-tight group-hover:scale-105 transform origin-left transition-transform duration-300">{readyVideosCount}</div>
            <p className="text-[11px] text-slate-500/80 font-semibold mt-0.5 uppercase tracking-wider">Videos Ready</p>
          </div>
          <div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mb-1">
              <div className="bg-emerald-600 h-full rounded-full transition-all" style={{ width: `${videoProgress}%` }}></div>
            </div>
            <div className="flex justify-between text-[10px] font-bold text-emerald-600">
              <span>{videoProgress}% Pipeline</span>
              <span className="flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                Manage <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>

        {/* Metric 3 - Broadcast */}
        <div 
          onClick={() => {
            onNavigateToTab('broadcast');
            onTriggerNotification("Navigating to Broadcast Engine");
          }}
          className="bg-white dark:bg-slate-900 backdrop-blur-xl p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden flex flex-col justify-between h-40 cursor-pointer hover:border-amber-400 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 group"
        >
          <div>
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider group-hover:text-amber-600 transition-colors">Jadwal Broadcast</span>
              <span className="p-2 bg-amber-50 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 rounded-lg group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <Send className="w-4 h-4" />
              </span>
            </div>
            <div className="text-4xl font-display font-black text-slate-800 dark:text-slate-100 mt-2 tracking-tight group-hover:scale-105 transform origin-left transition-transform duration-300">{scheduledBroadcastsCount}</div>
            <p className="text-[11px] text-slate-500/80 font-semibold mt-0.5 uppercase tracking-wider">Scheduled This Month</p>
          </div>
          <div>
            <div className="flex justify-between items-center text-[10px] font-bold text-amber-600">
              <span className="bg-amber-50 px-2 py-0.5 rounded text-[10px] font-bold">Manage Broadcast</span>
              <span className="flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                Manage <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>

        {/* Metric 4 - MoU */}
        <div 
          onClick={() => {
            onNavigateToTab('mou');
            onTriggerNotification("Navigating to MoU Agreements");
          }}
          className="bg-white dark:bg-slate-900 backdrop-blur-xl p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden flex flex-col justify-between h-40 cursor-pointer hover:border-purple-400 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 group"
        >
          <div>
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider group-hover:text-purple-600 transition-colors">MoU Aktif</span>
              <span className="p-2 bg-purple-50 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <FileText className="w-4 h-4" />
              </span>
            </div>
            <div className="text-4xl font-display font-black text-slate-800 dark:text-slate-100 mt-2 tracking-tight group-hover:scale-105 transform origin-left transition-transform duration-300">{activeMousCount}</div>
            <p className="text-[11px] text-slate-500/80 font-semibold mt-0.5 uppercase tracking-wider">Active Partners</p>
          </div>
          <div>
            <div className="flex justify-between items-center text-[10px] font-bold text-purple-700">
              <span className="bg-purple-50 px-2 py-0.5 rounded text-[10px] font-bold">View Agreements</span>
              <span className="flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                View <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Splitted Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Operational Activity Log Table */}
        <div className="bg-white dark:bg-slate-900 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.02)] lg:col-span-2 overflow-hidden">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-display font-black text-slate-900 dark:text-slate-100 text-lg flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600 animate-pulse" />
              Recent Operational Activity
            </h3>
            <button 
              onClick={() => {
                onTriggerNotification("Logs are perfectly synced to operations!");
                onNavigateToTab('responses');
              }}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline"
            >
              View All Logs
            </button>
            <button
              onClick={() => setSortDesc(p => !p)}
              title={sortDesc ? 'Tampilkan terlama dahulu' : 'Tampilkan terbaru dahulu'}
              className="flex items-center gap-1.5 px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:border-blue-400 hover:text-blue-600 transition-all ml-2"
            >
              <ArrowUpDown className="w-3 h-3" />
              {sortDesc ? 'Terbaru' : 'Terlama'}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950/70 text-slate-600 dark:text-slate-400 uppercase font-bold text-[10px] border-b border-slate-150">
                  <th className="py-3 px-5">Task / Event</th>
                  <th className="py-3 px-5">Departemen Pengaju</th>
                  <th className="py-3 px-5">Jenis Pengajuan</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(sortDesc ? [...logs].reverse() : logs).map((log) => (
                  <tr 
                    key={log.id} 
                    onClick={() => handleLogClick(log)}
                    className="hover:bg-blue-50/30 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-5 font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 transition-colors flex items-center gap-2">
                      <span>{log.task}</span>
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-blue-500 dark:text-blue-400" />
                    </td>
                    <td className="py-3.5 px-5 font-semibold text-slate-500">{log.department}</td>
                    <td className="py-3.5 px-5 font-semibold text-slate-500">{log.jenisPengajuan || '-'}</td>
                    <td className="py-3.5 px-5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] ${getLogStatusClass(log.status)}`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right font-medium text-slate-600 dark:text-slate-400">{log.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side Control Center */}
        <div className="space-y-6">
          {/* Quick Actions Panel */}
          <div className="bg-white dark:bg-slate-900 backdrop-blur-xl p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
            <h3 className="font-display font-black text-slate-900 dark:text-slate-100 text-sm uppercase tracking-wider mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={onOpenNewProject}
                className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-950/50 hover:bg-white dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl transition-all duration-300 hover:shadow-[0_4px_20px_rgb(0,0,0,0.05)] hover:-translate-y-0.5 text-center group"
              >
                <div className="p-2.5 bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-xl group-hover:scale-115 transition-transform">
                  <Plus className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-2">New Task</span>
              </button>

              <button 
                onClick={() => {
                  onNavigateToTab('broadcast');
                  onTriggerNotification("Drafting newsletter mass broadcast...");
                }}
                className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-950/50 hover:bg-white dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl transition-all duration-300 hover:shadow-[0_4px_20px_rgb(0,0,0,0.05)] hover:-translate-y-0.5 text-center group"
              >
                <div className="p-2.5 bg-purple-50 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-xl group-hover:scale-115 transition-transform">
                  <Send className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-2">Draft Blast</span>
              </button>

              <button 
                onClick={() => {
                  onNavigateToTab('templates');
                  onTriggerNotification("Redirected to brand assets library.");
                }}
                className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-950/50 hover:bg-white dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl transition-all duration-300 hover:shadow-[0_4px_20px_rgb(0,0,0,0.05)] hover:-translate-y-0.5 text-center group"
              >
                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-xl group-hover:scale-115 transition-transform">
                  <Layers className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-2">Upload Asset</span>
              </button>

              <button 
                onClick={() => {
                  onNavigateToTab('mou');
                  onTriggerNotification("Initiating new institutional MoU agreement.");
                }}
                className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-950/50 hover:bg-white dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl transition-all duration-300 hover:shadow-[0_4px_20px_rgb(0,0,0,0.05)] hover:-translate-y-0.5 text-center group"
              >
                <div className="p-2.5 bg-amber-50 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 rounded-xl group-hover:scale-115 transition-transform">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-2">New MoU</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

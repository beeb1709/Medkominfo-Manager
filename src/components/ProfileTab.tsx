import React from 'react';
import { 
  ArrowLeft, 
  MessageSquare, 
  Mail, 
  ShieldCheck, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  Award,
  Paintbrush,
  Users,
  Briefcase,
  Trash2
} from 'lucide-react';
import { Resident, TaskItem, VideoProject, PublicationItem, BroadcastCampaign, MouAgreement } from '../types';

interface ProfileTabProps {
  resident: Resident;
  tasks: TaskItem[];
  videos: VideoProject[];
  publications: PublicationItem[];
  campaigns: BroadcastCampaign[];
  mous: MouAgreement[];
  onBackToRoster: () => void;
  onTriggerNotification: (msg: string) => void;
  onUpdateResident: (resident: Resident) => void;
}

export default function ProfileTab({
  resident,
  tasks,
  videos,
  publications,
  campaigns,
  mous,
  onBackToRoster,
  onTriggerNotification,
  onUpdateResident
}: ProfileTabProps) {
  const [isAddCommitteeOpen, setIsAddCommitteeOpen] = React.useState(false);
  const [newCommittee, setNewCommittee] = React.useState({
    eventName: '',
    department: '',
    role: '',
    division: ''
  });
  
  // Filter tasks assigned to this resident
  const assignedTasks = tasks.filter(t => t.pic === resident.name);
  const assignedVideos = videos.filter(v => v.pic === resident.name);
  const assignedPublications = publications.filter(p => p.pic === resident.name);
  const assignedCampaigns = campaigns.filter(c => c.pic === resident.name);
  const assignedMous = mous.filter(m => m.pic === resident.name);

  const getStatusDotColor = (status: string) => {
    switch (status) {
      case 'Online': return 'bg-emerald-500';
      case 'Away': return 'bg-amber-500';
      default: return 'bg-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Back button */}
      <div>
        <button 
          onClick={onBackToRoster}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      {/* Main Profile Layout split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Card Summary */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-5">
          <div className="relative w-24 h-24 mx-auto">
            <div className={`w-full h-full rounded-full flex items-center justify-center font-black text-3xl shadow-inner ${resident.avatarColor}`}>
              {resident.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <span className={`absolute bottom-1 right-1 w-5 h-5 border-4 border-white rounded-full ${getStatusDotColor(resident.status)}`}></span>
          </div>

          <div className="space-y-1">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-xl tracking-tight">{resident.name}</h3>
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-500">
              <span>{resident.role}</span>
              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
              <span>{resident.division}</span>
            </div>
          </div>

          {/* Social Contact Buttons */}
          <div className="flex justify-center gap-2">
            <a 
              href={`https://wa.me/${resident.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 transition-all"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              Whatsapp
            </a>
            <a 
              href={`mailto:${resident.email}`}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl text-xs font-bold text-blue-800 transition-all"
            >
              <Mail className="w-4 h-4 text-blue-600" />
              Email
            </a>
          </div>

          {/* KPI Mini Row */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl">
              <div className="text-xl font-black text-slate-900 dark:text-white">{assignedTasks.length}</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">Assigned</div>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl">
              <div className="text-xl font-black text-emerald-600">
                {assignedTasks.filter(t => t.status === 'Done').length}
              </div>
              <div className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">Completed</div>
            </div>
          </div>
        </div>

        {/* About & Performance Metrics */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* About Section */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h4 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <ShieldCheck className="w-4.5 h-4.5 text-blue-600" />
              Personal Biography & Focus
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Highly dedicated staff member of the <strong>{resident.division}</strong>. Specializes in producing creative digital art assets, managing collaborative pipelines, and ensuring brand alignment across all publication channels for Medkominfo 2026.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl flex items-start gap-3">
                <Award className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-slate-800 dark:text-slate-200 text-xs">Specialization</h5>
                  <p className="text-[11px] text-slate-500 mt-0.5">Vector Art, Typography layouts, Social Feed Branding</p>
                </div>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl flex items-start gap-3">
                <Clock className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-slate-800 dark:text-slate-200 text-xs">Timezone Availability</h5>
                  <p className="text-[11px] text-slate-500 mt-0.5">Active hours: 10:00 AM - 10:00 PM (GMT+7)</p>
                </div>
              </div>
            </div>

            {/* Committees */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <Users className="w-4.5 h-4.5 text-blue-600" />
                  Kepanitiaan
                </h4>
                <button 
                  onClick={() => setIsAddCommitteeOpen(true)}
                  className="text-[10px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors"
                >
                  + Add
                </button>
              </div>

              {resident.committees && resident.committees.length > 0 ? (
                <div className="space-y-3">
                  {resident.committees.map((com, idx) => (
                    <div key={idx} className="relative p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm flex flex-col gap-2 hover:border-blue-200 transition-colors">
                      <div className="flex justify-between items-start gap-3">
                        <div>
                          <h5 className="font-bold text-slate-800 dark:text-slate-200 text-sm leading-tight">{com.eventName}</h5>
                          <span className="inline-block mt-1.5 px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-700 font-semibold text-[10px] rounded-md">
                            {com.department}
                          </span>
                        </div>
                        <button 
                          onClick={() => {
                            const updatedCommittees = [...(resident.committees || [])];
                            updatedCommittees.splice(idx, 1);
                            onUpdateResident({ ...resident, committees: updatedCommittees });
                            onTriggerNotification(`Removed committee ${com.eventName}`);
                          }}
                          className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                          title="Hapus Kepanitiaan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mt-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                        <div className="bg-slate-50 dark:bg-slate-950/50 p-2 rounded-lg border border-slate-200 dark:border-slate-800/50">
                          <p className="text-[9px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-0.5">Role / Jabatan</p>
                          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{com.role}</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-950/50 p-2 rounded-lg border border-slate-200 dark:border-slate-800/50">
                          <p className="text-[9px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-0.5">Divisi</p>
                          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{com.division}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium py-2 text-center">
                  Belum mengikuti kepanitiaan.
                </p>
              )}
            </div>
          </div>

          {/* Assigned Tasks Lists */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Design Assignments */}
            {(resident.role === 'Admin Multimedia' || resident.division === 'Multimedia' || assignedTasks.length > 0) && (
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h4 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <Paintbrush className="w-4.5 h-4.5 text-purple-600" />
                  Design Assignments ({assignedTasks.length})
                </h4>

                {assignedTasks.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {assignedTasks.map((task) => (
                      <div key={task.id} className="py-3 flex items-center justify-between hover:bg-slate-950/50 rounded-lg px-2 transition-colors">
                        <div className="space-y-1">
                          <div className="font-bold text-slate-800 dark:text-slate-200 text-xs">{task.title}</div>
                          <div className="flex items-center gap-2 text-[10px] text-slate-600 dark:text-slate-400 font-mono">
                            <span>ID: {task.id}</span>
                            <span>•</span>
                            <span>{task.category}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-semibold text-slate-500">{task.deadline}</span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                            task.status === 'Done' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400' :
                            task.status === 'In Progress' ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400' :
                            task.status === 'Review' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400' :
                            'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}>
                            {task.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium py-4 text-center">
                    No design assignments yet.
                  </p>
                )}
              </div>
            )}

            {/* Video Assignments */}
            {(resident.role !== 'Admin Humas' && resident.division !== 'Humas' && (resident.role === 'Admin Multimedia' || resident.division === 'Multimedia' || assignedVideos.length > 0)) && (
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h4 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <Sparkles className="w-4.5 h-4.5 text-blue-600" />
                  Video Project Assignments ({assignedVideos.length})
                </h4>

                {assignedVideos.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {assignedVideos.map((video) => (
                      <div key={video.id} className="py-3 flex items-center justify-between hover:bg-slate-950/50 rounded-lg px-2 transition-colors">
                        <div className="space-y-1">
                          <div className="font-bold text-slate-800 dark:text-slate-200 text-xs">{video.title}</div>
                          <div className="flex items-center gap-2 text-[10px] text-slate-600 dark:text-slate-400 font-mono">
                            <span>ID: {video.id}</span>
                            <span>•</span>
                            <span>{video.platform}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-semibold text-slate-500">{video.date}</span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                            video.status === 'Done' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400' :
                            video.status === 'In Progress' ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400' :
                            video.status === 'Review' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400' :
                            'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}>
                            {video.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium py-4 text-center">
                    No video assignments yet.
                  </p>
                )}
              </div>
            )}

            {/* Publication Assignments */}
            {(resident.role === 'Admin Humas' || resident.division === 'Humas' || assignedPublications.length > 0) && (
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h4 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <MessageSquare className="w-4.5 h-4.5 text-rose-500" />
                  Publication Assignments ({assignedPublications.length})
                </h4>

                {assignedPublications.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {assignedPublications.map((pub) => (
                      <div key={pub.id} className="py-3 flex items-center justify-between hover:bg-slate-950/50 rounded-lg px-2 transition-colors">
                        <div className="space-y-1">
                          <div className="font-bold text-slate-800 dark:text-slate-200 text-xs">{pub.title}</div>
                          <div className="flex items-center gap-2 text-[10px] text-slate-600 dark:text-slate-400 font-mono">
                            <span>ID: {pub.id}</span>
                            <span>•</span>
                            <span>{pub.platform}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-semibold text-slate-500">{pub.date} {pub.time}</span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                            pub.status === 'Published' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400' :
                            pub.status === 'Scheduled' ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400' :
                            'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}>
                            {pub.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium py-4 text-center">
                    No publication assignments yet.
                  </p>
                )}
              </div>
            )}

            {/* Broadcast Assignments */}
            {(resident.role === 'Admin Humas' || resident.division === 'Humas' || assignedCampaigns.length > 0) && (
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h4 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <Mail className="w-4.5 h-4.5 text-amber-500" />
                  Broadcast Assignments ({assignedCampaigns.length})
                </h4>

                {assignedCampaigns.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {assignedCampaigns.map((camp) => (
                      <div key={camp.id} className="py-3 flex items-center justify-between hover:bg-slate-950/50 rounded-lg px-2 transition-colors">
                        <div className="space-y-1">
                          <div className="font-bold text-slate-800 dark:text-slate-200 text-xs">{camp.name}</div>
                          <div className="flex items-center gap-2 text-[10px] text-slate-600 dark:text-slate-400 font-mono">
                            <span>ID: {camp.id}</span>
                            <span>•</span>
                            <span>{camp.platform}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-semibold text-slate-500">{camp.date}</span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                            camp.status === 'Sent' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400' :
                            camp.status === 'In Progress' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400' :
                            camp.status === 'Failed' ? 'bg-rose-50 text-rose-700 dark:bg-rose-900/50 dark:text-rose-400' :
                            'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}>
                            {camp.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium py-4 text-center">
                    No broadcast assignments yet.
                  </p>
                )}
              </div>
            )}

            {/* MoU Assignments */}
            {(resident.role === 'Admin Humas' || resident.division === 'Humas' || assignedMous.length > 0) && (
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h4 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <Briefcase className="w-4.5 h-4.5 text-emerald-600" />
                  MoU Assignments ({assignedMous.length})
                </h4>

                {assignedMous.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {assignedMous.map((mou) => (
                      <div key={mou.id} className="py-3 flex items-center justify-between hover:bg-slate-950/50 rounded-lg px-2 transition-colors">
                        <div className="space-y-1">
                          <div className="font-bold text-slate-800 dark:text-slate-200 text-xs">{mou.institution}</div>
                          <div className="flex items-center gap-2 text-[10px] text-slate-600 dark:text-slate-400 font-mono">
                            <span>ID: {mou.id}</span>
                            <span>•</span>
                            <span>{mou.mouType}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-semibold text-slate-500">{mou.validity}</span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                            mou.status === 'Active' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400' :
                            mou.status === 'Waiting TTD' ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400' :
                            'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}>
                            {mou.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium py-4 text-center">
                    No MoU assignments yet.
                  </p>
                )}
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Add Committee Modal */}
      {isAddCommitteeOpen && (
        <div className="fixed inset-0 bg-white dark:bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Add Kepanitiaan</h3>
              <button onClick={() => setIsAddCommitteeOpen(false)} className="p-1 text-slate-600 dark:text-slate-400 hover:text-slate-400 rounded">
                &times;
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const updatedCommittees = [...(resident.committees || []), newCommittee];
              onUpdateResident({ ...resident, committees: updatedCommittees });
              onTriggerNotification(`Added committee ${newCommittee.eventName}`);
              setNewCommittee({ eventName: '', department: '', role: '', division: '' });
              setIsAddCommitteeOpen(false);
            }} className="p-5 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Event / Kepanitiaan</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PKKMB 2026"
                  value={newCommittee.eventName}
                  onChange={(e) => setNewCommittee({...newCommittee, eventName: e.target.value})}
                  className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Departemen</label>
                <select
                  required
                  value={newCommittee.department}
                  onChange={(e) => setNewCommittee({...newCommittee, department: e.target.value})}
                  className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="" disabled>Pilih Departemen...</option>
                  <option value="Departemen Eselon">Departemen Eselon</option>
                  <option value="Departemen Kesejahteraan Mahasiswa">Departemen Kesejahteraan Mahasiswa</option>
                  <option value="Departemen Pengembangan Mahasiswa">Departemen Pengembangan Mahasiswa</option>
                  <option value="Departemen Pengembangan Sumber Daya Manusia">Departemen Pengembangan Sumber Daya Manusia</option>
                  <option value="Departemen Ekonomi Kreatif">Departemen Ekonomi Kreatif</option>
                  <option value="Departemen Media Komunikasi dan Informasi">Departemen Media Komunikasi dan Informasi</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Role / Jabatan</label>
                  <select
                    required
                    value={newCommittee.role}
                    onChange={(e) => setNewCommittee({...newCommittee, role: e.target.value})}
                    className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="" disabled>Pilih Role...</option>
                    <option value="Ketua Pelaksana">Ketua Pelaksana</option>
                    <option value="Wakil Ketua Pelaksana">Wakil Ketua Pelaksana</option>
                    <option value="Ketua Divisi">Ketua Divisi</option>
                    <option value="Staff">Staff</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Divisi Kepanitiaan</label>
                  <select
                    required
                    value={newCommittee.division}
                    onChange={(e) => setNewCommittee({...newCommittee, division: e.target.value})}
                    className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="" disabled>Pilih Divisi...</option>
                    <option value="BPH (Badan Pengurus Harian)">BPH (Badan Pengurus Harian)</option>
                    <option value="Acara">Acara</option>
                    <option value="Humas">Humas</option>
                    <option value="PDD (Publikasi, Dekorasi, Dokumentasi)">PDD (Publikasi, Dekorasi, Dokumentasi)</option>
                    <option value="Danus (Dana dan Usaha)">Danus (Dana dan Usaha)</option>
                    <option value="Kestari (Kesekretariatan)">Kestari (Kesekretariatan)</option>
                    <option value="Perlap / Logistik">Perlap / Logistik</option>
                    <option value="Konsumsi">Konsumsi</option>
                    <option value="Keamanan">Keamanan</option>
                    <option value="Sponsorship">Sponsorship</option>
                    <option value="Medis / Kesehatan">Medis / Kesehatan</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddCommitteeOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-md shadow-blue-500/10"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

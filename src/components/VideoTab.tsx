import React, { useState } from 'react';
import MarkdownRenderer from './MarkdownRenderer';
import { 
  Plus, 
  Video, 
  ExternalLink, 
  Check, 
  AlertTriangle, 
  Clock, 
  Play,
  User,
  Monitor, CheckCircle2, MessageSquare,
  Search,
  Trash2, FileText, Camera, Image as ImageIcon, Ban, Paperclip, UserSquare2, PenLine,
  ArrowUpDown
} from 'lucide-react';
import { VideoProject, Resident } from '../types';
import { checkPermission } from '../utils';


function parseVideoBrief(text: string) {
  const data = {
    header: '',
    details: [] as {key: string, val: string}[],
    additional: [] as {key: string, val: string}[],
    contact: [] as {key: string, val: string}[],
    slides: [] as any[] // Not used in video but keeping structure
  };
  
  if (text.includes('TEMPLATE PENGAJUAN KONTEN VIDEO')) {
      const lines = text.split('\n');
      let currentSection = '';
      let parsingIsiKonten = false;
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.includes('===') || line.includes('---')) continue;
        if (line.includes('DEPARTEMEN MEDKOMINFO')) continue;
        if (line.includes('HMIF UPNVJ')) continue;
        if (line.includes('*Note :')) continue;
        
        if (line.startsWith('TEMPLATE PENGAJUAN KONTEN VIDEO:')) {
          data.header = line.replace('TEMPLATE PENGAJUAN KONTEN VIDEO:', '').trim();
          continue;
        }
        
        if (line.trim() === 'DETAIL VIDEO') { currentSection = 'details'; continue; }
        if (line.includes('DETAIL TAMBAHAN')) { currentSection = 'additional'; parsingIsiKonten = false; continue; }
        if (line.includes('CONTACT PERSON')) { currentSection = 'contact'; parsingIsiKonten = false; continue; }
        
        if (line.trim() === '' && !parsingIsiKonten) continue;
        
        if (currentSection === 'details') {
          if (line.startsWith('Isi Konten    :')) {
             parsingIsiKonten = true;
             const val = line.replace('Isi Konten    :', '').trim();
             data.details.push({ key: 'Isi Konten', val: val ? val + '\n' : '' });
             continue;
          }
          if (parsingIsiKonten && !line.startsWith('Pakai CC?')) {
             data.details[data.details.length - 1].val += line + '\n';
             continue;
          }
          if (line.startsWith('Pakai CC?')) parsingIsiKonten = false;
          
          const parts = line.split(':');
          if (parts.length >= 2) {
            const key = parts[0].trim();
            const val = parts.slice(1).join(':').trim();
            if (key && val) data.details.push({ key, val });
          }
        } else if (currentSection === 'additional') {
          const parts = line.split(':');
          if (parts.length >= 2) {
            const key = parts[0].trim();
            const val = parts.slice(1).join(':').trim();
            if (key && val && val !== '-') data.additional.push({ key, val });
          }
        } else if (currentSection === 'contact') {
          const parts = line.split(':');
          if (parts.length >= 2) {
            const key = parts[0].trim();
            const val = parts.slice(1).join(':').trim();
            if (key && val && val !== '-') data.contact.push({ key, val });
          }
        }
      }
      return data;
  }
  
  // Format from new generator (or if they type Format Video: manually)
  const lines = text.split('\n');
  let currentSection = 'header';
  let isParsingContent = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.startsWith('Format Video:') || line.startsWith('Format Konten:')) {
      data.header = line.split(':')[1].trim();
      continue;
    }
    
    if (line.trim() === 'Detail Video:' || line.trim() === 'Detail Konten:') { currentSection = 'details'; continue; }
    if (line.trim() === 'Detail Tambahan:') { currentSection = 'additional'; continue; }
    if (line.trim() === 'Contact Person:') { currentSection = 'contact'; continue; }
    
    if (line.trim() === '') continue;
    
    if (currentSection === 'header' || currentSection === 'details') {
       if (line.startsWith('Tema Video:') || line.startsWith('Judul Video:') || line.startsWith('Rasio Video:') || line.startsWith('Tema Konten:')) {
           const parts = line.split(':');
           data.details.push({ key: parts[0].trim(), val: parts.slice(1).join(':').trim() });
       } else if (line.startsWith('- ')) {
           const parts = line.split(':');
           const key = parts[0].replace('-', '').trim();
           if (key === 'Isi Konten' || key === 'Isi Video') {
              isParsingContent = true;
              data.details.push({ key: 'Isi Konten', val: parts.slice(1).join(':').trim() + '\n' });
           } else {
              isParsingContent = false;
              data.details.push({ key: key, val: parts.slice(1).join(':').trim() });
           }
       } else if (isParsingContent && !line.startsWith('- ')) {
           const contentIdx = data.details.findIndex(d => d.key === 'Isi Konten');
           if (contentIdx >= 0) {
               data.details[contentIdx].val += line + '\n';
           }
       } else {
           isParsingContent = false;
           const parts = line.split(':');
           if (parts.length >= 2) {
               data.details.push({ key: parts[0].trim(), val: parts.slice(1).join(':').trim() });
           }
       }
    } else if (currentSection === 'additional') {
       isParsingContent = false;
       if (line.startsWith('- ')) {
           const parts = line.split(':');
           if (parts.length >= 2) {
               const key = parts[0].replace('-', '').trim();
               const val = parts.slice(1).join(':').trim();
               if (val && val !== '-') data.additional.push({ key, val });
           }
       }
    } else if (currentSection === 'contact') {
       isParsingContent = false;
       if (line.startsWith('- ')) {
           const parts = line.split(':');
           if (parts.length >= 2) {
               const key = parts[0].replace('-', '').trim();
               const val = parts.slice(1).join(':').trim();
               if (val && val !== '-') data.contact.push({ key, val });
           }
       }
    }
  }
  
  return data;
}
function FormattedVideoBriefRenderer({ text }: { text: string }) {
  if (!text) {
    return (
      <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500 whitespace-pre-wrap leading-relaxed font-medium text-center italic">
        Tidak ada detail brief atau deskripsi untuk video ini.
      </div>
    );
  }

  let data;
  if (text.includes('TEMPLATE PENGAJUAN KONTEN VIDEO') || text.includes('Format Video:')) {
    data = parseVideoBrief(text);
  } else {
    data = {
      header: 'CUSTOM VIDEO REQUEST',
      details: [{ key: 'Isi Konten', val: text }],
      additional: [],
      contact: [],
      slides: []
    };
  }

  const otherDetails = data.details.filter(d => d.key !== 'Isi Konten' && d.key !== 'Isi Konten Utama');
  let isiKontenItem = data.details.find(d => d.key === 'Isi Konten' || d.key === 'Isi Konten Utama');
  if (!isiKontenItem && data.details.length === 1 && data.details[0].key !== 'Isi Konten') {
      // Fallback
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
      {/* Left Col: Main Content */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-700" />
            <h3 className="font-bold text-blue-900 uppercase tracking-wider text-sm">Isi Konten Utama / Deskripsi</h3>
          </div>
          
          <div className="p-6">
            {/* Top Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-6 mb-10">
              <div>
                <span className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Format Video</span>
                <div className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300 text-sm">
                  <Camera className="w-4 h-4 text-blue-500" />
                  {data.header || '-'}
                </div>
              </div>
              
              {otherDetails.map((d, i) => (
                <div key={i}>
                  <span className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">{d.key}</span>
                  <div className="flex items-start gap-2 font-semibold text-slate-800 dark:text-slate-200 text-sm">
                    {d.key.toLowerCase().includes('judul') ? (
                      <span className="text-base font-bold text-slate-900 dark:text-white">{d.val}</span>
                    ) : d.key.toLowerCase().includes('dimensi') || d.key.toLowerCase().includes('ukuran') ? (
                      <>
                        <ImageIcon className="w-4 h-4 text-slate-600 dark:text-slate-400 shrink-0 mt-0.5" />
                        <span>{d.val}</span>
                      </>
                    ) : (
                      d.val
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Content / Slides */}
            {data.slides && data.slides.length > 0 ? (
              <div>
                <h4 className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-4">Detail Slide Content</h4>
                <div className="space-y-4">
                  {data.slides.map((slide, idx) => (
                    <div key={idx} className="bg-[#f8f9fc] border-l-[4px] border-blue-700 rounded-lg p-5 flex gap-5 relative overflow-hidden items-start shadow-sm">
                      {/* Circle Number */}
                      <div className="w-10 h-10 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center font-bold text-lg shrink-0 relative z-10">
                        {idx + 1}
                      </div>

                      <div className="flex-1 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 pr-16">
                        <div>
                          <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-3 text-sm">{slide.num}</h5>
                          <span className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">Isi Content</span>
                          <div className="bg-white dark:bg-slate-900 p-3 rounded border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed min-h-[60px] shadow-sm">
                            {slide.isi ? <MarkdownRenderer content={slide.isi} /> : '-'}
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="font-bold text-transparent mb-3 text-sm select-none hidden md:block">.</h5>
                          <span className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5 mt-4 md:mt-0">Instruksi Gambar</span>
                          <div className="flex items-start gap-2 text-xs font-semibold text-blue-600">
                            {slide.img && slide.img !== '-' ? (
                               <>
                                 <ImageIcon className="w-4 h-4 shrink-0 mt-0.5" />
                                 <span className="break-words">{slide.img}</span>
                               </>
                            ) : (
                               <>
                                 <Ban className="w-4 h-4 shrink-0 mt-0.5 text-slate-600 dark:text-slate-400" />
                                 <span className="text-slate-500">-</span>
                               </>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Watermark Outline Box */}
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                        <div className="border-[3px] border-slate-200 dark:border-slate-800/80 rounded-lg w-14 h-14 flex items-center justify-center font-black text-3xl text-slate-200/80">
                          {idx + 1}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
               isiKontenItem && (
                 <div>
                   <h4 className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-4">Isi Content</h4>
                   <div className="bg-[#f8f9fc] border-l-[4px] border-blue-700 rounded-lg p-5 text-sm font-medium text-slate-800 dark:text-slate-200 shadow-sm leading-relaxed">
                     <MarkdownRenderer content={isiKontenItem.val} />
                   </div>
                 </div>
               )
            )}
          </div>
        </div>
      </div>

      {/* Right Col: Additional & Contact */}
      <div className="space-y-6">
        {/* Additional */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
           <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
             <Paperclip className="w-4 h-4 text-blue-600" />
             <h3 className="font-bold text-blue-900 text-sm">Detail Tambahan</h3>
           </div>
           <div className="p-5 space-y-5">
             {data.additional.length > 0 ? data.additional.map((item, idx) => (
                <div key={idx}>
                  <span className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">{item.key}</span>
                  <div className="flex items-start gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400 shrink-0 mt-0.5" />
                    <span className="break-words">{item.val}</span>
                  </div>
                </div>
             )) : (
                <div className="text-xs text-slate-600 dark:text-slate-400 italic">Tidak ada detail tambahan</div>
             )}
           </div>
        </div>

        {/* Contact */}
        <div className="bg-[#002878] rounded-xl shadow-sm border border-[#001f5c] overflow-hidden text-white relative">
           <div className="absolute -bottom-10 -right-6 w-40 h-40 text-blue-500/10 pointer-events-none">
             <UserSquare2 className="w-full h-full" />
           </div>
           <div className="px-5 py-4 flex items-center gap-2 relative z-10">
             <User className="w-4 h-4 text-blue-200" />
             <h3 className="font-bold text-white text-sm">Contact Person</h3>
           </div>
           <div className="px-5 pb-5 relative z-10 space-y-4">
             {data.contact.length > 0 ? (
               <>
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-lg text-white shrink-0">
                     {data.contact[0]?.val?.[0] || 'U'}
                   </div>
                   <div>
                     <h4 className="font-bold text-white text-sm leading-tight">{data.contact[0]?.val || 'Unknown'}</h4>
                     <span className="text-[10px] text-blue-300">{data.contact[0]?.key || 'PIC'}</span>
                   </div>
                 </div>
                 
                 <div className="space-y-2 mt-4">
                   {data.contact.slice(1).map((c, i) => (
                     <div key={i} className="bg-blue-800/60 rounded-lg p-2.5 flex gap-3 items-center border border-blue-700/50">
                       <MessageSquare className="w-3.5 h-3.5 text-blue-300 shrink-0" />
                       <div>
                         <span className="text-xs font-medium text-blue-50 break-words block">{c.val}</span>
                         <span className="block text-[10px] text-blue-300 mt-0.5">{c.key}</span>
                       </div>
                     </div>
                   ))}
                 </div>
               </>
             ) : (
                <div className="text-xs text-blue-300 italic">Tidak ada kontak</div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
}


interface VideoTabProps {
  videos: VideoProject[];
  residents: Resident[];
  onAddVideo: (vid: VideoProject) => void;
  onUpdateVideo: (vid: VideoProject) => void;
  onDeleteVideo: (id: string) => void;
  onTriggerNotification: (msg: string) => void;
  currentUser?: { role: string; jabatan?: string } | null;
}

export default function VideoTab({
  videos,
  residents,
  onAddVideo,
  onUpdateVideo,
  onDeleteVideo,
  onTriggerNotification,
  currentUser
}: VideoTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [sortDesc, setSortDesc] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [newPlatform, setNewPlatform] = useState('Vlog');
  const [newPic, setNewPic] = useState('Unassigned');
  const [newDepartment, setNewDepartment] = useState('Departemen Media Komunikasi dan Informasi');
  const [newStatus, setNewStatus] = useState<VideoProject['status']>('To Do');

  const [selectedVideo, setSelectedVideo] = useState<VideoProject | null>(null);

  const columns: { id: VideoProject['status']; title: string; color: string; border: string }[] = [
    { id: 'To Do', title: 'To Do', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200', border: 'border-slate-200 dark:border-slate-800' },
    { id: 'In Progress', title: 'In Progress', color: 'bg-amber-50 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800' },
    { id: 'Review', title: 'Under Review', color: 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800' },
    { id: 'Done', title: 'Completed', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800' }
  ];

  const handleCreateVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created: VideoProject = {
      id: `VID-0${videos.length + 1}`,
      title: newTitle,
      department: newDepartment,
      status: newStatus,
      platform: newPlatform,
      date: "Oct 20",
      pic: newPic,
      imageUrl: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=400&q=80"
    };

    onAddVideo(created);
    setIsAddOpen(false);
    setNewTitle('');
    setNewPic('Unassigned');
    onTriggerNotification(`Added video project pipeline: ${created.title}`);
  };

  const hasAccess = checkPermission(currentUser?.jabatan, 'Video');

  const getFilteredVideos = (colId: VideoProject['status']) => {
    const filtered = videos.filter(v => v.status === colId && v.title.toLowerCase().includes(searchQuery.toLowerCase()));
    return sortDesc ? [...filtered].reverse() : filtered;
  };

  return (
    <div className="space-y-6">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-blue-100 dark:to-slate-300 tracking-tight">Video Content Pipeline</h2>
          <p className="text-sm text-slate-500 mt-1">Kanban board workflow for video projects.</p>
        </div>

        <div className="flex gap-2">
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            onClick={() => setSortDesc(p => !p)}
            title={sortDesc ? 'Tampilkan terlama dahulu' : 'Tampilkan terbaru dahulu'}
            className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:border-blue-400 hover:text-blue-600 transition-all"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            {sortDesc ? 'Terbaru' : 'Terlama'}
          </button>

          {(currentUser?.role === 'admin' && currentUser?.jabatan !== 'Pengawas') && (
          <button 
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/10"
          >
            <Plus className="w-4 h-4" />
            Add Video
          </button>
          )}
        </div>
      </div>

      {/* Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
        {columns.map((col) => {
          const colVideos = getFilteredVideos(col.id);
          return (
            <div key={col.id} className="bg-slate-50 dark:bg-slate-950/80 rounded-2xl p-4 border border-slate-200 dark:border-slate-800/60 flex flex-col h-[calc(100vh-220px)] min-h-[400px] max-h-[800px]">
              
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${col.color}`}>
                    {col.title}
                  </span>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{colVideos.length}</span>
                </div>
              </div>

              {/* Cards Container */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {colVideos.map((vid) => (
                  <div 
                    key={vid.id}
                    onClick={() => setSelectedVideo(vid)}
                    className="cursor-pointer bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 shadow-sm transition-all space-y-3 relative group overflow-hidden"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">
                        {vid.platform}
                      </span>
                      <span className="text-[10px] text-slate-600 dark:text-slate-400 font-mono font-bold">#{vid.id}</span>
                    </div>

                    <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs leading-normal">{vid.title}</h4>

                    <div className="h-24 relative bg-white dark:bg-slate-900 rounded-md overflow-hidden">
                      <img 
                        src={vid.imageUrl} 
                        alt={vid.title} 
                        className="w-full h-full object-cover opacity-80"
                        referrerPolicy="no-referrer"
                      />
                      {vid.isOverdue && (
                        <div className="absolute top-1 left-1 bg-rose-600 text-white text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded flex items-center gap-1">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          Overdue
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                        <span className="w-8 h-8 bg-white dark:bg-slate-900/90 rounded-full flex items-center justify-center shadow-lg text-slate-800 dark:text-slate-200">
                          <Play className="w-3 h-3 fill-current ml-0.5" />
                        </span>
                      </div>
                    </div>

                    {/* Footer Info */}
                    <div className="pt-2.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-600 dark:text-slate-400">
                      <span className={`font-semibold flex items-center gap-1 ${vid.urgency === 'High' || vid.urgency === 'Mendesak' ? 'text-rose-600 dark:text-rose-400' : vid.urgency === 'Medium' || vid.urgency === 'Menengah' ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                        <Clock className={`w-3 h-3 ${vid.urgency === 'High' || vid.urgency === 'Mendesak' ? 'text-rose-600 dark:text-rose-400' : vid.urgency === 'Medium' || vid.urgency === 'Menengah' ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`} />
                        {(() => {
                          const t = vid.date || '';
                          if (t.includes('/')) {
                            const parts = t.split('/');
                            if (parts.length === 3) {
                              const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
                              return `${parts[0]} ${months[parseInt(parts[1], 10)-1]} ${parts[2]}`;
                            }
                          }
                          return t;
                        })()}
                      </span>
                      
                      <div className="flex items-center gap-1">
                        <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 text-[8px] font-extrabold flex items-center justify-center border border-indigo-200">
                          {vid.pic ? vid.pic[0] : 'U'}
                        </span>
                        {(currentUser?.role === 'admin') ? (
                          <select
                            value={vid.pic}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => {
                              onUpdateVideo({ ...vid, pic: e.target.value });
                              onTriggerNotification(`PIC updated to ${e.target.value}`);
                            }}
                            disabled={!hasAccess}
                            className={`text-slate-800 dark:text-slate-200 font-bold border border-slate-200 dark:border-slate-800 rounded px-1 py-0.5 focus:ring-0 outline-none truncate max-w-[80px] text-[9px] transition-colors ${!hasAccess ? 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-800' : 'bg-slate-100 dark:bg-slate-800 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                          >
                            <option value="Unassigned" className="bg-white dark:bg-slate-900 text-slate-500 font-medium">Unassigned</option>
                            {residents.filter(r => r.division === 'Kadept' || r.division === 'Wakadept' || r.role === 'Admin Multimedia' || r.division === 'Multimedia').map(r => (
                              <option key={r.id} value={r.name} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">{r.name}</option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-slate-500 font-bold max-w-[50px] truncate">{vid.pic}</span>
                        )}
                      </div>
                    </div>

                    {/* Quick Move Action overlay buttons */}
                    {(currentUser?.role === 'admin') && (
                      <div 
                        className="absolute right-2 top-2 hidden group-hover:flex bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800 shadow gap-1 z-10"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <select
                          value={vid.status}
                          onChange={(e) => {
                            onUpdateVideo({
                              ...vid,
                              status: e.target.value as VideoProject['status']
                            });
                            onTriggerNotification(`Moved "${vid.title}" to ${e.target.value}`);
                          }}
                          disabled={!hasAccess}
                          className={`text-[9px] font-bold text-slate-800 dark:text-slate-200 border-none focus:ring-0 p-0.5 outline-none ${!hasAccess ? 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-800' : 'bg-white dark:bg-slate-900 cursor-pointer'}`}
                        >
                          <option value="To Do" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">To Do</option>
                          <option value="In Progress" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">In Progress</option>
                          <option value="Review" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">Review</option>
                          <option value="Done" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">Done</option>
                        </select>
                        {vid.status === 'Done' && currentUser?.jabatan !== 'Pengawas' && (
                          <button
                            onClick={() => {
                              onDeleteVideo(vid.id);
                              onTriggerNotification(`Moved to Archive.`);
                            }}
                            className="p-1 text-slate-600 dark:text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                            title="Move to Archive"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    )}

                  </div>
                ))}

                {colVideos.length === 0 && (
                  <div className="border-2 border-dashed border-slate-200 dark:border-slate-800/60 rounded-xl p-8 text-center text-slate-600 dark:text-slate-400 text-xs font-semibold">
                    No active videos
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Add video dialog */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-white dark:bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Add Video Project</h3>
              <button onClick={() => setIsAddOpen(false)} className="p-1 text-slate-600 dark:text-slate-400 hover:text-slate-400 rounded">
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateVideo} className="p-5 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Video Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tik Tok / Reels: Study Tips"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Departemen Pengaju</label>
                <select
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white font-medium"
                >
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
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Target Platform</label>
                  <select
                    value={newPlatform}
                    onChange={(e) => setNewPlatform(e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none text-slate-900 dark:text-white font-medium"
                  >
                    <option value="Vlog" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">Vlog</option>
                    <option value="YouTube Shorts" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">YouTube Shorts</option>
                    <option value="Instagram" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">Instagram</option>
                    <option value="YouTube" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">YouTube</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Initial Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none text-slate-900 dark:text-white font-medium"
                  >
                    <option value="To Do" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">To Do</option>
                    <option value="In Progress" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">In Progress</option>
                    <option value="Review" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">Review</option>
                    <option value="Done" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">Done</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">PIC Assigned</label>
                <select
                  required
                  value={newPic}
                  onChange={(e) => setNewPic(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none text-slate-900 dark:text-white font-medium"
                >
                  <option value="Unassigned" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">Unassigned</option>
                  {residents.filter(r => r.division === 'Kadept' || r.division === 'Wakadept' || r.role === 'Admin Multimedia' || r.division === 'Multimedia').map(r => (
                    <option key={r.id} value={r.name} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">{r.name} ({r.role})</option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold"
                >
                  Create Video Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* Detail Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white dark:bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-5xl w-[95vw] lg:w-[85vw] max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="sticky top-0 bg-white dark:bg-slate-900/90 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 p-5 flex justify-between items-center z-10">
              <div>
                <h3 className="font-black text-slate-900 dark:text-white text-lg">{selectedVideo.title}</h3>
                <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mt-1">{selectedVideo.platform}</p>
              </div>
              <button 
                onClick={() => setSelectedVideo(null)}
                className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-300 rounded-lg transition-colors"
              >
                &times;
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="w-full h-48 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden relative">
                <img src={selectedVideo.imageUrl} alt={selectedVideo.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">Status</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300 text-xs">{selectedVideo.status}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">Deadline</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300 text-xs">{selectedVideo.date}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">PIC</span>
                  {(currentUser?.role === 'admin') ? (
                    <select
                      value={selectedVideo.pic}
                      onChange={(e) => {
                        const updatedVideo = { ...selectedVideo, pic: e.target.value };
                        onUpdateVideo(updatedVideo);
                        setSelectedVideo(updatedVideo);
                        onTriggerNotification(`PIC updated to ${e.target.value}`);
                      }}
                      disabled={!hasAccess}
                      className={`font-bold text-slate-900 dark:text-slate-100 text-xs border border-slate-200 dark:border-slate-800 rounded px-2 py-1 focus:ring-0 outline-none w-full transition-colors ${!hasAccess ? 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-800' : 'bg-slate-100 dark:bg-slate-800 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                    >
                      <option value="Unassigned" className="bg-white dark:bg-slate-900 text-slate-500 font-medium">Unassigned</option>
                      {residents.filter(r => r.division === 'Kadept' || r.division === 'Wakadept' || r.role === 'Admin Multimedia' || r.division === 'Multimedia').map(r => (
                        <option key={r.id} value={r.name} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">{r.name}</option>
                      ))}
                    </select>
                  ) : (
                    <span className="font-bold text-slate-700 dark:text-slate-300 text-xs">{selectedVideo.pic}</span>
                  )}
                </div>
                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">ID</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300 text-xs">{selectedVideo.id}</span>
                </div>
              </div>

              {/* Brief / Details */}
              <div>
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Video className="w-3.5 h-3.5 text-indigo-600" />
                  Video Brief & Scripting Notes
                </h4>
                <FormattedVideoBriefRenderer text={selectedVideo.details || ''} />
              </div>
            </div>
            
            <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-end gap-3">
              <button
                onClick={() => setSelectedVideo(null)}
                className="px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-950 font-bold rounded-xl text-xs transition-colors shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import MarkdownRenderer from './MarkdownRenderer';
import { 
  Plus, 
  CalendarDays, 
  Clock, 
  Send, 
  Trash2, FileText, Camera, Image as ImageIcon, Ban, Paperclip, UserSquare2, PenLine, 
  Check, 
  Search,
  ArrowUpDown
} from 'lucide-react';
import { PublicationItem } from '../types';
import { checkPermission } from '../utils';

function parseBrief(text: string) {
  const lines = text.split('\n');
  let currentSection = '';
  const data = {
    header: '',
    details: [] as {key: string, val: string}[],
    caption: '',
        additional: [] as {key: string, val: string}[],
    contact: [] as {key: string, val: string}[]
  };

  let parsingCaption = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('===') || line.includes('---')) continue;
    if (line.includes('DEPARTEMEN MEDKOMINFO')) continue;
    if (line.includes('HMIF UPNVJ')) continue;
    if (line.includes('*Note :')) continue;

    if (line.startsWith('TEMPLATE PENGAJUAN')) {
      data.header = line.replace('TEMPLATE PENGAJUAN PUBLIKASI KONTEN: ', '').trim();
      continue;
    }

    if (line.trim() === 'DETAIL PENGAJUAN KONTEN') {
      currentSection = 'details';
      continue;
    }
    if (line.includes('DETAIL TAMBAHAN')) {
      currentSection = 'additional';
      parsingCaption = false;
      continue;
    }
    if (line.includes('CONTACT PERSON')) {
      currentSection = 'contact';
      parsingCaption = false;
      continue;
    }

    if (line.trim() === '') {
        if (parsingCaption) data.caption += '\n';
        continue;
    }

    if (currentSection === 'details') {
      if (line.startsWith('Caption / Teks:')) {
        parsingCaption = true;
        let cap = line.replace('Caption / Teks:', '').trim();
        if (cap) data.caption += cap + '\n';
        continue;
      }
            if (parsingCaption) {
        data.caption += line + '\n';
        continue;
      }
      
      const parts = line.split(':');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const val = parts.slice(1).join(':').trim();
        data.details.push({ key, val });
      }
    } else if (currentSection === 'additional') {
      const parts = line.split(':');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const val = parts.slice(1).join(':').trim();
        data.additional.push({ key, val });
      }
    } else if (currentSection === 'contact') {
      const parts = line.split(':');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const val = parts.slice(1).join(':').trim();
        data.contact.push({ key, val });
      }
    }
  }

  data.caption = data.caption.trim();
  return data;
}

const FormattedBriefRenderer = ({ text }: { text: string }) => {
  if (!text) {
    return (
      <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500 whitespace-pre-wrap leading-relaxed font-medium text-center italic">
        Tidak ada detail brief atau deskripsi untuk publikasi ini.
      </div>
    );
  }

  let data;
  if (text.includes('TEMPLATE PENGAJUAN PUBLIKASI KONTEN')) {
    data = parseBrief(text);
  } else {
    data = {
      header: 'CUSTOM PUBLICATION REQUEST',
      details: [{ key: 'Deskripsi', val: text }],
      caption: '',
      additional: [],
      contact: []
    };
  }

  const formatBoldText = (str: string) => {
    const parts = str.split('*');
    return parts.map((part, pIdx) => {
      if (pIdx % 2 === 1) {
        return (
          <strong key={pIdx} className="font-extrabold text-slate-900 dark:text-white">
            {part}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-5 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white dark:bg-slate-900/10 rounded-full blur-2xl -translate-y-10 translate-x-10"></div>
        <h5 className="text-[10px] font-extrabold text-emerald-100 uppercase tracking-widest mb-1.5 opacity-90 flex items-center gap-1.5">
          <Send className="w-3.5 h-3.5" />
          Jenis Publikasi
        </h5>
        <h3 className="text-base font-black uppercase tracking-wider relative z-10">{data.header || 'PUBLIKASI KONTEN'}</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left Col: Details & Additional */}
        <div className="space-y-5">
          {(data.details.length > 0) && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <CalendarDays className="w-3.5 h-3.5" />
                </span>
                <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Detail Pengajuan
                </h5>
              </div>
              <div className="p-4 space-y-4">
                {data.details.map((item, idx) => (
                  <div key={idx} className="flex flex-col gap-1 pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                    <span className="text-[10px] font-extrabold text-slate-600 dark:text-slate-400 uppercase tracking-wider">{item.key}</span>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 break-words">{item.val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(data.additional.length > 0) && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-amber-50 border-b border-amber-100 px-4 py-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <Plus className="w-3.5 h-3.5" />
                </span>
                <h5 className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                  Detail Tambahan
                </h5>
              </div>
              <div className="p-4 space-y-4 bg-amber-50/30">
                {data.additional.map((item, idx) => (
                  <div key={idx} className="flex flex-col gap-1 pb-3 border-b border-amber-100/50 last:border-0 last:pb-0">
                    <span className="text-[10px] font-extrabold text-amber-600/70 uppercase tracking-wider">{item.key}</span>
                    <span className="text-xs font-semibold text-amber-900 break-words">{item.val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {(data.contact.length > 0) && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                </span>
                <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Penanggung Jawab
                </h5>
              </div>
              <div className="p-4 grid grid-cols-2 gap-4">
                {data.contact.map((item, idx) => (
                  <div key={idx} className="flex flex-col gap-1">
                    <span className="text-[10px] font-extrabold text-slate-600 dark:text-slate-400 uppercase tracking-wider">{item.key}</span>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 break-words">{item.val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Caption */}
        <div className={`space-y-5 flex flex-col ${data.details.length === 0 && data.contact.length === 0 ? 'lg:col-span-2' : ''}`}>
          <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl flex flex-col flex-1 shadow-sm overflow-hidden min-h-[300px]">
            <div className="bg-indigo-100/50 border-b border-indigo-100 px-4 py-3 flex items-center gap-2 shrink-0">
              <span className="w-6 h-6 rounded-lg bg-indigo-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Send className="w-3.5 h-3.5" />
              </span>
              <h5 className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
                Caption / Teks Publikasi
              </h5>
            </div>
            <div className="p-4 overflow-y-auto flex-1">
              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-indigo-50 shadow-sm text-xs text-slate-700 dark:text-slate-300 leading-relaxed min-h-full">
                {data.caption ? <MarkdownRenderer content={data.caption} /> : (
                  <div className="h-full flex items-center justify-center py-10">
                     <p className="text-slate-600 dark:text-slate-400 font-medium italic text-center max-w-[200px]">Kosong / Tidak ada caption dilampirkan.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function PublicationTab({
  currentUser,
  residents,
  publications,
  onAddPublication,
  onUpdatePublication,
  onDeletePublication,
  onTriggerNotification
}: any) {
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedPub, setSelectedPub] = React.useState<any>(null);
  const [sortDesc, setSortDesc] = React.useState(true);

  const [newTitle, setNewTitle] = React.useState('');
  const [newPlatform, setNewPlatform] = React.useState('Instagram');
  const [newDate, setNewDate] = React.useState('');
  const [newTime, setNewTime] = React.useState('');
  const [newDepartment, setNewDepartment] = React.useState('Departemen Media Komunikasi dan Informasi');
  const [newPic, setNewPic] = React.useState('Unassigned');

  const hasAccess = checkPermission(currentUser?.jabatan, 'Content Publication');

  const filteredPubs = (() => {
    const f = publications.filter((p: any) => p.title.toLowerCase().includes(searchQuery.toLowerCase()));
    return sortDesc ? [...f].reverse() : f;
  })();

  const handleCreatePublication = (e: any) => {
    e.preventDefault();
    onAddPublication({
      id: 'PUB-' + Math.floor(Math.random() * 10000),
      title: newTitle,
      department: newDepartment,
      platform: newPlatform as any,
      date: newDate,
      time: newTime,
      pic: newPic === 'Unassigned' ? undefined : newPic,
      status: 'Scheduled'
    });
    setNewTitle('');
    setNewDate('');
    setNewTime('');
    setNewPic('Unassigned');
    setIsAddOpen(false);
    onTriggerNotification('Publication scheduled successfully');
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Published': return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-400 dark:border-emerald-800';
      case 'Scheduled': return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/50 dark:text-amber-400 dark:border-amber-800';
      default: return 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-800';
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Header */}
      <div className="bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-600 dark:text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search content drafts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:border-blue-500 bg-slate-50 dark:bg-slate-950/50"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSortDesc(p => !p)}
            title={sortDesc ? 'Tampilkan terlama dahulu' : 'Tampilkan terbaru dahulu'}
            className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:border-blue-400 hover:text-blue-600 transition-all"
          >
            <ArrowUpDown className="w-4 h-4" />
            {sortDesc ? 'Terbaru' : 'Terlama'}
          </button>

          {currentUser?.jabatan !== 'Pengawas' && (
            <button
              onClick={() => setIsAddOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Publication
            </button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500">
              <th className="py-3 px-5 text-[10px] font-black uppercase tracking-wider">Title</th>
              <th className="py-3 px-5 text-[10px] font-black uppercase tracking-wider">Date</th>
              <th className="py-3 px-5 text-[10px] font-black uppercase tracking-wider">Time</th>
              <th className="py-3 px-5 text-[10px] font-black uppercase tracking-wider">Platform</th>
              <th className="py-3 px-5 text-[10px] font-black uppercase tracking-wider">PIC</th>
              <th className="py-3 px-5 text-[10px] font-black uppercase tracking-wider">Status</th>
              <th className="py-3 px-5 text-[10px] font-black uppercase tracking-wider text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredPubs.map((pub: any) => (
              <tr key={pub.id} className="hover:bg-slate-950/50 transition-colors cursor-pointer" onClick={() => setSelectedPub(pub)}>
                <td className="py-4 px-5">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{pub.title}</span>
                </td>
                <td className="py-4 px-5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                    <CalendarDays className="w-3 h-3 text-slate-600 dark:text-slate-400" />
                    <span>{pub.date}</span>
                  </div>
                </td>
                <td className="py-4 px-5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                    <Clock className="w-3 h-3 text-slate-600 dark:text-slate-400" />
                    <span>{pub.time}</span>
                  </div>
                </td>
                <td className="py-4 px-5">
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full uppercase">
                    {pub.platform}
                  </span>
                </td>
                <td className="py-4 px-5" onClick={(e) => e.stopPropagation()}>
                  {(currentUser?.role === 'admin') ? (
                    <select
                      value={pub.pic || 'Unassigned'}
                      onChange={(e) => {
                        const newPic = e.target.value === 'Unassigned' ? undefined : e.target.value;
                        onUpdatePublication({ ...pub, pic: newPic });
                        onTriggerNotification(`PIC updated to ${e.target.value}`);
                      }}
                      disabled={!hasAccess}
                      className={`text-slate-800 dark:text-slate-200 font-bold border border-slate-200 dark:border-slate-800 rounded px-1 py-0.5 focus:ring-0 outline-none truncate max-w-[80px] text-[9px] transition-colors ${!hasAccess ? 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-800' : 'bg-slate-100 dark:bg-slate-800 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                    >
                      <option value="Unassigned" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">Unassigned</option>
                      {residents?.filter(r => r.role === 'Admin Humas' || r.division === 'Humas').map(r => (
                        <option key={r.id} value={r.name} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">{r.name}</option>
                      ))}
                    </select>
                  ) : (
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{pub.pic || 'Unassigned'}</span>
                  )}
                </td>
                <td className="py-4 px-5" onClick={(e) => e.stopPropagation()}>
                  <select
                    value={pub.status}
                    onChange={(e) => {
                      onUpdatePublication({ ...pub, status: e.target.value as any });
                      onTriggerNotification(`Status updated for "${pub.title}"`);
                    }}
                    disabled={!hasAccess}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${getStatusStyle(pub.status)} text-slate-800 dark:text-slate-200 ${!hasAccess ? 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-800' : 'cursor-pointer'}`}
                  >
                    <option value="Draft" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">Draft</option>
                    <option value="Scheduled" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">Scheduled</option>
                    <option value="Published" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">Published</option>
                  </select>
                </td>
                <td className="py-4 px-5 text-center">
                  <div className="flex items-center justify-center gap-1">
                    {pub.status !== 'Published' && currentUser?.jabatan !== 'Pengawas' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdatePublication({ ...pub, status: 'Published' });
                          onTriggerNotification(`Successfully published "${pub.title}" live!`);
                        }}
                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded"
                        title="Publish Live Now"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {currentUser?.jabatan !== 'Pengawas' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeletePublication(pub.id);
                        onTriggerNotification(`Deleted content schedule.`);
                      }}
                      className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                      title="Delete Schedule"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* Add popup form */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-white dark:bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Schedule New Content Publication</h3>
              <button onClick={() => setIsAddOpen(false)} className="p-1 text-slate-600 dark:text-slate-400 hover:text-slate-400 rounded">
                &times;
              </button>
            </div>

            <form onSubmit={handleCreatePublication} className="p-5 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Post Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Infographic HMI Citta Prakarsa Q3"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none"
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
                    <option value="Instagram" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">Instagram</option>
                    <option value="YouTube" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">YouTube</option>
                    <option value="TikTok" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">TikTok</option>
                    <option value="Website" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">Website</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Publish Date</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Oct 25, 2026"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Time of Post</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 19:00"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">PIC (Assigned)</label>
                <select
                  value={newPic}
                  onChange={(e) => setNewPic(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none text-slate-900 dark:text-white font-medium"
                >
                  <option value="Unassigned" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">Unassigned</option>
                  {residents?.filter(r => r.role === 'Admin Humas' || r.division === 'Humas').map(r => (
                    <option key={r.id} value={r.name} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">{r.name}</option>
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
                  Schedule Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* Detail Modal */}
      {selectedPub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white dark:bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-5xl w-[95vw] lg:w-[85vw] max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="sticky top-0 bg-white dark:bg-slate-900/90 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 p-5 flex justify-between items-center z-10">
              <div>
                <h3 className="font-black text-slate-900 dark:text-white text-lg">{selectedPub.title}</h3>
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mt-1">{selectedPub.platform}</p>
              </div>
              <button 
                onClick={() => setSelectedPub(null)}
                className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-300 rounded-lg transition-colors"
              >
                &times;
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Info grid */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">Status</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300 text-xs">{selectedPub.status}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">Date</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300 text-xs">{selectedPub.date}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">Time</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300 text-xs">{selectedPub.time}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">PIC</span>
                  {(currentUser?.role === 'admin') ? (
                    <select
                      value={selectedPub.pic || 'Unassigned'}
                      onChange={(e) => {
                        const newPic = e.target.value === 'Unassigned' ? undefined : e.target.value;
                        const updatedPub = { ...selectedPub, pic: newPic };
                        onUpdatePublication(updatedPub);
                        setSelectedPub(updatedPub);
                        onTriggerNotification(`PIC updated to ${e.target.value}`);
                      }}
                      disabled={!hasAccess}
                      className={`font-bold text-slate-900 dark:text-slate-100 text-xs border border-slate-200 dark:border-slate-800 rounded px-2 py-1 focus:ring-0 outline-none w-full transition-colors ${!hasAccess ? 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-800' : 'bg-slate-100 dark:bg-slate-800 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                    >
                      <option value="Unassigned" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">Unassigned</option>
                      {residents?.filter(r => r.role === 'Admin Humas' || r.division === 'Humas').map(r => (
                        <option key={r.id} value={r.name} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">{r.name}</option>
                      ))}
                    </select>
                  ) : (
                    <span className="font-bold text-slate-700 dark:text-slate-300 text-xs">{selectedPub.pic || 'Unassigned'}</span>
                  )}
                </div>
                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">ID</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300 text-xs">{selectedPub.id}</span>
                </div>
              </div>

              {/* Brief / Details */}
              <div>
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Send className="w-3.5 h-3.5 text-blue-600" />
                  Publication Brief & Caption
                </h4>
                <FormattedBriefRenderer text={selectedPub.details || ''} />
              </div>
            </div>
            
            <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-end gap-3">
              <button
                onClick={() => setSelectedPub(null)}
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

import React, { useState } from 'react';
import { 
  Archive, 
  Search, 
  ExternalLink, 
  Calendar, 
  User, 
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { ArchiveItem } from '../types';

interface ArchiveTabProps {
  currentUser: { id?: string; name: string; email?: string; role: 'admin' | 'public'; nim?: string; jabatan?: string; avatarUrl?: string } | null;
  archives: ArchiveItem[];
  onTriggerNotification: (msg: string) => void;
  onDeleteArchive: (id: string) => void;
  onRestoreArchive: (item: ArchiveItem) => void;
}

export default function ArchiveTab({
  currentUser,
  archives,
  onTriggerNotification,
  onDeleteArchive,
  onRestoreArchive
}: ArchiveTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [itemToDelete, setItemToDelete] = useState<ArchiveItem | null>(null);
  const [itemToRestore, setItemToRestore] = useState<ArchiveItem | null>(null);

  const filtered = archives.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-blue-100 dark:to-slate-300 tracking-tight">Project Archive</h2>
          <p className="text-sm text-slate-500 mt-1">Historic repository of published content, finished designs, and expired media MoUs.</p>
        </div>

        <div className="relative w-64">
          <Search className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search archived items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none"
          />
        </div>
      </div>

      {/* Archives List Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 uppercase font-bold text-[10px] border-b border-slate-200 dark:border-slate-800">
              <th className="py-3 px-5">ID</th>
              <th className="py-3 px-5">Project Name</th>
              <th className="py-3 px-5">Type / Category</th>
              <th className="py-3 px-5">Completion Date</th>
              <th className="py-3 px-5 text-center">PIC Leader</th>
              {currentUser?.jabatan !== 'Pengawas' && (
                <th className="py-3 px-5 text-center">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-slate-950/50 transition-colors">
                <td className="py-4 px-5 font-mono text-slate-600 dark:text-slate-400">{item.id}</td>
                <td className="py-4 px-5 font-bold text-slate-800 dark:text-slate-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    {item.name}
                  </div>
                </td>
                <td className="py-4 px-5">
                  <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase">
                    {item.category}
                  </span>
                </td>
                <td className="py-4 px-5 font-medium text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                    {item.dateCompleted}
                  </div>
                </td>
                <td className="py-4 px-5 font-semibold text-slate-600 dark:text-slate-400">
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="w-5 h-5 bg-blue-50 text-blue-700 text-[9px] font-extrabold rounded-full flex items-center justify-center border border-blue-100 shrink-0">
                      {item.pic[0]}
                    </span>
                    {item.pic}
                  </div>
                </td>
                {currentUser?.jabatan !== 'Pengawas' && (
                  <td className="py-4 px-5 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => {
                          onRestoreArchive(item);
                          onTriggerNotification(`Restored project draft for ${item.name}`);
                        }}
                        className="px-2.5 py-1 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold border border-slate-200 dark:border-slate-800 rounded-lg transition-colors"
                      >
                        Restore Draft
                      </button>
                      <button
                        onClick={() => setItemToDelete(item)}
                        className="p-1 text-slate-600 dark:text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                        title="Permanently Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white dark:bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">Konfirmasi Hapus</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              Apakah anda ingin menghapus "{itemToDelete.name}" dari archive secara permanen?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  onDeleteArchive(itemToDelete.id);
                  onTriggerNotification(`Item dihapus secara permanen`);
                  setItemToDelete(null);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-sm rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
      
      </div>
  );
}

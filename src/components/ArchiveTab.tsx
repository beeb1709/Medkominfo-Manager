import React, { useState } from 'react';
import { 
  Search, 
  Calendar, 
  CheckCircle2,
  Trash2,
  ArchiveRestore,
  ArchiveX
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

  const filtered = archives.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const isAdmin = currentUser?.jabatan !== 'Pengawas';

  const categoryColor: Record<string, string> = {
    DESIGN: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
    VIDEO: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    PUBLIKASI: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    BROADCAST: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    MOU: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-blue-100 dark:to-slate-300 tracking-tight">Project Archive</h2>
          <p className="text-sm text-slate-500 mt-1">Historic repository of published content, finished designs, and expired media MoUs.</p>
        </div>
        <div className="relative w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search archived items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        
        {/* Table Header */}
        <div className={`grid ${isAdmin ? 'grid-cols-[1.5fr_2fr_1fr_1.5fr_2fr_1.2fr]' : 'grid-cols-[1.5fr_2fr_1fr_1.5fr_2fr]'} gap-0 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-4`}>
          <div className="py-3 px-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">ID</div>
          <div className="py-3 px-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Project Name</div>
          <div className="py-3 px-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Type</div>
          <div className="py-3 px-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Completion Date</div>
          <div className="py-3 px-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">PIC Leader</div>
          {isAdmin && (
            <div className="py-3 px-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-center">Actions</div>
          )}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <ArchiveX className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">No archived items</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Items deleted from other tabs will appear here.</p>
          </div>
        )}

        {/* Table Rows */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`grid ${isAdmin ? 'grid-cols-[1.5fr_2fr_1fr_1.5fr_2fr_1.2fr]' : 'grid-cols-[1.5fr_2fr_1fr_1.5fr_2fr]'} gap-0 px-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors`}
            >
              {/* ID */}
              <div className="py-4 px-2 font-mono text-[11px] text-slate-500 dark:text-slate-400 truncate" title={item.id}>
                {item.id}
              </div>

              {/* Project Name */}
              <div className="py-4 px-2 flex items-center gap-2 min-w-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="font-semibold text-sm text-slate-800 dark:text-slate-200 truncate">{item.name}</span>
              </div>

              {/* Category */}
              <div className="py-4 px-2">
                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${categoryColor[item.category?.toUpperCase()] || 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                  {item.category}
                </span>
              </div>

              {/* Completion Date */}
              <div className="py-4 px-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <span>{item.dateCompleted}</span>
              </div>

              {/* PIC */}
              <div className="py-4 px-2 flex items-center gap-2 min-w-0">
                <span className="w-6 h-6 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[10px] font-extrabold rounded-full flex items-center justify-center shrink-0">
                  {item.pic?.[0]?.toUpperCase() ?? '?'}
                </span>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">{item.pic}</span>
              </div>

              {/* Actions */}
              {isAdmin && (
                <div className="py-4 px-2 flex items-center justify-center gap-1.5">
                  <button
                    onClick={() => {
                      onRestoreArchive(item);
                      onTriggerNotification(`Restored project draft for ${item.name}`);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
                  >
                    <ArchiveRestore className="w-3 h-3" />
                    Restore
                  </button>
                  <button
                    onClick={() => setItemToDelete(item)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors"
                    title="Permanently Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-rose-100 dark:bg-rose-900/30 rounded-xl flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-rose-600" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Hapus Permanen</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              Apakah Anda yakin ingin menghapus <span className="font-bold text-slate-800 dark:text-slate-200">"{itemToDelete.name}"</span> secara permanen? Tindakan ini tidak dapat dibatalkan.
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

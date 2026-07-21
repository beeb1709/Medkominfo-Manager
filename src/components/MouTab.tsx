import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  ExternalLink, 
  AlertCircle, 
  Check, 
  User, 
  CalendarDays,
  Search,
  Edit2,
  ArrowUpDown
} from 'lucide-react';
import { RefreshCw, Database } from 'lucide-react';
import { MouAgreement } from '../types';
import { checkPermission } from '../utils';

interface MouTabProps {
  mous: MouAgreement[];
  currentUser?: { name: string; role: string; jabatan?: string } | null;
  onAddMou: (mou: MouAgreement) => void;
  onUpdateMou: (mou: MouAgreement) => void;
  onDeleteMou: (id: string) => void;
  onTriggerNotification: (msg: string) => void;
}

const HUMAS_MEMBERS = [
  'Muhammad Habibie Wibisono',
  'Rihadatul Aliya',
  'Syifa Nafisa'
];

export default function MouTab({
  mous,
  currentUser,
  onAddMou,
  onUpdateMou,
  onDeleteMou,
  onTriggerNotification
}: MouTabProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortDesc, setSortDesc] = useState(true);
  const [newInstitution, setNewInstitution] = useState('');
  const [newMouType, setNewMouType] = useState<'MoU Satu Periode' | 'MoU Event'>('MoU Satu Periode');
  const [newValidityStart, setNewValidityStart] = useState('');
  const [newValidityEnd, setNewValidityEnd] = useState('');
  const [newDepartment, setNewDepartment] = useState('Departemen Media Komunikasi dan Informasi');
  const [newPdfFile, setNewPdfFile] = useState<File | null>(null);
  const [newPic, setNewPic] = useState('Unassigned');

  const [editingMou, setEditingMou] = useState<MouAgreement | null>(null);
  const [editPdfFile, setEditPdfFile] = useState<File | null>(null);
  const [editPic, setEditPic] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [sheetsInited, setSheetsInited] = useState(false);

  const hasAccess = checkPermission(currentUser?.jabatan, 'MoU');
  const canEdit = hasAccess;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-400 dark:border-emerald-800';
      case 'Waiting TTD': return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/50 dark:text-amber-400 dark:border-amber-800 animate-pulse';
      case 'Expired': return 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-500 dark:border-slate-800';
      default: return 'bg-slate-50 text-slate-600 dark:bg-slate-950 dark:text-slate-300';
    }
  };

  const handleCreateMou = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInstitution.trim() || !newValidityStart || !newValidityEnd) return;

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const formattedValidity = `${formatDate(newValidityStart)} - ${formatDate(newValidityEnd)}`;

    const created: MouAgreement = {
      id: `MOU-0${mous.length + 1}`,
      institution: newInstitution,
      department: newDepartment,
      mouType: newMouType,
      validity: formattedValidity,
      pdfUrl: newPdfFile ? URL.createObjectURL(newPdfFile) : undefined,
      pic: newPic,
      status: newPdfFile ? 'Active' : 'Waiting TTD'
    };

        onAddMou(created);

    setIsAddOpen(false);
    setNewInstitution('');
    setNewValidityStart('');
    setNewValidityEnd('');
    setNewPic('Unassigned');
    setNewPdfFile(null);
    onTriggerNotification(`Drafted MoU partnership proposal with ${created.institution}`);
  };

  const handleUpdateMou = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMou) return;
    
    const updated = { ...editingMou };
    if (editPic) updated.pic = editPic;
    if (editPdfFile) {
      updated.pdfUrl = URL.createObjectURL(editPdfFile);
      updated.status = 'Active';
    }
    
    onUpdateMou(updated);
    setEditingMou(null);
    setEditPdfFile(null);
    setEditPic('');
    onTriggerNotification(`Updated MoU with ${updated.institution}`);
  };

  const getDerivedStatus = (mou: MouAgreement): string => {
    if (mou.status !== 'Active') return mou.status;
    const parts = mou.validity.split(' - ');
    if (parts.length === 2) {
      const endDate = new Date(parts[1]);
      const now = new Date();
      now.setHours(0, 0, 0, 0); // compare dates without time
      if (endDate < now) {
        return 'Expired';
      }
    }
    return mou.status;
  };

  const filtered = (() => {
    const f = mous.filter(m => m.institution.toLowerCase().includes(searchQuery.toLowerCase()));
    return sortDesc ? [...f].reverse() : f;
  })();

  return (
    <div className="space-y-6">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-blue-100 dark:to-slate-300 tracking-tight">MoU Agreements & Media Partners</h2>
          <p className="text-sm text-slate-500 mt-1">Track strategic partner memorandums, media contracts, and renewal timelines.</p>
        </div>

        <div className="flex gap-2">
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search partnerships..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none"
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

          <button 
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/10"
          >
            <Plus className="w-4 h-4" />
            Draft MoU
          </button>
        </div>
      </div>

      {/* MoU list table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 uppercase font-bold text-[10px] border-b border-slate-200 dark:border-slate-800">
              <th className="py-3 px-5">ID</th>
              <th className="py-3 px-5">Institusi atau Ormawa</th>
              <th className="py-3 px-5">Tipe MoU</th>
              <th className="py-3 px-5">Masa Berlaku</th>
              <th className="py-3 px-5">PIC</th>
              <th className="py-3 px-5 text-center">Status</th>
              <th className="py-3 px-5 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((mou) => (
              <tr key={mou.id} className="hover:bg-slate-950/50 transition-colors">
                <td className="py-4 px-5 font-mono text-slate-600 dark:text-slate-400">{mou.id}</td>
                <td className="py-4 px-5 font-bold text-slate-800 dark:text-slate-200">{mou.institution}</td>
                <td className="py-4 px-5">
                  <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase">
                    {mou.mouType}
                  </span>
                </td>
                <td className="py-4 px-5">
                  <div className="flex items-center gap-1.5 font-medium text-slate-500">
                    <CalendarDays className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                    {mou.validity}
                  </div>
                </td>
                
                <td className="py-4 px-5">
                  {(currentUser?.role === 'admin') ? (
                    <select
                      value={mou.pic || 'Unassigned'}
                      onChange={(e) => {
                        const newPic = e.target.value === 'Unassigned' ? undefined : e.target.value;
                        onUpdateMou({ ...mou, pic: newPic });
                        onTriggerNotification(`PIC updated to ${e.target.value}`);
                      }}
                      disabled={!hasAccess}
                      className={`text-slate-800 dark:text-slate-200 font-bold border border-slate-200 dark:border-slate-800 rounded px-1.5 py-0.5 focus:ring-0 outline-none max-w-[120px] text-[10px] transition-colors ${!hasAccess ? 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-800' : 'bg-slate-100 dark:bg-slate-800 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                    >
                      <option value="Unassigned">Unassigned</option>
                      {HUMAS_MEMBERS.map(member => (
                        <option key={member} value={member}>{member}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-400">
                      {mou.pic && <User className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />}
                      {mou.pic || '-'}
                    </div>
                  )}
                </td>

                
                <td className="py-4 px-5 text-center">
                  {(currentUser?.role === 'admin') ? (
                    <select
                      value={mou.status}
                      onChange={(e) => {
                        onUpdateMou({ ...mou, status: e.target.value as any });
                        onTriggerNotification(`Status updated to ${e.target.value}`);
                      }}
                      disabled={!hasAccess || getDerivedStatus(mou) === 'Expired'}
                      className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border inline-block ${getStatusBadge(getDerivedStatus(mou))} ${(!hasAccess || getDerivedStatus(mou) === 'Expired') ? 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-800' : 'cursor-pointer'}`}
                    >
                      <option value="Waiting TTD">Waiting TTD</option>
                      <option value="Active">Active</option>
                      <option value="Expired" disabled>Expired</option>
                    </select>
                  ) : (
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border inline-block ${getStatusBadge(getDerivedStatus(mou))}`}>
                      {getDerivedStatus(mou)}
                    </span>
                  )}
                </td>

                <td className="py-4 px-5 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    {getDerivedStatus(mou) === 'Waiting TTD' && (
                      <button
                        onClick={() => {
                          onUpdateMou({ ...mou, status: 'Active' });
                          onTriggerNotification(`MoU with ${mou.institution} is now ACTIVE!`);
                        }}
                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-lg border border-emerald-100 transition-colors"
                      >
                        Approve & TTD
                      </button>
                    )}
                    {canEdit && (
                      <button
                        onClick={() => {
                          setEditingMou(mou);
                          setEditPic(mou.pic || '');
                          setEditPdfFile(null);
                        }}
                        className="p-1 text-slate-600 dark:text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                        title="Edit MoU Document/PIC"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        onTriggerNotification(`Opening agreement PDF file for: ${mou.institution}`);
                        if (mou.pdfUrl && mou.pdfUrl.startsWith('blob:')) {
                          window.open(mou.pdfUrl, '_blank');
                        } else {
                          window.open('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', '_blank');
                        }
                      }}
                      className="p-1 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                      title="View PDF Document"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                    {canEdit && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to archive MoU with ${mou.institution}?`)) {
                            onDeleteMou(mou.id);
                            onTriggerNotification(`MoU archived: ${mou.institution}`);
                          }
                        }}
                        className="p-1 text-slate-600 dark:text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded"
                        title="Archive MoU"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
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

      {/* Draft MoU form modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-white dark:bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Draft New MoU Strategic Agreement</h3>
              <button onClick={() => setIsAddOpen(false)} className="p-1 text-slate-600 dark:text-slate-400 hover:text-slate-400 rounded">
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateMou} className="p-5 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Institusi atau Ormawa</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Universitas Indonesia"
                  value={newInstitution}
                  onChange={(e) => setNewInstitution(e.target.value)}
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
              
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Tipe MoU</label>
                <select
                  value={newMouType}
                  onChange={(e) => setNewMouType(e.target.value as any)}
                  className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none"
                >
                  <option value="MoU Satu Periode">MoU Satu Periode</option>
                  <option value="MoU Event">MoU Event</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Masa Berlaku</label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="date"
                    required
                    value={newValidityStart}
                    onChange={(e) => setNewValidityStart(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none"
                  />
                  <span className="text-slate-600 dark:text-slate-400 self-center">-</span>
                  <input
                    type="date"
                    required
                    value={newValidityEnd}
                    onChange={(e) => setNewValidityEnd(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Bukti MoU (PDF)</label>
                <input
                  type="file"
                  accept="application/pdf"
                  required
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setNewPdfFile(e.target.files[0]);
                    }
                  }}
                  className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">PIC MoU</label>
                <select
                  value={newPic}
                  onChange={(e) => setNewPic(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none"
                >
                  <option value="Unassigned">Unassigned</option>
                  {HUMAS_MEMBERS.map(member => (
                    <option key={member} value={member}>{member}</option>
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
                  Draft MOU Agreement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit MoU modal */}
      {editingMou && (
        <div className="fixed inset-0 bg-white dark:bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Edit Dokumen/PIC MoU</h3>
              <button onClick={() => { setEditingMou(null); setEditPdfFile(null); setEditPic(''); }} className="p-1 text-slate-600 dark:text-slate-400 hover:text-slate-400 rounded">
                &times;
              </button>
            </div>

            <form onSubmit={handleUpdateMou} className="p-5 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Ganti PIC MoU</label>
                <select
                  value={editPic}
                  onChange={(e) => setEditPic(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none"
                >
                  <option value="Unassigned">Unassigned</option>
                  {HUMAS_MEMBERS.map(member => (
                    <option key={member} value={member}>{member}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Ganti Bukti MoU (PDF)</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setEditPdfFile(e.target.files[0]);
                    }
                  }}
                  className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-1">Biarkan kosong jika dokumen sudah benar.</p>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setEditingMou(null); setEditPdfFile(null); setEditPic(''); }}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

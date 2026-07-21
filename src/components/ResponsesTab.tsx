import RichTextArea from './RichTextArea';
import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  FileSpreadsheet, 
  Plus, 
  Download, 
  RefreshCw,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Zap,
  Check,
  Trash2,
  X
} from 'lucide-react';
import { Submission } from '../types';

interface ResponsesTabProps {
  submissions: Submission[];
  onAddSubmission: (newSub: Submission) => void;
  onUpdateSubmission: (updatedSub: Submission) => void;
  onDeleteSubmission: (id: string) => void;
  onTriggerNotification: (msg: string) => void;
}

export default function ResponsesTab({
  submissions,
  onAddSubmission,
  onUpdateSubmission,
  onDeleteSubmission,
  onTriggerNotification
}: ResponsesTabProps) {
  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [urgencyFilter, setUrgencyFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Integration Sheets state
  const [spreadsheetId, setSpreadsheetId] = useState(localStorage.getItem('medkom_spreadsheet_id') || '');
  const [sheetName, setSheetName] = useState('Form Responses 1');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLinked, setIsLinked] = useState(!!localStorage.getItem('medkom_spreadsheet_id'));

  // Simulation form state
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const [newForm, setNewForm] = useState({
    sender: '',
    department: 'Departemen Media Komunikasi dan Informasi',
    picHumas: 'Unassigned',
    programKerja: '',
    jenisPengajuan: 'Publikasi Broadcast',
    urgency: 'Medium' as 'Low' | 'Medium' | 'High',
    deadline: '',
    details: ''
  });

  const handleLinkSheets = (e: React.FormEvent) => {
    e.preventDefault();
    if (!spreadsheetId.trim()) return;
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setIsLinked(true);
      localStorage.setItem('medkom_spreadsheet_id', spreadsheetId);
      onTriggerNotification("Connected to Google Sheets: Loaded 5 active responses.");
    }, 1200);
  };

  const handleSyncNow = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      onTriggerNotification("Real-time Sheets synchronization successful!");
    }, 1000);
  };

  const handleCreateRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `MDK-2026-0${submissions.length + 1}`;
    const timestampStr = new Date().toLocaleDateString('id-ID');
    
    const created: Submission = {
      id: newId,
      timestamp: timestampStr,
      sender: newForm.sender,
      department: newForm.department,
      picHumas: newForm.picHumas,
      programKerja: newForm.programKerja || "Program Kerja Umum",
      jenisPengajuan: newForm.jenisPengajuan,
      urgency: newForm.urgency,
      deadline: newForm.deadline || "Jumat, 30 Jun 2026",
      status: 'Queue',
      details: newForm.details
    };

    onAddSubmission(created);
    setIsNewRequestOpen(false);
    setNewForm({
      sender: '',
      department: 'Medkominfo',
      picHumas: 'Unassigned',
      programKerja: '',
      jenisPengajuan: 'Publikasi Broadcast',
      urgency: 'Medium',
      deadline: '',
      details: ''
    });
    onTriggerNotification(`New submission ${newId} queued successfully!`);
  };

  // Filter logic
  const filteredSubmissions = submissions.filter(sub => {
    const matchesSearch = 
      sub.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.programKerja.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.jenisPengajuan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDept = deptFilter === 'All' || sub.department === deptFilter;
    const matchesUrgency = urgencyFilter === 'All' || sub.urgency === urgencyFilter;
    const matchesStatus = statusFilter === 'All' || sub.status === statusFilter;

    return matchesSearch && matchesDept && matchesUrgency && matchesStatus;
  });

  const getUrgencyBadge = (urgency: 'Low' | 'Medium' | 'High') => {
    switch (urgency) {
      case 'High': return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/50 dark:text-rose-400 dark:border-rose-800';
      case 'Medium': return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/50 dark:text-amber-400 dark:border-amber-800';
      case 'Low': return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/50 dark:text-blue-400 dark:border-blue-800';
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Queue': return 'bg-amber-50 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400';
      case 'Designing': return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400';
      case 'Revision': return 'bg-rose-50 text-rose-700 dark:bg-rose-900/50 dark:text-rose-400';
      case 'Approved': return 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400';
      case 'Published': return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-blue-100 dark:to-slate-300 tracking-tight">Responses</h2>
          <p className="text-sm text-slate-500 mt-1">Manage external requests and inter-divisional inquiries.</p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              const csvContent = "data:text/csv;charset=utf-8,ID,Timestamp,Sender,Department,PIC Humas,Program,Type,Urgency,Deadline,Status\n" + 
                submissions.map(s => `"${s.id}","${s.timestamp}","${s.sender}","${s.department}","${s.picHumas}","${s.programKerja}","${s.jenisPengajuan}","${s.urgency}","${s.deadline}","${s.status}"`).join("\n");
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", "medkom_submissions_export.csv");
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              onTriggerNotification("Submissions database exported as CSV!");
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold transition-all text-slate-700 dark:text-slate-300 shadow-sm"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Export
          </button>
          
          <button 
            onClick={() => setIsNewRequestOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/10"
          >
            <Plus className="w-4 h-4" />
            New Request
          </button>
        </div>
      </div>

      {/* Sheets Quick Linking Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Responses Table & Search/Filter Row */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Filters Bar */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap gap-3 items-center justify-between">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-slate-600 dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-[11px] font-semibold text-slate-800 dark:text-slate-100 focus:outline-none"
              >
                <option value="All" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">All Departments</option>
                <option value="Departemen Eselon" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">Departemen Eselon</option>
                <option value="Departemen Kesejahteraan Mahasiswa" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">Departemen Kesejahteraan Mahasiswa</option>
                <option value="Departemen Pengembangan Mahasiswa" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">Departemen Pengembangan Mahasiswa</option>
                <option value="Departemen Pengembangan Sumber Daya Manusia" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">Departemen PSDM</option>
                <option value="Departemen Ekonomi Kreatif" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">Departemen Ekonomi Kreatif</option>
                <option value="Departemen Media Komunikasi dan Informasi" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">Departemen Medkominfo</option>
              </select>

              <select
                value={urgencyFilter}
                onChange={(e) => setUrgencyFilter(e.target.value)}
                className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-[11px] font-semibold text-slate-800 dark:text-slate-100 focus:outline-none"
              >
                <option value="All" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">All Urgencies</option>
                <option value="High" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">High</option>
                <option value="Medium" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">Medium</option>
                <option value="Low" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">Low</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-[11px] font-semibold text-slate-800 dark:text-slate-100 focus:outline-none"
              >
                <option value="All" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">All Statuses</option>
                <option value="Queue" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">Queue</option>
                <option value="Designing" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">Designing</option>
                <option value="Revision" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">Revision</option>
                <option value="Approved" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">Approved</option>
                <option value="Published" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">Published</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 uppercase font-extrabold text-[10px] border-b border-slate-200 dark:border-slate-800">
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Pengirim</th>
                    <th className="py-3 px-4">Departemen</th>
                    <th className="py-3 px-4">PIC Humas</th>
                    <th className="py-3 px-4">Program Kerja</th>
                    <th className="py-3 px-4">Jenis Pengajuan</th>
                    <th className="py-3 px-4">Urgensi</th>
                    <th className="py-3 px-4">Deadline</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSubmissions.length > 0 ? (
                    filteredSubmissions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-950/50 transition-colors">
                        <td className="py-3.5 px-4 font-medium text-slate-600 dark:text-slate-400">{sub.timestamp}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">{sub.sender}</td>
                        <td className="py-3.5 px-4 font-semibold text-slate-500">{sub.department}</td>
                        <td className="py-3.5 px-4 font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                          <span className="w-5 h-5 bg-blue-50 text-blue-700 text-[10px] font-extrabold rounded-full flex items-center justify-center border border-blue-100">
                            {sub.picHumas[0]}
                          </span>
                          {sub.picHumas}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-500 truncate max-w-[120px]" title={sub.programKerja}>
                          {sub.programKerja}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{sub.jenisPengajuan}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getUrgencyBadge(sub.urgency)}`}>
                            {sub.urgency === 'High' ? 'Mendesak' : sub.urgency === 'Medium' ? 'Menengah' : 'Standar'}
                          </span>
                        </td>
                        <td className={`py-3.5 px-4 font-bold ${sub.urgency === 'High' ? 'text-rose-600 dark:text-rose-400' : sub.urgency === 'Medium' ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                          {(() => {
                            const t = sub.deadline || '';
                            if (t.includes('/')) {
                              const parts = t.split('/');
                              if (parts.length === 3) {
                                const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
                                return `${parts[0]} ${months[parseInt(parts[1], 10)-1]} ${parts[2]}`;
                              }
                            }
                            return t;
                          })()}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => {
                                onDeleteSubmission(sub.id);
                                onTriggerNotification(`Removed submission ${sub.id}`);
                              }}
                              className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-600 dark:text-slate-400 font-medium">
                        No submissions match the filters. Try typing a different search query.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Mock */}
            <div className="bg-slate-50 dark:bg-slate-950 p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
              <span>Showing 1 to {filteredSubmissions.length} of {filteredSubmissions.length} entries</span>
              <div className="flex gap-1">
                <button className="px-2 py-1 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400" disabled>&lt;</button>
                <button className="px-3 py-1 rounded bg-blue-600 text-white font-bold">1</button>
                <button className="px-3 py-1 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">2</button>
                <button className="px-3 py-1 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">3</button>
                <button className="px-2 py-1 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">&gt;</button>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Google Sheets Integration config */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Google Sheets Sync</h3>
            </div>
            
            <p className="text-xs text-slate-500 leading-relaxed">
              Connect this operations portal directly to the live Google Sheets backing your Google Form.
            </p>

            <form onSubmit={handleLinkSheets} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Spreadsheet ID</label>
                <input
                  type="text"
                  placeholder="e.g. 1aBcDeFgHiJkLmNoPqRsTuV..."
                  value={spreadsheetId}
                  onChange={(e) => setSpreadsheetId(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Sheet Name</label>
                <input
                  type="text"
                  placeholder="Form Responses 1"
                  value={sheetName}
                  onChange={(e) => setSheetName(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSyncing}
                className={`w-full py-2.5 rounded-lg text-xs font-bold text-white transition-all ${
                  isLinked 
                    ? 'bg-emerald-600 hover:bg-emerald-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
                } flex items-center justify-center gap-2`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Syncing...' : isLinked ? 'Sheets Connected' : 'Connect Google Sheets'}
              </button>
            </form>

            {isLinked && (
              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-100 text-[11px] font-bold text-emerald-800">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  Active Syncing
                </span>
                <button 
                  onClick={() => {
                    setIsLinked(false);
                    setSpreadsheetId('');
                    localStorage.removeItem('medkom_spreadsheet_id');
                    onTriggerNotification("Disconnected Google Sheets integration.");
                  }}
                  className="text-rose-600 hover:underline"
                >
                  Disconnect
                </button>
              </div>
            )}
          </div>

          {/* Quick Guide */}
          <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs">How it works:</h4>
            <ul className="space-y-2.5 text-slate-600 dark:text-slate-400 text-[11px] list-decimal pl-4">
              <li>Open your Google Sheets response sheet.</li>
              <li>Ensure the spreadsheet is shared with <strong>Anyone with link can view</strong>.</li>
              <li>Paste the spreadsheet ID from the URL.</li>
              <li>Submissions will automatically flow into the board below!</li>
            </ul>
          </div>
        </div>

      </div>

      {/* Simulasi New GForm Request Modal */}
      {isNewRequestOpen && (
        <div className="fixed inset-0 bg-white dark:bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Create New Submission Request</h3>
              <button 
                onClick={() => setIsNewRequestOpen(false)}
                className="p-1 text-slate-600 dark:text-slate-400 hover:text-slate-400 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRequestSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Pengirim Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Naqila"
                    value={newForm.sender}
                    onChange={(e) => setNewForm({...newForm, sender: e.target.value})}
                    className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Departemen</label>
                  <select
                    value={newForm.department}
                    onChange={(e) => setNewForm({...newForm, department: e.target.value})}
                    className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="Departemen Eselon" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">Departemen Eselon</option>
                    <option value="Departemen Kesejahteraan Mahasiswa" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">Departemen Kesma</option>
                    <option value="Departemen Pengembangan Mahasiswa" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">Departemen Pemikat</option>
                    <option value="Departemen Pengembangan Sumber Daya Manusia" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">Departemen PSDM</option>
                    <option value="Departemen Ekonomi Kreatif" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">Departemen Ekraf</option>
                    <option value="Departemen Media Komunikasi dan Informasi" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">Departemen Medkominfo</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Program Kerja</label>
                  <input
                    type="text"
                    placeholder="e.g. Penyebaran Informasi"
                    value={newForm.programKerja}
                    onChange={(e) => setNewForm({...newForm, programKerja: e.target.value})}
                    className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Jenis Pengajuan</label>
                  <input
                    type="text"
                    placeholder="e.g. Publikasi Broadcast"
                    value={newForm.jenisPengajuan}
                    onChange={(e) => setNewForm({...newForm, jenisPengajuan: e.target.value})}
                    className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Urgensi</label>
                  <select
                    value={newForm.urgency}
                    onChange={(e) => setNewForm({...newForm, urgency: e.target.value as 'Low' | 'Medium' | 'High'})}
                    className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="Low" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">Low</option>
                    <option value="Medium" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">Medium</option>
                    <option value="High" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">High</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Deadline</label>
                  <input
                    type="text"
                    placeholder="e.g. Senin, 24 Feb 2026"
                    value={newForm.deadline}
                    onChange={(e) => setNewForm({...newForm, deadline: e.target.value})}
                    className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Concept Details / Description</label>
                <RichTextArea
                  rows={3}
                  placeholder="Describe what needs to be designed or posted..."
                  value={newForm.details}
                  onChange={(e) => setNewForm({...newForm, details: e.target.value})}
                  className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewRequestOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-blue-500/10"
                >
                  Submit Simulation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit2, 
  Trash2, 
  MessageSquare, 
  Mail,
  UserCheck,
  ArrowUpDown
} from 'lucide-react';
import { Resident } from '../types';

interface ResidentsTabProps {
  residents: Resident[];
  onTriggerNotification: (msg: string) => void;
  onSelectResidentForProfile: (resident: Resident) => void;
  onDeleteResident: (id: string) => void;
  onAddResident: (res: Resident) => void;
}

export default function ResidentsTab({
  residents,
  onTriggerNotification,
  onSelectResidentForProfile,
  onDeleteResident,
  onAddResident
}: ResidentsTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('All');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [sortDesc, setSortDesc] = useState(true);

  // New Resident State
  const [newRes, setNewRes] = useState({
    name: '',
    role: 'Admin',
    division: 'Multimedia',
    whatsapp: '',
    email: '',
    status: 'Online' as Resident['status']
  });

  const divisions = ['All', 'Kadept', 'Wakadept', 'Multimedia', 'Humas'];

  const getStatusBadge = (status: Resident['status']) => {
    switch (status) {
      case 'Online': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'Away': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'Offline': return 'text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800';
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Super Admin': return 'bg-rose-50 text-rose-700 dark:bg-rose-900/50 dark:text-rose-400';
      case 'Admin': return 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200';
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRes.name.trim()) return;

    const colors = ['bg-blue-600', 'bg-emerald-600', 'bg-indigo-600', 'bg-purple-600', 'bg-pink-600', 'bg-amber-600'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)] + " text-white";

    const created: Resident = {
      id: `MK-2026-0${residents.length + 12}`,
      name: newRes.name,
      role: newRes.role,
      division: newRes.division,
      whatsapp: newRes.whatsapp || "+62 812-0000-0000",
      email: newRes.email || `${newRes.name.toLowerCase().replace(/\s+/g, '')}@medkominfo.org`,
      status: newRes.status,
      avatarColor: randomColor
    };

    onAddResident(created);
    setIsAddOpen(false);
    setNewRes({
      name: '',
      role: 'Admin',
      division: 'Multimedia',
      whatsapp: '',
      email: '',
      status: 'Online'
    });
    onTriggerNotification(`New resident ${created.name} added to roster!`);
  };

  // Filter logic
  const filtered = (() => {
    const f = residents.filter(res => {
      const matchesSearch = 
        res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDiv = selectedDivision === 'All' || res.division === selectedDivision;
      return matchesSearch && matchesDiv;
    });
    return sortDesc ? [...f].reverse() : f;
  })();

  return (
    <div className="space-y-6">
      
      {/* Top Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-blue-100 dark:to-slate-300 tracking-tight">Warga Medkom</h2>
          <p className="text-sm text-slate-500 mt-1">Team Directory & Active Status</p>
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
          
          <button 
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/10 transition-all"
          >
            <Plus className="w-4 h-4" />
            New Member
          </button>
        </div>
      </div>

      {/* Roster Table Content */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        
        {/* Sub-Filters / Quick Tabs Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-950/50">
          
          {/* Quick Division Tab buttons */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {divisions.map((div) => (
              <button
                key={div}
                onClick={() => setSelectedDivision(div)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  selectedDivision === div
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-950'
                }`}
              >
                {div === 'All' ? 'All Divisions' : div.replace(' Division', '')}
              </button>
            ))}
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-72">
            <Search className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

        </div>

        {/* Directory Table Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 uppercase font-extrabold text-[10px] border-b border-slate-200 dark:border-slate-800">
                <th className="py-3 px-5">Name / ID</th>
                <th className="py-3 px-5">Division & Role</th>
                <th className="py-3 px-5">Whatsapp</th>
                <th className="py-3 px-5">Email</th>
                <th className="py-3 px-5 text-center">Status</th>
                <th className="py-3 px-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((res) => (
                <tr key={res.id} className="hover:bg-slate-950/50 transition-colors">
                  
                  {/* Name with avatar ID */}
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${res.avatarColor}`}>
                        {res.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">{res.name}</div>
                        <div className="text-[10px] text-slate-600 dark:text-slate-400 font-mono">ID: {res.id}</div>
                      </div>
                    </div>
                  </td>

                  {/* Division with Role badge */}
                  <td className="py-3.5 px-5">
                    <div className="space-y-1">
                      <div className="font-semibold text-slate-700 dark:text-slate-300">{res.division}</div>
                      <span className={`inline-block px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${getRoleBadgeColor(res.role)}`}>
                        {res.role}
                      </span>
                    </div>
                  </td>

                  {/* Whatsapp */}
                  <td className="py-3.5 px-5 font-mono text-slate-600 dark:text-slate-400">
                    <a 
                      href={`https://wa.me/${res.whatsapp.replace(/[^0-9]/g, '')}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-emerald-600 hover:underline flex items-center gap-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      {res.whatsapp}
                    </a>
                  </td>

                  {/* Email */}
                  <td className="py-3.5 px-5 font-medium text-slate-500 flex items-center gap-1.5 pt-5">
                    <Mail className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                    {res.email}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-5 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border inline-flex items-center gap-1 ${getStatusBadge(res.status)}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        res.status === 'Online' ? 'bg-emerald-500' : res.status === 'Away' ? 'bg-amber-500' : 'bg-slate-400'
                      }`}></span>
                      {res.status}
                    </span>
                  </td>

                  {/* Actions (Interactive Redirection) */}
                  <td className="py-3.5 px-5 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onSelectResidentForProfile(res)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="View Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onTriggerNotification(`Edit mode active for member: ${res.name}`)}
                        className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                        title="Edit Details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          onDeleteResident(res.id);
                          onTriggerNotification(`Removed member ${res.name} from registry.`);
                        }}
                        className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                        title="Delete Member"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer info stats count */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500">
          Showing 1 to {filtered.length} of {filtered.length} Warga Medkom registered.
        </div>

      </div>

      {/* Add Resident Modal popup */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-white dark:bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Add New Resident Member</h3>
              <button 
                onClick={() => setIsAddOpen(false)}
                className="p-1 text-slate-600 dark:text-slate-400 hover:text-slate-400 rounded"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-5 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Habibie Wibisono"
                  value={newRes.name}
                  onChange={(e) => setNewRes({...newRes, name: e.target.value})}
                  className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Division</label>
                  <select
                    value={newRes.division}
                    onChange={(e) => setNewRes({...newRes, division: e.target.value})}
                    className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="Kadept">Kadept</option>
                    <option value="Wakadept">Wakadept</option>
                    <option value="Multimedia">Multimedia</option>
                    <option value="Humas">Humas</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Role</label>
                  <select
                    value={newRes.role}
                    onChange={(e) => setNewRes({...newRes, role: e.target.value})}
                    className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Super Admin">Super Admin</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Whatsapp</label>
                  <input
                    type="text"
                    placeholder="+62 812-xxx-xxx"
                    value={newRes.whatsapp}
                    onChange={(e) => setNewRes({...newRes, whatsapp: e.target.value})}
                    className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Status</label>
                  <select
                    value={newRes.status}
                    onChange={(e) => setNewRes({...newRes, status: e.target.value as Resident['status']})}
                    className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="Online">Online</option>
                    <option value="Away">Away</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>
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
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-md shadow-blue-500/10"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

import React from 'react';
import { Users } from 'lucide-react';
import { Resident } from '../../types';

interface PublicRosterSectionProps {
  residents: Resident[];
  onSelectResidentForProfile?: (res: Resident) => void;
}

export default function PublicRosterSection({ residents, onSelectResidentForProfile }: PublicRosterSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
          <Users className="w-4 h-4 text-purple-500" />
          Direktori Pengurus Medkominfo HMIF UPNVJ
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Butuh koordinasi langsung terkait pengajuan, materi naskah, wawancara, atau jalinan kemitraan sponsorship?</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {residents.map((res) => (
          <div 
            key={res.id} 
            onClick={() => onSelectResidentForProfile && onSelectResidentForProfile(res)}
            className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-300 hover:shadow-md transition-all flex items-start gap-4 cursor-pointer"
          >
            <div className={`w-10 h-10 rounded-full ${res.avatarColor || 'bg-blue-600'} text-white font-extrabold flex items-center justify-center uppercase shadow-inner shrink-0`}>
              {res.name.charAt(0)}
            </div>
            
            <div className="space-y-1.5">
              <div>
                <h4 className="font-extrabold text-slate-800 dark:text-slate-200 text-xs leading-tight">{res.name}</h4>
                <p className="text-[10px] text-slate-500 font-bold mt-0.5">{res.role} • {res.division}</p>
              </div>
              
              <div className="space-y-0.5 text-[10px] text-slate-600 dark:text-slate-400 font-semibold">
                <div>WA: <a href={`https://wa.me/${res.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 hover:underline">{res.whatsapp}</a></div>
                <div className="truncate max-w-[150px]">Email: {res.email}</div>
              </div>
              <div className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${
                  res.status === 'Online' ? 'bg-emerald-500' :
                  res.status === 'Away' ? 'bg-amber-400' : 'bg-slate-300'
                }`}></span>
                <span className="text-[9px] text-slate-600 dark:text-slate-400 font-bold">{res.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

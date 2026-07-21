import React from 'react';
import { 
  FolderHeart, 
  Download, 
  ExternalLink, 
  Sparkles, 
  Search,
  BookOpen
} from 'lucide-react';
import { BrandTemplate } from '../types';

interface TemplatesTabProps {
  templates: BrandTemplate[];
  onTriggerNotification: (msg: string) => void;
}

export default function TemplatesTab({ templates, onTriggerNotification }: TemplatesTabProps) {
  
  const handleDownload = (title: string, format: string) => {
    onTriggerNotification(`Preparing download: "${title}" (${format})`);
  };

  return (
    <div className="space-y-6">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-blue-100 dark:to-slate-300 tracking-tight">Brand Templates & Assets</h2>
          <p className="text-sm text-slate-500 mt-1">Download pre-approved corporate presentation decks, Figma structures, letterheads, and lower-thirds.</p>
        </div>
      </div>

      {/* Grid structure of templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((tmp) => (
          <div 
            key={tmp.id} 
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col hover:border-slate-300 hover:shadow-md transition-all group"
          >
            {/* Visual Header Banner preview */}
            <div className="h-44 bg-white dark:bg-slate-900 relative overflow-hidden">
              <img 
                src={tmp.imageUrl} 
                alt={tmp.title} 
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              
              <div className="absolute top-3 right-3 bg-white dark:bg-slate-900/90 backdrop-blur text-slate-900 dark:text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-md shadow">
                {tmp.format}
              </div>
            </div>

            {/* Content area */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-1.5">
                <h4 className="font-extrabold text-slate-800 dark:text-slate-200 text-sm">{tmp.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{tmp.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400 font-bold">ID: {tmp.id}</span>
                
                <button
                  onClick={() => handleDownload(tmp.title, tmp.format)}
                  className="bg-blue-600 hover:bg-blue-500 text-white py-1.5 px-3.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  Use Asset
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}

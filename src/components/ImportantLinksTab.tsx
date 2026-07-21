import React from 'react';
import { 
  FileText, 
  ExternalLink, 
  AlertCircle,
  Folder,
  Database,
  Figma,
  Palette,
  LayoutTemplate
} from 'lucide-react';

interface ImportantLinksTabProps {
  onTriggerNotification: (msg: string) => void;
}

export default function ImportantLinksTab({}: ImportantLinksTabProps) {
  
  const humasDocs = [
    {
      title: "Spreadsheet Medpart",
      description: "Data database Media Partner HMIF UPNVJ.",
      link: "https://docs.google.com/spreadsheets/d/16z2Dq99fvG7tuX2s2v8q9YDy_K7HXXrE9s9TI8Mb704/edit?usp=sharing",
      icon: Database
    },
    {
      title: "Kebutuhan Medpart",
      description: "Folder Google Drive untuk file kebutuhan Medpart.",
      link: "https://drive.google.com/drive/folders/1L6dBCicUOWhZRVKu0isBE0SUTD5Z9oru?usp=sharing",
      icon: Folder
    },
    {
      title: "Medpart Bukti Follow",
      description: "Folder Google Drive untuk bukti follow Medpart.",
      link: "https://drive.google.com/drive/folders/136rHlm_UzMgc6Xtu81L12GpBcGX4oykN?usp=sharing",
      icon: Folder
    },
    {
      title: "SOP Medpart",
      description: "Standar Operasional Prosedur Media Partner HMIF.",
      link: "https://bit.ly/SOPMediaPartnerHMIF",
      icon: FileText
    }
  ];

  const multimediaDocs = [
    {
      title: "Visual Guideline",
      description: "Visual Guideline HMI Citta Prakarsa untuk standar desain dan feed.",
      link: "https://docs.google.com/document/d/1RcDENDzU1JqJuPMehvtDb9-vE_4sAYuySykWTe-llRA/edit?tab=t.0",
      icon: FileText
    },
    {
      title: "Header Footer (Canva)",
      description: "Template Header & Footer di Canva.",
      link: "https://www.canva.com/design/DAHCmJRCFxQ/mS0hRxoLYR0xZJ0rtPUUAw/edit?utm_content=DAHCmJRCFxQ&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton",
      icon: LayoutTemplate
    },
    {
      title: "Header Footer (Figma)",
      description: "Template Header, Footer & Referensi di Figma.",
      link: "https://www.figma.com/design/R0dyG39CuMAbdKyDZ8POrg/Theme-Ref?node-id=157-485&t=etdbqFqEhfzMZzxX-1",
      icon: Figma
    },
    {
      title: "Pipo Design (Canva)",
      description: "Maskot Pipo Design di Canva.",
      link: "https://www.canva.com/design/DAHEM0Mf7go/o1H_3sxylZDJHc3FN4mR6g/edit?utm_content=DAHEM0Mf7go&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton",
      icon: Palette
    },
    {
      title: "Pipo Design (Figma)",
      description: "Maskot Pipo Design Official di Figma.",
      link: "https://www.figma.com/design/EMxBg9iZg1ITG9TFPwNsri/HMIF-Mascot-Official?node-id=0-1&t=mZjMwUo9x9v92P1v-1",
      icon: Figma
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div>
        <h2 className="text-3xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-blue-100 dark:to-slate-300 tracking-tight">Important Links</h2>
        <p className="text-sm text-slate-500 mt-1">Essential resources and access points for Medkominfo operations.</p>
      </div>

      {/* Dokumen HUMAS Group */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
          <span className="w-1.5 h-6 bg-rose-600 rounded-full"></span>
          Dokumen HUMAS
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {humasDocs.map((doc, idx) => {
            const Icon = doc.icon;
            return (
              <div 
                key={idx} 
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-rose-300 transition-colors group"
              >
                <div className="space-y-2">
                  <span className="p-2 bg-rose-50 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 rounded-xl inline-block group-hover:bg-rose-100 transition-colors">
                    <Icon className="w-4 h-4" />
                  </span>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{doc.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{doc.description}</p>
                </div>
                <a 
                  href={doc.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 w-full bg-rose-50 hover:bg-rose-100 text-rose-700 py-2 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5"
                >
                  Open Link
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dokumen Multimedia Group */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
          <span className="w-1.5 h-6 bg-purple-600 rounded-full"></span>
          Dokumen Multimedia
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
          {multimediaDocs.map((doc, idx) => {
            const Icon = doc.icon;
            return (
              <div 
                key={idx} 
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-purple-300 transition-colors group"
              >
                <div className="space-y-2">
                  <span className="p-2 bg-purple-50 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-xl inline-block group-hover:bg-purple-100 transition-colors">
                    <Icon className="w-4 h-4" />
                  </span>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{doc.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{doc.description}</p>
                </div>
                <a 
                  href={doc.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 w-full bg-purple-50 hover:bg-purple-100 text-purple-700 py-2 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5"
                >
                  Open Link
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            );
          })}
        </div>
      </div>

      {/* Info Warning Footer */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <h5 className="font-bold text-blue-900 text-xs">Need to update links?</h5>
          <p className="text-[11px] text-blue-700 mt-1 leading-normal">
            Divisi Humas dan Kadept dapat mengedit tautan ini dari menu pengaturan portal untuk disesuaikan dengan Google Drive kabinet Anda.
          </p>
        </div>
      </div>

    </div>
  );
}

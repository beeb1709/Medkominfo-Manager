import React, { useRef } from 'react';
import { Bold, Italic, List, ListOrdered, Link as LinkIcon, Type } from 'lucide-react';

interface RichTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
  onChange: (e: any) => void;
  label?: string;
  required?: boolean;
}

export default function RichTextArea({ value, onChange, label, required, className, ...props }: RichTextAreaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertFormat = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    let newText = text.substring(0, start) + prefix + selectedText + suffix + text.substring(end);
    
    // Create a synthetic event
    const event = {
      target: { value: newText }
    };
    
    onChange(event as any);

    // Set cursor position after React re-renders
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(
          start + prefix.length,
          end + prefix.length
        );
      }
    }, 0);
  };

  const handleBold = (e: React.MouseEvent) => { e.preventDefault(); insertFormat('**', '**'); };
  const handleItalic = (e: React.MouseEvent) => { e.preventDefault(); insertFormat('*', '*'); };
  const handleBulletList = (e: React.MouseEvent) => { e.preventDefault(); insertFormat('- '); };
  const handleNumberList = (e: React.MouseEvent) => { e.preventDefault(); insertFormat('1. '); };
  const handleHeading = (e: React.MouseEvent) => { e.preventDefault(); insertFormat('### '); };

  return (
    <div className="w-full">
      {label && (
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
          {label} {required && <span className="text-red-500 font-extrabold">*</span>}
        </label>
      )}
      <div className={`border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 overflow-hidden focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all`}>
        <div className="flex items-center gap-1 p-1.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <button type="button" onClick={handleBold} className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors" title="Bold">
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button type="button" onClick={handleItalic} className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors" title="Italic">
            <Italic className="w-3.5 h-3.5" />
          </button>
          <div className="w-px h-4 bg-slate-200 dark:bg-slate-800 mx-1"></div>
          <button type="button" onClick={handleBulletList} className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors" title="Bullet List">
            <List className="w-3.5 h-3.5" />
          </button>
          <button type="button" onClick={handleNumberList} className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors" title="Numbered List">
            <ListOrdered className="w-3.5 h-3.5" />
          </button>
          <div className="w-px h-4 bg-slate-200 dark:bg-slate-800 mx-1"></div>
          <button type="button" onClick={handleHeading} className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors" title="Heading">
            <Type className="w-3.5 h-3.5" />
          </button>
        </div>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={onChange}
          className={`w-full px-3 py-2 text-xs focus:outline-none font-medium text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 placeholder-slate-400 dark:placeholder-slate-500 resize-y min-h-[80px] ${className || ''}`}
          {...props}
        />
      </div>
    </div>
  );
}

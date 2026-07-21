import RichTextArea from './RichTextArea';
import React, { useState } from 'react';
import { 
  MessageSquare,
  XCircle, 
  MessageCircle,
  Mail, 
  Copy,
  Save,
  CheckCircle,
  FileText
} from 'lucide-react';
import { BroadcastCampaign } from '../types';
import { checkPermission } from '../utils';

interface BroadcastTabProps {
  currentUser?: any;
  residents?: any[];
  campaigns: BroadcastCampaign[];
  onAddCampaign: (camp: BroadcastCampaign) => void;
  onUpdateCampaign?: (camp: BroadcastCampaign) => void;
  onTriggerNotification: (msg: string) => void;
}

export default function BroadcastTab({
  currentUser,
  residents,
  campaigns,
  onAddCampaign,
  onUpdateCampaign,
  onTriggerNotification
}: BroadcastTabProps) {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [editMessage, setEditMessage] = useState<string>('');
  
  const hasAccess = checkPermission(currentUser?.jabatan, 'Broadcast');

  const selectedCampaign = campaigns.find(c => c.id === selectedCampaignId);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Sent': return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-400 dark:border-emerald-800';
      case 'In Progress': return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/50 dark:text-blue-400 dark:border-blue-800';
      case 'Failed': return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/50 dark:text-rose-400 dark:border-rose-800';
      case 'Cancelled': return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/50 dark:text-red-400 dark:border-red-800';
      case 'Draft': return 'bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-950 dark:text-slate-400 dark:border-slate-800';
      default: return 'bg-slate-50 text-slate-600 dark:bg-slate-950 dark:text-slate-300';
    }
  };

  const handleSelectCampaign = (camp: BroadcastCampaign) => {
    setSelectedCampaignId(camp.id);
    let msg = camp.message || '';
    if (msg.includes('Teks Broadcast:')) {
      msg = msg.split('Teks Broadcast:').slice(1).join('Teks Broadcast:').trim();
    }
    setEditMessage(msg);
  };

  const handleSaveMessage = () => {
    if (!selectedCampaign || !onUpdateCampaign) return;
    onUpdateCampaign({
      ...selectedCampaign,
      message: editMessage
    });
    onTriggerNotification('Broadcast message updated successfully.');
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(editMessage);
    onTriggerNotification('Broadcast message copied to clipboard!');
  };

  const renderRecipients = (rec: string) => {
    // Memisahkan berdasarkan koma yang diikuti spasi, agar angka seperti "1,250" tidak terpotong
    const parts = rec.split(/,\s+/);
    return parts.map((p, i) => (
      <span key={i} className="inline-block bg-slate-100 dark:bg-slate-800 text-slate-500 rounded px-1.5 py-0.5 text-[9px] font-medium mr-1 mb-1">
        {p.trim()}
      </span>
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div>
        <h2 className="text-3xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-blue-100 dark:to-slate-300 tracking-tight">Mass Broadcast Engine</h2>
        <p className="text-sm text-slate-500 mt-1">Manage and edit your broadcast campaigns efficiently.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Side - Campaigns Log */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-200px)] min-h-[500px]">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
              <h4 className="font-extrabold text-slate-900 dark:text-white text-xs uppercase tracking-wider">Campaigns Log</h4>
            </div>
            <div className="divide-y divide-slate-100 overflow-y-auto flex-1">
              {campaigns.length === 0 ? (
                <div className="p-8 text-center text-slate-600 dark:text-slate-400">
                  <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs font-bold">No campaigns found.</p>
                </div>
              ) : (
                campaigns.map((camp) => (
                  <div 
                    key={camp.id} 
                    onClick={() => handleSelectCampaign(camp)}
                    className={`p-4 flex flex-col gap-3 cursor-pointer transition-colors ${selectedCampaignId === camp.id ? 'bg-amber-50/50 border-l-4 border-amber-500' : 'hover:bg-slate-950/50 border-l-4 border-transparent'}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="p-1.5 bg-white dark:bg-slate-900 shadow-3xs text-slate-600 dark:text-slate-400 rounded-lg flex gap-1 items-center">
                            {(camp.platform.includes('WA') || camp.platform.includes('WhatsApp')) ? <MessageSquare className="w-3.5 h-3.5 text-emerald-500" /> : null}
                            {camp.platform.includes('Line') ? <MessageCircle className="w-3.5 h-3.5 text-green-500" /> : null}
                            {(!camp.platform.includes('WA') && !camp.platform.includes('WhatsApp') && !camp.platform.includes('Line')) && <Mail className="w-3.5 h-3.5 text-blue-500" />}
                          </span>
                          <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">{camp.name}</span>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${getStatusBadge(camp.status)}`}>
                        {camp.status}
                      </span>
                    </div>
                    
                    <div className="flex flex-col gap-1.5 ml-8 text-[10px]">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 dark:text-slate-400 font-medium">{camp.date}</span>
                        <div onClick={(e) => e.stopPropagation()}>
                          {(currentUser?.role === 'admin') ? (
                            <select
                              value={camp.pic || 'Unassigned'}
                              onChange={(e) => {
                                if (onUpdateCampaign) {
                                  const newPic = e.target.value === 'Unassigned' ? undefined : e.target.value;
                                  onUpdateCampaign({ ...camp, pic: newPic });
                                  onTriggerNotification(`PIC updated to ${e.target.value}`);
                                }
                              }}
                              disabled={!hasAccess}
                              className={`text-slate-800 dark:text-slate-200 font-bold border border-slate-200 dark:border-slate-800 rounded px-1.5 py-0.5 focus:ring-0 outline-none max-w-[80px] text-[9px] transition-colors ${!hasAccess ? 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-800' : 'bg-slate-100 dark:bg-slate-800 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                            >
                              <option value="Unassigned" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">Unassigned</option>
                              {residents?.filter(r => r.role === 'Admin Humas' || r.division === 'Humas').map(r => (
                                <option key={r.id} value={r.name} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">{r.name}</option>
                              ))}
                            </select>
                          ) : (
                            <span className="text-slate-500 font-bold">PIC: {camp.pic || 'Unassigned'}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap">{renderRecipients(camp.recipients)}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Side - Live Preview & Edit */}
        <div className="lg:col-span-3">
          {selectedCampaign ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm h-[calc(100vh-200px)] min-h-[500px] flex flex-col">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/50 rounded-t-2xl">
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-xs uppercase tracking-wider">Live Preview</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Edit and copy the broadcast message below.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    disabled={!hasAccess}
                    onClick={handleSaveMessage}
                    style={{ display: !hasAccess ? 'none' : undefined }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 hover:bg-blue-100 rounded-lg text-[10px] font-bold transition-colors"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Save Edit
                  </button>
                  <button
                    onClick={handleCopyMessage}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 hover:bg-amber-100 rounded-lg text-[10px] font-bold transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Copy Text
                  </button>
                </div>
              </div>
              <div className="p-5 flex-1 bg-slate-50 dark:bg-slate-950/30 overflow-hidden">
                <RichTextArea
                  value={editMessage}
                  onChange={(e) => setEditMessage(e.target.value)}
                  className="w-full h-full p-4 text-xs font-medium font-mono text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-50 transition-all resize-none shadow-3xs"
                  placeholder="Broadcast message content..."
                />
              </div>
              <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 rounded-b-2xl">
                <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold">Characters: {editMessage.length}</span>
                <button
                  disabled={!hasAccess}
                  style={{ display: !hasAccess ? 'none' : undefined }}
                  onClick={() => {
                    if(onUpdateCampaign) {
                       onUpdateCampaign({ ...selectedCampaign, status: 'Cancelled' });
                    }
                    setSelectedCampaignId(null);
                    onTriggerNotification('Broadcast cancelled and moved to archive!');
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 text-white hover:bg-rose-500 rounded-xl text-[11px] font-bold transition-colors shadow-sm"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  Cancel Broadcast
                </button>
                <button
                  disabled={!hasAccess}
                  style={{ display: !hasAccess ? 'none' : undefined }}
                  onClick={() => {
                    if(onUpdateCampaign) {
                       onUpdateCampaign({ ...selectedCampaign, status: 'Sent' });
                    }
                    setSelectedCampaignId(null);
                    onTriggerNotification('Broadcast sent and moved to archive!');
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-500 rounded-xl text-[11px] font-bold transition-colors shadow-sm"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  Mark as Sent
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 border-dashed h-[calc(100vh-200px)] min-h-[500px] flex flex-col items-center justify-center text-slate-600 dark:text-slate-400 p-8 text-center">
              <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
              <h3 className="text-sm font-bold text-slate-600 dark:text-slate-400">Select a Campaign</h3>
              <p className="text-xs mt-1">Click on a campaign from the list to view and edit its content.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

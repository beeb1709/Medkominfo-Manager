import React, { useState } from 'react';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Sparkles, 
  Clock, 
  HelpCircle,
  Trash2
} from 'lucide-react';

import { CalendarEvent } from '../types';

interface CalendarTabProps {
  events: CalendarEvent[];
  onAddEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (eventId: string) => void;
  onTriggerNotification: (msg: string) => void;
}



const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

export default function CalendarTab({ events, onAddEvent, onDeleteEvent, onTriggerNotification }: CalendarTabProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  
  // Real-time date control state
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); // 0-indexed



  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventType, setNewEventType] = useState<string>('meeting');
  const [newEventColor, setNewEventColor] = useState<string>('bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/50 dark:text-rose-400 dark:border-rose-800');
  const [newEventTime, setNewEventTime] = useState('');
  const [newEventPic, setNewEventPic] = useState('Unassigned');

  const AVAILABLE_COLORS = [
    { name: 'Red', classes: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/50 dark:text-rose-400 dark:border-rose-800', dot: 'bg-rose-500' },
    { name: 'Green', classes: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-400 dark:border-emerald-800', dot: 'bg-emerald-500' },
    { name: 'Blue', classes: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/50 dark:text-blue-400 dark:border-blue-800', dot: 'bg-blue-500' },
    { name: 'Yellow', classes: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/50 dark:text-amber-400 dark:border-amber-800', dot: 'bg-amber-500' },
    { name: 'Purple', classes: 'bg-purple-50 text-purple-700 border-purple-200', dot: 'bg-purple-500' },
    { name: 'Indigo', classes: 'bg-indigo-50 text-indigo-700 border-indigo-200', dot: 'bg-indigo-500' },
    { name: 'Pink', classes: 'bg-pink-50 text-pink-700 border-pink-200', dot: 'bg-pink-500' },
    { name: 'Orange', classes: 'bg-orange-50 text-orange-700 border-orange-200', dot: 'bg-orange-500' },
    { name: 'Teal', classes: 'bg-teal-50 text-teal-700 border-teal-200', dot: 'bg-teal-500' },
    { name: 'Cyan', classes: 'bg-cyan-50 text-cyan-700 border-cyan-200', dot: 'bg-cyan-500' },
    { name: 'Gray', classes: 'bg-slate-950 text-slate-300 border-slate-800', dot: 'bg-slate-9500' }
  ];

  // Dynamic calculations
  const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
  const startOffset = new Date(currentYear, currentMonth, 1).getDay(); // Sunday=0, Monday=1...

  const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);
  const offsetArray = Array.from({ length: startOffset }, () => null);
  const gridCells = [...offsetArray, ...daysArray];

  const handlePrevMonth = () => {
    setCurrentDate(prev => {
      const next = new Date(prev);
      next.setMonth(next.getMonth() - 1);
      return next;
    });
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => {
      const next = new Date(prev);
      next.setMonth(next.getMonth() + 1);
      return next;
    });
    setSelectedDay(null);
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDay || !newEventTitle.trim()) return;

    const created: CalendarEvent = {
      id: `EV-${Date.now()}`,
      year: currentYear,
      month: currentMonth,
      day: selectedDay,
      title: newEventTitle,
      type: newEventType as any,
      color: newEventColor || 'bg-slate-800 text-slate-300 border-slate-800',
      time: newEventTime,
      pic: newEventPic,
      isManual: true,
    };

    onAddEvent(created);
    setNewEventTitle('');
    setNewEventTime('');
    setNewEventPic('');
    setSelectedDay(null);
    onTriggerNotification(`Scheduled "${created.title}" on ${MONTH_NAMES[currentMonth]} ${created.day}, ${currentYear}!`);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-blue-100 dark:to-slate-300 tracking-tight">Operations Calendar</h2>
          <p className="text-sm text-slate-500 mt-1">Schedules, publication deadlines, and event trackers.</p>
        </div>

        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
          <button onClick={handlePrevMonth} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{MONTH_NAMES[currentMonth]} {currentYear}</span>
          <button onClick={handleNextMonth} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Main Calendar Month Grid */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-6">
          
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 gap-2 text-center border-b border-slate-200 dark:border-slate-800 pb-3 mb-3">
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day, idx) => (
              <span key={idx} className={`text-[10px] font-black tracking-wider ${idx === 0 || idx === 6 ? 'text-slate-400' : 'text-slate-500'}`}>
                {day}
              </span>
            ))}
          </div>

          {/* Calendar Day Cells */}
          <div className="grid grid-cols-7 gap-2 min-h-[450px]">
            {gridCells.map((day, cellIdx) => {
              if (day === null) {
                return <div key={cellIdx} className="bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-800"></div>;
              }

              const dayEvents = events.filter(e => e.year === currentYear && e.month === currentMonth && e.day === day);
              const isSelected = selectedDay === day;
              const isToday = day === new Date().getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear();

              return (
                <div 
                  key={cellIdx}
                  onClick={() => setSelectedDay(day)}
                  className={`bg-white dark:bg-slate-900 p-2 rounded-xl border ${
                    isSelected ? 'border-blue-600 ring-2 ring-blue-500/10' : 
                    isToday ? 'border-purple-500 ring-2 ring-purple-500/20' : 'border-slate-200 dark:border-slate-800/60'
                  } hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between group h-24 overflow-hidden relative`}
                >
                  {/* Day Number */}
                  <div className="flex justify-between items-center">
                    <span className={`text-xs font-black ${isToday ? 'text-purple-600 dark:text-purple-400' : 'text-slate-700 dark:text-slate-200'}`}>{day}</span>
                    <button className="opacity-0 group-hover:opacity-100 p-0.5 bg-blue-50 hover:bg-blue-100 rounded text-blue-600 transition-opacity">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Day Events Bullet list inside box */}
                  <div className="flex-1 mt-1 space-y-1 overflow-y-auto scrollbar-none">
                    {dayEvents.map((evt, evtIdx) => (
                      <div 
                        key={evtIdx}
                        className={`px-1.5 py-0.5 rounded text-[8px] font-bold border truncate ${evt.color}`}
                        title={evt.title}
                      >
                        {evt.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Right Side Event Detail Sidebar */}
        <div className="space-y-6">
          
          {selectedDay ? (
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Add Event on {MONTH_NAMES[currentMonth]} {selectedDay}</h3>
              
              <form onSubmit={handleAddEvent} className="space-y-3.5">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Event / Deadline Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Upload Youtube Short"
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase block">Jam</label>
                    <input
                      type="time"
                      value={newEventTime}
                      onChange={(e) => setNewEventTime(e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase block">PIC</label>
                    <input
                      type="text"
                      placeholder="e.g. Budi"
                      value={newEventPic}
                      onChange={(e) => setNewEventPic(e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Category</label>
                  <select
                    value={newEventType}
                    onChange={(e) => setNewEventType(e.target.value as any)}
                    className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none"
                  >
                    <option value="meeting">Internal Meeting</option>
                    <option value="design">Design Deadline</option>
                    <option value="video">Video Upload</option>
                    <option value="broadcast">Broadcast Blast</option>
                    <option value="publication">Publikasi Konten</option>
                    <option value="other">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase block mb-1">Color Options</label>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_COLORS.map(c => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setNewEventColor(c.classes)}
                        className={`w-6 h-6 rounded-full border-2 focus:outline-none ${c.dot} ${newEventColor === c.classes ? 'ring-2 ring-offset-2 ring-blue-500 border-white' : 'border-transparent'}`}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button 
                    type="button"
                    onClick={() => setSelectedDay(null)}
                    className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-700 rounded-lg text-[11px] font-bold text-slate-600 dark:text-slate-400"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-[11px] font-bold text-white shadow-sm"
                  >
                    Save Event
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-3 py-12">
              <span className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 rounded-xl inline-block shadow-sm">
                <Calendar className="w-5 h-5 text-blue-500" />
              </span>
              <h4 className="font-extrabold text-slate-800 dark:text-slate-200 text-xs">No day selected</h4>
              <p className="text-[11px] text-slate-500 leading-normal">
                Click on any calendar day block cell to add a design target, video upload, or strategic partnership meeting event.
              </p>
            </div>
          )}

          {/* Quick reminders list panel */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h4 className="font-extrabold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
              {selectedDay ? `${selectedDay} ${MONTH_NAMES[currentMonth]}` : `${new Date().getDate()} ${MONTH_NAMES[currentMonth]}`} Milestones
            </h4>
            <div className="space-y-3">
              {(() => {
                const dayToView = selectedDay || (currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear() ? new Date().getDate() : null);
                const dayEvents = dayToView ? events.filter(e => e.year === currentYear && e.month === currentMonth && e.day === dayToView) : [];
                return (
                  <>
                      {dayEvents.length > 0 ? dayEvents.map((e, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 group/item">
                        <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                          e.type === 'meeting' ? 'bg-rose-500' :
                          e.type === 'video' ? 'bg-emerald-500' :
                          e.type === 'design' ? 'bg-blue-500' :
                          e.type === 'publication' ? 'bg-purple-500' : 'bg-amber-500'
                        }`}></span>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-slate-800 dark:text-slate-200 text-xs">{e.title}</div>
                          <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">{e.time || 'Waktu tidak ditentukan'} • PIC: {e.pic || 'Tidak ada'}</p>
                        </div>
                        {e.isManual && (
                          <button
                            onClick={() => {
                              if (window.confirm('Apakah Anda yakin ingin menghapus kegiatan manual ini?')) {
                                onDeleteEvent(e.id!);
                              }
                            }}
                            className="flex-shrink-0 opacity-0 group-hover/item:opacity-100 p-1 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                            title="Hapus event manual ini"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    )) : (
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">No milestones scheduled for this date.</p>
                    )}
                  </>
                );
              })()}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

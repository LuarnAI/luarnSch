
import React, { useState, useEffect, useMemo } from 'react';
import { TimeSlot, BroadcastTemplate, TimetableData, DAYS_ZH } from './types';
import MainDisplay from './components/MainDisplay';
import Toolbar from './components/Toolbar';
import BroadcastModal from './components/BroadcastModal';
import SettingsModal from './components/SettingsModal';

const App: React.FC = () => {
  const [now, setNow] = useState(new Date());
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [activeBroadcast, setActiveBroadcast] = useState<BroadcastTemplate | null>(null);

  // 初始作息時間
  const [slots, setSlots] = useState<TimeSlot[]>(() => {
    const saved = localStorage.getItem('schooltool_slots');
    return saved ? JSON.parse(saved) : [
      { id: 'morning', name: '晨光時間', start: '07:30', end: '08:40' },
      { id: '1', name: '第一節', start: '08:45', end: '09:25' },
      { id: '2', name: '第二節', start: '09:35', end: '10:15' },
      { id: '3', name: '第三節', start: '10:30', end: '11:10' },
      { id: '4', name: '第四節', start: '11:20', end: '12:00' },
      { id: 'lunch', name: '午餐休息', start: '12:00', end: '13:20' },
      { id: '5', name: '第五節', start: '13:30', end: '14:10' },
      { id: '6', name: '第六節', start: '14:20', end: '15:00' },
      { id: '7', name: '第七節', start: '15:15', end: '15:55' },
      { id: '8', name: '第八節', start: '16:05', end: '16:45' },
      { id: '9', name: '第九節', start: '16:55', end: '17:35' },
      { id: '10', name: '第十節', start: '17:45', end: '18:25' },
    ];
  });

  const [timetable, setTimetable] = useState<TimetableData>(() => {
    const saved = localStorage.getItem('schooltool_timetable');
    return saved ? JSON.parse(saved) : {};
  });

  const [broadcastTemplates, setTemplates] = useState<BroadcastTemplate[]>([
    { id: '1', btnName: '常用1', title: '全班集合', subtitle: '請到走廊排隊' },
    { id: '2', btnName: '常用2', title: '下課休息', subtitle: '記得喝水上廁所' },
    { id: '3', btnName: '常用3', title: '準備上課', subtitle: '請回到座位拿出課本' },
  ]);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('schooltool_slots', JSON.stringify(slots));
    localStorage.setItem('schooltool_timetable', JSON.stringify(timetable));
  }, [slots, timetable]);

  // 計算目前的課程狀態
  const currentStatus = useMemo(() => {
    const timeStr = now.toLocaleTimeString('en-GB', { hour12: false }).slice(0, 5);
    const activeSlot = slots.find(s => timeStr >= s.start && timeStr <= s.end);
    if (!activeSlot) return { name: 'OFF-HOURS', label: '非上課時段', isClass: false };
    
    const day = now.getDay();
    const subject = timetable[day]?.[activeSlot.id];
    return {
      name: activeSlot.name,
      label: subject && subject !== '(空堂)' ? subject : activeSlot.name,
      isClass: !!subject && subject !== '(空堂)'
    };
  }, [now, slots, timetable]);

  return (
    <div className="h-screen w-screen bg-[#0f172a] text-white flex flex-col overflow-hidden select-none">
      {/* Main Display Area */}
      <div className="flex-grow flex items-center justify-center p-8 relative">
        <MainDisplay 
          now={now} 
          status={currentStatus} 
          broadcast={activeBroadcast} 
          onCloseBroadcast={() => setActiveBroadcast(null)}
        />
      </div>

      {/* Toolbar */}
      <Toolbar 
        onOpenBroadcast={() => setShowBroadcastModal(true)}
        onOpenSettings={() => setShowSettingsModal(true)}
        onQuickAction={(title, sub) => setActiveBroadcast({ id: 'quick', btnName: '', title, subtitle: sub })}
      />

      {/* Modals */}
      {showBroadcastModal && (
        <BroadcastModal 
          templates={broadcastTemplates}
          onUpdateTemplates={setTemplates}
          onPublish={(t) => {
            setActiveBroadcast(t);
            setShowBroadcastModal(false);
          }}
          onClose={() => setShowBroadcastModal(false)}
        />
      )}

      {showSettingsModal && (
        <SettingsModal 
          slots={slots}
          setSlots={setSlots}
          timetable={timetable}
          setTimetable={setTimetable}
          onClose={() => setShowSettingsModal(false)}
        />
      )}
    </div>
  );
};

export default App;

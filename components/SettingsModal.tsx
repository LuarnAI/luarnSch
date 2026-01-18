
import React, { useState } from 'react';
import { TimeSlot, TimetableData, DAYS_ZH } from '../types';

interface SettingsModalProps {
  slots: TimeSlot[];
  setSlots: (s: TimeSlot[]) => void;
  timetable: TimetableData;
  setTimetable: (t: TimetableData) => void;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ slots, setSlots, timetable, setTimetable, onClose }) => {
  const [activeSection, setActiveSection] = useState<string | null>('timetable');

  const handleTimetableChange = (day: number, slotId: string, value: string) => {
    setTimetable({
      ...timetable,
      [day]: { ...(timetable[day] || {}), [slotId]: value }
    });
  };

  const sections = [
    { id: 'schedule', title: '作息時間表設定 (可自訂每節課時間)', icon: 'fa-clock' },
    { id: 'daymode', title: '全天/半天設定', icon: 'fa-calendar-day' },
    { id: 'quickbtn', title: '快捷按鈕管理', icon: 'fa-location-crosshairs' },
    { id: 'timetable', title: '課表設定', icon: 'fa-book' },
    { id: 'subject', title: '科目與提醒詞管理', icon: 'fa-mug-hot' },
    { id: 'system', title: '系統維護 (備份/還原/測試)', icon: 'fa-save' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-[#f8fafc] rounded-[2rem] w-full max-w-5xl max-h-[90vh] text-slate-800 overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
        <div className="p-6 bg-white border-b flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <i className="fas fa-gear text-slate-700"></i>
            設定控制台
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-3">
          {sections.map(sec => (
            <div key={sec.id} className="bg-white border rounded-2xl overflow-hidden shadow-sm">
              <button 
                onClick={() => setActiveSection(activeSection === sec.id ? null : sec.id)}
                className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-50 transition-all"
              >
                <div className="flex items-center gap-4">
                    <i className={`fas ${sec.icon} ${activeSection === sec.id ? 'text-blue-500' : 'text-slate-400'} text-xl`}></i>
                    <span className="font-bold">{sec.title}</span>
                </div>
                <i className={`fas fa-chevron-${activeSection === sec.id ? 'up' : 'down'} text-slate-300`}></i>
              </button>

              {activeSection === sec.id && (
                <div className="p-6 border-t bg-slate-50 animate-in slide-in-from-top-2">
                  {sec.id === 'timetable' && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-center border-separate border-spacing-2">
                        <thead>
                          <tr>
                            <th className="p-3 font-bold text-slate-400 text-sm">節次</th>
                            {DAYS_ZH.map(d => <th key={d} className="p-3 font-bold text-slate-600">{d}</th>)}
                          </tr>
                        </thead>
                        <tbody>
                          {slots.map(slot => (
                            <tr key={slot.id}>
                              <td className="p-3 bg-white border rounded-xl font-bold text-sm text-slate-500">{slot.name}</td>
                              {[0, 1, 2, 3, 4, 5, 6].map(day => (
                                <td key={day}>
                                  <input 
                                    className="w-full p-3 bg-white border rounded-xl outline-none focus:ring-2 focus:ring-blue-400 text-sm font-medium transition-all text-center"
                                    value={timetable[day]?.[slot.id] || ''}
                                    placeholder="(空堂)"
                                    onChange={e => handleTimetableChange(day, slot.id, e.target.value)}
                                  />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {sec.id === 'schedule' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {slots.map(slot => (
                            <div key={slot.id} className="bg-white p-4 border rounded-2xl flex flex-col gap-2">
                                <span className="font-bold text-slate-500 text-xs uppercase">{slot.name}</span>
                                <div className="flex items-center gap-2">
                                    <input type="time" className="flex-1 p-2 bg-slate-50 border rounded-lg" value={slot.start} onChange={e => setSlots(slots.map(s => s.id === slot.id ? {...s, start: e.target.value} : s))} />
                                    <span>~</span>
                                    <input type="time" className="flex-1 p-2 bg-slate-50 border rounded-lg" value={slot.end} onChange={e => setSlots(slots.map(s => s.id === slot.id ? {...s, end: e.target.value} : s))} />
                                </div>
                            </div>
                        ))}
                    </div>
                  )}
                  {['daymode', 'quickbtn', 'subject', 'system'].includes(sec.id) && (
                    <div className="py-12 text-center text-slate-400 italic">
                        功能開發中，敬請期待...
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-6 bg-white border-t flex items-center justify-between">
          <button 
            onClick={() => {
                if(confirm('確定要清除所有設定嗎？')) {
                    localStorage.clear();
                    window.location.reload();
                }
            }}
            className="text-red-400 hover:text-red-500 font-bold flex items-center gap-2"
          >
            <i className="fas fa-rotate-left"></i>
            重置預設
          </button>
          <button 
            onClick={onClose}
            className="px-12 py-4 bg-[#1e293b] hover:bg-slate-800 text-white font-bold rounded-2xl shadow-lg transition-all active:scale-95 flex items-center gap-3"
          >
            <i className="fas fa-save"></i>
            完成設定
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;

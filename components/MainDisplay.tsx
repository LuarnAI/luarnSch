
import React from 'react';
import { DAYS_ZH, BroadcastTemplate } from '../types';

interface MainDisplayProps {
  now: Date;
  status: { name: string, label: string, isClass: boolean };
  broadcast: BroadcastTemplate | null;
  onCloseBroadcast: () => void;
}

const MainDisplay: React.FC<MainDisplayProps> = ({ now, status, broadcast, onCloseBroadcast }) => {
  // 轉換為民國年
  const minguoYear = now.getFullYear() - 1911;
  const dateStr = `民國${minguoYear}年${(now.getMonth() + 1).toString().padStart(2, '0')}月${now.getDate().toString().padStart(2, '0')}日 ${DAYS_ZH[now.getDay()]}`;
  const timeStr = now.toLocaleTimeString('zh-TW', { hour12: false });

  if (broadcast) {
    return (
      <div className="flex flex-col items-center animate-in zoom-in duration-300">
        <h2 className="text-pink-400 text-3xl font-bold uppercase tracking-widest mb-8">
          <i className="fas fa-bullhorn mr-4"></i>
          正在進行廣播
        </h2>
        <div className="text-[12rem] font-black leading-none text-white text-center mb-6">
          {broadcast.title}
        </div>
        <div className="text-5xl text-slate-300 font-medium">
          {broadcast.subtitle}
        </div>
        <button 
          onClick={onCloseBroadcast}
          className="mt-20 px-12 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-xl transition-all"
        >
          結束並關閉廣播
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center text-center animate-in fade-in duration-700">
      <div className="mb-8">
        <div className="text-indigo-400 text-2xl font-bold uppercase tracking-[0.4em] mb-4">
          {status.name}
        </div>
        <div className="text-[8rem] font-bold leading-tight">
          {status.label}
        </div>
      </div>

      <div className="text-[16rem] font-mono font-medium tracking-tight leading-none text-slate-100/90 mb-12">
        {timeStr}
      </div>

      <div className="text-4xl text-slate-400 font-light tracking-wide">
        {dateStr}
      </div>
    </div>
  );
};

export default MainDisplay;

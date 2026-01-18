
import React from 'react';

interface ToolbarProps {
  onOpenBroadcast: () => void;
  onOpenSettings: () => void;
  onQuickAction: (title: string, sub: string) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onOpenBroadcast, onOpenSettings, onQuickAction }) => {
  return (
    <div className="p-4 bg-[#1e293b]/50 backdrop-blur-xl border-t border-white/5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button 
            className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all"
        >
            <i className="fas fa-th-large text-slate-400"></i>
        </button>

        <button 
            onClick={onOpenBroadcast}
            className="px-6 h-12 bg-pink-500 hover:bg-pink-600 rounded-xl flex items-center gap-3 transition-all font-bold"
        >
          <i className="fas fa-bullhorn"></i>
          自訂廣播
        </button>

        <button 
            onClick={() => onQuickAction("全班集合", "請立刻回到教室")}
            className="px-6 h-12 bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center gap-3 transition-all font-bold"
        >
          <i className="fas fa-right-to-bracket"></i>
          回教室
        </button>

        <button 
            onClick={() => onQuickAction("走廊排隊", "安靜、迅速、確實")}
            className="px-6 h-12 bg-orange-600 hover:bg-orange-700 rounded-xl flex items-center gap-3 transition-all font-bold"
        >
          <i className="fas fa-arrow-right-from-bracket"></i>
          走廊排隊
        </button>

        <button 
            onClick={() => onQuickAction("移動/集合", "請攜帶相關用具")}
            className="px-6 h-12 bg-emerald-600 hover:bg-emerald-700 rounded-xl flex items-center gap-3 transition-all font-bold"
        >
          <i className="fas fa-location-dot"></i>
          移動/集合
        </button>

        <button 
            className="px-6 h-12 bg-indigo-600 hover:bg-indigo-700 rounded-xl flex items-center gap-3 transition-all font-bold"
        >
          <i className="fas fa-mug-hot"></i>
          作息/狀態
        </button>
      </div>

      <div className="flex items-center gap-6 text-slate-400 px-4">
        <div className="flex items-center gap-4 border-r border-white/10 pr-6">
            <button className="hover:text-white transition-all"><i className="fas fa-clock text-xl"></i></button>
            <button className="hover:text-white transition-all"><i className="fas fa-sun text-xl"></i></button>
            <button className="hover:text-white transition-all"><i className="fas fa-cube text-xl"></i></button>
            <button className="hover:text-white transition-all" onClick={() => document.documentElement.requestFullscreen()}><i className="fas fa-expand text-xl"></i></button>
        </div>
        <button 
            onClick={onOpenSettings}
            className="w-12 h-12 flex items-center justify-center hover:bg-white/10 rounded-full transition-all"
        >
            <i className="fas fa-gear text-2xl"></i>
        </button>
      </div>
    </div>
  );
};

export default Toolbar;

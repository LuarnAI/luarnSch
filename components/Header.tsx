
import React from 'react';
import { ViewType } from '../types';

interface HeaderProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const Header: React.FC<HeaderProps> = ({ activeView, onViewChange }) => {
  const navItems = [
    { id: ViewType.DASHBOARD, label: '概覽', icon: 'fa-chart-pie' },
    { id: ViewType.CALCULATOR, label: '計算器', icon: 'fa-calculator' },
    { id: ViewType.AI_ASSISTANT, label: 'AI 導師', icon: 'fa-robot' },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => onViewChange(ViewType.DASHBOARD)}
        >
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <i className="fas fa-graduation-cap text-white"></i>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            SmartSchool
          </h1>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                activeView === item.id 
                  ? 'bg-indigo-50 text-indigo-700' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
              }`}
            >
              <i className={`fas ${item.icon}`}></i>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
            <button className="p-2 text-slate-400 hover:text-slate-600">
                <i className="fas fa-bell"></i>
            </button>
            <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-500 font-bold text-xs">
                ST
            </div>
        </div>
      </div>
      
      {/* Mobile Nav */}
      <div className="md:hidden flex justify-around border-t py-2 bg-white">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`flex flex-col items-center gap-1 py-1 px-4 ${
                activeView === item.id ? 'text-indigo-600' : 'text-slate-500'
              }`}
            >
              <i className={`fas ${item.icon}`}></i>
              <span className="text-[10px]">{item.label}</span>
            </button>
          ))}
      </div>
    </header>
  );
};

export default Header;

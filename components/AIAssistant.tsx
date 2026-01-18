
import React, { useState } from 'react';
import { Course } from '../types';
import { analyzeGrades, getSmartResponse } from '../services/geminiService';

interface AIAssistantProps {
  courses: Course[];
}

const AIAssistant: React.FC<AIAssistantProps> = ({ courses }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'bot', text: string}[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleFullAnalysis = async () => {
    if (courses.length === 0) return;
    setIsAnalyzing(true);
    const result = await analyzeGrades(courses);
    setAnalysis(result);
    setIsAnalyzing(false);
  };

  const handleChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMsg = query;
    setQuery('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    const response = await getSmartResponse(userMsg, courses);
    setChatHistory(prev => [...prev, { role: 'bot', text: response }]);
    setIsTyping(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">AI 學習分析助手</h2>
          <p className="opacity-90 max-w-md">讓 Gemini 為你的學業表現提供專業建議，發掘你的潛力並克服困難學科。</p>
          <button 
            onClick={handleFullAnalysis}
            disabled={courses.length === 0 || isAnalyzing}
            className="mt-6 px-8 py-3 bg-white text-indigo-600 font-bold rounded-full hover:bg-indigo-50 transition-all disabled:opacity-50 shadow-lg shadow-indigo-800/20"
          >
            {isAnalyzing ? (
                <>
                    <i className="fas fa-circle-notch fa-spin mr-2"></i>
                    AI 正在思考中...
                </>
            ) : (
                <>
                    <i className="fas fa-wand-magic-sparkles mr-2"></i>
                    生成完整學期報告
                </>
            )}
          </button>
        </div>
        <div className="hidden md:block relative z-10 text-8xl opacity-20">
            <i className="fas fa-robot"></i>
        </div>
      </div>

      {analysis && (
        <div className="bg-white p-8 rounded-3xl border shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <i className="fas fa-clipboard-check text-green-500"></i>
                AI 分析報告
            </h3>
            <button 
                onClick={() => setAnalysis(null)}
                className="text-slate-400 hover:text-slate-600"
            >
                <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="prose prose-indigo max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
            {analysis}
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl border shadow-sm flex flex-col h-[500px]">
        <div className="p-4 border-b flex items-center justify-between bg-slate-50/50 rounded-t-3xl">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <i className="fas fa-comment-dots"></i>
                </div>
                <h3 className="font-bold text-slate-700">與 AI 助手對話</h3>
            </div>
            <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Smart Advisor Beta</span>
        </div>
        
        <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
          {chatHistory.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                <div className="p-4 bg-slate-50 rounded-full">
                    <i className="fas fa-messages text-4xl"></i>
                </div>
                <p className="text-sm">你可以問我：「我的微積分該怎麼救？」或「這學期表現如何？」</p>
            </div>
          )}
          {chatHistory.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
                  : 'bg-slate-100 text-slate-700 shadow-sm'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-slate-100 px-4 py-3 rounded-2xl flex gap-1 items-center">
                <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleChat} className="p-4 bg-slate-50/50 rounded-b-3xl border-t">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="輸入問題，讓 AI 協助你..."
              className="w-full pl-6 pr-14 py-4 bg-white border border-slate-200 rounded-full outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
            />
            <button
              type="submit"
              disabled={!query.trim() || isTyping}
              className="absolute right-2 top-2 w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-md"
            >
              <i className="fas fa-arrow-up"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AIAssistant;

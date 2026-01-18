
import React, { useState } from 'react';
import { Semester, Course } from '../types';

interface GradeCalculatorProps {
  semesters: Semester[];
  onAddCourse: (semesterId: string, course: Omit<Course, 'id'>) => void;
  onRemoveCourse: (semesterId: string, courseId: string) => void;
}

const GradeCalculator: React.FC<GradeCalculatorProps> = ({ semesters, onAddCourse, onRemoveCourse }) => {
  const [activeSemId, setActiveSemId] = useState(semesters[0].id);
  const [newCourse, setNewCourse] = useState({ name: '', credits: 3, score: 80, category: '必修' });

  const currentSem = semesters.find(s => s.id === activeSemId);
  const totalCredits = currentSem?.courses.reduce((sum, c) => sum + Number(c.credits), 0) || 0;
  const weightedSum = currentSem?.courses.reduce((sum, c) => sum + (c.score * c.credits), 0) || 0;
  const semAvg = totalCredits > 0 ? (weightedSum / totalCredits).toFixed(2) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourse.name) return;
    onAddCourse(activeSemId, newCourse);
    setNewCourse({ ...newCourse, name: '' });
  };

  const categories = ['必修', '選修', '通識', '體育', '其他'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Panel: Sidebar Tabs */}
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-white p-4 rounded-2xl border shadow-sm">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <i className="fas fa-layer-group text-indigo-500"></i>
            選擇學期
          </h3>
          <div className="space-y-2">
            {semesters.map(sem => (
              <button
                key={sem.id}
                onClick={() => setActiveSemId(sem.id)}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all border ${
                  activeSemId === sem.id 
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
                    : 'bg-white text-slate-600 border-slate-100 hover:border-indigo-200'
                }`}
              >
                <div className="font-semibold text-sm">{sem.title}</div>
                <div className={`text-[10px] mt-1 ${activeSemId === sem.id ? 'text-indigo-100' : 'text-slate-400'}`}>
                    {sem.courses.length} 門課程 | {sem.courses.reduce((s,c)=>s+Number(c.credits),0)} 學分
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-6 rounded-2xl text-white shadow-lg">
            <h4 className="text-sm font-medium opacity-80">學期學分平均 (GPA)</h4>
            <div className="text-4xl font-bold mt-1 mb-4">{semAvg}</div>
            <div className="flex justify-between text-xs opacity-90 border-t border-white/20 pt-4">
                <span>當前學期學分</span>
                <span className="font-bold">{totalCredits}</span>
            </div>
        </div>
      </div>

      {/* Right Panel: Form and List */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="text-lg font-bold mb-4 text-slate-800">新增課程</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-1">
              <label className="block text-xs font-semibold text-slate-500 mb-1">科目名稱</label>
              <input
                type="text"
                value={newCourse.name}
                onChange={e => setNewCourse({ ...newCourse, name: e.target.value })}
                placeholder="例如: 微積分"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">學分</label>
              <input
                type="number"
                min="0"
                max="10"
                value={newCourse.credits}
                onChange={e => setNewCourse({ ...newCourse, credits: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">成績 (0-100)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={newCourse.score}
                onChange={e => setNewCourse({ ...newCourse, score: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
              />
            </div>
            <button
              type="submit"
              className="bg-indigo-600 text-white font-bold py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200"
            >
              <i className="fas fa-plus mr-2"></i>
              新增
            </button>
            <div className="md:col-span-4 flex gap-4 mt-2">
                {categories.map(cat => (
                    <label key={cat} className="flex items-center gap-1 cursor-pointer group">
                        <input 
                            type="radio" 
                            name="category" 
                            checked={newCourse.category === cat}
                            onChange={() => setNewCourse({...newCourse, category: cat})}
                            className="hidden"
                        />
                        <span className={`text-[11px] px-3 py-1 rounded-full border transition-all ${
                            newCourse.category === cat 
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-bold' 
                            : 'bg-white border-slate-200 text-slate-400 group-hover:border-slate-300'
                        }`}>
                            {cat}
                        </span>
                    </label>
                ))}
            </div>
          </form>
        </div>

        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-700">學期課程列表</h3>
            <span className="text-xs text-slate-500">共 {currentSem?.courses.length || 0} 科</span>
          </div>
          <div className="divide-y max-h-[400px] overflow-y-auto">
            {currentSem?.courses.length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                    <i className="fas fa-folder-open text-3xl mb-2"></i>
                    <p>目前沒有課程資料</p>
                </div>
            ) : (
                currentSem?.courses.map(course => (
                <div key={course.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                            <i className="fas fa-book-open"></i>
                        </div>
                        <div>
                            <div className="font-bold text-slate-700">{course.name}</div>
                            <div className="text-[11px] text-slate-400 flex gap-2">
                                <span>{course.credits} 學分</span>
                                <span>•</span>
                                <span>{course.category}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <div className={`text-lg font-bold ${course.score >= 60 ? 'text-indigo-600' : 'text-red-500'}`}>
                                {course.score}
                            </div>
                        </div>
                        <button 
                            onClick={() => onRemoveCourse(activeSemId, course.id)}
                            className="w-8 h-8 rounded-full text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                        >
                            <i className="fas fa-trash-can"></i>
                        </button>
                    </div>
                </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradeCalculator;

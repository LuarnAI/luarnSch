
import React from 'react';
import { Semester, Course } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

interface DashboardProps {
  semesters: Semester[];
}

const Dashboard: React.FC<DashboardProps> = ({ semesters }) => {
  const allCourses = semesters.flatMap(s => s.courses);
  const totalCredits = allCourses.reduce((sum, c) => sum + Number(c.credits), 0);
  const weightedSum = allCourses.reduce((sum, c) => sum + (c.score * c.credits), 0);
  const avgScore = totalCredits > 0 ? (weightedSum / totalCredits).toFixed(2) : 0;

  // GPA Mapping (Simple 4.0 scale)
  const calculateGPA = (score: number) => {
    if (score >= 80) return 4.0;
    if (score >= 70) return 3.0;
    if (score >= 60) return 2.0;
    if (score >= 50) return 1.0;
    return 0.0;
  };

  const gpa = totalCredits > 0 
    ? (allCourses.reduce((sum, c) => sum + (calculateGPA(c.score) * c.credits), 0) / totalCredits).toFixed(2) 
    : "0.00";

  const chartData = semesters.map(sem => {
    const semCredits = sem.courses.reduce((sum, c) => sum + Number(c.credits), 0);
    const semWeighted = sem.courses.reduce((sum, c) => sum + (c.score * c.credits), 0);
    return {
      name: sem.title.split(' ')[0] + ' ' + sem.title.split(' ')[2],
      score: semCredits > 0 ? (semWeighted / semCredits).toFixed(1) : 0
    };
  });

  // Fixed reduce type to ensure value is not inferred as 'unknown'
  const categoryData = Object.entries(
    allCourses.reduce((acc: Record<string, number>, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#10b981'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="平均分數" value={avgScore} icon="fa-star" color="text-yellow-500" />
        <StatCard title="預估 GPA" value={gpa} icon="fa-graduation-cap" color="text-indigo-600" />
        <StatCard title="總修學分" value={totalCredits} icon="fa-book" color="text-green-500" />
        <StatCard title="修習科目" value={allCourses.length} icon="fa-list-check" color="text-blue-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <h3 className="text-lg font-bold mb-4 text-slate-800">各學期成績趨勢</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <h3 className="text-lg font-bold mb-4 text-slate-800">科目類別分佈</h3>
          <div className="h-64 flex flex-col md:flex-row items-center justify-around">
            <div className="w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    >
                    {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap md:flex-col gap-2 mt-4 md:mt-0">
                {categoryData.map((c, i) => (
                    <div key={c.name} className="flex items-center gap-2 text-xs text-slate-600">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></span>
                        {c.name}: {c.value} 門
                    </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border">
        <h3 className="text-lg font-bold mb-4 text-slate-800">最近修課記錄</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-slate-400 text-sm">
                <th className="pb-3 font-medium">科目名稱</th>
                <th className="pb-3 font-medium">學分</th>
                <th className="pb-3 font-medium">成績</th>
                <th className="pb-3 font-medium">類別</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {allCourses.slice(-5).reverse().map(course => (
                <tr key={course.id} className="text-sm">
                  <td className="py-4 font-medium text-slate-700">{course.name}</td>
                  <td className="py-4 text-slate-500">{course.credits}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                      course.score >= 80 ? 'bg-green-50 text-green-700' :
                      course.score >= 60 ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {course.score}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">{course.category}</span>
                  </td>
                </tr>
              ))}
              {allCourses.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400 italic">尚未新增課程資料</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/**
 * Fixed 'value' type to React.ReactNode to resolve TS error on line 106
 */
const StatCard = ({ title, value, icon, color }: { title: string, value: React.ReactNode, icon: string, color: string }) => (
  <div className="bg-white p-5 rounded-2xl shadow-sm border flex items-center justify-between">
    <div>
      <p className="text-xs font-medium text-slate-400 mb-1">{title}</p>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
    </div>
    <div className={`w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center ${color}`}>
      <i className={`fas ${icon}`}></i>
    </div>
  </div>
);

export default Dashboard;

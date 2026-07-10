import React, { useState, useEffect } from 'react';
import { dashboardService } from '../services/api';
import {
  Users,
  BookOpen,
  Award,
  TrendingUp,
  Percent,
  ChevronRight,
  TrendingDown,
  Brain
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await dashboardService.getStats();
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-slate-300 dark:border-slate-800 border-t-sky-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Predefined HSL Color Schemes for charts
  const CHART_COLORS = ['#38bdf8', '#6366f1', '#a855f7', '#10b981', '#f59e0b', '#ec4899'];

  const aiSuggestions = [
    {
      title: 'CGPA Enhancement Tip',
      desc: 'Based on average stats, Information Technology department students have higher ratings in semester 8 Cloud subjects. Recommending peer-tutoring sessions for core Computer Science components.',
    },
    {
      title: 'Low Attendance Cautionary Log',
      desc: `${stats?.counters?.lowAttendanceCount || 0} students are currently under 75% attendance limits. It is advised to dispatch warning bulletins before project submission cycles start.`,
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            Dashboard Analytics
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time visual monitoring indicators of academic statistics.
          </p>
        </div>
      </div>

      {/* Stats Quick Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Students Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm flex items-center gap-5 hover:scale-[1.01] transition-transform">
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Enrollment</span>
            <h3 className="text-2xl font-bold mt-1 text-slate-850 dark:text-white">{stats?.counters?.totalStudents}</h3>
          </div>
        </div>

        {/* Subjects Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm flex items-center gap-5 hover:scale-[1.01] transition-transform">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Active Subjects</span>
            <h3 className="text-2xl font-bold mt-1 text-slate-850 dark:text-white">{stats?.counters?.totalSubjects}</h3>
          </div>
        </div>

        {/* Average CGPA Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm flex items-center gap-5 hover:scale-[1.01] transition-transform">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Average CGPA</span>
            <h3 className="text-2xl font-bold mt-1 text-slate-850 dark:text-white">{stats?.counters?.averageCgpa} <span className="text-xs font-normal text-slate-400">/10</span></h3>
          </div>
        </div>

        {/* Low Attendance Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm flex items-center gap-5 hover:scale-[1.01] transition-transform">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
            <Percent className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Low Attendance</span>
            <h3 className="text-2xl font-bold mt-1 text-slate-850 dark:text-white">{stats?.counters?.lowAttendanceCount} <span className="text-xs font-normal text-slate-450">Alerts</span></h3>
          </div>
        </div>
      </div>

      {/* Main Charts & Visual Block */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Department & Semester Stats */}
        <div className="lg:col-span-2 space-y-8">
          {/* CGPA Trend Area Chart */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm">
            <h3 className="text-base font-bold mb-6 text-slate-800 dark:text-slate-100">Semester-wise Average Student CGPA Distribution</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.semDistribution}>
                  <defs>
                    <linearGradient id="colorCgpa" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="semester" name="Semester" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={[0, 10]} />
                  <Tooltip contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="avgCgpa" name="Average CGPA" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorCgpa)" />
                  <Area type="monotone" dataKey="count" name="Student Count" stroke="#38bdf8" strokeWidth={1} fill="none" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Department breakdown Bar Chart */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm">
            <h3 className="text-base font-bold mb-6 text-slate-800 dark:text-slate-100">Department Students Allocation & Grade Index</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.deptDistribution}>
                  <XAxis dataKey="department" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                  <Bar dataKey="count" name="Students count" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="avgCgpa" name="Avg CGPA" fill="#818cf8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Side: Leaderboards, Top rankers & AI Suggestion box */}
        <div className="space-y-8">
          {/* Top Performers Rank Board */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold mb-5 text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                <span>Department Top Rankers</span>
              </h3>
              <div className="space-y-4">
                {stats?.topPerformers?.map((student, idx) => (
                  <div key={student._id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60 hover:scale-[1.01] transition-transform">
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 text-xs font-bold rounded-full flex items-center justify-center ${
                        idx === 0 ? 'bg-amber-500/20 text-amber-500' :
                        idx === 1 ? 'bg-slate-400/20 text-slate-400' :
                        idx === 2 ? 'bg-amber-700/20 text-amber-700' : 'bg-slate-200 dark:bg-slate-800 text-slate-550'
                      }`}>
                        {idx + 1}
                      </span>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{student.fullName}</h4>
                        <span className="text-[10px] text-slate-450 dark:text-slate-400">{student.department} • Semester {student.semester}</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-sky-500/10 text-sky-500 dark:text-sky-400">
                      {student.cgpa}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Smart AI suggested academic instructions */}
          <div className="p-6 rounded-2xl bg-gradient-to-tr from-indigo-950/20 to-sky-950/20 border border-indigo-500/10 dark:border-indigo-500/20 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Brain className="w-24 h-24 text-sky-400" />
            </div>
            <h3 className="text-base font-bold mb-4 text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Brain className="w-5 h-5 text-indigo-400" />
              <span>EduSphere Smart AI Suggestion</span>
            </h3>
            <div className="space-y-4">
              {aiSuggestions.map((item, idx) => (
                <div key={idx} className="p-3 bg-white/40 dark:bg-slate-900/50 rounded-xl border border-indigo-500/5">
                  <h4 className="text-xs font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider">{item.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useState, useEffect } from 'react';
import { studentService } from '../services/api';
import { Award, ShieldAlert, Sparkles, Trophy } from 'lucide-react';

const Achievements = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await studentService.getAll();
        if (res.data.success) {
          // Sort by CGPA descending to construct a leaderboard
          const sorted = res.data.data.sort((a, b) => b.cgpa - a.cgpa);
          setStudents(sorted);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const getBadgeDetails = (gpa) => {
    if (gpa >= 9.0) {
      return {
        label: 'Gold Badge',
        desc: 'Academic Honors (CGPA >= 9.00)',
        style: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
        text: 'Elite Tier',
      };
    }
    if (gpa >= 8.0) {
      return {
        label: 'Silver Badge',
        desc: 'Dean\'s List honors (CGPA >= 8.00)',
        style: 'bg-slate-400/10 text-slate-400 border-slate-450/30',
        text: 'Distinction Tier',
      };
    }
    if (gpa >= 7.0) {
      return {
        label: 'Bronze Badge',
        desc: 'First Division honors (CGPA >= 7.00)',
        style: 'bg-amber-700/10 text-amber-700 border-amber-700/30',
        text: 'Merit Tier',
      };
    }
    return null;
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
          Honor Roll & Badges
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Academic rank boards evaluate badges based on CGPA indexes.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-slate-200 dark:border-slate-800 border-t-sky-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Rank Board */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span>Campus Academic Rankings</span>
            </h3>

            <div className="space-y-3.5">
              {students.map((student, index) => {
                const badge = getBadgeDetails(student.cgpa);
                return (
                  <div
                    key={student._id}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60 flex items-center justify-between flex-wrap gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <span className={`w-7 h-7 text-xs font-bold rounded-full flex items-center justify-center ${
                        index === 0 ? 'bg-amber-500/20 text-amber-500' :
                        index === 1 ? 'bg-slate-400/20 text-slate-450' :
                        index === 2 ? 'bg-amber-800/20 text-amber-850' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                      }`}>
                        #{index + 1}
                      </span>

                      <div>
                        <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200">{student.fullName}</h4>
                        <span className="text-xs text-slate-400">{student.department} • Semester {student.semester}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-bold">{student.cgpa} <span className="text-[10px] text-slate-400 font-normal">/10</span></p>
                      </div>

                      {badge ? (
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${badge.style}`}>
                          <Award className="w-3.5 h-3.5" />
                          <span>{badge.text}</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">—</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Badges explanation section */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm h-fit space-y-6">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span>Honor Badge System</span>
            </h3>

            <div className="space-y-4">
              {/* Gold Badge */}
              <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-2">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <h4 className="font-bold text-sm text-amber-500">Gold Elite Tier</h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Granted to students maintaining cumulative CGPA &gt;= 9.00. Evaluates candidate profiles for advanced placement tracks.
                </p>
              </div>

              {/* Silver Badge */}
              <div className="p-4 rounded-xl border border-slate-400/20 bg-slate-400/5 space-y-2">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-slate-450" />
                  <h4 className="font-bold text-sm text-slate-400 dark:text-slate-355">Silver Distinction Tier</h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Granted to students maintaining cumulative CGPA &gt;= 8.00. Represents dean's honors rolls.
                </p>
              </div>

              {/* Bronze Badge */}
              <div className="p-4 rounded-xl border border-amber-700/20 bg-amber-700/5 space-y-2">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-700" />
                  <h4 className="font-bold text-sm text-amber-700">Bronze Merit Tier</h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Granted to students maintaining cumulative CGPA &gt;= 7.00. Represents honorable academic standards.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Achievements;

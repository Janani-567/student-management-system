import React, { useState, useEffect, useContext } from 'react';
import { attendanceService, subjectService, studentService } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import {
  Calendar,
  Check,
  X,
  UserCheck,
  Percent,
  AlertTriangle,
  Info,
  CalendarCheck,
  Sparkles
} from 'lucide-react';

const Attendance = () => {
  const { user } = useContext(AuthContext);

  // Mapped drop-downs data
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);

  // Query / Selection States
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().substring(0, 10));

  // Loading indicator states
  const [loadingList, setLoadingList] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);

  // Bulk Record State (List of students and their checkin status)
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  // Individual Student Report view state (Only if role === 'student')
  const [studentReport, setStudentReport] = useState(null);

  // Load active dropdown options
  useEffect(() => {
    const initDropdowns = async () => {
      try {
        const subRes = await subjectService.getAll();
        if (subRes.data.success) {
          setSubjects(subRes.data.data);
          if (subRes.data.data.length > 0) {
            setSelectedSubjectId(subRes.data.data[0]._id);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (user?.role !== 'student') {
      initDropdowns();
    }
  }, [user]);

  // Load detailed report if role is Student
  useEffect(() => {
    const fetchPersonalReport = async () => {
      if (user?.role === 'student' && user?.profile?._id) {
        setLoadingReport(true);
        try {
          const res = await attendanceService.getReport(user.profile._id);
          if (res.data.success) {
            setStudentReport(res.data.data);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoadingReport(false);
        }
      }
    };
    fetchPersonalReport();
  }, [user]);

  // Load students directory mapping to recorded status
  const handleLoadStudentsList = async () => {
    if (!selectedSubjectId) return;
    setLoadingList(true);
    try {
      // Find course details to resolve mapped department
      const subjectMatched = subjects.find((s) => s._id === selectedSubjectId);
      if (!subjectMatched) return;

      // 1. Get all students of that department/semester
      const studRes = await studentService.getAll({
        department: subjectMatched.department,
        semester: subjectMatched.semester,
      });

      // 2. Get existing logs for that subject/date to map present checkboxes
      const logsRes = await attendanceService.getLogs({
        subjectId: selectedSubjectId,
        date: selectedDate,
      });

      const existingLogs = logsRes.data.data || [];
      const studentData = studRes.data.data || [];

      // Map matching record statuses
      const records = studentData.map((student) => {
        const match = existingLogs.find((l) => l.student?._id === student._id);
        return {
          studentId: student._id,
          fullName: student.fullName,
          rollNumber: student.rollNumber,
          status: match ? match.status : 'Present', // default to Present if new
        };
      });

      setAttendanceRecords(records);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingList(false);
    }
  };

  // Toggle present/absent status inside state
  const handleStatusToggle = (studentId, nextStatus) => {
    setAttendanceRecords((prev) =>
      prev.map((r) => (r.studentId === studentId ? { ...r, status: nextStatus } : r))
    );
  };

  const handleBulkSave = async () => {
    try {
      const payload = {
        subjectId: selectedSubjectId,
        date: selectedDate,
        records: attendanceRecords.map((r) => ({
          studentId: r.studentId,
          status: r.status,
        })),
      };
      const res = await attendanceService.recordBulk(payload);
      if (res.data.success) {
        alert('Attendance records written successfully!');
      }
    } catch (err) {
      alert('Error saving records');
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
          Attendance Ledger
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {user?.role === 'student'
            ? 'Track your daily attendance percentage indicators per subject.'
            : 'Record daily student attendance lists per subject.'}
        </p>
      </div>

      {/* RENDER FACULTY VIEW (MUTATOR CHECK-IN) */}
      {user?.role !== 'student' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls side */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm h-fit space-y-6">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-sky-500" />
              <span>Select Ledger Configuration</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-450 uppercase mb-2">Subject Course</label>
                <select
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-sky-500 text-slate-700 dark:text-slate-300"
                >
                  {subjects.map((sub) => (
                    <option key={sub._id} value={sub._id}>
                      [{sub.subjectCode}] {sub.subjectName} (Sem {sub.semester})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-450 uppercase mb-2">Check-in Date</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                    <Calendar className="w-4 h-4" />
                  </span>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-sky-500 text-slate-700 dark:text-slate-350"
                  />
                </div>
              </div>

              <button
                onClick={handleLoadStudentsList}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:opacity-95 text-white font-semibold text-sm shadow-md transition-all cursor-pointer text-center"
              >
                Fetch Student Roster
              </button>
            </div>
          </div>

          {/* Roster Listing side */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Roster Check-in Logs</h3>
                <span className="text-xs text-slate-400 font-semibold">{attendanceRecords.length} Students listed</span>
              </div>

              {loadingList ? (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-4 border-slate-200 dark:border-slate-800 border-t-sky-500 rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="space-y-3">
                  {attendanceRecords.map((record) => (
                    <div
                      key={record.studentId}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60 flex items-center justify-between hover:scale-[1.005] transition-transform"
                    >
                      <div>
                        <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200">{record.fullName}</h4>
                        <span className="text-xs text-slate-400 font-mono">{record.rollNumber}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleStatusToggle(record.studentId, 'Present')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                            record.status === 'Present'
                              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                              : 'bg-slate-100 dark:bg-slate-905 text-slate-400 hover:text-slate-650'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Present</span>
                        </button>

                        <button
                          onClick={() => handleStatusToggle(record.studentId, 'Absent')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                            record.status === 'Absent'
                              ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20 shadow-md'
                              : 'bg-slate-100 dark:bg-slate-905 text-slate-400 hover:text-slate-650'
                          }`}
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Absent</span>
                        </button>
                      </div>
                    </div>
                  ))}

                  {attendanceRecords.length === 0 && (
                    <div className="py-12 text-center text-slate-500">
                      Roster is currently empty. Fetch class details from database configurations.
                    </div>
                  )}
                </div>
              )}
            </div>

            {attendanceRecords.length > 0 && (
              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  onClick={handleBulkSave}
                  className="px-6 py-3 bg-emerald-500 hover:opacity-95 text-white font-semibold text-sm rounded-xl cursor-pointer"
                >
                  Save Active Attendance Logs
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* RENDER STUDENT VIEW (VIEW INDIVIDUAL REPORT CARD) */}
      {user?.role === 'student' && (
        <div className="space-y-8 animate-fade-in">
          {loadingReport ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-slate-200 dark:border-slate-800 border-t-sky-500 rounded-full animate-spin"></div>
            </div>
          ) : studentReport ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Overall stats */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm flex flex-col justify-between space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-indigo-400" />
                    <span>Average Attendance Status</span>
                  </h3>

                  <div className="flex flex-col items-center py-6">
                    <div className="relative w-36 h-36 flex items-center justify-center rounded-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                      <div className="text-center">
                        <span className="text-3xl font-extrabold">{studentReport.overallPercentage}%</span>
                        <span className="text-[10px] text-slate-450 block uppercase font-bold tracking-wider mt-0.5">Average Pct</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mt-4 text-xs">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60">
                      <span className="text-slate-450">Present sessions:</span>
                      <strong className="font-semibold text-slate-700 dark:text-slate-200">{studentReport.totalPresent} Classes</strong>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60">
                      <span className="text-slate-450">Aggregate total:</span>
                      <strong className="font-semibold text-slate-700 dark:text-slate-200">{studentReport.totalClasses} Lectures</strong>
                    </div>
                  </div>
                </div>

                {studentReport.overallPercentage < 75 && (
                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex gap-3 items-start">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold">LOW ATTENDANCE WARNING!</h4>
                      <p className="mt-1 leading-relaxed text-rose-350">
                        Your percentage average is below the 75% standard. You risk restriction codes from project submissions.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Course breakdown */}
              <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm">
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
                  Course Breakdown Logs
                </h3>

                <div className="space-y-4">
                  {studentReport.subjectWiseReport?.map((sub) => (
                    <div
                      key={sub.subjectId}
                      className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-105 dark:border-slate-800/60 flex items-center justify-between flex-wrap gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 text-[9px] font-mono font-bold rounded bg-slate-200 dark:bg-slate-900">
                            {sub.subjectCode}
                          </span>
                          <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200">{sub.subjectName}</h4>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">Instructor: {sub.facultyNameText} • Credits: {sub.credits}</p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-bold">{sub.percentage}%</p>
                          <span className="text-[10px] text-slate-400">{sub.present} / {sub.total} classes</span>
                        </div>
                        {sub.alert ? (
                          <span className="p-1 rounded bg-rose-500/10 text-rose-400" title="Low attendance alert">
                            <AlertTriangle className="w-4 h-4" />
                          </span>
                        ) : (
                          <span className="p-1 rounded bg-emerald-500/10 text-emerald-500" title="Good attendance">
                            <Info className="w-4 h-4" />
                          </span>
                        )}
                      </div>
                    </div>
                  ))}

                  {(!studentReport.subjectWiseReport || studentReport.subjectWiseReport.length === 0) && (
                    <div className="py-12 text-center text-slate-550">
                      No attendance classes resolved. Check with database coordinator.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-500">
              No student profiles linked to active login credentials.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Attendance;

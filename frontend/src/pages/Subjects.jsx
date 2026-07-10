import React, { useState, useEffect, useContext } from 'react';
import { subjectService, facultyService } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Bookmark,
  UserCheck,
  Cpu
} from 'lucide-react';

const Subjects = () => {
  const { user } = useContext(AuthContext);
  const [subjects, setSubjects] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [deptFilter, setDeptFilter] = useState('');
  const [semFilter, setSemFilter] = useState('');

  // Modal Fields
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [subjectName, setSubjectName] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [semester, setSemester] = useState('8');
  const [credits, setCredits] = useState('4');
  const [facultyId, setFacultyId] = useState('');
  const [facultyNameText, setFacultyNameText] = useState('TBD');

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const params = {};
      if (deptFilter) params.department = deptFilter;
      if (semFilter) params.semester = semFilter;

      const res = await subjectService.getAll(params);
      if (res.data.success) {
        setSubjects(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFaculties = async () => {
    try {
      const res = await facultyService.getAll();
      if (res.data.success) {
        setFacultyList(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, [deptFilter, semFilter]);

  useEffect(() => {
    fetchFaculties();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setSubjectName('');
    setSubjectCode('');
    setDepartment('Computer Science');
    setSemester('8');
    setCredits('4');
    setFacultyId('');
    setFacultyNameText('TBD');
    setShowModal(true);
  };

  const openEditModal = (subject) => {
    setEditingId(subject._id);
    setSubjectName(subject.subjectName);
    setSubjectCode(subject.subjectCode);
    setDepartment(subject.department);
    setSemester(subject.semester.toString());
    setCredits(subject.credits.toString());
    setFacultyId(subject.faculty?._id || '');
    setFacultyNameText(subject.facultyNameText || 'TBD');
    setShowModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // Resolve faculty text name if facultyId matched
    let facText = facultyNameText;
    if (facultyId) {
      const matched = facultyList.find((f) => f._id === facultyId);
      if (matched) facText = matched.fullName;
    }

    const payload = {
      subjectName,
      subjectCode,
      department,
      semester,
      credits,
      facultyId: facultyId || null,
      facultyNameText: facText,
    };

    try {
      if (editingId) {
        await subjectService.update(editingId, payload);
      } else {
        await subjectService.create(payload);
      }
      setShowModal(false);
      fetchSubjects();
    } catch (err) {
      alert(err.response?.data?.message || 'Error occurred while saving subject');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this subject configuration from database?')) {
      try {
        await subjectService.delete(id);
        fetchSubjects();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            Subject configurations
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Configure semesters, credits, departments and assign instructors.
          </p>
        </div>

        {user?.role === 'admin' && (
          <button
            onClick={openCreateModal}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold text-sm shadow-md hover:opacity-95 flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Subject</span>
          </button>
        )}
      </div>

      {/* Basic Filters bar */}
      <div className="flex flex-wrap items-center gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:border-sky-500 text-slate-700 dark:text-slate-300"
          >
            <option value="">All Departments</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Electronics & Comm">Electronics & Comm</option>
            <option value="Mechanical">Mechanical</option>
            <option value="Civil">Civil</option>
            <option value="Electrical">Electrical</option>
          </select>
        </div>

        <div>
          <select
            value={semFilter}
            onChange={(e) => setSemFilter(e.target.value)}
            className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:border-sky-500 text-slate-700 dark:text-slate-300"
          >
            <option value="">All Semesters</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
              <option key={s} value={s}>Semester {s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Subject Cards */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-slate-200 dark:border-slate-800 border-t-sky-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((sub) => (
            <div key={sub._id} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm flex flex-col justify-between hover:scale-[1.01] transition-transform group relative overflow-hidden">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-sky-500/10 text-sky-500 tracking-wider font-mono">
                    {sub.subjectCode}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">{sub.credits} Credits</span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-slate-800 dark:text-white line-clamp-1 group-hover:text-sky-500 transition-colors">
                    {sub.subjectName}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{sub.department} • Sem {sub.semester}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-950 flex items-center justify-center border border-slate-200 dark:border-slate-800">
                    <UserCheck className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Instructor</span>
                    <span className="text-xs font-semibold">{sub.faculty?.fullName || sub.facultyNameText || 'TBD'}</span>
                  </div>
                </div>
              </div>

              {/* Administrative actions */}
              {user?.role === 'admin' && (
                <div className="flex justify-end gap-2 pt-5 mt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => openEditModal(sub)}
                    className="p-1.5 text-slate-450 hover:text-indigo-500 hover:bg-indigo-500/10 rounded-lg transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(sub._id)}
                    className="p-1.5 text-slate-450 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}

          {subjects.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500">
              No subject configurations matched active department query.
            </div>
          )}
        </div>
      )}

      {/* CREATE/EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-lg p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl relative">
            <h3 className="text-xl font-bold mb-6">{editingId ? 'Modify Subject Config' : 'Create Subject Profile'}</h3>

            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-450 uppercase mb-2">Subject Name</label>
                <input
                  type="text"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-450 uppercase mb-2">Subject Code</label>
                  <input
                    type="text"
                    value={subjectCode}
                    onChange={(e) => setSubjectCode(e.target.value)}
                    placeholder="e.g. CS801"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-sky-500 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-450 uppercase mb-2">Credits</label>
                  <select
                    value={credits}
                    onChange={(e) => setCredits(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-sky-500"
                  >
                    {[1, 2, 3, 4, 5, 6].map((c) => (
                      <option key={c} value={c}>{c} Credits</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-450 uppercase mb-2">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-sky-500"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Electronics & Comm">Electronics & Comm</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Civil">Civil</option>
                    <option value="Electrical">Electrical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-450 uppercase mb-2">Semester</label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-sky-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>Semester {s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-450 uppercase mb-2">Assign Faculty Instructor</label>
                <select
                  value={facultyId}
                  onChange={(e) => setFacultyId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-sky-500"
                >
                  <option value="">Unassigned (TBD)</option>
                  {facultyList.map((f) => (
                    <option key={f._id} value={f._id}>{f.fullName} ({f.department})</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-sky-550 dark:bg-sky-600 text-white text-sm font-semibold hover:opacity-90"
                >
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subjects;

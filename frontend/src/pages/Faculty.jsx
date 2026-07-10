import React, { useState, useEffect, useContext } from 'react';
import { facultyService, subjectService } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import {
  UserPlus,
  Mail,
  Phone,
  Bookmark,
  Briefcase,
  ChevronRight,
  GraduationCap,
  Shield,
  Trash2,
  Edit2
} from 'lucide-react';

const Faculty = () => {
  const { user } = useContext(AuthContext);
  const [faculty, setFaculty] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal / Form state
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [designation, setDesignation] = useState('Professor');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const fetchFaculty = async () => {
    setLoading(true);
    try {
      const res = await facultyService.getAll();
      if (res.data.success) {
        setFaculty(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setFullName('');
    setEmail('');
    setPhoneNumber('');
    setDepartment('Computer Science');
    setDesignation('Professor');
    setUsername('');
    setPassword('');
    setShowModal(true);
  };

  const openEditModal = (fac) => {
    setEditingId(fac._id);
    setFullName(fac.fullName);
    setEmail(fac.email);
    setPhoneNumber(fac.phoneNumber);
    setDepartment(fac.department);
    setDesignation(fac.designation);
    setUsername(fac.email.split('@')[0]);
    setPassword('');
    setShowModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      fullName,
      email,
      phoneNumber,
      department,
      designation,
      username: username || email.split('@')[0],
      password: password || '123456',
    };

    try {
      if (editingId) {
        await facultyService.update(editingId, payload);
      } else {
        await facultyService.create(payload);
      }
      setShowModal(false);
      fetchFaculty();
    } catch (err) {
      alert(err.response?.data?.message || 'Error occurred while saving faculty profile');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete faculty account and rescind assigned classes?')) {
      try {
        await facultyService.delete(id);
        fetchFaculty();
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
            Faculty Directory
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Registered faculty list, designations and mapped course codes.
          </p>
        </div>

        {user?.role === 'admin' && (
          <button
            onClick={openCreateModal}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold text-sm shadow-md hover:opacity-95 flex items-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register Faculty</span>
          </button>
        )}
      </div>

      {/* Grid view of instructors */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-slate-200 dark:border-slate-800 border-t-sky-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {faculty.map((fac) => (
            <div key={fac._id} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm flex flex-col justify-between hover:scale-[1.01] transition-transform">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center font-bold text-white uppercase text-base">
                    {fac.fullName.substring(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-800 dark:text-white leading-tight">{fac.fullName}</h3>
                    <span className="inline-block text-[10px] uppercase font-bold tracking-wider text-sky-500 mt-1">{fac.designation}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <Bookmark className="w-3.5 h-3.5 text-slate-400" />
                    <span>Department: <strong>{fac.department}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{fac.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{fac.phoneNumber}</span>
                  </div>
                </div>

                {/* Assigned Course Codes List */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider mb-2">Assigned Courses</span>
                  <div className="flex flex-wrap gap-1.5">
                    {fac.assignedSubjects?.map((sub) => (
                      <span key={sub._id} className="px-2 py-0.5 text-[9px] font-mono font-bold rounded-md bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                        {sub.subjectCode}
                      </span>
                    ))}
                    {(!fac.assignedSubjects || fac.assignedSubjects.length === 0) && (
                      <span className="text-slate-450 text-xs italic">No courses unassigned.</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Mutation options */}
              {(user?.role === 'admin' || (user?.role === 'faculty' && fac.user === user.id)) && (
                <div className="flex justify-end gap-2 pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => openEditModal(fac)}
                    className="p-1.5 text-slate-400 hover:text-indigo-500 hover:bg-indigo-500/10 rounded-lg transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  {user?.role === 'admin' && (
                    <button
                      onClick={() => handleDelete(fac._id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}

          {faculty.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500">
              No faculty instructor profiles catalogued.
            </div>
          )}
        </div>
      )}

      {/* CREATE/EDIT FACULTY MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-lg p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl relative">
            <h3 className="text-xl font-bold mb-6">{editingId ? 'Modify Faculty Record' : 'Register Faculty Profile'}</h3>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-450 uppercase mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-450 uppercase mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-450 uppercase mb-1.5">Phone Number</label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-450 uppercase mb-1.5">Department Mapping</label>
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
                  <label className="block text-xs font-semibold text-slate-450 uppercase mb-1.5">Designation</label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. Professor"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Login Account credentials mapping */}
              {!editingId && (
                <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-sky-500 uppercase tracking-widest">Automatic Web Credentials Setup</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase mb-1">Username</label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="e.g. johndoe"
                        className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase mb-1">Password</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="e.g. 123456"
                        className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

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
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Faculty;

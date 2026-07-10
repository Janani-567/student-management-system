import React, { useState, useEffect, useContext } from 'react';
import { studentService, facultyService } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Download,
  Filter,
  CheckCircle,
  FileSpreadsheet,
  FileText,
  UserPlus,
  QrCode,
  Award
} from 'lucide-react';

const Students = () => {
  const { user } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [nameSearch, setNameSearch] = useState('');
  const [rollSearch, setRollSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [semFilter, setSemFilter] = useState('');
  const [minCgpa, setMinCgpa] = useState('');
  const [maxCgpa, setMaxCgpa] = useState('');

  // Modal / Form state
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [qrModalData, setQrModalData] = useState(null);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [batchYear, setBatchYear] = useState('2026');
  const [semester, setSemester] = useState('8');
  const [gender, setGender] = useState('Male');
  const [cgpa, setCgpa] = useState('0.0');
  const [address, setAddress] = useState('');
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = {};
      if (nameSearch) params.name = nameSearch;
      if (rollSearch) params.rollNumber = rollSearch;
      if (deptFilter) params.department = deptFilter;
      if (semFilter) params.semester = semFilter;
      if (minCgpa) params.minCgpa = minCgpa;
      if (maxCgpa) params.maxCgpa = maxCgpa;

      const res = await studentService.getAll(params);
      if (res.data.success) {
        setStudents(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load students', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [deptFilter, semFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchStudents();
  };

  const handleClearFilters = () => {
    setNameSearch('');
    setRollSearch('');
    setDeptFilter('');
    setSemFilter('');
    setMinCgpa('');
    setMaxCgpa('');
    // Trigger reset list
    studentService.getAll().then((res) => {
      if (res.data.success) setStudents(res.data.data);
    });
  };

  const openCreateModal = () => {
    setEditingId(null);
    setFullName('');
    setRollNumber('');
    setEmail('');
    setPhoneNumber('');
    setDepartment('Computer Science');
    setBatchYear('2026');
    setSemester('8');
    setGender('Male');
    setCgpa('0.0');
    setAddress('');
    setProfilePhotoFile(null);
    setUsername('');
    setPassword('');
    setShowModal(true);
  };

  const openEditModal = (student) => {
    setEditingId(student._id);
    setFullName(student.fullName);
    setRollNumber(student.rollNumber);
    setEmail(student.email);
    setPhoneNumber(student.phoneNumber);
    setDepartment(student.department);
    setBatchYear(student.batchYear.toString());
    setSemester(student.semester.toString());
    setGender(student.gender);
    setCgpa(student.cgpa.toString());
    setAddress(student.address);
    setProfilePhotoFile(null);
    setUsername(student.rollNumber);
    setPassword('');
    setShowModal(true);
  };

  const handleFileChange = (e) => {
    setProfilePhotoFile(e.target.files[0]);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('rollNumber', rollNumber);
    formData.append('email', email);
    formData.append('phoneNumber', phoneNumber);
    formData.append('department', department);
    formData.append('batchYear', batchYear);
    formData.append('semester', semester);
    formData.append('gender', gender);
    formData.append('cgpa', cgpa);
    formData.append('address', address);
    if (profilePhotoFile) {
      formData.append('profilePhoto', profilePhotoFile);
    }

    if (!editingId) {
      // Append unique fields for login account creation
      formData.append('username', username || rollNumber);
      formData.append('password', password || '123456');
    }

    try {
      if (editingId) {
        await studentService.update(editingId, formData);
      } else {
        await studentService.create(formData);
      }
      setShowModal(false);
      fetchStudents();
    } catch (err) {
      alert(err.response?.data?.message || 'Error occurred while saving profile');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this student record?')) {
      try {
        await studentService.delete(id);
        fetchStudents();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Badge evaluated indicator
  const getBadgeDetails = (gpa) => {
    if (gpa >= 9.0) return { label: 'Gold Badge', style: 'bg-amber-500/10 text-amber-500 border-amber-500/20' };
    if (gpa >= 8.0) return { label: 'Silver Badge', style: 'bg-slate-400/10 text-slate-400 border-slate-400/20' };
    if (gpa >= 7.0) return { label: 'Bronze Badge', style: 'bg-amber-700/10 text-amber-700 border-amber-700/20' };
    return null;
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            Student Records Directory
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Search, filter and customize academic student cards.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {user?.role === 'admin' && (
            <button
              onClick={openCreateModal}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold text-sm shadow-md hover:opacity-95 flex items-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add New Student</span>
            </button>
          )}

          <a
            href="http://localhost:5000/api/reports/excel/students"
            className="px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-sm flex items-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
            <span>Export Excel</span>
          </a>
        </div>
      </div>

      {/* Advanced Filters Block */}
      <form onSubmit={handleSearchSubmit} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Filter className="w-4 h-4 text-sky-500" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Refine Results Directory</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-450 dark:text-slate-500">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-sky-500 text-slate-700 dark:text-slate-300"
              placeholder="Search by name..."
            />
          </div>

          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-450 dark:text-slate-500">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={rollSearch}
              onChange={(e) => setRollSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-sky-500 text-slate-700 dark:text-slate-300"
              placeholder="Search by Roll number..."
            />
          </div>

          <div>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-sky-500 text-slate-700 dark:text-slate-350"
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
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-sky-500 text-slate-700 dark:text-slate-350"
            >
              <option value="">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <option key={s} value={s}>Semester {s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Extended filters: CGPA limit */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              value={minCgpa}
              onChange={(e) => setMinCgpa(e.target.value)}
              placeholder="Min CGPA (e.g. 8.0)"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-sky-500 text-slate-700 dark:text-slate-300"
            />
            <span className="text-slate-400 text-xs">to</span>
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              value={maxCgpa}
              onChange={(e) => setMaxCgpa(e.target.value)}
              placeholder="Max CGPA (e.g. 10.0)"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-sky-500 text-slate-700 dark:text-slate-300"
            />
          </div>

          <div className="flex gap-3 justify-end sm:col-span-2">
            <button
              type="button"
              onClick={handleClearFilters}
              className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold"
            >
              Clear Filters
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-sky-550 dark:bg-sky-600 hover:opacity-90 text-white text-xs font-semibold cursor-pointer"
            >
              Apply Filter Indexes
            </button>
          </div>
        </div>
      </form>

      {/* Database Display Table/Cards */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-slate-200 dark:border-slate-800 border-t-sky-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-450 dark:text-slate-400 text-xs uppercase font-bold tracking-wider">
                  <th className="py-4 px-4">Student</th>
                  <th className="py-4 px-4">Roll Number</th>
                  <th className="py-4 px-4">Department & Sem</th>
                  <th className="py-4 px-4">CGPA Index</th>
                  <th className="py-4 px-4">Badges</th>
                  <th className="py-4 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300 text-sm">
                {students.map((student) => {
                  const badge = getBadgeDetails(student.cgpa);
                  return (
                    <tr key={student._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/30 transition-colors">
                      <td className="py-4 px-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center border border-slate-200 dark:border-slate-700">
                          {student.profilePhoto ? (
                            <img src={`http://localhost:5000${student.profilePhoto}`} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="font-bold text-slate-500">{student.fullName.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-850 dark:text-slate-250">{student.fullName}</h4>
                          <span className="text-xs text-slate-400">{student.email}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4 font-mono text-xs">{student.rollNumber}</td>
                      <td className="py-4 px-4">
                        <p className="font-medium">{student.department}</p>
                        <span className="text-xs text-slate-450 dark:text-slate-400">Semester {student.semester}</span>
                      </td>

                      <td className="py-4 px-4">
                        <span className="font-bold">{student.cgpa}</span>
                        <span className="text-[10px] text-slate-400 font-normal"> /10.0</span>
                      </td>

                      <td className="py-4 px-4">
                        {badge ? (
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${badge.style}`}>
                            <Award className="w-3 h-3" />
                            <span>{badge.label}</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">—</span>
                        )}
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setQrModalData(student)}
                            className="p-2 text-slate-400 hover:text-sky-500 hover:bg-sky-500/10 rounded-lg transition-colors cursor-pointer"
                            title="Generate QR ID Card"
                          >
                            <QrCode className="w-4 h-4" />
                          </button>
                          
                          <a
                            href={`http://localhost:5000/api/reports/pdf/student/${student._id}`}
                            className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-500/10 rounded-lg transition-colors"
                            title="Export PDF Report"
                          >
                            <FileText className="w-4 h-4" />
                          </a>

                          {(user?.role === 'admin' || (user?.role === 'student' && student.user === user.id)) && (
                            <button
                              onClick={() => openEditModal(student)}
                              className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-500/10 rounded-lg transition-colors cursor-pointer"
                              title="Update profile"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}

                          {user?.role === 'admin' && (
                            <button
                              onClick={() => handleDelete(student._id)}
                              className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                              title="Delete record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {students.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-450 dark:text-slate-500">
                      No matching student profiles found in the registry database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* QR Code Modal popup overlay */}
      {qrModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-sm p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4">
            <h3 className="font-bold text-lg">Student Profile QR Identity Card</h3>
            
            <div className="flex justify-center p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800">
              <img src={qrModalData.qrCode} alt="Profile QR Card" className="w-44 h-44" />
            </div>

            <div>
              <h4 className="font-bold text-base">{qrModalData.fullName}</h4>
              <p className="text-xs text-slate-450 font-mono mt-1">{qrModalData.rollNumber}</p>
              <p className="text-xs text-sky-500 font-semibold mt-1">{qrModalData.department}</p>
            </div>

            <button
              onClick={() => setQrModalData(null)}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold rounded-xl"
            >
              Dismiss Panel
            </button>
          </div>
        </div>
      )}

      {/* CREATE/EDIT MODAL OVERLAY */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl relative my-8">
            <h3 className="text-xl font-bold mb-6">{editingId ? 'Modify Student Profile' : 'Register New Student'}</h3>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-450 uppercase mb-2">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-sky-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-450 uppercase mb-2">Roll Number (Unique)</label>
                  <input
                    type="text"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-sky-500 font-mono"
                    required
                    disabled={!!editingId}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-450 uppercase mb-2">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-sky-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-450 uppercase mb-2">Phone Number</label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-sky-500"
                    required
                  />
                </div>

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
                  <label className="block text-xs font-semibold text-slate-450 uppercase mb-2">Semester (1–8)</label>
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

                <div>
                  <label className="block text-xs font-semibold text-slate-450 uppercase mb-2">Batch Year</label>
                  <input
                    type="number"
                    value={batchYear}
                    onChange={(e) => setBatchYear(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-sky-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-450 uppercase mb-2">CGPA (0.00 – 10.00)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={cgpa}
                    onChange={(e) => setCgpa(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-sky-500"
                    required
                    disabled={user?.role !== 'admin'}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-450 uppercase mb-2">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-sky-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-450 uppercase mb-2">Profile Photo File</label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-sky-500/10 file:text-sky-500 hover:file:bg-sky-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-450 uppercase mb-2">Residential Address</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-sky-500 h-20"
                  required
                />
              </div>

              {/* Account Setup block (only for new registration) */}
              {!editingId && (
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 space-y-4">
                  <h4 className="text-xs font-bold text-sky-500 uppercase tracking-widest">Automatic Web Credentials Setup</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase mb-1">Portal Login Username</label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="defaults to Roll Number"
                        className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase mb-1">Access Password</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="defaults to: 123456"
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
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;

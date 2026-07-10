import React, { useState, useEffect, useContext } from 'react';
import { NotificationContext } from '../context/NotificationContext';
import { AuthContext } from '../context/AuthContext';
import {
  Bell,
  Trash2,
  Plus,
  Megaphone,
  BookOpen,
  AlertOctagon,
  Sparkles
} from 'lucide-react';

const Notifications = () => {
  const { user } = useContext(AuthContext);
  const { notifications, fetchNotifications, addNotification } = useContext(NotificationContext);
  const [loading, setLoading] = useState(true);

  // Form Fields
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('General');
  const [targetRole, setTargetRole] = useState('all');
  const [department, setDepartment] = useState('all');

  useEffect(() => {
    fetchNotifications().finally(() => setLoading(false));
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!title || !message) return;

    try {
      const res = await addNotification(title, message, type, targetRole, department);
      if (res.success) {
        setShowModal(false);
        setTitle('');
        setMessage('');
        setType('General');
        setTargetRole('all');
        setDepartment('all');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getNotificationIcon = (notifType) => {
    if (notifType === 'Academic') return <BookOpen className="w-5 h-5 text-indigo-500" />;
    if (notifType === 'Exam') return <Sparkles className="w-5 h-5 text-purple-500" />;
    if (notifType === 'Alert') return <AlertOctagon className="w-5 h-5 text-rose-500" />;
    return <Megaphone className="w-5 h-5 text-sky-500" />;
  };

  const getTypeStyle = (notifType) => {
    if (notifType === 'Academic') return 'bg-indigo-500/10 text-indigo-500 border-indigo-550/20';
    if (notifType === 'Exam') return 'bg-purple-500/10 text-purple-500 border-purple-550/20';
    if (notifType === 'Alert') return 'bg-rose-500/10 text-rose-500 border-rose-550/20';
    return 'bg-sky-500/10 text-sky-550 border-sky-550/20';
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            Announcements Board
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Exam tables, schedules, department bulletins and alerts.
          </p>
        </div>

        {user?.role !== 'student' && (
          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold text-sm shadow-md hover:opacity-95 flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Announcement</span>
          </button>
        )}
      </div>

      {/* Announcements List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-slate-200 dark:border-slate-800 border-t-sky-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {notifications.map((notif) => (
            <div
              key={notif._id}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm flex items-start gap-4 hover:scale-[1.005] transition-transform"
            >
              <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl">
                {getNotificationIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="font-bold text-base text-slate-800 dark:text-white leading-tight">
                    {notif.title}
                  </h3>
                  <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded border ${getTypeStyle(notif.type)}`}>
                    {notif.type}
                  </span>
                  <span className="text-[10px] text-slate-450 dark:text-slate-400">
                    {new Date(notif.createdAt).toLocaleDateString(undefined, {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed">
                  {notif.message}
                </p>

                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  <span>Scope: {notif.targetRole}</span>
                  <span>•</span>
                  <span>Dept: {notif.department}</span>
                </div>
              </div>
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="py-12 text-center text-slate-500">
              No bulletins posted at this time.
            </div>
          )}
        </div>
      )}

      {/* CREATE BULLETIN MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-lg p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl relative">
            <h3 className="text-xl font-bold mb-6">Create New Announcement</h3>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-450 uppercase mb-2">Bulletin Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-sky-500 text-slate-700 dark:text-slate-300"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-450 uppercase mb-2">Detailed Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-sky-500 h-24 text-slate-700 dark:text-slate-300"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-450 uppercase mb-2">Bulletin Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-sky-500"
                  >
                    <option value="General">General Announcement</option>
                    <option value="Academic">Academic Schedule</option>
                    <option value="Exam">Exam Bulletin</option>
                    <option value="Alert">Important Alert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-450 uppercase mb-2">Target Audience</label>
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-sky-500"
                  >
                    <option value="all">Everyone</option>
                    <option value="faculty">Faculty Only</option>
                    <option value="student">Students Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-450 uppercase mb-2">Department Restrictions</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-sky-500"
                >
                  <option value="all">All Departments</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics & Comm">Electronics & Comm</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Civil">Civil</option>
                  <option value="Electrical">Electrical</option>
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
                  Publish Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;

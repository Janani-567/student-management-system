import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';
import { Bell, ShieldCheck, HelpCircle } from 'lucide-react';

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const { unreadCount, fetchNotifications, clearUnread } = useContext(NotificationContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleNotificationClick = () => {
    clearUnread();
    navigate('/notifications');
  };

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-30 transition-all duration-300">
      {/* Search Bar / System Status */}
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
          Portal Secure Engine Connected
        </span>
      </div>

      {/* Profile/Controls Utilities */}
      <div className="flex items-center gap-6">
        {/* Support Help */}
        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* Notifications Alert Center */}
        <button
          onClick={handleNotificationClick}
          className="relative text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold font-sans">
              {unreadCount}
            </span>
          )}
        </button>

        {/* User context metadata details */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
          <div className="text-right hidden sm:block">
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 capitalize">
              {user?.username}
            </h4>
            <span className="text-[10px] font-bold text-sky-500 tracking-widest uppercase">
              {user?.role}
            </span>
          </div>

          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-md border border-white/10 dark:border-slate-800">
            {user?.role === 'admin' ? <ShieldCheck className="w-5 h-5" /> : user?.username?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

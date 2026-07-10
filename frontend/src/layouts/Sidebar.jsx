import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  UserCheck,
  Award,
  Bell,
  Activity,
  LogOut,
  Sun,
  Moon,
  ShieldAlert,
  GraduationCap
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'faculty', 'student'] },
    { to: '/students', label: 'Students', icon: Users, roles: ['admin', 'faculty', 'student'] },
    { to: '/subjects', label: 'Subjects', icon: BookOpen, roles: ['admin', 'faculty', 'student'] },
    { to: '/faculty', label: 'Faculty', icon: UserCheck, roles: ['admin', 'faculty'] },
    { to: '/attendance', label: 'Attendance', icon: ShieldAlert, roles: ['admin', 'faculty', 'student'] },
    { to: '/achievements', label: 'Achievements', icon: Award, roles: ['admin', 'faculty', 'student'] },
    { to: '/notifications', label: 'Announcements', icon: Bell, roles: ['admin', 'faculty', 'student'] },
    { to: '/logs', label: 'Audit Logs', icon: Activity, roles: ['admin'] },
  ];

  const allowedLinks = navLinks.filter((link) => link.roles.includes(user?.role));

  return (
    <aside className="w-68 min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between border-r border-slate-800 transition-all duration-300">
      <div>
        {/* Brand/Logo header */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-800/60">
          <div className="p-2 bg-gradient-to-tr from-sky-500 to-indigo-600 rounded-xl shadow-lg">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">EduSphere Pro</h1>
            <span className="text-xs text-sky-400 font-medium tracking-widest uppercase">Smart Portal</span>
          </div>
        </div>

        {/* User Card */}
        <div className="px-4 py-5 border-b border-slate-800/40">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-800/60">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white uppercase shadow-md">
              {user?.username?.substring(0, 2) || 'AD'}
            </div>
            <div className="truncate">
              <p className="text-sm font-semibold text-white">{user?.username}</p>
              <span className="inline-block px-2 py-0.5 mt-1 text-[10px] font-bold tracking-wider uppercase text-sky-300 bg-sky-950/60 border border-sky-800/40 rounded-full">
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="px-4 py-6 space-y-1">
          {allowedLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium tracking-wide transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/10 scale-[1.02]'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`
                }
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer / Utilities actions */}
      <div className="p-4 border-t border-slate-800/60 space-y-2">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-slate-800/40 border border-transparent hover:border-slate-800 transition-all duration-200"
        >
          <div className="flex items-center gap-2">
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-400" />}
            <span>{darkMode ? 'Light Theme' : 'Dark Theme'}</span>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Mode</span>
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-rose-400 hover:text-white hover:bg-rose-950/40 border border-transparent hover:border-rose-900/40 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout Portal</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

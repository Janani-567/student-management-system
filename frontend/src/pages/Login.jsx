import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { GraduationCap, Mail, Lock, AlertTriangle, Key } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loadingState, setLoadingState] = useState(false);

  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoadingState(true);
    setErrorMsg('');
    const result = await login(email, password);
    setLoadingState(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setErrorMsg(result.message);
    }
  };

  const autofillRole = (role) => {
    if (role === 'admin') {
      setEmail('admin@edusphere.com');
      setPassword('adminpassword');
    } else if (role === 'faculty') {
      setEmail('john.doe@edusphere.com');
      setPassword('facultypassword');
    } else if (role === 'student') {
      setEmail('alex.mercer@edusphere.com');
      setPassword('studentpassword');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative select-none font-sans">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-sky-500/10 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Glass Card Container */}
        <div className="glass-premium rounded-2xl p-8 border border-white/5 bg-slate-900/35 relative">
          <div className="flex flex-col items-center mb-8">
            <div className="p-3 bg-gradient-to-tr from-sky-500 to-indigo-600 rounded-2xl shadow-xl shadow-sky-500/15 mb-4">
              <GraduationCap className="w-8 h-8 text-white animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Access Control Portal</h2>
            <p className="text-slate-400 text-xs mt-1">Sign in to manage EduSphere academic statistics</p>
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2.5 p-3.5 mb-6 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30 transition-all"
                  placeholder="name@edusphere.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Password Credentials</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loadingState}
              className="w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:opacity-95 text-white text-sm font-semibold tracking-wide shadow-lg shadow-sky-500/10 active:scale-[0.98] transition-all flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loadingState ? (
                <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
              ) : (
                'Sign In Security'
              )}
            </button>
          </form>

          {/* Quick Demo Autofill Controls */}
          <div className="mt-8 pt-6 border-t border-slate-800/60">
            <h4 className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-3 flex items-center gap-1.5 justify-center">
              <Key className="w-3 h-3 text-sky-400" />
              <span>Quick Demo Sign In Profile</span>
            </h4>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => autofillRole('admin')}
                className="py-2 px-1 text-[10px] text-sky-400 bg-sky-950/30 hover:bg-sky-950/60 border border-sky-900/40 rounded-lg font-medium transition-all"
              >
                Admin
              </button>
              <button
                onClick={() => autofillRole('faculty')}
                className="py-2 px-1 text-[10px] text-indigo-400 bg-indigo-950/30 hover:bg-indigo-950/60 border border-indigo-900/40 rounded-lg font-medium transition-all"
              >
                Faculty
              </button>
              <button
                onClick={() => autofillRole('student')}
                className="py-2 px-1 text-[10px] text-purple-400 bg-purple-950/30 hover:bg-purple-950/60 border border-purple-900/40 rounded-lg font-medium transition-all"
              >
                Student
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

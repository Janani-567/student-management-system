import React from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Shield,
  ChartBar,
  Zap,
  Globe,
  Award,
  ArrowRight,
  TrendingUp,
  Cpu
} from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-sky-500 selection:text-slate-900 overflow-x-hidden font-sans">
      {/* Dynamic Futuristic Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 z-0"></div>

      {/* Floating neon light blobs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none z-0"></div>

      {/* Header / Navbar */}
      <header className="relative z-10 max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-slate-900/60">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-tr from-sky-500 to-indigo-600 rounded-xl shadow-lg shadow-sky-500/20">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            EduSphere <span className="text-sky-400">Pro</span>
          </span>
        </div>
        <Link
          to="/login"
          className="px-5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white hover:border-slate-700 transition-all font-medium text-sm"
        >
          Sign In Portal
        </Link>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-28 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-white/5 text-xs text-sky-400 font-medium tracking-wide mb-8 animate-pulse">
          <Zap className="w-3.5 h-3.5" />
          <span>v2.0 Elite Platform Live</span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight max-w-5xl leading-tight mb-8">
          The Next-Generation Smart{' '}
          <span className="bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Academic Platform
          </span>
        </h1>

        <p className="text-slate-400 text-base sm:text-xl max-w-3xl mb-12 leading-relaxed">
          Manage profiles, track attendance, evaluate badges, analyze CGPA charts and export reports with real-time statistics on a unified glassmorphism dashboard.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold flex items-center justify-center gap-2 hover:opacity-95 hover:scale-[1.02] shadow-lg shadow-indigo-500/20 transition-all"
          >
            <span>Enter Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#features"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 font-semibold hover:text-white hover:border-slate-700 transition-all"
          >
            Explore Modules
          </a>
        </div>

        {/* Hero Mockup Panel */}
        <div className="mt-16 w-full max-w-5xl rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 shadow-2xl backdrop-blur-sm relative">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-4/5 h-12 bg-sky-500/10 rounded-full blur-xl"></div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/60 mb-4 px-2">
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/60"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/60"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/60"></span>
            </div>
            <span className="text-[10px] tracking-widest text-slate-500 uppercase font-mono">EDUSPHERE_ENGINE_SECURE</span>
            <div className="w-12"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left p-2">
            <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-900">
              <span className="text-xs text-sky-400 font-mono">01 // VISUAL ANALYTICS</span>
              <h3 className="text-lg font-bold mt-2 mb-1">CGPA Trends</h3>
              <p className="text-xs text-slate-400">Interactive charts and department distributions tracked in real-time.</p>
            </div>
            <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-900">
              <span className="text-xs text-indigo-400 font-mono">02 // ACADEMIC PROFILE</span>
              <h3 className="text-lg font-bold mt-2 mb-1">QR Code Badges</h3>
              <p className="text-xs text-slate-400">Gold, Silver, Bronze badges paired with student custom QR codes.</p>
            </div>
            <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-900">
              <span className="text-xs text-purple-400 font-mono">03 // CERTIFICATES</span>
              <h3 className="text-lg font-bold mt-2 mb-1">PDF & Excel Export</h3>
              <p className="text-xs text-slate-400">Download formatted digital profile reports and spreadsheets instantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Modules Feature Grid */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24 border-t border-slate-900">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Enterprise Grade Student Management</h2>
          <p className="text-slate-400">Comprehensive suite of school modules designed for modern academic institutions.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="p-8 rounded-2xl bg-slate-900/20 border border-slate-900 hover:border-slate-800 transition-all hover:scale-[1.01] group">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400 mb-6 group-hover:bg-sky-500 group-hover:text-slate-950 transition-all">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Role-Based Access Control</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Granular access system catering to Admins, Faculty, and Students. Secured with signed JWT tokens.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-8 rounded-2xl bg-slate-900/20 border border-slate-900 hover:border-slate-800 transition-all hover:scale-[1.01] group">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 group-hover:bg-indigo-500 group-hover:text-slate-950 transition-all">
              <ChartBar className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Performance Trends</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Track CGPA rankings, student progress indexes, and department grade leaderboards automatically.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-8 rounded-2xl bg-slate-900/20 border border-slate-900 hover:border-slate-800 transition-all hover:scale-[1.01] group">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-6 group-hover:bg-purple-500 group-hover:text-slate-950 transition-all">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">QR Student Identification</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Generate customizable PDF report cards and QR codes mapping to detailed database entries.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-8 rounded-2xl bg-slate-900/20 border border-slate-900 hover:border-slate-800 transition-all hover:scale-[1.01] group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-6 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Attendance Alert Indicators</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Automated notifications flagged for low class attendance below the 75% standard threshold.
            </p>
          </div>

          {/* Card 5 */}
          <div className="p-8 rounded-2xl bg-slate-900/20 border border-slate-900 hover:border-slate-800 transition-all hover:scale-[1.01] group">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-6 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Achievement Badges</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Motivate students with Gold, Silver, and Bronze badges directly mapped to their final cumulative CGPA.
            </p>
          </div>

          {/* Card 6 */}
          <div className="p-8 rounded-2xl bg-slate-900/20 border border-slate-900 hover:border-slate-800 transition-all hover:scale-[1.01] group">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400 mb-6 group-hover:bg-rose-500 group-hover:text-slate-950 transition-all">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">AI Suggestions Engine</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Intelligent performance evaluation and AI-based academic support tips generated for underperforming tiers.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto px-6 py-12 border-t border-slate-900/60 text-center text-xs text-slate-500">
        <p>© 2026 EduSphere Pro Platform. All rights reserved. Powered by React + Tailwind.</p>
      </footer>
    </div>
  );
};

export default Landing;

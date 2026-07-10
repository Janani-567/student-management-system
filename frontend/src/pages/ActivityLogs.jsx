import React, { useState, useEffect } from 'react';
import { logService } from '../services/api';
import { ShieldCheck, Calendar, Activity, AlertCircle } from 'lucide-react';

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await logService.getLogs();
        if (res.data.success) {
          setLogs(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
          System Audit Trail
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Detailed security logging of all actions and client IP accesses (Admin only).
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-slate-200 dark:border-slate-800 border-t-sky-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
            <Activity className="w-4 h-4 text-sky-500" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Recent Security Logs</h3>
          </div>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {logs.map((log) => (
              <div
                key={log._id}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-105 dark:border-slate-800/60 flex items-start justify-between flex-wrap gap-4 text-xs"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-500 font-bold uppercase tracking-wider text-[9px]">
                      {log.action}
                    </span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      User: {log.username} ({log.role})
                    </span>
                  </div>

                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-mono">
                    {log.details}
                  </p>
                </div>

                <div className="text-right space-y-1 text-slate-400 font-semibold font-mono">
                  <p className="flex items-center gap-1 justify-end text-[10px]">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(log.createdAt).toLocaleString()}</span>
                  </p>
                  {log.ipAddress && (
                    <p className="text-[9px]">IP: {log.ipAddress}</p>
                  )}
                </div>
              </div>
            ))}

            {logs.length === 0 && (
              <div className="py-12 text-center text-slate-500">
                No system activity logs found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityLogs;

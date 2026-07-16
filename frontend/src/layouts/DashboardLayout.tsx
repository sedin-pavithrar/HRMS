import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Briefcase, 
  CalendarDays, 
  FileText, 
  DollarSign, 
  Sparkles,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { navigationConfig } from '../navigation/modules';

export default function DashboardLayout() {
  const [stats, setStats] = useState({
    activeOpenings: 4,
    totalEmployees: 0,
    attendanceToday: '92%',
    pendingLeaves: 0,
    payrollSummary: '$48,250'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardStats() {
      try {
        const [empRes, leaveRes, attRes, payrollRes] = await Promise.all([
          fetch('/hrms/api/employees?size=100'),
          fetch('/hrms/api/leave'),
          fetch('/hrms/api/attendance'),
          fetch('/hrms/api/payroll')
        ]);
        
        const empData = await empRes.json();
        const leaveData = await leaveRes.json();
        const attData = await attRes.json();
        const payrollData = await payrollRes.json();

        const activeEmployeesCount = (empData.items || []).length;
        const pendingLeavesCount = (leaveData || []).filter((l: any) => l.status === 'Pending').length;
        
        // Calculate payroll total
        const totalNetSalary = (payrollData || []).reduce((acc: number, item: any) => acc + (item.net_salary || 0), 0);
        const formattedPayroll = totalNetSalary > 0 
          ? `$${totalNetSalary.toLocaleString()}`
          : '$48,250';

        // Calculate attendance
        const todayStr = new Date().toISOString().split('T')[0];
        const todayAtt = (attData || []).filter((a: any) => a.date === todayStr);
        const presentCount = todayAtt.filter((a: any) => a.status === 'Present' || a.status === 'Late').length;
        const attRate = activeEmployeesCount > 0 
          ? `${Math.round((presentCount / activeEmployeesCount) * 100)}%`
          : '94%';

        setStats({
          activeOpenings: 4, // Static mock for Recruitment Management POC
          totalEmployees: activeEmployeesCount || 12,
          attendanceToday: attRate,
          pendingLeaves: pendingLeavesCount || 2,
          payrollSummary: formattedPayroll
        });
      } catch (err) {
        console.error("Error fetching stats", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardStats();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 p-2 rounded-lg text-white shadow-lg shadow-indigo-500/25">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                HRMS Portal
              </span>
              <span className="ml-2 text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 px-2 py-0.5 rounded-full">
                POC
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span>Powered by SparkEcho</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 flex flex-col justify-center">
        {/* Welcome Section */}
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-4 sm:text-5xl">
            HRMS Dashboard
          </h1>
          <p className="text-slate-400 text-lg">
            Welcome to the SparkEcho modular HRMS concept. Select a module below to begin managing workflows.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-16">
          {/* Job Openings */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-6 hover:border-slate-700/80 transition-all duration-300">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Job Openings</p>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-bold text-white">{stats.activeOpenings}</span>
              <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                <Briefcase className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Total Employees */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-6 hover:border-slate-700/80 transition-all duration-300">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Total Employees</p>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-bold text-white">{stats.totalEmployees}</span>
              <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                <Users className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Today's Attendance */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-6 hover:border-slate-700/80 transition-all duration-300">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Today's Attendance</p>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-bold text-white">{stats.attendanceToday}</span>
              <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
                <CalendarDays className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Pending Leaves */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-6 hover:border-slate-700/80 transition-all duration-300">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Pending Leaves</p>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-bold text-white">{stats.pendingLeaves}</span>
              <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
                <FileText className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Payroll Summary */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-6 hover:border-slate-700/80 transition-all duration-300">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Payroll Summary</p>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-bold text-white">{stats.payrollSummary}</span>
              <div className="p-2 bg-rose-500/10 text-rose-400 rounded-lg">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Available Modules Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <h2 className="text-xl font-bold text-white">Available Modules</h2>
            <span className="text-xs text-slate-500">Select to explore</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {navigationConfig.modules.map((mod) => (
              <Link
                key={mod.id}
                to={`${mod.navigation[0].route}`}
                className="group relative bg-slate-900/30 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900/60 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 flex flex-col justify-between min-h-[160px]"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold bg-slate-800 text-slate-300 group-hover:bg-indigo-500/10 group-hover:text-indigo-400 border border-transparent group-hover:border-indigo-500/20 px-3 py-1 rounded-full transition-colors duration-300">
                      Module
                    </span>
                    <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-indigo-400 transform group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors duration-300">
                    {mod.name}
                  </h3>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500 group-hover:text-slate-400 transition-colors duration-300">
                  <span>Contains {mod.navigation.length} sub-sections</span>
                  <span className="flex items-center gap-1">
                    Open <ChevronRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-600">
        &copy; {new Date().getFullYear()} HRMS POC. All rights reserved. SparkEcho Integration.
      </footer>
    </div>
  );
}

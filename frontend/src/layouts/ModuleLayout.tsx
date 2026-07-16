import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  UserPlus, 
  Users, 
  CalendarDays, 
  FileText, 
  DollarSign, 
  Sparkles,
  ArrowLeft,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { navigationConfig } from '../navigation/modules';

const iconMap: Record<string, React.ComponentType<any>> = {
  recruitment: UserPlus,
  employees: Users,
  leaves: FileText,
  attendance: CalendarDays,
  payroll: DollarSign
};

export default function ModuleLayout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  // Identify active module based on current path
  const currentPath = location.pathname;
  
  // Find matching module config
  const activeModule = navigationConfig.modules.find(mod => 
    currentPath.startsWith(mod.route)
  );

  if (!activeModule) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-8">
        <h2 className="text-2xl font-bold text-red-400">Module Not Found</h2>
        <p className="text-slate-400 mt-2">The requested module path is invalid.</p>
        <Link to="/" className="mt-4 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  const ModuleIcon = iconMap[activeModule.id] || Sparkles;

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900/60 backdrop-blur-md border-r border-slate-800/80">
      {/* Module Title */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
          <ModuleIcon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-bold text-sm text-slate-200 tracking-tight leading-tight">
            {activeModule.name}
          </h2>
          <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
            Active Module
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {activeModule.navigation.map((item) => {
          const isActive = currentPath === item.route;
          return (
            <Link
              key={item.route}
              to={item.route}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/15' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <span>{item.title}</span>
              {isActive && <ChevronRight className="h-4 w-4 text-white/70" />}
            </Link>
          );
        })}
      </nav>

      {/* Back to Dashboard Link at bottom */}
      <div className="p-4 border-t border-slate-800/60">
        <Link
          to="/"
          className="flex items-center gap-2 justify-center w-full px-4 py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-950/40 text-slate-400 hover:text-slate-200 text-xs font-semibold tracking-wider uppercase transition-all duration-200"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Dashboard
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-200">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline text-sm font-medium">Dashboard</span>
            </Link>
            <div className="h-4 w-[1px] bg-slate-800 hidden sm:block"></div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-white">
                HRMS
              </span>
              <span className="text-slate-600 text-sm">/</span>
              <span className="text-slate-300 text-sm font-medium">{activeModule.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 hidden md:inline">SparkEcho Integrated</span>
            
            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900/60 text-slate-400 hover:text-white"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto relative">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-16 h-[calc(100vh-64px)]">
            {sidebarContent}
          </div>
        </aside>

        {/* Mobile Sidebar drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            {/* Overlay */}
            <div 
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            {/* Sidebar Container */}
            <div className="fixed top-0 bottom-0 left-0 w-64 bg-slate-950 z-50">
              {sidebarContent}
            </div>
          </div>
        )}

        {/* Dynamic Nested Page Content */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto min-w-0">
          <div className="animate-fadeIn">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

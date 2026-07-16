import React, { useState } from 'react';
import { Plus, Trash2, Search, Briefcase } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  department: string;
  type: string;
  status: string;
  postedDate: string;
}

export default function JobOpenings() {
  const [jobs, setJobs] = useState<Job[]>([
    { id: "JOB001", title: "Senior React Developer", department: "Engineering", type: "Full-Time", status: "Open", postedDate: "2026-07-01" },
    { id: "JOB002", title: "DevOps Engineer", department: "Engineering", type: "Full-Time", status: "Open", postedDate: "2026-07-05" },
    { id: "JOB003", title: "HR Generalist", department: "HR", type: "Full-Time", status: "On Hold", postedDate: "2026-07-10" },
    { id: "JOB004", title: "Product Marketing Manager", department: "Marketing", type: "Contract", status: "Closed", postedDate: "2026-06-15" }
  ]);
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', department: 'Engineering', type: 'Full-Time' });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newJob: Job = {
      id: `JOB00${jobs.length + 1}`,
      title: formData.title,
      department: formData.department,
      type: formData.type,
      status: 'Open',
      postedDate: new Date().toISOString().split('T')[0]
    };
    setJobs([...jobs, newJob]);
    setFormData({ title: '', department: 'Engineering', type: 'Full-Time' });
    setShowAddForm(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this job posting?")) {
      setJobs(jobs.filter(j => j.id !== id));
    }
  };

  const filtered = jobs.filter(j => 
    j.title.toLowerCase().includes(search.toLowerCase()) || 
    j.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Job Openings</h1>
          <p className="text-sm text-slate-400">Create and manage active career postings for talent acquisition.</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-505 text-white font-medium px-4 py-2 rounded-lg transition-colors shadow-lg shadow-indigo-600/20"
        >
          <Plus className="h-4 w-4" /> Create Opening
        </button>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-955/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md space-y-4">
            <h2 className="text-lg font-bold text-white">New Job Opening</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Job Title</label>
                <input
                  type="text" required value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Department</label>
                  <select
                    value={formData.department}
                    onChange={e => setFormData({ ...formData, department: e.target.value })}
                    className="w-full bg-slate-955 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="HR">HR</option>
                    <option value="Sales">Sales</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Job Type</label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-slate-955 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-350 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button" onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filter and Search */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by job title or ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-900/40 border border-slate-800/80 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead>
              <tr className="border-b border-slate-850 text-slate-400 text-xs font-semibold uppercase tracking-wider bg-slate-900/20">
                <th className="p-4">Job ID</th>
                <th className="p-4">Title</th>
                <th className="p-4">Department</th>
                <th className="p-4">Type</th>
                <th className="p-4">Posted Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filtered.map(job => (
                <tr key={job.id} className="hover:bg-slate-900/20 transition-colors">
                  <td className="p-4 font-mono text-slate-400 text-xs">{job.id}</td>
                  <td className="p-4 font-semibold text-white">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-indigo-400" />
                      {job.title}
                    </div>
                  </td>
                  <td className="p-4 text-slate-400">{job.department}</td>
                  <td className="p-4 text-slate-400">{job.type}</td>
                  <td className="p-4">{job.postedDate}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      job.status === 'Open' ? 'bg-emerald-500/10 text-emerald-400' :
                      job.status === 'On Hold' ? 'bg-amber-500/10 text-amber-400' :
                      'bg-rose-500/10 text-rose-400'
                    }`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDelete(job.id)}
                      className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

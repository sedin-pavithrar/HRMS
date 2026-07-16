import React, { useState } from 'react';
import { Search, UserCheck, Eye, Trash2 } from 'lucide-react';

interface Candidate {
  id: string;
  name: string;
  email: string;
  appliedRole: string;
  experience: string;
  status: string;
}

export default function Candidates() {
  const [candidates, setCandidates] = useState<Candidate[]>([
    { id: "CAN001", name: "Sarah Connor", email: "sarah.c@sky.net", appliedRole: "Senior React Developer", experience: "5 Years", status: "Screened" },
    { id: "CAN002", name: "John Connor", email: "john.c@res.org", appliedRole: "DevOps Engineer", experience: "3 Years", status: "Interviewing" },
    { id: "CAN003", name: "Kyle Reese", email: "kyle.reese@past.com", appliedRole: "HR Generalist", experience: "4 Years", status: "Offered" },
    { id: "CAN004", name: "Ellen Ripley", email: "ripley@weyland.com", appliedRole: "Senior React Developer", experience: "8 Years", status: "Rejected" }
  ]);
  const [search, setSearch] = useState('');

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this candidate profile?")) {
      setCandidates(candidates.filter(c => c.id !== id));
    }
  };

  const filtered = candidates.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.appliedRole.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Candidates Directory</h1>
        <p className="text-sm text-slate-400">Track applicants, their qualifications, and recruitment pipeline status.</p>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by candidate name or applied role..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-900/40 border border-slate-800/80 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-slate-300">
          <thead>
            <tr className="border-b border-slate-850 text-slate-400 text-xs font-semibold uppercase tracking-wider bg-slate-900/20">
              <th className="p-4">Candidate ID</th>
              <th className="p-4">Name</th>
              <th className="p-4">Applied Role</th>
              <th className="p-4">Experience</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-850">
            {filtered.map(cand => (
              <tr key={cand.id} className="hover:bg-slate-900/20 transition-colors">
                <td className="p-4 font-mono text-slate-400 text-xs">{cand.id}</td>
                <td className="p-4">
                  <span className="font-semibold text-white block">{cand.name}</span>
                  <span className="text-[10px] text-slate-500">{cand.email}</span>
                </td>
                <td className="p-4 text-slate-400">{cand.appliedRole}</td>
                <td className="p-4 text-slate-400">{cand.experience}</td>
                <td className="p-4">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                    cand.status === 'Offered' ? 'bg-emerald-500/10 text-emerald-400' :
                    cand.status === 'Interviewing' ? 'bg-indigo-500/10 text-indigo-400' :
                    cand.status === 'Screened' ? 'bg-blue-500/10 text-blue-400' :
                    'bg-rose-500/10 text-rose-400'
                  }`}>
                    {cand.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleDelete(cand.id)}
                    className="text-slate-550 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors"
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
  );
}

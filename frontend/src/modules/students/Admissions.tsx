import React, { useState } from 'react';
import { Send, FileCheck } from 'lucide-react';

export default function Admissions() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    course: 'Computer Science',
    qualification: 'High School',
    address: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dob: '',
        course: 'Computer Science',
        qualification: 'High School',
        address: ''
      });
    }, 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Student Admissions</h1>
        <p className="text-sm text-slate-400">Process new enrollment requests and register academic profiles.</p>
      </div>

      <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-6">
        {submitted && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg flex items-center gap-3">
            <FileCheck className="h-5 w-5" />
            <span>Admission application recorded successfully! Document review pending.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">First Name</label>
              <input
                type="text" required value={formData.firstName}
                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Last Name</label>
              <input
                type="text" required value={formData.lastName}
                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Email Address</label>
              <input
                type="email" required value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Phone Number</label>
              <input
                type="tel" required value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Date of Birth</label>
              <input
                type="date" required value={formData.dob}
                onChange={e => setFormData({ ...formData, dob: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Intended Course</label>
              <select
                value={formData.course}
                onChange={e => setFormData({ ...formData, course: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Business Administration">Business Administration</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">Permanent Address</label>
            <textarea
              required rows={3} value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-2.5 rounded-lg transition-colors shadow-lg shadow-indigo-600/20"
          >
            <Send className="h-4 w-4" /> Submit Application
          </button>
        </form>
      </div>
    </div>
  );
}

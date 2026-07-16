import React, { useState } from 'react';
import { Search, Plus, Trash2, GraduationCap } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
  course: string;
  admissionDate: string;
  status: string;
}

export default function StudentList() {
  const [students, setStudents] = useState<Student[]>([
    { id: "STU001", name: "Alice Johnson", email: "alice.j@school.edu", course: "Computer Science", admissionDate: "2025-09-01", status: "Active" },
    { id: "STU002", name: "Bob Smith", email: "bob.smith@school.edu", course: "Electrical Engineering", admissionDate: "2025-09-01", status: "Active" },
    { id: "STU003", name: "Charlie Brown", email: "charlie.b@school.edu", course: "Mechanical Engineering", admissionDate: "2026-02-15", status: "Active" },
    { id: "STU004", name: "Diana Prince", email: "diana.p@school.edu", course: "Business Administration", admissionDate: "2024-09-01", status: "Graduated" },
    { id: "STU005", name: "Evan Wright", email: "evan.w@school.edu", course: "Information Technology", admissionDate: "2026-02-15", status: "Suspended" }
  ]);
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', course: 'Computer Science' });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newStudent: Student = {
      id: `STU00${students.length + 1}`,
      name: formData.name,
      email: formData.email,
      course: formData.course,
      admissionDate: new Date().toISOString().split('T')[0],
      status: 'Active'
    };
    setStudents([...students, newStudent]);
    setFormData({ name: '', email: '', course: 'Computer Science' });
    setShowAddForm(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this student?")) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  const filtered = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Student Directory</h1>
          <p className="text-sm text-slate-400">View and manage enrolled student profiles and enrollment status.</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2 rounded-lg transition-colors shadow-lg shadow-indigo-600/20"
        >
          <Plus className="h-4 w-4" /> Enroll Student
        </button>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md space-y-4">
            <h2 className="text-lg font-bold text-white">Quick Student Admission</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Name</label>
                <input
                  type="text" required value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Email</label>
                <input
                  type="email" required value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Course Path</label>
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
                  Enroll
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
            placeholder="Search by student name or ID..."
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
                <th className="p-4">Student ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Course</th>
                <th className="p-4">Admission Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filtered.map(student => (
                <tr key={student.id} className="hover:bg-slate-900/20 transition-colors">
                  <td className="p-4 font-mono text-slate-400 text-xs">{student.id}</td>
                  <td className="p-4 font-semibold text-white">{student.name}</td>
                  <td className="p-4">{student.email}</td>
                  <td className="p-4 text-slate-400">{student.course}</td>
                  <td className="p-4">{student.admissionDate}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      student.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' :
                      student.status === 'Graduated' ? 'bg-blue-500/10 text-blue-400' :
                      'bg-rose-500/10 text-rose-400'
                    }`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDelete(student.id)}
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

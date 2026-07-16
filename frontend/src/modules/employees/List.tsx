import { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Eye, X, ArrowUpDown } from 'lucide-react';
import { Employee } from '../../types';

export default function EmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('employee_id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Modals state
  const [viewEmployee, setViewEmployee] = useState<Employee | null>(null);
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    employee_id: '',
    name: '',
    email: '',
    department: 'Engineering',
    designation: '',
    joining_date: new Date().toISOString().split('T')[0],
    status: 'Active'
  });

  const [formError, setFormError] = useState('');

  const departmentsList = ["Engineering", "HR", "Sales", "Marketing"];

  const fetchEmployees = async () => {
    try {
      let url = `/hrms/api/employees?page=${page}&size=8&sort_by=${sortBy}&sort_order=${sortOrder}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (deptFilter) url += `&department=${encodeURIComponent(deptFilter)}`;
      if (statusFilter) url += `&status=${encodeURIComponent(statusFilter)}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setEmployees(data.items);
        setTotal(data.total);
      }
    } catch (err) {
      console.error("Error fetching employees", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [page, search, deptFilter, statusFilter, sortBy, sortOrder]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setPage(1);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    try {
      const res = await fetch('/hrms/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setAddModalOpen(false);
        setFormData({
          employee_id: '',
          name: '',
          email: '',
          department: 'Engineering',
          designation: '',
          joining_date: new Date().toISOString().split('T')[0],
          status: 'Active'
        });
        fetchEmployees();
      } else {
        const errData = await res.json();
        setFormError(errData.detail || 'Failed to create employee');
      }
    } catch (err) {
      setFormError('Failed to create employee due to connection issue.');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editEmployee) return;
    setFormError('');
    try {
      const res = await fetch(`/hrms/api/employees/${editEmployee.employee_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editEmployee)
      });
      if (res.ok) {
        setEditEmployee(null);
        fetchEmployees();
      } else {
        const errData = await res.json();
        setFormError(errData.detail || 'Failed to update employee');
      }
    } catch (err) {
      setFormError('Failed to update employee due to connection issue.');
    }
  };

  const handleDelete = async (empId: string) => {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    try {
      const res = await fetch(`/hrms/api/employees/${empId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchEmployees();
      }
    } catch (err) {
      console.error("Error deleting employee", err);
    }
  };

  const totalPages = Math.ceil(total / 8);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title Area */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Employee Directory</h1>
          <p className="text-sm text-slate-400">Manage organizational members, departments, designations, and account status.</p>
        </div>
        <button
          onClick={() => setAddModalOpen(true)}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2 rounded-lg transition-colors shadow-lg shadow-indigo-600/20"
        >
          <Plus className="h-4 w-4" />
          Add Employee
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/40 border border-slate-800/80 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search name, email, ID..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-4 w-full md:w-auto items-center justify-end">
          <select
            value={deptFilter}
            onChange={(e) => { setDeptFilter(e.target.value); setPage(1); }}
            className="bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Departments</option>
            {departmentsList.map(d => <option key={d} value={d}>{d}</option>)}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Employee List Table */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/20 border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <th onClick={() => handleSort('employee_id')} className="p-4 cursor-pointer hover:text-white transition-colors">
                  <div className="flex items-center gap-1">Employee ID <ArrowUpDown className="h-3 w-3" /></div>
                </th>
                <th onClick={() => handleSort('name')} className="p-4 cursor-pointer hover:text-white transition-colors">
                  <div className="flex items-center gap-1">Name <ArrowUpDown className="h-3 w-3" /></div>
                </th>
                <th className="p-4">Email</th>
                <th className="p-4">Department</th>
                <th className="p-4">Designation</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850 text-sm text-slate-300">
              {employees.map(emp => (
                <tr key={emp.id} className="hover:bg-slate-900/20 transition-colors">
                  <td className="p-4 font-mono text-indigo-400">{emp.employee_id}</td>
                  <td className="p-4 font-semibold text-white">{emp.name}</td>
                  <td className="p-4 text-slate-400">{emp.email}</td>
                  <td className="p-4">{emp.department}</td>
                  <td className="p-4">{emp.designation}</td>
                  <td className="p-4">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                      emp.status === 'Active' 
                        ? 'bg-emerald-500/10 text-emerald-400' 
                        : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button 
                      onClick={() => setViewEmployee(emp)} 
                      className="p-1.5 hover:text-indigo-400 hover:bg-slate-800/40 rounded transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => setEditEmployee(emp)} 
                      className="p-1.5 hover:text-indigo-450 hover:bg-slate-800/40 rounded transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(emp.employee_id)} 
                      className="p-1.5 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No employees found matching the filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 bg-slate-900/20 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Showing page {page} of {totalPages} ({total} employees)
            </span>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                className="px-3 py-1 bg-slate-950 border border-slate-800 rounded text-xs text-slate-300 hover:border-indigo-500 disabled:opacity-40 transition-colors"
              >
                Previous
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                className="px-3 py-1 bg-slate-950 border border-slate-800 rounded text-xs text-slate-300 hover:border-indigo-500 disabled:opacity-40 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Employee Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Add New Employee</h3>
              <button onClick={() => setAddModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              {formError && <p className="text-sm text-rose-400 bg-rose-500/10 p-2 rounded">{formError}</p>}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Employee ID</label>
                  <input
                    type="text"
                    required
                    placeholder="EMP031"
                    value={formData.employee_id}
                    onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Alex Mercer"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="alex@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500"
                  >
                    {departmentsList.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Designation</label>
                  <input
                    type="text"
                    required
                    placeholder="UX Architect"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Joining Date</label>
                  <input
                    type="date"
                    required
                    value={formData.joining_date}
                    onChange={(e) => setFormData({ ...formData, joining_date: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-800 rounded-lg text-sm text-slate-350 hover:bg-slate-800/40 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-550 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {editEmployee && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Edit Employee ({editEmployee.employee_id})</h3>
              <button onClick={() => setEditEmployee(null)} className="text-slate-400 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              {formError && <p className="text-sm text-rose-400 bg-rose-500/10 p-2 rounded">{formError}</p>}
              
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Full Name</label>
                <input
                  type="text"
                  required
                  value={editEmployee.name}
                  onChange={(e) => setEditEmployee({ ...editEmployee, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Email Address</label>
                <input
                  type="email"
                  required
                  value={editEmployee.email}
                  onChange={(e) => setEditEmployee({ ...editEmployee, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Department</label>
                  <select
                    value={editEmployee.department}
                    onChange={(e) => setEditEmployee({ ...editEmployee, department: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500"
                  >
                    {departmentsList.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Designation</label>
                  <input
                    type="text"
                    required
                    value={editEmployee.designation}
                    onChange={(e) => setEditEmployee({ ...editEmployee, designation: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Joining Date</label>
                  <input
                    type="date"
                    required
                    value={editEmployee.joining_date}
                    onChange={(e) => setEditEmployee({ ...editEmployee, joining_date: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Status</label>
                  <select
                    value={editEmployee.status}
                    onChange={(e) => setEditEmployee({ ...editEmployee, status: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditEmployee(null)}
                  className="px-4 py-2 border border-slate-800 rounded-lg text-sm text-slate-350 hover:bg-slate-800/40 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-550 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {viewEmployee && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-xl overflow-hidden shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Employee Profile</h3>
              <button onClick={() => setViewEmployee(null)} className="text-slate-400 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="text-center pb-4 border-b border-slate-800/60">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-indigo-650/20 text-indigo-400 text-2xl font-bold mb-2">
                  {viewEmployee.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h4 className="text-xl font-bold text-white">{viewEmployee.name}</h4>
                <p className="text-sm text-slate-400">{viewEmployee.designation}</p>
              </div>

              <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase">Employee ID</p>
                  <p className="font-mono text-indigo-400 font-medium">{viewEmployee.employee_id}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase">Status</p>
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold mt-1 ${
                    viewEmployee.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                  }`}>
                    {viewEmployee.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase">Department</p>
                  <p className="text-slate-200">{viewEmployee.department}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase">Joining Date</p>
                  <p className="text-slate-200">{viewEmployee.joining_date}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-slate-500 font-semibold uppercase">Email Address</p>
                  <p className="text-slate-200">{viewEmployee.email}</p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setViewEmployee(null)}
                className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-350 hover:text-white transition-colors"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

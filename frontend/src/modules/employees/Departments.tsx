import React, { useState, useEffect } from 'react';
import { Network, Users } from 'lucide-react';
import { Employee } from '../../types';

export default function Departments() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const res = await fetch('/hrms/api/employees?size=100');
        if (res.ok) {
          const data = await res.json();
          setEmployees(data.items || []);
        }
      } catch (err) {
        console.error("Error fetching employees", err);
      } finally {
        setLoading(false);
      }
    }
    fetchEmployees();
  }, []);

  const departmentData = [
    { name: "Engineering", desc: "Core software development, systems engineering, design, and QA teams.", lead: "Clara Oswald" },
    { name: "HR", desc: "Talent acquisition, operations, benefits, and employee relations.", lead: "Martha Jones" },
    { name: "Sales", desc: "Client acquisition, account management, and business partnerships.", lead: "Donna Noble" },
    { name: "Marketing", desc: "Brand management, communications, and digital product outreach.", lead: "Rose Tyler" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Departments</h1>
        <p className="text-sm text-slate-400">View corporate departments, leads, and staff member counts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {departmentData.map((dept) => {
          const count = employees.filter(e => e.department === dept.name).length;
          return (
            <div key={dept.name} className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-6 space-y-4 hover:border-slate-700/80 transition-all flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-white text-lg">{dept.name} Department</h3>
                  <Network className="h-5 w-5 text-indigo-400" />
                </div>
                <p className="text-sm text-slate-450">{dept.desc}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800/60 text-xs">
                <div>
                  <span className="text-slate-500 block">Department Lead</span>
                  <span className="text-slate-350 font-semibold">{dept.lead}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-slate-500 block">Staff Members</span>
                    <span className="text-slate-200 font-bold text-sm">{count}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

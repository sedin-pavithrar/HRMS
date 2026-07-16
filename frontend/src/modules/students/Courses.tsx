import React from 'react';
import { BookOpen, Award, Users } from 'lucide-react';

export default function Courses() {
  const coursesList = [
    { code: "CS-101", title: "Introduction to Computer Science", dept: "Computer Science", duration: "4 Years", capacity: 60, enrolled: 54 },
    { code: "EE-204", title: "Circuits & Signal Processing", dept: "Electrical Engineering", duration: "4 Years", capacity: 45, enrolled: 41 },
    { code: "ME-301", title: "Thermodynamics & Heat Transfer", dept: "Mechanical Engineering", duration: "4 Years", capacity: 40, enrolled: 32 },
    { code: "BA-110", title: "Principles of Management", dept: "Business Administration", duration: "3 Years", capacity: 80, enrolled: 76 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Course Catalog</h1>
        <p className="text-sm text-slate-400">View and manage curricular courses, duration configurations, and headcount capacities.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {coursesList.map((course) => (
          <div key={course.code} className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-6 space-y-4 hover:border-slate-700/80 transition-all">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="font-mono text-xs text-indigo-400 font-semibold bg-indigo-500/10 px-2 py-0.5 rounded">
                  {course.code}
                </span>
                <h3 className="font-bold text-white text-lg mt-1">{course.title}</h3>
              </div>
              <BookOpen className="h-5 w-5 text-slate-500" />
            </div>

            <div className="grid grid-cols-3 gap-4 pt-2 text-xs">
              <div>
                <span className="text-slate-500 block">Department</span>
                <span className="text-slate-300 font-semibold">{course.dept}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Duration</span>
                <span className="text-slate-300 font-semibold">{course.duration}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Enrolled</span>
                <span className="text-slate-300 font-semibold">{course.enrolled} / {course.capacity}</span>
              </div>
            </div>

            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-500 h-full rounded-full" 
                style={{ width: `${(course.enrolled / course.capacity) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

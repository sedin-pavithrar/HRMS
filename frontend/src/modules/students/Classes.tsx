import React from 'react';
import { Calendar, Clock, MapPin, User } from 'lucide-react';

export default function Classes() {
  const schedule = [
    { day: "Monday", classes: [
      { id: "CL-01", name: "Data Structures & Algorithms", time: "09:00 AM - 11:00 AM", room: "Lab A", instructor: "Dr. Clara Oswald" },
      { id: "CL-02", name: "Linear Circuits", time: "11:30 AM - 01:30 PM", room: "Room 302", instructor: "Prof. John Smith" }
    ]},
    { day: "Tuesday", classes: [
      { id: "CL-03", name: "Fluid Dynamics", time: "10:00 AM - 12:00 PM", room: "Room 105", instructor: "Dr. Arthur Dent" },
      { id: "CL-04", name: "Strategic Management", time: "02:00 PM - 04:00 PM", room: "Auditorium", instructor: "Prof. Sarah Connor" }
    ]},
    { day: "Wednesday", classes: [
      { id: "CL-01", name: "Data Structures & Algorithms", time: "09:00 AM - 11:00 AM", room: "Lab A", instructor: "Dr. Clara Oswald" }
    ]}
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Class Schedule</h1>
        <p className="text-sm text-slate-400">View schedules, classroom assignments, and assigned instructors.</p>
      </div>

      <div className="space-y-6">
        {schedule.map((dayGroup) => (
          <div key={dayGroup.day} className="space-y-3">
            <h3 className="text-md font-bold text-indigo-400 border-b border-slate-800 pb-1">{dayGroup.day}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dayGroup.classes.map((cls) => (
                <div key={cls.id} className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <span className="text-xs text-slate-500 font-mono">{cls.id}</span>
                    <h4 className="font-bold text-white text-sm">{cls.name}</h4>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-slate-500" /> {cls.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-500" /> {cls.room}
                    </span>
                    <span className="flex items-center gap-1 col-span-2">
                      <User className="h-3.5 w-3.5 text-slate-500" /> {cls.instructor}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

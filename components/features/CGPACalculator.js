'use client';

import { useState, useEffect } from 'react';

export default function CGPACalculator() {
  const [semesters, setSemesters] = useState([
    { id: 1, subjects: [{ id: 1, name: '', credits: '', grade: '' }] }
  ]);
  const [cgpa, setCGPA] = useState(0);

  const gradePoints = {
    'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'C+': 5.5, 'C': 5, 'D+': 4.5, 'D': 4, 'P': 4, 'F': 0
  };

  const addSemester = () => {
    setSemesters([...semesters, { id: Date.now(), subjects: [{ id: Date.now() + 1, name: '', credits: '', grade: '' }] }]);
  };

  const removeSemester = (semId) => {
    setSemesters(semesters.filter(s => s.id !== semId));
  };

  const addSubject = (semId) => {
    setSemesters(semesters.map(sem => {
      if (sem.id === semId) {
        return { ...sem, subjects: [...sem.subjects, { id: Date.now(), name: '', credits: '', grade: '' }] };
      }
      return sem;
    }));
  };

  const updateSubject = (semId, subId, field, value) => {
    setSemesters(semesters.map(sem => {
      if (sem.id === semId) {
        return {
          ...sem,
          subjects: sem.subjects.map(sub => sub.id === subId ? { ...sub, [field]: value } : sub)
        };
      }
      return sem;
    }));
  };

  const removeSubject = (semId, subId) => {
    setSemesters(semesters.map(sem => {
      if (sem.id === semId) {
        return { ...sem, subjects: sem.subjects.filter(sub => sub.id !== subId) };
      }
      return sem;
    }));
  };

  useEffect(() => {
    let totalPoints = 0;
    let totalCredits = 0;

    semesters.forEach(sem => {
      sem.subjects.forEach(sub => {
        const credits = parseFloat(sub.credits);
        const points = gradePoints[sub.grade];
        if (!isNaN(credits) && points !== undefined) {
          totalPoints += (credits * points);
          totalCredits += credits;
        }
      });
    });

    setCGPA(totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0);
  }, [semesters]);

  const calculateSGPA = (subjects) => {
    let totalPoints = 0;
    let totalCredits = 0;
    subjects.forEach(sub => {
      const credits = parseFloat(sub.credits);
      const points = gradePoints[sub.grade];
      if (!isNaN(credits) && points !== undefined) {
        totalPoints += (credits * points);
        totalCredits += credits;
      }
    });
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12" id="cgpa-calculator">
      <div className="text-center mb-12">
        <h2 className="font-heading font-bold text-3xl md:text-5xl text-primary-900 mb-4">
          Smart <span className="text-accent-600">CGPA Calculator</span>
        </h2>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Calculate your Semester SGPA and overall CGPA with ease. Add your subjects, credits, and grades to get instant results.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Input Area */}
        <div className="lg:col-span-2 space-y-6">
          {semesters.map((sem, index) => (
            <div key={sem.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-heading font-bold text-xl text-primary-900 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-accent-100 text-accent-600 flex items-center justify-center text-sm">
                    {index + 1}
                  </span>
                  Semester {index + 1}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-accent-600 bg-accent-50 px-3 py-1 rounded-full uppercase tracking-wider">
                    SGPA: {calculateSGPA(sem.subjects)}
                  </span>
                  {semesters.length > 1 && (
                    <button onClick={() => removeSemester(sem.id)} className="text-red-400 hover:text-red-600 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-12 gap-4 px-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest hidden md:grid">
                  <div className="col-span-6">Subject Name</div>
                  <div className="col-span-3 text-center">Credits</div>
                  <div className="col-span-2 text-center">Grade</div>
                  <div className="col-span-1"></div>
                </div>

                {sem.subjects.map((sub) => (
                  <div key={sub.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center group">
                    <div className="col-span-6">
                      <input
                        type="text"
                        placeholder="e.g. Mathematics"
                        value={sub.name}
                        onChange={(e) => updateSubject(sem.id, sub.id, 'name', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-accent-500 focus:ring-4 focus:ring-accent-500/10 outline-none transition-all text-sm"
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="number"
                        placeholder="Credits"
                        value={sub.credits}
                        onChange={(e) => updateSubject(sem.id, sub.id, 'credits', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-accent-500 focus:ring-4 focus:ring-accent-500/10 outline-none transition-all text-sm text-center"
                      />
                    </div>
                    <div className="col-span-2">
                      <select
                        value={sub.grade}
                        onChange={(e) => updateSubject(sem.id, sub.id, 'grade', e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-accent-500 focus:ring-4 focus:ring-accent-500/10 outline-none transition-all text-sm appearance-none cursor-pointer text-center font-bold text-primary-900"
                      >
                        <option value="">Grade</option>
                        {Object.keys(gradePoints).map(g => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <button 
                        onClick={() => removeSubject(sem.id, sub.id)}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => addSubject(sem.id)}
                className="mt-6 w-full py-3 border-2 border-dashed border-gray-100 rounded-2xl text-gray-400 text-sm font-medium hover:border-accent-200 hover:text-accent-500 hover:bg-accent-50/30 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Subject
              </button>
            </div>
          ))}

          <button 
            onClick={addSemester}
            className="w-full py-4 bg-primary-900 text-white rounded-3xl font-bold shadow-lg hover:shadow-2xl hover:bg-black transform hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Add New Semester
          </button>
        </div>

        {/* Right: Summary Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-gray-100 sticky top-24 overflow-hidden relative group">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-accent-500/20 transition-all duration-700" />
            
            <h3 className="font-heading font-bold text-xl text-primary-900 mb-8 relative">Result Summary</h3>
            
            <div className="text-center mb-10 relative">
              <div className="inline-block relative">
                <div className="w-40 h-40 rounded-full border-[10px] border-accent-50 flex items-center justify-center">
                  <div className="text-center">
                    <span className="block text-4xl font-heading font-black text-primary-900 leading-none">{cgpa}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Total CGPA</span>
                  </div>
                </div>
                {/* Decorative dots */}
                <div className="absolute top-0 right-0 w-4 h-4 bg-accent-500 rounded-full border-4 border-white shadow-lg animate-bounce" />
              </div>
            </div>

            <div className="space-y-4 relative">
              <div className="flex justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <span className="text-sm font-medium text-gray-500">Semesters</span>
                <span className="text-sm font-bold text-primary-900">{semesters.length}</span>
              </div>
              <div className="flex justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <span className="text-sm font-medium text-gray-500">Total Credits</span>
                <span className="text-sm font-bold text-primary-900">
                  {semesters.reduce((acc, sem) => acc + sem.subjects.reduce((sAcc, sub) => sAcc + (parseFloat(sub.credits) || 0), 0), 0)}
                </span>
              </div>
              <div className="flex justify-between p-4 rounded-2xl bg-accent-500 text-white shadow-xl shadow-accent-500/20">
                <span className="text-sm font-bold">Percentage %</span>
                <span className="text-sm font-black">{(cgpa * 9.5).toFixed(1)}%</span>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-100 text-center">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-loose">
                Formula: CGPA × 9.5 = Percentage
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';

export default function AttendanceCalculator() {
  const [totalClasses, setTotalClasses] = useState('');
  const [attendedClasses, setAttendedClasses] = useState('');
  const [requiredPercent, setRequiredPercent] = useState(75);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const total = parseInt(totalClasses);
    const attended = parseInt(attendedClasses);
    const target = parseFloat(requiredPercent);

    if (!isNaN(total) && !isNaN(attended) && total > 0 && attended >= 0) {
      const currentPercent = (attended / total) * 100;
      let message = '';
      let classesNeeded = 0;
      let classesCanSkip = 0;
      let status = '';

      if (currentPercent < target) {
        status = 'shortage';
        // (attended + x) / (total + x) = target / 100
        // 100attended + 100x = target*total + target*x
        // x(100 - target) = target*total - 100attended
        classesNeeded = Math.ceil((target * total - 100 * attended) / (100 - target));
        message = `You need to attend ${classesNeeded} more classes to reach ${target}% attendance.`;
      } else {
        status = 'safe';
        // attended / (total + x) = target / 100
        // 100attended = target*total + target*x
        // target*x = 100attended - target*total
        classesCanSkip = Math.floor((100 * attended - target * total) / target);
        message = classesCanSkip > 0 
          ? `You are safe! You can skip ${classesCanSkip} more classes and still maintain ${target}% attendance.`
          : `You are exactly on track! Don't skip any more classes.`;
      }

      setResult({
        percent: currentPercent.toFixed(2),
        status,
        message,
        classesNeeded,
        classesCanSkip
      });
    } else {
      setResult(null);
    }
  }, [totalClasses, attendedClasses, requiredPercent]);

  return (
    <section className="section-padding bg-white relative overflow-hidden" id="attendance-calculator">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-50 text-primary-600 text-xs font-bold mb-4 tracking-widest uppercase">
            STUDENT TOOLS
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-primary-900 mb-4">
            Attendance <span className="text-accent-600">Calculator</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Track your lectures and stay on the safe side. Our smart algorithm tells you exactly how many classes you can skip or need to attend.
          </p>
        </div>

        <div className="bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Input Side */}
            <div className="p-8 md:p-12 border-b md:border-b-0 md:border-r border-gray-100">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-primary-900 mb-2 ml-1">Total Classes Held</label>
                  <input
                    type="number"
                    placeholder="e.g. 50"
                    value={totalClasses}
                    onChange={(e) => setTotalClasses(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-accent-500 focus:ring-4 focus:ring-accent-500/10 outline-none transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary-900 mb-2 ml-1">Classes Attended</label>
                  <input
                    type="number"
                    placeholder="e.g. 35"
                    value={attendedClasses}
                    onChange={(e) => setAttendedClasses(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-accent-500 focus:ring-4 focus:ring-accent-500/10 outline-none transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary-900 mb-2 ml-1">Required Attendance (%)</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[65, 75, 80, 85].map((p) => (
                      <button
                        key={p}
                        onClick={() => setRequiredPercent(p)}
                        className={`py-3 rounded-xl text-sm font-bold transition-all ${
                          requiredPercent === p
                            ? 'bg-accent-500 text-white shadow-lg'
                            : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                        }`}
                      >
                        {p}%
                      </button>
                    ))}
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={requiredPercent}
                    onChange={(e) => setRequiredPercent(e.target.value)}
                    className="w-full mt-4 accent-accent-500"
                  />
                </div>
              </div>
            </div>

            {/* Result Side */}
            <div className="p-8 md:p-12 bg-gray-50/50 flex flex-col justify-center text-center">
              {result ? (
                <div className="animate-fade-in space-y-6">
                  <div className="relative inline-block mb-4">
                    <div className="w-32 h-32 rounded-full border-8 border-white shadow-xl flex items-center justify-center bg-white relative z-10">
                      <span className={`text-3xl font-black ${result.status === 'safe' ? 'text-green-500' : 'text-red-500'}`}>
                        {result.percent}%
                      </span>
                    </div>
                    {/* Pulsing ring */}
                    <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${result.status === 'safe' ? 'bg-green-500' : 'bg-red-500'}`} />
                  </div>

                  <div>
                    <h4 className={`text-xl font-black uppercase tracking-tighter mb-2 ${result.status === 'safe' ? 'text-green-600' : 'text-red-600'}`}>
                      {result.status === 'safe' ? 'You are Safe!' : 'Low Attendance!'}
                    </h4>
                    <p className="text-gray-600 font-medium px-4">
                      {result.message}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${
                      result.status === 'safe' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      <span className="w-2 h-2 rounded-full animate-pulse bg-current" />
                      Current Status: {result.status}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-gray-300">
                  <svg className="w-20 h-20 mx-auto mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <p className="font-medium">Enter your details to calculate status</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

export default function PoweredBy() {
  return (
    <section className="py-12 bg-white border-t border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <span className="inline-block px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wider mb-6">
          Support & Recognition
        </span>
        <h2 className="font-heading font-black text-2xl md:text-3xl text-primary-900 mb-2">
          Powered By
        </h2>
        <p className="text-slate-500 text-sm md:text-base max-w-xl mx-auto mb-8">
          UniEntry is proud to be incubated and supported by these prestigious institutions, empowering us to build a better student ecosystem.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 md:gap-16">
          {/* Runway Incubator Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-lg shadow-slate-100/50 flex flex-col items-center justify-center w-full max-w-[280px] hover:scale-105 transition-all duration-300">
            <img 
              src="/runway-logo.png" 
              alt="Runway Incubator" 
              className="h-16 w-auto object-contain mb-3"
            />
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Start-up Incubator</span>
          </div>

          {/* UPES Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-lg shadow-slate-100/50 flex flex-col items-center justify-center w-full max-w-[280px] hover:scale-105 transition-all duration-300">
            <img 
              src="/upes-logo.png" 
              alt="UPES University" 
              className="h-16 w-auto object-contain mb-3"
            />
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">University Partner</span>
          </div>
        </div>
      </div>
    </section>
  );
}

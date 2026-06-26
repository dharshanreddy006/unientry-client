'use client';

import { useState } from 'react';
import { API_URL, getImageUrl } from '@/lib/apiConfig';
import { useSettings } from '@/components/providers/SettingsProvider';

export default function EducationLoan() {
  const settings = useSettings();
  const [universities, setUniversities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingUnis, setLoadingUnis] = useState(false);
  const [resultsVisible, setResultsVisible] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    university: '',
    isPremier: false,
    isAbroad: false,
    course: '',
    loanAmount: '7.5-15', // 'up-to-4', '4-7.5', '7.5-15', 'above-15'
    academicScore: '',
    coBorrowerIncome: '3-6', // 'below-3', '3-6', '6-10', 'above-10'
  });

  const getWaNumber = () => settings?.whatsappNumber || '918121665671';

  // Fetch universities for auto-suggest
  const handleUniSearch = async (q) => {
    setSearchQuery(q);
    setFormData(prev => ({ ...prev, university: q }));
    if (q.trim().length > 1 && universities.length === 0) {
      setLoadingUnis(true);
      try {
        const res = await fetch(`${API_URL}/universities`, { cache: 'no-store', signal: AbortSignal.timeout(5000) });
        const data = await res.json();
        setUniversities(data.data || data);
      } catch {}
      setLoadingUnis(false);
    }
  };

  const filteredUnis = searchQuery.trim() === '' 
    ? [] 
    : (Array.isArray(universities) ? universities : []).filter(uni => 
        uni?.universityName?.toLowerCase().trim().includes(searchQuery.toLowerCase().trim())
      ).slice(0, 5);

  // Determine if a selected university is premier or abroad
  const selectUniversity = (uni) => {
    const name = uni.universityName;
    const isAbroad = uni.country && uni.country.toLowerCase() !== 'india';
    
    // Simple checks for premier institutes
    const lowerName = name.toLowerCase();
    const isPremier = lowerName.includes('iit') || 
                      lowerName.includes('iim') || 
                      lowerName.includes('nit') || 
                      lowerName.includes('bits') || 
                      lowerName.includes('vellore') || 
                      lowerName.includes('vit') || 
                      lowerName.includes('manipal') || 
                      lowerName.includes('srm') ||
                      lowerName.includes('lovely') ||
                      lowerName.includes('thapar');

    setFormData(prev => ({
      ...prev,
      university: name,
      isPremier,
      isAbroad
    }));
    setSearchQuery('');
  };

  // Generate suggested loan schemes
  const getLoanSuggestions = () => {
    const suggestions = [];
    const { loanAmount, isPremier, isAbroad } = formData;

    // 1. Premier Institutions Offer (e.g. SBI Scholar Loan)
    if (isPremier) {
      suggestions.push({
        bank: 'State Bank of India (SBI)',
        scheme: 'SBI Scholar Loan Scheme',
        rate: '8.55% - 8.95%',
        maxAmount: isAbroad ? 'Up to ₹1.5 Cr' : 'Up to ₹40 Lakhs',
        collateral: '100% Collateral-Free (No security needed)',
        processingFee: 'Nil',
        features: ['Special low rates for premier campuses', 'Zero processing charge', 'Fast track approval'],
        logoText: 'SBI'
      });
    }

    // 2. Mainstream Bank offers based on amount
    if (loanAmount === 'up-to-4') {
      suggestions.push({
        bank: 'Union Bank of India',
        scheme: 'Union Education Scheme',
        rate: '8.85% - 9.30%',
        maxAmount: 'Up to ₹4 Lakhs',
        collateral: 'No Collateral required (Parent as Co-borrower)',
        processingFee: 'Nil',
        features: ['No collateral or security needed', 'Co-applicant signature only', 'Concession for girl students'],
        logoText: 'UBI'
      });
      suggestions.push({
        bank: 'Canara Bank',
        scheme: 'Canara Vidya Turan',
        rate: '9.15% - 9.60%',
        maxAmount: 'Up to ₹4 Lakhs',
        collateral: 'No third-party guarantee required',
        processingFee: 'Nil',
        features: ['Simple documentation', 'Easy repayment options', 'Subsidy on interest for eligible candidates'],
        logoText: 'CNB'
      });
    } else if (loanAmount === '4-7.5') {
      suggestions.push({
        bank: 'Bank of Baroda (BoB)',
        scheme: 'Baroda Gyan Scheme',
        rate: '8.85% - 10.20%',
        maxAmount: 'Up to ₹7.5 Lakhs',
        collateral: 'Third-party guarantee or Co-applicant required',
        processingFee: 'Nil (in India)',
        features: ['Free credit card co-branded', 'No prepayment penalty', 'Flexible repayment holidays'],
        logoText: 'BOB'
      });
      suggestions.push({
        bank: 'HDFC Credila',
        scheme: 'HDFC Credila Customized Loan',
        rate: '9.50% - 11.25%',
        maxAmount: 'Up to ₹7.5 Lakhs',
        collateral: 'Flexible collateral options (Non-collateral possible)',
        processingFee: 'Up to 1% of loan amount',
        features: ['Doorstep service', 'Customized repayment schedule', 'Tax benefits under Sec 80E'],
        logoText: 'HDFC'
      });
    } else {
      // 7.5-15 or above-15
      suggestions.push({
        bank: 'ICICI Bank',
        scheme: 'ICICI Bank Education Loan',
        rate: '9.25% - 10.75%',
        maxAmount: isAbroad ? 'Up to ₹2 Cr' : 'Up to ₹1 Cr',
        collateral: 'Collateral preferred (Tangible assets/Fixed Deposit)',
        processingFee: '1% + GST',
        features: ['Pre-visa loan disbursal available', 'No margin money for premier institutes', 'Quick online sanction'],
        logoText: 'ICICI'
      });
      suggestions.push({
        bank: 'Axis Bank',
        scheme: 'Axis Education Loan',
        rate: '9.70% - 12.50%',
        maxAmount: 'Up to ₹40 Lakhs (In India)',
        collateral: 'Co-applicant mandatory, collateral above 7.5L',
        processingFee: '₹15,000 + GST',
        features: ['Up to 100% funding', 'Covers tuition fees, hostel, and travel', 'Long repayment term (up to 15 years)'],
        logoText: 'AXIS'
      });
    }

    // 3. Global Study Loan (if abroad, e.g. Prodigy Finance or Avanse)
    if (isAbroad || loanAmount === 'above-15') {
      suggestions.push({
        bank: 'Avanse Financial Services',
        scheme: 'Avanse Overseas Education Loan',
        rate: '10.50% - 12.75%',
        maxAmount: '100% of cost of education',
        collateral: 'Both collateral & non-collateral options available',
        processingFee: '1% - 2%',
        features: ['Quick 4-day sanction', 'Includes living costs, books, laptop, travel', 'Customized grace periods'],
        logoText: 'AVS'
      });
    }

    return suggestions;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.university) {
      alert('Please fill in your name, contact number, and target university.');
      return;
    }
    setResultsVisible(true);
  };

  const handleApplyWhatsApp = (scheme) => {
    const loanRangeLabel = 
      formData.loanAmount === 'up-to-4' ? 'Up to ₹4 Lakhs' :
      formData.loanAmount === '4-7.5' ? '₹4 Lakhs - ₹7.5 Lakhs' :
      formData.loanAmount === '7.5-15' ? '₹7.5 Lakhs - ₹15 Lakhs' : 'Above ₹15 Lakhs';

    const msg = `Hi UniEntry! I am looking for an *Education Loan* and want to get a free consultation.\n\n*Name:* ${formData.fullName}\n*Phone:* ${formData.phone}\n*Target University:* ${formData.university}\n*Course:* ${formData.course || 'Not specified'}\n*Required Loan Amount:* ${loanRangeLabel}\n*Academic Marks:* ${formData.academicScore || 'Not specified'}\n*Selected Suggested Scheme:* ${scheme.bank} - ${scheme.scheme}\n\nPlease guide me with the application process.`;
    
    window.open(`https://wa.me/${getWaNumber()}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <section className="section-padding bg-slate-50 relative overflow-hidden py-16" id="education-loan">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[130px] -mr-64 -mt-64 pointer-events-none" style={{background: 'rgba(59, 130, 246, 0.07)'}} />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[130px] -ml-64 -mb-64 pointer-events-none" style={{background: 'rgba(99, 102, 241, 0.07)'}} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-black tracking-widest uppercase mb-4">
            🎓 Hassle-Free Funding
          </span>
          <h2 className="font-heading font-black text-3xl md:text-5xl text-primary-900 mb-4 tracking-tighter">
            Smart Education <span className="text-blue-600">Loan Finder</span>
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-sm sm:text-base">
            Compare top bank rates, check your eligibility without any collateral, and apply directly via WhatsApp for a dedicated personal assistant.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Left Side */}
          <div className="lg:col-span-5 bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-xl shadow-slate-100/50 border border-slate-100">
            <h3 className="font-heading font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-blue-50 text-blue-600 font-bold text-sm">1</span>
              Enter Details
            </h3>
            
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Kumar"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-500 outline-none text-sm font-medium transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">WhatsApp Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 91XXXXXXXXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-500 outline-none text-sm font-medium transition-all"
                />
              </div>

              <div className="relative">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Target University *</label>
                <input
                  type="text"
                  required
                  placeholder="Search or type university name..."
                  value={formData.university}
                  onChange={(e) => handleUniSearch(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-500 outline-none text-sm font-medium transition-all"
                />
                
                {/* University dropdown results */}
                {searchQuery.trim().length > 1 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-2xl z-50">
                    {filteredUnis.length > 0 ? (
                      filteredUnis.map(uni => (
                        <button
                          type="button"
                          key={uni._id || uni.id}
                          onClick={() => selectUniversity(uni)}
                          className="w-full px-4 py-3 text-left text-sm hover:bg-blue-50 border-b border-slate-50 last:border-0 font-medium text-slate-700 transition-colors"
                        >
                          {uni.universityName}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-xs text-slate-400 italic">
                        No matches found. Press enter to save custom name.
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Course Name</label>
                <input
                  type="text"
                  placeholder="e.g. B.Tech Computer Science"
                  value={formData.course}
                  onChange={(e) => setFormData(prev => ({ ...prev, course: e.target.value }))}
                  className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-500 outline-none text-sm font-medium transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Required Loan Amount *</label>
                <select
                  value={formData.loanAmount}
                  onChange={(e) => setFormData(prev => ({ ...prev, loanAmount: e.target.value }))}
                  className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-500 outline-none text-sm font-medium transition-all appearance-none cursor-pointer"
                >
                  <option value="up-to-4">Up to ₹4 Lakhs</option>
                  <option value="4-7.5">₹4 Lakhs - ₹7.5 Lakhs</option>
                  <option value="7.5-15">₹7.5 Lakhs - ₹15 Lakhs</option>
                  <option value="above-15">Above ₹15 Lakhs</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Academic Score</label>
                  <input
                    type="text"
                    placeholder="e.g. 85% or 8.5 CGPA"
                    value={formData.academicScore}
                    onChange={(e) => setFormData(prev => ({ ...prev, academicScore: e.target.value }))}
                    className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-500 outline-none text-sm font-medium transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Parent's Income (p.a.)</label>
                  <select
                    value={formData.coBorrowerIncome}
                    onChange={(e) => setFormData(prev => ({ ...prev, coBorrowerIncome: e.target.value }))}
                    className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-500 outline-none text-sm font-medium transition-all appearance-none cursor-pointer"
                  >
                    <option value="below-3">Below ₹3 Lakhs</option>
                    <option value="3-6">₹3L - ₹6 Lakhs</option>
                    <option value="6-10">₹6L - ₹10 Lakhs</option>
                    <option value="above-10">Above ₹10 Lakhs</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 mt-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 flex items-center justify-center gap-2"
              >
                <span>🔍 FIND LOAN OPTIONS</span>
              </button>
            </form>
          </div>

          {/* Results Right Side */}
          <div className="lg:col-span-7">
            {!resultsVisible ? (
              <div className="bg-slate-100/40 rounded-[2.5rem] border-2 border-dashed border-slate-200 p-8 text-center h-full flex flex-col justify-center items-center py-20 min-h-[400px]">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-3xl mb-4">🏦</div>
                <h4 className="font-heading font-bold text-slate-800 text-lg mb-2">Check Your Loan Offers</h4>
                <p className="text-slate-400 max-w-sm text-sm">
                  Fill out the form on the left with your academic and target university details to see matches and estimated interest rates instantly.
                </p>
              </div>
            ) : (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-bold text-lg text-slate-800 flex items-center gap-2">
                    <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-green-50 text-green-600 font-bold text-sm">2</span>
                    Suggested Loan Schemes
                  </h3>
                  <button 
                    onClick={() => setResultsVisible(false)}
                    className="text-xs text-slate-400 hover:text-blue-600 font-semibold"
                  >
                    Reset Form
                  </button>
                </div>

                <div className="space-y-4">
                  {getLoanSuggestions().map((scheme, idx) => (
                    <div 
                      key={idx} 
                      className="bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-100/50 border border-slate-100 card-hover flex flex-col md:flex-row md:items-center justify-between gap-6"
                    >
                      {/* Left Block */}
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-center font-black text-blue-700 text-xs flex-shrink-0 tracking-wider">
                          {scheme.logoText}
                        </div>
                        <div>
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold mb-1.5 uppercase">
                            {scheme.bank}
                          </span>
                          <h4 className="font-heading font-bold text-slate-800 text-base mb-1">{scheme.scheme}</h4>
                          <p className="text-xs text-slate-500 leading-relaxed max-w-md">
                            Interest Rate: <strong className="text-slate-700">{scheme.rate}</strong> | Collateral: <strong className="text-slate-700">{scheme.collateral}</strong>
                          </p>
                          
                          {/* Bullet points */}
                          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                            {scheme.features.map((feat, fidx) => (
                              <span key={fidx} className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                                <span className="w-1 h-1 rounded-full bg-blue-500" />
                                {feat}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right Block (CTA) */}
                      <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 pt-4 md:pt-0 border-slate-50 flex-shrink-0 gap-4">
                        <div className="text-left md:text-right">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Max Amount</p>
                          <p className="font-heading font-black text-slate-800 text-lg leading-tight">{scheme.maxAmount}</p>
                        </div>
                        <button
                          onClick={() => handleApplyWhatsApp(scheme)}
                          className="px-5 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-xs tracking-wider transition-all shadow-md shadow-green-500/10 flex items-center gap-1.5"
                        >
                          <span>APPLY NOW</span>
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.588-1.449l-6.205 1.625zM6.16 19.347c1.558.925 3.327 1.414 5.132 1.415 5.56 0 10.083-4.523 10.086-10.086.002-2.695-1.047-5.228-2.953-7.135C16.517 3.633 13.987 2.583 11.298 2.582c-5.56 0-10.084 4.523-10.087 10.086-.001 1.905.497 3.766 1.442 5.385l-.946 3.454 3.535-.926zM17.065 14c-.328-.164-1.942-.958-2.243-1.069-.301-.11-.52-.164-.738.164-.219.329-.848 1.069-1.039 1.288-.192.219-.383.246-.711.082-.328-.164-1.385-.511-2.64-1.63-1-.892-1.675-1.994-1.87-2.322-.196-.328-.021-.505.143-.668.148-.147.329-.383.493-.575.164-.192.219-.328.328-.547.11-.219.055-.411-.027-.575-.082-.164-.738-1.78-.999-2.41-.254-.61-.513-.527-.704-.537-.183-.009-.393-.01-.602-.01-.209 0-.547.078-.834.393-.287.315-1.094 1.069-1.094 2.607 0 1.538 1.121 3.023 1.272 3.229.151.206 2.207 3.37 5.347 4.726.747.323 1.329.516 1.785.66.752.239 1.436.205 1.977.125.602-.09 1.942-.794 2.216-1.56.274-.767.274-1.424.192-1.56-.082-.137-.301-.219-.629-.383z"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

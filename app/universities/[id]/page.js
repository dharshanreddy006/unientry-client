'use client';

import { useState, useEffect } from 'react';
import { API_URL, getImageUrl } from '@/lib/apiConfig';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/common/WhatsAppButton';

export default function UniversityDetailsPage() {
  const { id } = useParams();
  const [university, setUniversity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUniversity = async () => {
      try {
        const res = await fetch(
          `${API_URL}/universities/${id}`,
          { cache: 'no-store' }
        );
        const data = await res.json();
        if (data.success) {
          setUniversity(data.data);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchUniversity();
  }, [id]);

  if (loading) {
    return (
      <main>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center pt-20">
          <div className="w-12 h-12 border-4 border-accent-200 border-t-accent-500 rounded-full animate-spin" />
        </div>
      </main>
    );
  }

  if (!university) {
    return (
      <main>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center pt-20">
          <p className="text-gray-500 text-lg mb-4">University not found</p>
          <Link href="/universities" className="text-accent-600 font-medium hover:underline">
            ← Back to Universities
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main>
      <Navbar />

      {/* Banner */}
      <section className="relative h-[400px] md:h-[500px]">
        <img
          src={getImageUrl(university.coverImage?.url) || 'https://images.unsplash.com/photo-1562774053-701939374585?w=1200'}
          alt={university.universityName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="max-w-7xl mx-auto">
            <Link href="/universities" className="text-white/60 hover:text-white text-sm mb-4 inline-flex items-center gap-1 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Universities
            </Link>
            <h1 className="font-heading font-bold text-3xl md:text-5xl text-white mb-3">
              {university.universityName}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/80">
              <span className="flex items-center gap-1.5">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {university.city}, {university.country}
              </span>
              {university.ranking && (
                <span className="px-3 py-1 bg-accent-500/20 rounded-full text-accent-300 text-sm">
                  🏆 {university.ranking}
                </span>
              )}
              <span className="px-3 py-1 bg-white/10 rounded-full text-sm">
                {university.degreeType}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About */}
              <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
                <h2 className="font-heading font-semibold text-xl text-primary-900 mb-4">About the University</h2>
                <p className="text-gray-600 leading-relaxed">{university.description}</p>
              </div>

              {/* Fees Structure */}
              <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
                <h2 className="font-heading font-semibold text-xl text-primary-900 mb-4">Fees Structure</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: 'Tuition Fees', value: university.fees?.tuition, icon: '🎓' },
                    { label: 'Hostel Fees', value: university.fees?.hostel, icon: '🏠' },
                    { label: 'Living Cost', value: university.fees?.livingCost, icon: '💰' },
                  ].map((item) => (
                    <div key={item.label} className="bg-gray-50 rounded-xl p-5 text-center">
                      <span className="text-2xl">{item.icon}</span>
                      <p className="text-accent-600 font-bold text-lg mt-2">{item.value || 'Contact us'}</p>
                      <p className="text-gray-400 text-xs mt-1">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Courses */}
              {university.courses?.length > 0 && (
                <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
                  <h2 className="font-heading font-semibold text-xl text-primary-900 mb-4">Courses Offered</h2>
                  <div className="flex flex-wrap gap-2">
                    {university.courses.map((course) => (
                      <span
                        key={course}
                        className="px-4 py-2 bg-accent-50 text-accent-700 rounded-xl text-sm font-medium"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Eligibility */}
              <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
                <h2 className="font-heading font-semibold text-xl text-primary-900 mb-4">Eligibility Requirements</h2>
                <div className="space-y-3">
                  {university.eligibility?.marks && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <span className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center text-sm">✓</span>
                      <span>Minimum Marks: <strong>{university.eligibility.marks}</strong></span>
                    </div>
                  )}
                  {university.eligibility?.ielts && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <span className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center text-sm">✓</span>
                      <span>IELTS: <strong>{university.eligibility.ielts}</strong></span>
                    </div>
                  )}
                  {university.eligibility?.toefl && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <span className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center text-sm">✓</span>
                      <span>TOEFL: <strong>{university.eligibility.toefl}</strong></span>
                    </div>
                  )}
                  {university.eligibility?.documents?.length > 0 && (
                    <div>
                      <p className="font-medium text-primary-900 mt-4 mb-2">Documents Required:</p>
                      <ul className="space-y-1.5">
                        {university.eligibility.documents.map((doc) => (
                          <li key={doc} className="flex items-center gap-2 text-gray-600 text-sm">
                            <svg className="w-4 h-4 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {doc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Image Gallery */}
              {university.images?.length > 0 && (
                <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
                  <h2 className="font-heading font-semibold text-xl text-primary-900 mb-4">Campus Gallery</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {university.images.map((img, i) => (
                      <div key={i} className="rounded-xl overflow-hidden h-40">
                        <img src={img.url} alt={`Campus ${i + 1}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Info Card */}
              <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 sticky top-24">
                <h3 className="font-heading font-semibold text-lg text-primary-900 mb-5">Quick Information</h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Duration</span>
                    <span className="font-medium text-primary-900">{university.duration}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Degree Type</span>
                    <span className="font-medium text-primary-900">{university.degreeType}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Country</span>
                    <span className="font-medium text-primary-900">{university.country}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">City</span>
                    <span className="font-medium text-primary-900">{university.city}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Tuition</span>
                    <span className="font-bold text-accent-600">{university.fees?.tuition}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <WhatsAppButton
                    text={`Hi UniEntry! I am interested in ${university.universityName}. Please provide more details.`}
                    className="whatsapp-btn flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-sm"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Contact on WhatsApp
                  </WhatsAppButton>
                  <Link
                    href="/contact"
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-accent-500 to-accent-600 text-white hover:shadow-lg transition-all"
                  >
                    Apply Now
                  </Link>
                </div>

                {university.referAndEarn && (
                  <div className="mt-5 p-4 bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl shadow-inner">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">🎁</span>
                      <h4 className="font-heading font-semibold text-yellow-800 text-sm">Refer & Earn</h4>
                    </div>
                    <p className="text-yellow-700 text-sm font-medium leading-snug">{university.referAndEarn}</p>
                  </div>
                )}

                {university.website && (
                  <a
                    href={university.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center text-accent-600 text-sm font-medium mt-4 hover:underline"
                  >
                    Visit Official Website ↗
                  </a>
                )}

                {(university.uniCheats || []).map((cheat, index) => (
                  <a
                    key={index}
                    href={cheat.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3.5 mt-3 rounded-xl font-semibold text-sm bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors border border-primary-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {cheat.note || 'Download Uni Cheats (PDF)'}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

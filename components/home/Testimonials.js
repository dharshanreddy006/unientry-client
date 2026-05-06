'use client';

import { useState } from 'react';

const testimonials = [
  {
    name: 'Arjun Mehta',
    university: 'TU Munich, Germany',
    feedback: 'UniEntry helped me get into my dream university in Germany. The guidance on SOP and visa process was incredible! I couldn\'t have done it without their expert team.',
    rating: 5,
  },
  {
    name: 'Priya Sharma',
    university: 'University of Toronto, Canada',
    feedback: 'I was confused about studying abroad. UniEntry\'s counselors made the whole process so simple and stress-free. From application to visa, they were there every step of the way.',
    rating: 5,
  },
  {
    name: 'Rahul Verma',
    university: 'University of Melbourne, Australia',
    feedback: 'From university selection to visa approval, UniEntry was with me every step. Their scholarship guidance saved me a lot of money. Highly recommended!',
    rating: 5,
  },
  {
    name: 'Sneha Patel',
    university: 'University of Oxford, UK',
    feedback: 'The scholarship guidance from UniEntry saved me lakhs! Their team is knowledgeable, responsive, and always available to help. Best consultancy I\'ve worked with.',
    rating: 5,
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);

  return (
    <section className="section-padding bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent-50 text-accent-600 text-sm font-medium mb-4">
            💬 Student Reviews
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary-900 mb-4">
            What Our Students Say
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Hear from students who achieved their dreams with UniEntry
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 card-hover"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-600 leading-relaxed mb-6 text-sm">
                &ldquo;{testimonial.feedback}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-400 to-primary-600 flex items-center justify-center text-white font-bold text-lg">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-primary-900 text-sm">{testimonial.name}</h4>
                  <p className="text-gray-400 text-xs">{testimonial.university}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

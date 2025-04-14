'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FallbackImage from '../common/Fallbacks';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    
    // Simulate form submission
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      setSubmitError('There was an error submitting your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="font-sans text-gray-800">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[40vh] bg-cover bg-center" style={{ backgroundImage: "url('/images/hero.png')" }}>
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-serif">Contact Us</h1>
            <p className="text-xl text-white italic">We're here to help plan your perfect African journey</p>
          </div>
        </div>
      </section>
      
      {/* Contact Information */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-8 shadow-md rounded-lg text-center">
              <div className="text-4xl text-blue-500 mb-4">📍</div>
              <h3 className="font-bold text-xl mb-3">Our Address</h3>
              <p className="text-gray-700">
                123 Travel Way<br />
                Cape Town, 8001<br />
                South Africa
              </p>
            </div>
            <div className="bg-white p-8 shadow-md rounded-lg text-center">
              <div className="text-4xl text-blue-500 mb-4">📞</div>
              <h3 className="font-bold text-xl mb-3">Phone & Email</h3>
              <p className="text-gray-700 mb-2">+27 21 555 0123</p>
              <p className="text-gray-700">info@mckaiser-travels.com</p>
            </div>
            <div className="bg-white p-8 shadow-md rounded-lg text-center">
              <div className="text-4xl text-blue-500 mb-4">⏰</div>
              <h3 className="font-bold text-xl mb-3">Working Hours</h3>
              <p className="text-gray-700 mb-2">Monday - Friday: 8am - 6pm</p>
              <p className="text-gray-700">Saturday: 9am - 3pm</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Send Us a Message</h2>
              {submitSuccess ? (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
                  <p className="text-green-700">Thank you for your message! We'll respond as soon as possible.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {submitError && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4">
                      <p className="text-red-700">{submitError}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                      <select
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select a subject</option>
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Booking">Booking</option>
                        <option value="Feedback">Feedback</option>
                        <option value="Partnership">Partnership</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                  </div>
                  
                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary py-3 px-8"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </div>
                </form>
              )}
            </div>
            
            {/* Map or Image */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Location</h2>
              <div className="h-[400px] relative rounded-lg overflow-hidden">
                <FallbackImage
                  src="/images/Rectangle9.png"
                  alt="Map of McKaiser Travels office location"
                  category="general"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="mt-4">
                <p className="text-gray-700">
                  Our main office is conveniently located in the heart of Cape Town, South Africa. 
                  We're easily accessible by public transportation and just a short drive from the international airport.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Find quick answers to common questions about our services</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                question: 'How far in advance should I book my tour?',
                answer: 'We recommend booking at least 3 months in advance for popular destinations, especially during peak season (June-September). This ensures availability of accommodations and activities.'
              },
              {
                question: 'What payment methods do you accept?',
                answer: 'We accept all major credit cards, bank transfers, and PayPal. A 20% deposit is required to confirm your booking, with the balance due 30 days before your trip.'
              },
              {
                question: 'Do I need a visa to visit African countries?',
                answer: 'Visa requirements vary by country and your nationality. Our team will provide guidance specific to your itinerary during the booking process.'
              },
              {
                question: 'Are your tours suitable for families with children?',
                answer: 'Many of our tours are family-friendly, but some activities have age restrictions. Please contact us for recommendations based on your children\'s ages.'
              },
              {
                question: 'What happens if I need to cancel my trip?',
                answer: 'Our cancellation policy allows full refunds (minus processing fees) for cancellations made 60+ days before departure. Please refer to our terms and conditions for detailed information.'
              },
              {
                question: 'Do you offer customized itineraries?',
                answer: 'Yes! We specialize in creating custom travel experiences tailored to your preferences, interests, and budget. Contact our team to start planning your dream African adventure.'
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-bold text-lg mb-3">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your African Adventure?</h2>
          <p className="text-xl mb-8">Our team is ready to help you plan an unforgettable experience</p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button className="btn-secondary px-8 py-3 text-lg">Book a Consultation</button>
            <button className="btn-outline-white px-8 py-3 text-lg">View Our Tours</button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
} 
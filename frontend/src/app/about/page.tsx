'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FallbackImage from '../common/Fallbacks';

export default function AboutPage() {
  return (
    <div className="font-sans text-gray-800">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[40vh] bg-cover bg-center" style={{ backgroundImage: "url('/images/about.png')" }}>
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-serif">About McKaiser Travels</h1>
            <p className="text-xl text-white italic">Your trusted partner for African adventures</p>
          </div>
        </div>
      </section>
      
      {/* Our Story */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-700 mb-4">
                Founded in 2010, McKaiser Travels began with a simple mission: to showcase the beauty and diversity of Africa to travelers from around the world. What started as a small tour operation in Cape Town has grown into a comprehensive travel service that spans the entire continent.
              </p>
              <p className="text-gray-700 mb-4">
                Our founder, Samuel McKaiser, was born and raised in South Africa and has always had a deep passion for the landscapes, wildlife, and cultures of Africa. After years of working in the tourism industry, he realized there was a need for a travel company that could provide authentic experiences while supporting local communities.
              </p>
              <p className="text-gray-700">
                Today, McKaiser Travels employs over 50 travel experts across Africa and has helped thousands of travelers create unforgettable memories. We remain committed to responsible tourism, sustainability, and creating positive impacts in the communities we visit.
              </p>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <FallbackImage
                src="/images/destination1.png"
                alt="McKaiser Travels Team"
                category="general"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Values */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">The principles that guide everything we do at McKaiser Travels</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🌍',
                title: 'Sustainability',
                description: 'We are committed to minimizing our environmental footprint and preserving the natural beauty of Africa for future generations.'
              },
              {
                icon: '🤝',
                title: 'Community Engagement',
                description: 'We partner with local communities, ensuring that tourism benefits the people who call our destinations home.'
              },
              {
                icon: '✨',
                title: 'Authentic Experiences',
                description: 'We believe in creating genuine connections between travelers and the places they visit, moving beyond the typical tourist experience.'
              },
              {
                icon: '🔍',
                title: 'Attention to Detail',
                description: 'From accommodation selection to itinerary planning, we ensure every aspect of your journey meets our high standards.'
              },
              {
                icon: '🛡️',
                title: 'Safety First',
                description: 'Your safety is our priority. We maintain rigorous safety protocols and work only with trusted partners.'
              },
              {
                icon: '💼',
                title: 'Professionalism',
                description: 'Our team of experienced travel professionals is dedicated to providing exceptional service at every step of your journey.'
              }
            ].map((value, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-md text-center">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="font-bold text-xl mb-3">{value.title}</h3>
                <p className="text-gray-700">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Our Team */}
      <section className="py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">The passionate individuals who make your travel dreams a reality</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                name: 'Nyamao Gregory',
                position: 'Founder & CEO',
                image: '/images/Gregory.jpg',
                bio: 'With over 20 years in the travel industry, Samuel leads our team with vision and passion.'
              },
              {
                name: 'Austin Barongo',
                position: 'Head of Operations',
                image: '/images/Austin.jpg',
                bio: 'Amara ensures that every journey runs smoothly from planning to completion.'
              },
              {
                name: 'Faith Moraa',
                position: 'Lead Tour Guide',
                image: '/images/faith.jpg',
                bio: 'An expert in African wildlife and culture, David has led over 500 tours across the continent.'
              },
              {
                name: 'Justinah Nyanchoka',
                position: 'Customer Experience Manager',
                image: '/images/Justinar.jpg',
                bio: 'Dedicated to creating memorable experiences, Zara oversees our client relationships.'
              }
            ].map((member, index) => (
              <div key={index} className="text-center">
                <div className="relative h-64 w-64 rounded-full overflow-hidden mx-auto mb-4">
                  <FallbackImage
                    src={member.image}
                    alt={member.name}
                    category="person"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="font-bold text-xl mb-1">{member.name}</h3>
                <p className="text-blue-600 mb-3">{member.position}</p>
                <p className="text-gray-700">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Achievements */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-12">Our Achievements</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">10K+</div>
              <p className="text-gray-700">Happy Travelers</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">15+</div>
              <p className="text-gray-700">African Countries</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <p className="text-gray-700">Tours Conducted</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">12</div>
              <p className="text-gray-700">Years of Experience</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience Africa with Us?</h2>
          <p className="text-xl mb-8">Let us help you plan your perfect African adventure</p>
          <button className="btn-secondary px-8 py-3 text-lg">Contact Us Today</button>
        </div>
      </section>
      
      <Footer />
    </div>
  );
} 
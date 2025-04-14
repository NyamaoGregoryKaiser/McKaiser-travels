'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { popularDestinations } from '@/lib/locationData';
import FallbackImage from '../common/Fallbacks';
import { useRouter } from 'next/navigation';

export default function ToursPage() {
  const router = useRouter();
  // Filter only tour destinations
  const tours = popularDestinations.filter(dest => dest.category === 'tour');
  
  const handleBookNow = (tourName: string) => {
    router.push(`/booking?name=${encodeURIComponent(tourName)}`);
  };
  
  return (
    <div className="font-sans text-gray-800">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[40vh] bg-cover bg-center" style={{ backgroundImage: "url('/images/about.png')" }}>
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-serif">Explore Our Tours</h1>
            <p className="text-xl text-white italic">Unforgettable guided experiences across Africa</p>
          </div>
        </div>
      </section>
      
      {/* Featured Tour */}
      {tours.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Featured Tour Package</h2>
              <p className="text-gray-600">Experience our most popular tour package</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="relative h-96 rounded-lg overflow-hidden">
                <FallbackImage 
                  src={tours[0].image} 
                  alt={tours[0].name} 
                  category="tour" 
                  fill 
                  className="object-cover" 
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3">{tours[0].name}</h3>
                <p className="text-gray-600 mb-2">{tours[0].country}</p>
                <p className="text-gray-700 mb-6 text-lg">{tours[0].description}</p>
                
                <div className="mb-6">
                  <h4 className="font-bold mb-2">Highlights</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Expert local guides</li>
                    <li>All-inclusive accommodation</li>
                    <li>Authentic cultural experiences</li>
                    <li>Transportation included</li>
                    <li>Curated itinerary</li>
                  </ul>
                </div>
                
                <div className="flex gap-4">
                  <button 
                    className="btn-primary px-8 py-3"
                    onClick={() => handleBookNow(tours[0].name)}
                  >
                    Book Now
                  </button>
                  <button className="btn-outline px-8 py-3">Learn More</button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Tour Packages */}
      <section className="py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Tour Packages</h2>
            <p className="text-gray-600">Discover our selection of guided tour experiences</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tours.slice(1).map((tour, index) => (
              <div key={index} className="card overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="h-64 relative">
                  <FallbackImage 
                    src={tour.image} 
                    alt={tour.name} 
                    category="tour"
                    fill 
                    className="object-cover transition-transform duration-300 hover:scale-105" 
                  />
                  <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Tour
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2">{tour.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{tour.country}</p>
                  <p className="text-gray-700 mb-4">{tour.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">7 Days</span>
                    <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">Guided</span>
                    <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">Small Group</span>
                  </div>
                  <button 
                    className="btn-primary w-full"
                    onClick={() => handleBookNow(tour.name)}
                  >
                    View Tour
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">What Our Travelers Say</h2>
          <p className="text-gray-600 mb-12">Hear from those who have experienced our tours</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                image: '/images/destination1.png',
                quote: 'The tour was absolutely incredible. Our guide was knowledgeable and made the experience unforgettable.',
                tour: 'Serengeti Safari'
              },
              {
                name: 'Michael Thompson',
                image: '/images/destination2.png',
                quote: 'Everything was well organized and the accommodations were excellent. Would definitely book again!',
                tour: 'Pyramids of Giza'
              },
              {
                name: 'Emily Davis',
                image: '/images/destination3.png',
                quote: 'This tour exceeded all my expectations. The cultural immersion was phenomenal.',
                tour: 'Marrakech Explorer'
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-md">
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden mb-4 relative">
                    <FallbackImage 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      category="person"
                      fill 
                      className="object-cover" 
                    />
                  </div>
                  <p className="text-gray-700 italic mb-4">"{testimonial.quote}"</p>
                  <p className="font-bold">{testimonial.name}</p>
                  <p className="text-gray-500 text-sm">{testimonial.tour}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8">Book your tour today and embark on an unforgettable adventure</p>
          <button className="btn-secondary px-8 py-3 text-lg">Browse All Tours</button>
        </div>
      </section>
      
      <Footer />
    </div>
  );
} 
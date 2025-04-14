'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FallbackImage from '../common/Fallbacks';
import { destinationService } from '@/lib/api';

interface Destination {
  _id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  country: string;
  rating: number;
  featured: boolean;
  category: 'flight' | 'hotel' | 'tour';
}

export default function DestinationsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch destinations from API
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const data = await destinationService.getAll();
        setDestinations(data);
      } catch (error) {
        console.error('Error fetching destinations:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDestinations();
  }, []);
  
  // Filter destinations based on selected category
  const filteredDestinations = selectedCategory 
    ? destinations.filter(dest => dest.category === selectedCategory)
    : destinations;
  
  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p>Loading destinations...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="font-sans text-gray-800">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[40vh] bg-cover bg-center" style={{ backgroundImage: "url('/images/hero.png')" }}>
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-serif">Discover Amazing Destinations</h1>
            <p className="text-xl text-white italic">Find your perfect getaway in Africa</p>
          </div>
        </div>
      </section>
      
      {/* Filter Section */}
      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              className={`px-6 py-2 rounded-full ${selectedCategory === null ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setSelectedCategory(null)}
            >
              All
            </button>
            <button 
              className={`px-6 py-2 rounded-full ${selectedCategory === 'tour' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setSelectedCategory('tour')}
            >
              Tours
            </button>
            <button 
              className={`px-6 py-2 rounded-full ${selectedCategory === 'hotel' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setSelectedCategory('hotel')}
            >
              Hotels
            </button>
            <button 
              className={`px-6 py-2 rounded-full ${selectedCategory === 'flight' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setSelectedCategory('flight')}
            >
              Flights
            </button>
          </div>
        </div>
      </section>
      
      {/* Destinations Grid */}
      <section className="py-12">
        <div className="container-custom">
          {filteredDestinations.length === 0 ? (
            <div className="text-center py-10">
              <h3 className="text-xl font-medium mb-2">No destinations found</h3>
              <p className="text-gray-600">Try selecting a different category or check back later</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {filteredDestinations.map((destination) => (
                <div key={destination._id} className="card overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="h-64 relative">
                    <FallbackImage 
                      src={destination.image} 
                      alt={destination.name} 
                      category={destination.category}
                      fill 
                      className="object-cover transition-transform duration-300 hover:scale-105" 
                    />
                    <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      {destination.category.charAt(0).toUpperCase() + destination.category.slice(1)}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-2">{destination.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{destination.country}</p>
                    <p className="text-gray-700 mb-4 line-clamp-2">{destination.description}</p>
                    <Link href={`/destinations/${destination._id}`} className="btn-primary w-full block text-center">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Ready for Your Next Adventure?</h2>
          <p className="text-xl mb-8">Let us plan your perfect trip to any of these amazing destinations</p>
          <Link href="/contact" className="btn-secondary px-8 py-3 text-lg inline-block">
            Contact Us Now
          </Link>
        </div>
      </section>
      
      <Footer />
    </div>
  );
} 
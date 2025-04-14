'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FallbackImage from '@/app/common/Fallbacks';
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
  bookings?: number;
}

export default function DestinationDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [travelers, setTravelers] = useState(1);
  const [bookingDate, setBookingDate] = useState<string>('');

  // Set minimum date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  useEffect(() => {
    const fetchDestination = async () => {
      setLoading(true);
      try {
        const data = await destinationService.getById(params.id);
        setDestination(data);
      } catch (err) {
        console.error('Error fetching destination:', err);
        setError('Failed to load destination details');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchDestination();
    }
  }, [params.id]);

  const handleBookNow = () => {
    if (!destination) return;
    
    router.push(`/booking?destinationId=${destination._id}&date=${bookingDate}&travelers=${travelers}`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p>Loading destination details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !destination) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
          <p className="mb-4">{error || 'Destination not found'}</p>
          <Link href="/destinations" className="btn-primary">
            Back to All Destinations
          </Link>
        </div>
      </div>
    );
  }

  // Render stars for rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={`star-${i}`} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half-star" className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="half-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="#D1D5DB" />
            </linearGradient>
          </defs>
          <path fill="url(#half-gradient)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-star-${i}`} className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    return stars;
  };

  return (
    <div className="font-sans text-gray-800">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[50vh] bg-cover bg-center" style={{ backgroundImage: `url('${destination.image}')` }}>
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
          <div className="text-center px-4">
            <div className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-semibold mb-2 rounded-full">
              {destination.category.toUpperCase()}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 font-serif">{destination.name}</h1>
            <p className="text-xl text-white italic">{destination.country}</p>
          </div>
        </div>
      </section>
      
      <div className="container-custom py-12">
        <div className="flex justify-between items-center mb-8">
          <Link href="/destinations" className="text-blue-600 hover:text-blue-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to All Destinations
          </Link>
          
          {destination.featured && (
            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-3 py-1 rounded-full">
              Featured Destination
            </span>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-80 relative">
                <FallbackImage 
                  src={destination.image} 
                  alt={destination.name}
                  category={destination.category}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">{destination.name}</h2>
                    <p className="text-gray-600">{destination.country}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">${destination.price.toLocaleString()}</p>
                    <p className="text-gray-500">per person</p>
                  </div>
                </div>
                
                <div className="flex items-center mb-4">
                  <div className="flex mr-2">
                    {renderStars(destination.rating)}
                  </div>
                  <span className="text-sm text-gray-600">{destination.rating} out of 5</span>
                </div>
                
                <div className="border-t border-b py-4 my-4">
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-gray-700 whitespace-pre-line">{destination.description}</p>
                </div>
                
                <div className="py-4">
                  <h3 className="text-lg font-semibold mb-3">Features</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Professional Guide</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Entrance Fees</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Transportation</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Meals Included</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Booking Sidebar */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h3 className="text-xl font-bold mb-4">Book This Destination</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Travel Date</label>
                  <input 
                    type="date" 
                    min={minDate}
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Number of Travelers</label>
                  <div className="flex items-center">
                    <button 
                      type="button"
                      className="p-2 border rounded-l-md bg-gray-100 hover:bg-gray-200"
                      onClick={() => setTravelers(Math.max(1, travelers - 1))}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <input 
                      type="number" 
                      min="1"
                      value={travelers}
                      onChange={(e) => setTravelers(parseInt(e.target.value) || 1)}
                      className="w-20 p-2 text-center border-t border-b"
                      readOnly
                    />
                    <button 
                      type="button"
                      className="p-2 border rounded-r-md bg-gray-100 hover:bg-gray-200"
                      onClick={() => setTravelers(travelers + 1)}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Price per person</span>
                    <span className="font-medium">${destination.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between mb-4">
                    <span className="text-gray-600">Total price</span>
                    <span className="font-bold text-lg">${(destination.price * travelers).toLocaleString()}</span>
                  </div>
                  
                  <button 
                    onClick={handleBookNow}
                    disabled={!bookingDate}
                    className="w-full btn-primary py-3 text-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {!bookingDate ? 'Select Date to Book' : 'Book Now'}
                  </button>
                  
                  {!bookingDate && (
                    <p className="text-sm text-red-500 mt-2 text-center">
                      Please select a travel date
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
} 
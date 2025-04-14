'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchForm from '@/components/SearchForm';
import FallbackImage from './common/Fallbacks';
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

export default function Home() {
  const router = useRouter();
  const [featuredDestinations, setFeaturedDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch featured destinations
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const data = await destinationService.getAll({ featured: true, limit: 4 });
        setFeaturedDestinations(data);
      } catch (error) {
        console.error('Error fetching destinations:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDestinations();
  }, []);
  
  return (
    <div className="font-sans text-gray-800">
      <Header />

      {/* Hero Section */}
      <section className="relative h-screen bg-cover bg-center" style={{ backgroundImage: "url('/images/hero.png')" }}>
        <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center">
          <div className="text-center px-4 mb-8">
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-4 font-serif">Your Dream Vacation Awaits</h1>
            <p className="text-xl text-white italic">Explore the World with us.</p>
          </div>

          {/* Search Form */}
          <SearchForm />
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16">
        <div className="container-custom">
          <h2 className="text-4xl font-bold text-center mb-4">Popular African Destinations</h2>
          <p className="text-gray-600 text-center mb-12">Explore our most sought-after travel destinations in Africa</p>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="spinner mb-4"></div>
                <p>Loading destinations...</p>
              </div>
            </div>
          ) : featuredDestinations.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-600">No featured destinations available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {featuredDestinations.map((destination) => (
                <div key={destination._id} className="card">
                  <div className="h-64 relative">
                    <FallbackImage 
                      src={destination.image} 
                      alt={destination.name} 
                      category={destination.category}
                      fill 
                      className="object-cover" 
                    />
                    <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      {destination.category.charAt(0).toUpperCase() + destination.category.slice(1)}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-2">{destination.name}</h3>
                    <p className="text-gray-600 mb-2">{destination.country}</p>
                    <p className="text-gray-700 mb-4 line-clamp-2">{destination.description}</p>
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center">
                        <span className="text-yellow-500">★</span>
                        <span className="text-gray-600 ml-1">{destination.rating}</span>
                      </div>
                      <span className="font-bold text-blue-600">${destination.price.toLocaleString()}</span>
                    </div>
                    <Link href={`/destinations/${destination._id}`} className="btn-primary w-full block text-center">
                      Explore
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-10">
            <Link href="/destinations" className="btn-primary">
              View All Destinations
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="relative h-screen bg-cover bg-center" style={{ backgroundImage: "url('/images/about.png')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 font-serif">Experience the Journey</h2>
          <p className="text-xl text-white mb-8 max-w-2xl">Watch our latest travel adventures and get inspired for your next trip</p>
          <button className="btn-secondary text-lg px-8 py-4">Watch More</button>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <h2 className="text-4xl font-bold text-center mb-4">Why Choose Us?</h2>
          <p className="text-gray-600 text-center mb-12">Experience the difference with our premium travel services</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: '⭐', 
                title: 'Best Price Guarantee', 
                description: 'We guarantee the best prices for all our travel packages',
                image: '/images/destination1.png'
              },
              { 
                icon: '✈️', 
                title: 'Expert Guides', 
                description: 'Travel with experienced guides who know the destinations inside out',
                image: '/images/destination2.png'
              },
              { 
                icon: '🛡️', 
                title: '24/7 Support', 
                description: 'Round-the-clock customer support for all your travel needs',
                image: '/images/destination3.png'
              }
            ].map((feature, i) => (
              <div key={i} className="card h-[500px]">
                <div className="h-64 relative overflow-hidden">
                  <FallbackImage 
                    src={feature.image} 
                    alt={feature.title} 
                    category="general"
                    fill 
                    className="object-cover transform hover:scale-110 transition-transform duration-300" 
                  />
                </div>
                <div className="p-8 text-center">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h4 className="font-bold text-xl mb-3">{feature.title}</h4>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Adventure Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-4xl font-bold text-center mb-4">Adventure Awaits</h2>
          <p className="text-gray-600 text-center mb-12">Choose your next adventure from our curated experiences</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Sailing', image: '/images/Rectangle5.png', description: 'Experience the freedom of the open sea' },
              { name: 'Camping', image: '/images/Rectangle6.png', description: 'Connect with nature in beautiful locations' },
              { name: 'Hiking', image: '/images/Rectangle7.png', description: 'Explore breathtaking trails and landscapes' }
            ].map((activity, i) => (
              <div key={i} className="relative group overflow-hidden rounded-xl h-96">
                <div className="relative w-full h-full">
                  <FallbackImage 
                    src={activity.image} 
                    alt={activity.name} 
                    category="general"
                    fill 
                    className="object-cover transform group-hover:scale-110 transition-transform duration-300" 
                  />
                  <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-6">
                    <h3 className="text-2xl font-bold text-white mb-2">{activity.name}</h3>
                    <p className="text-white/90">{activity.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Stay Updated</h2>
          <p className="mb-8 text-white/90">Subscribe to our newsletter for exclusive travel deals and updates</p>
          <form className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="p-3 rounded-lg flex-grow text-gray-900 focus:ring-2 focus:ring-white" 
            />
            <button type="submit" className="btn-secondary">Subscribe</button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
} 
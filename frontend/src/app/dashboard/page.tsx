'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FallbackImage from '../common/Fallbacks';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';

// Mock data for user bookings
const mockBookings = [
  {
    id: 'bk001',
    destination: 'Serengeti National Park',
    date: '2025-06-15',
    status: 'confirmed',
    price: 2200,
    image: '/images/Rectangle5.png',
    travelers: 2
  },
  {
    id: 'bk002',
    destination: 'Victoria Falls',
    date: '2025-08-20',
    status: 'pending',
    price: 1800,
    image: '/images/destination4.png',
    travelers: 1
  },
  {
    id: 'bk003',
    destination: 'Pyramids of Giza',
    date: '2025-03-10',
    status: 'completed',
    price: 2400,
    image: '/images/destination1.png',
    travelers: 4
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('upcoming');
  
  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);
  
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          <p>Please wait while we load your dashboard</p>
        </div>
      </div>
    );
  }
  
  const filteredBookings = mockBookings.filter(booking => {
    if (activeTab === 'upcoming') return booking.status === 'confirmed' || booking.status === 'pending';
    if (activeTab === 'completed') return booking.status === 'completed';
    if (activeTab === 'canceled') return booking.status === 'canceled';
    return true;
  });
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'canceled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="font-sans text-gray-800">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[20vh] bg-cover bg-center" style={{ backgroundImage: "url('/images/about.png')" }}>
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 font-serif">My Dashboard</h1>
            <p className="text-lg text-white italic">Welcome back, {user.name}</p>
          </div>
        </div>
      </section>
      
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="p-6 border-b">
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 rounded-full overflow-hidden">
                    <FallbackImage
                      src="/images/Rectangle5.png"
                      alt={user.name}
                      category="person"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="font-bold text-xl">{user.name}</h2>
                    <p className="text-gray-600">{user.email}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-bold text-gray-700 mb-3">Dashboard Navigation</h3>
                <ul className="space-y-2">
                  <li>
                    <button 
                      className={`w-full text-left px-4 py-2 rounded-md ${activeTab === 'upcoming' ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-gray-50'}`}
                      onClick={() => setActiveTab('upcoming')}
                    >
                      Upcoming Trips
                    </button>
                  </li>
                  <li>
                    <button 
                      className={`w-full text-left px-4 py-2 rounded-md ${activeTab === 'completed' ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-gray-50'}`}
                      onClick={() => setActiveTab('completed')}
                    >
                      Trip History
                    </button>
                  </li>
                  <li>
                    <button 
                      className={`w-full text-left px-4 py-2 rounded-md ${activeTab === 'profile' ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-gray-50'}`}
                      onClick={() => setActiveTab('profile')}
                    >
                      Profile Settings
                    </button>
                  </li>
                  <li>
                    <button 
                      className={`w-full text-left px-4 py-2 rounded-md ${activeTab === 'account' ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-gray-50'}`}
                      onClick={() => setActiveTab('account')}
                    >
                      Account Settings
                    </button>
                  </li>
                  {user.role === 'admin' && (
                    <li>
                      <button 
                        className="w-full text-left px-4 py-2 rounded-md bg-purple-50 text-purple-600 font-medium hover:bg-purple-100"
                        onClick={() => router.push('/admin')}
                      >
                        Admin Dashboard
                      </button>
                    </li>
                  )}
                  <li className="pt-2 border-t mt-2">
                    <button 
                      className="w-full text-left px-4 py-2 rounded-md text-red-600 hover:bg-red-50"
                      onClick={() => {
                        logout();
                        router.push('/');
                      }}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="font-bold text-gray-700 mb-3">Need Help?</h3>
                <p className="text-gray-600 mb-4">Contact our travel experts if you need assistance with your bookings.</p>
                <button className="btn-primary w-full">Contact Support</button>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Upcoming & Past Trips */}
            {(activeTab === 'upcoming' || activeTab === 'completed') && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b">
                  <h2 className="font-bold text-2xl">
                    {activeTab === 'upcoming' ? 'Your Upcoming Trips' : 'Trip History'}
                  </h2>
                  <p className="text-gray-600">
                    {activeTab === 'upcoming' ? 'Manage your upcoming travel plans' : 'View your past travel experiences'}
                  </p>
                </div>
                
                {filteredBookings.length > 0 ? (
                  <div className="divide-y">
                    {filteredBookings.map(booking => (
                      <div key={booking.id} className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                          <div className="md:col-span-1">
                            <div className="h-32 relative rounded-md overflow-hidden">
                              <FallbackImage
                                src={booking.image}
                                alt={booking.destination}
                                category="tour"
                                fill
                                className="object-cover"
                              />
                            </div>
                          </div>
                          <div className="md:col-span-2">
                            <h3 className="font-bold text-lg mb-1">{booking.destination}</h3>
                            <div className="flex gap-2 items-center mb-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </span>
                              <span className="text-gray-500 text-sm">
                                {new Date(booking.date).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-1">Travelers: {booking.travelers}</p>
                            <p className="font-medium">Total: ${booking.price.toLocaleString()}</p>
                          </div>
                          <div className="md:col-span-1 flex flex-col gap-2">
                            <button className="btn-primary py-2">View Details</button>
                            {booking.status !== 'completed' && booking.status !== 'canceled' && (
                              <>
                                <button className="btn-outline py-2">Modify</button>
                                {booking.status === 'pending' && (
                                  <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                                    Cancel Booking
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-10 text-center">
                    <p className="text-gray-500 mb-4">
                      {activeTab === 'upcoming' 
                        ? "You don't have any upcoming trips" 
                        : "You haven't completed any trips yet"}
                    </p>
                    <button className="btn-primary">Browse Destinations</button>
                  </div>
                )}
              </div>
            )}
            
            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b">
                  <h2 className="font-bold text-2xl">Profile Settings</h2>
                  <p className="text-gray-600">Update your personal information</p>
                </div>
                
                <div className="p-6">
                  <form className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          defaultValue={user.name}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          defaultValue={user.email}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          placeholder="Enter your phone number"
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Enter your address"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      ></textarea>
                    </div>
                    
                    <div className="flex justify-end">
                      <button type="submit" className="btn-primary px-6 py-2">
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            
            {/* Account Settings */}
            {activeTab === 'account' && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b">
                  <h2 className="font-bold text-2xl">Account Settings</h2>
                  <p className="text-gray-600">Manage your account preferences and security</p>
                </div>
                
                <div className="p-6">
                  <div className="mb-8">
                    <h3 className="font-bold text-lg mb-4">Change Password</h3>
                    <form className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Current Password
                        </label>
                        <input
                          type="password"
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          New Password
                        </label>
                        <input
                          type="password"
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <button type="submit" className="btn-primary px-6 py-2">
                          Update Password
                        </button>
                      </div>
                    </form>
                  </div>
                  
                  <div className="mb-8">
                    <h3 className="font-bold text-lg mb-4">Email Notifications</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Trip Updates</p>
                          <p className="text-sm text-gray-600">Receive notifications about changes to your bookings</p>
                        </div>
                        <div className="relative inline-block w-12 h-6">
                          <input type="checkbox" id="toggle-1" className="sr-only" defaultChecked />
                          <label
                            htmlFor="toggle-1"
                            className="block bg-gray-300 w-12 h-6 rounded-full cursor-pointer transition-colors duration-300 peer-checked:bg-blue-500"
                          ></label>
                          <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 peer-checked:translate-x-6"></span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Promotional Emails</p>
                          <p className="text-sm text-gray-600">Receive deals, discounts and travel inspiration</p>
                        </div>
                        <div className="relative inline-block w-12 h-6">
                          <input type="checkbox" id="toggle-2" className="sr-only" defaultChecked />
                          <label
                            htmlFor="toggle-2"
                            className="block bg-gray-300 w-12 h-6 rounded-full cursor-pointer transition-colors duration-300 peer-checked:bg-blue-500"
                          ></label>
                          <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 peer-checked:translate-x-6"></span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Account Alerts</p>
                          <p className="text-sm text-gray-600">Receive notifications about account activity</p>
                        </div>
                        <div className="relative inline-block w-12 h-6">
                          <input type="checkbox" id="toggle-3" className="sr-only" defaultChecked />
                          <label
                            htmlFor="toggle-3"
                            className="block bg-gray-300 w-12 h-6 rounded-full cursor-pointer transition-colors duration-300 peer-checked:bg-blue-500"
                          ></label>
                          <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 peer-checked:translate-x-6"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-lg mb-4 text-red-600">Danger Zone</h3>
                    <div className="border border-red-200 rounded-md p-4 bg-red-50">
                      <p className="text-gray-700 mb-4">Deleting your account will permanently remove all your data from our system.</p>
                      <button className="bg-white text-red-600 border border-red-600 px-4 py-2 rounded hover:bg-red-50">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
} 
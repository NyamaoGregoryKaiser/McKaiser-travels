'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FallbackImage from '../common/Fallbacks';
import { adminService } from '@/lib/api';

// Define types for our data
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface Booking {
  _id: string;
  user: string;
  destination?: {
    name: string;
  };
  travelDate: string;
  numberOfTravelers: number;
  totalPrice: number;
  status: string;
  createdAt: string;
}

interface Destination {
  _id: string;
  name: string;
  country: string;
  price: number;
  rating: number;
  featured: boolean;
  image?: string;
  bookings?: number;
}

interface Analytics {
  totalUsers: number;
  totalBookings: number;
  totalRevenue: number;
  avgBookingValue: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  monthlyBookings: number[];
  mostPopularDestination?: {
    name: string;
    bookings: number;
  };
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [activeSection, setActiveSection] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  
  // State for real data with proper types
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Fetch data from API - wrap in useCallback to prevent infinite renders
  const fetchData = useCallback(async () => {
    if (!isAuthenticated || user?.role !== 'admin') {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch all data in parallel for efficiency
      const [analyticsData, usersData, bookingsData, destinationsData] = await Promise.all([
        adminService.getAnalytics(),
        adminService.getAllUsers(),
        adminService.getAllBookings(),
        adminService.getAllDestinations()
      ]);

      setAnalytics(analyticsData);
      setUsers(usersData);
      setBookings(bookingsData);
      setDestinations(destinationsData);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setError('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  // First check auth status
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (user && user.role !== 'admin') {
      router.push('/dashboard');
    } else {
      setAuthChecked(true);
    }
  }, [isAuthenticated, user, router]);

  // Only fetch data after auth is confirmed
  useEffect(() => {
    if (authChecked) {
      fetchData();
    }
  }, [fetchData, authChecked]);

  // Flag to determine if all data is ready
  const isDataReady = authChecked && !loading && analytics && users.length > 0 && destinations.length > 0;

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Authorization Required</h1>
          <p>Please log in to access the admin dashboard</p>
        </div>
      </div>
    );
  }
  
  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Access Denied</h1>
          <p className="mb-4">You don't have administrator privileges to access this page.</p>
          <button 
            onClick={() => router.push('/dashboard')} 
            className="btn-primary"
          >
            Go to User Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (authChecked && loading && !analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading Admin Dashboard...</h1>
          <p>Please wait while we load the administrative interface</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'canceled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderOverview = () => {
    // Don't try to render data that doesn't exist yet
    if (!analytics || bookings.length === 0) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="spinner mb-4"></div>
            <p>Loading analytics data...</p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Analytics cards */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-gray-500 text-sm font-medium mb-1">Total Users</h3>
            <p className="text-3xl font-bold">{analytics.totalUsers}</p>
            <p className="text-green-600 text-sm mt-2">↑ 12% from last month</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-gray-500 text-sm font-medium mb-1">Total Bookings</h3>
            <p className="text-3xl font-bold">{analytics.totalBookings}</p>
            <p className="text-green-600 text-sm mt-2">↑ 8% from last month</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-gray-500 text-sm font-medium mb-1">Revenue</h3>
            <p className="text-3xl font-bold">${analytics.totalRevenue.toLocaleString()}</p>
            <p className="text-green-600 text-sm mt-2">↑ 15% from last month</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-gray-500 text-sm font-medium mb-1">Avg. Booking Value</h3>
            <p className="text-3xl font-bold">${Math.round(analytics.avgBookingValue).toLocaleString()}</p>
            <p className="text-green-600 text-sm mt-2">↑ 5% from last month</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Booking Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-gray-800 font-bold mb-4">Monthly Bookings</h3>
            <div className="h-60 flex items-end space-x-2">
              {analytics.monthlyBookings.map((value, index) => (
                <div key={index} className="relative flex-1 flex flex-col items-center">
                  <div 
                    className="bg-blue-500 rounded-t w-full" 
                    style={{ height: `${(value / Math.max(...analytics.monthlyBookings)) * 100}%` }}
                  ></div>
                  <div className="text-xs mt-1 text-gray-500">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Booking Status */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-gray-800 font-bold mb-4">Booking Status</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Pending</span>
                  <span className="text-sm text-gray-500">{analytics.pendingBookings} bookings</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${(analytics.pendingBookings / analytics.totalBookings) * 100}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Confirmed</span>
                  <span className="text-sm text-gray-500">{analytics.confirmedBookings} bookings</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${(analytics.confirmedBookings / analytics.totalBookings) * 100}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Completed</span>
                  <span className="text-sm text-gray-500">{analytics.completedBookings} bookings</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${(analytics.completedBookings / analytics.totalBookings) * 100}%` }}></div>
                </div>
              </div>
            </div>
            {analytics.mostPopularDestination && (
              <div className="mt-6">
                <h4 className="font-medium mb-2">Most Popular Destination</h4>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 relative rounded overflow-hidden">
                    <FallbackImage
                      src="/images/destination1.png"
                      alt={analytics.mostPopularDestination.name}
                      category="tour"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{analytics.mostPopularDestination.name}</p>
                    <p className="text-sm text-gray-500">{analytics.mostPopularDestination.bookings} bookings</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b px-6 py-4 flex justify-between items-center">
            <h3 className="text-gray-800 font-bold">Recent Bookings</h3>
            <button 
              className="text-blue-600 text-sm font-medium"
              onClick={() => {
                setActiveSection('management');
                setActiveTab('bookings');
              }}
            >
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.slice(0, 5).map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking._id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.user}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {booking.destination?.name || 'Unknown Destination'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(booking.travelDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${booking.totalPrice.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderUsers = () => {
    if (users.length === 0 && !loading) {
      return (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p>No user data available.</p>
        </div>
      );
    }
    
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b px-6 py-4 flex justify-between items-center">
          <h3 className="text-gray-800 font-bold">User Management</h3>
          <button className="btn-primary text-sm">Add New User</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{user.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">Edit</button>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderBookings = () => {
    if (bookings.length === 0 && !loading) {
      return (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p>No booking data available.</p>
        </div>
      );
    }
    
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b px-6 py-4 flex justify-between items-center">
          <h3 className="text-gray-800 font-bold">Booking Management</h3>
          <div className="flex space-x-2">
            <select className="border rounded-md px-3 py-1 text-sm">
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="canceled">Canceled</option>
            </select>
            <button className="btn-primary text-sm">Add Booking</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Travel Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking._id.substring(0, 8)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{booking.user}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {booking.destination?.name || 'Unknown Destination'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(booking.travelDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${booking.totalPrice.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">Edit</button>
                    <select className="border rounded text-sm px-2 py-1">
                      <option value="">Change Status</option>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="canceled">Canceled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderDestinations = () => {
    if (destinations.length === 0 && !loading) {
      return (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p>No destination data available.</p>
        </div>
      );
    }
    
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b px-6 py-4 flex justify-between items-center">
          <h3 className="text-gray-800 font-bold">Destination Management</h3>
          <button className="btn-primary text-sm">Add Destination</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bookings</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Featured</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {destinations.map((destination) => (
                <tr key={destination._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 relative rounded overflow-hidden">
                        <FallbackImage
                          src={`/images/${destination.image || 'destination1.png'}`}
                          alt={destination.name}
                          category="tour"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{destination.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{destination.country}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${destination.price.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{destination.bookings || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{destination.rating}/5</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${destination.featured ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {destination.featured ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">Edit</button>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Create an optimized render function for the entire dashboard
  const renderDashboardContent = () => {
    if (!isDataReady) {
      return (
        <div className="container-custom py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="spinner mb-4"></div>
              <p>Loading dashboard data...</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="container-custom py-8">
        {/* View Client Site Button */}
        <div className="flex justify-end mb-4">
          <button 
            onClick={() => router.push('/')}
            className="flex items-center gap-2 bg-green-100 hover:bg-green-200 text-green-800 py-2 px-4 rounded-md transition-colors"
          >
            <span>View Client Site</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        {/* Admin Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="flex flex-wrap border-b">
            <button 
              className={`px-6 py-3 font-medium text-sm ${activeSection === 'dashboard' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveSection('dashboard')}
            >
              Dashboard
            </button>
            <button 
              className={`px-6 py-3 font-medium text-sm ${activeSection === 'management' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveSection('management')}
            >
              Management
            </button>
            <button 
              className={`px-6 py-3 font-medium text-sm ${activeSection === 'settings' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveSection('settings')}
            >
              Settings
            </button>
          </div>
        </div>
        
        {/* Dashboard Content */}
        {activeSection === 'dashboard' && (
          <div>
            {/* Dashboard Tabs */}
            <div className="flex flex-wrap mb-6 space-x-2">
              <button 
                className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'overview' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button 
                className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'analytics' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                onClick={() => setActiveTab('analytics')}
              >
                Detailed Analytics
              </button>
              <button 
                className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'reports' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                onClick={() => setActiveTab('reports')}
              >
                Reports
              </button>
            </div>
            
            {/* Selected Dashboard Content */}
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'analytics' && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Detailed Analytics</h2>
                <p>Advanced analytics dashboard would be displayed here.</p>
              </div>
            )}
            {activeTab === 'reports' && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Reports</h2>
                <p>Revenue reports, booking reports, and other business metrics would be displayed here.</p>
              </div>
            )}
          </div>
        )}
        
        {/* Management Content */}
        {activeSection === 'management' && (
          <div>
            {/* Management Tabs */}
            <div className="flex flex-wrap mb-6 space-x-2">
              <button 
                className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'users' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                onClick={() => setActiveTab('users')}
              >
                User Management
              </button>
              <button 
                className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'bookings' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                onClick={() => setActiveTab('bookings')}
              >
                Booking Management
              </button>
              <button 
                className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'destinations' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                onClick={() => setActiveTab('destinations')}
              >
                Destination Management
              </button>
            </div>
            
            {/* Selected Management Content */}
            {activeTab === 'users' && renderUsers()}
            {activeTab === 'bookings' && renderBookings()}
            {activeTab === 'destinations' && renderDestinations()}
          </div>
        )}
        
        {/* Settings Content */}
        {activeSection === 'settings' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="border-b px-6 py-4">
              <h3 className="text-gray-800 font-bold">System Settings</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-medium mb-4">General Settings</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
                      <input type="text" className="w-full border rounded-md p-2" defaultValue="McKaiser Travels" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                      <input type="email" className="w-full border rounded-md p-2" defaultValue="info@mckaiser-travels.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                      <select className="w-full border rounded-md p-2">
                        <option>USD ($)</option>
                        <option>EUR (€)</option>
                        <option>GBP (£)</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-medium mb-4">System Maintenance</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Database Backup</label>
                      <div className="flex space-x-2">
                        <button className="btn-primary py-2">Run Backup</button>
                        <button className="btn-outline py-2">Download Latest</button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">System Logs</label>
                      <button className="btn-outline py-2">View Logs</button>
                    </div>
                    <div className="pt-2">
                      <div className="flex items-center">
                        <input type="checkbox" id="maintenance" className="mr-2" />
                        <label htmlFor="maintenance" className="text-sm font-medium text-gray-700">Enable Maintenance Mode</label>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">This will put the site in maintenance mode and show a maintenance page to visitors.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t flex justify-end">
                <button className="btn-primary">Save Settings</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="font-sans text-gray-800 min-h-screen bg-gray-100">
      <Header />
      
      {/* Admin Header */}
      <section className="relative h-[20vh] bg-cover bg-center" style={{ backgroundImage: "url('/images/about.png')" }}>
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
          <div className="text-center px-4">
            <div className="inline-block px-3 py-1 bg-purple-600 text-white text-xs font-semibold mb-2 rounded-full">ADMINISTRATOR ACCESS</div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 font-serif">Admin Dashboard</h1>
            <p className="text-lg text-white italic">Welcome back, {user?.name}</p>
          </div>
        </div>
      </section>
      
      {renderDashboardContent()}
      
      <Footer />
    </div>
  );
} 
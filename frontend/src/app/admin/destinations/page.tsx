'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FallbackImage from '@/app/common/Fallbacks';
import { adminService } from '@/lib/api';

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

export default function AdminDestinationsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  // State variables
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentDestination, setCurrentDestination] = useState<Destination | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    country: '',
    price: '',
    rating: '',
    category: 'tour',
    featured: false,
    image: null as File | null
  });

  // Redirect if not admin
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (user && user.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [isAuthenticated, user, router]);

  // Fetch destinations
  useEffect(() => {
    const fetchDestinations = async () => {
      setLoading(true);
      try {
        const data = await adminService.getAllDestinations();
        setDestinations(data);
      } catch (err) {
        console.error('Error fetching destinations:', err);
        setError('Failed to load destinations');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user?.role === 'admin') {
      fetchDestinations();
    }
  }, [isAuthenticated, user]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({
        ...formData,
        image: file
      });

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      country: '',
      price: '',
      rating: '',
      category: 'tour',
      featured: false,
      image: null
    });
    setImagePreview(null);
  };

  // Open edit modal
  const handleEditClick = (destination: Destination) => {
    setCurrentDestination(destination);
    setFormData({
      name: destination.name,
      description: destination.description,
      country: destination.country,
      price: destination.price.toString(),
      rating: destination.rating.toString(),
      category: destination.category,
      featured: destination.featured,
      image: null
    });
    setImagePreview(destination.image);
    setShowEditModal(true);
  };

  // Open add modal
  const handleAddClick = () => {
    resetForm();
    setShowAddModal(true);
  };

  // Submit form for adding a new destination
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.image) {
      setError('Please upload an image');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create form data for file upload
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('country', formData.country);
      submitData.append('price', formData.price);
      submitData.append('rating', formData.rating);
      submitData.append('category', formData.category);
      submitData.append('featured', formData.featured.toString());
      submitData.append('image', formData.image);

      // Call API to create destination
      await adminService.createDestination(submitData);
      
      // Refresh destinations
      const data = await adminService.getAllDestinations();
      setDestinations(data);
      
      // Close modal and reset form
      setShowAddModal(false);
      resetForm();
    } catch (err) {
      console.error('Error creating destination:', err);
      setError('Failed to create destination');
    } finally {
      setLoading(false);
    }
  };

  // Submit form for updating a destination
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentDestination) return;

    setLoading(true);
    setError(null);

    try {
      // Create form data for file upload
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('country', formData.country);
      submitData.append('price', formData.price);
      submitData.append('rating', formData.rating);
      submitData.append('category', formData.category);
      submitData.append('featured', formData.featured.toString());
      
      // Only append image if a new one is selected
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      // Call API to update destination
      await adminService.updateDestination(currentDestination._id, submitData);
      
      // Refresh destinations
      const data = await adminService.getAllDestinations();
      setDestinations(data);
      
      // Close modal and reset
      setShowEditModal(false);
      setCurrentDestination(null);
      resetForm();
    } catch (err) {
      console.error('Error updating destination:', err);
      setError('Failed to update destination');
    } finally {
      setLoading(false);
    }
  };

  // Delete destination
  const handleDeleteDestination = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this destination? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      await adminService.deleteDestination(id);
      setDestinations(destinations.filter(dest => dest._id !== id));
    } catch (err) {
      console.error('Error deleting destination:', err);
      setError('Failed to delete destination. It may have existing bookings.');
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading && destinations.length === 0) {
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
    <div className="font-sans text-gray-800 min-h-screen bg-gray-100">
      <Header />
      
      {/* Admin Header */}
      <section className="relative h-[20vh] bg-cover bg-center" style={{ backgroundImage: "url('/images/about.png')" }}>
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
          <div className="text-center px-4">
            <div className="inline-block px-3 py-1 bg-purple-600 text-white text-xs font-semibold mb-2 rounded-full">ADMINISTRATOR ACCESS</div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 font-serif">Manage Destinations</h1>
            <p className="text-lg text-white italic">Add, edit or remove travel destinations</p>
          </div>
        </div>
      </section>
      
      <div className="container-custom py-8">
        {/* Navigation and Actions */}
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => router.push('/admin')}
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Dashboard
          </button>
          
          <button 
            className="btn-primary flex items-center"
            onClick={handleAddClick}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add New Destination
          </button>
        </div>
        
        {/* Error alert */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button 
                    onClick={() => setError(null)}
                    className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {destinations.map(destination => (
            <div key={destination._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 relative">
                <FallbackImage 
                  src={destination.image} 
                  alt={destination.name}
                  category={destination.category}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2 bg-white rounded-full p-1">
                  {destination.featured && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Featured</span>
                  )}
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{destination.name}</h3>
                    <p className="text-gray-600 text-sm">{destination.country}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${destination.price.toLocaleString()}</p>
                    <p className="text-gray-500 text-sm">{destination.rating}/5 stars</p>
                  </div>
                </div>
                
                <p className="text-gray-700 mt-2 text-sm line-clamp-2">{destination.description}</p>
                
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {destination.category}
                    </span>
                    {destination.bookings !== undefined && (
                      <span className="ml-2 text-gray-500 text-xs">
                        {destination.bookings} bookings
                      </span>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEditClick(destination)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteDestination(destination._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Add Destination Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Add New Destination</h2>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleAddSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">Name</label>
                    <input 
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">Country</label>
                    <input 
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-1">Description</label>
                  <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    required
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">Price ($)</label>
                    <input 
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">Rating (0-5)</label>
                    <input 
                      type="number"
                      name="rating"
                      value={formData.rating}
                      onChange={handleInputChange}
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      max="5"
                      step="0.1"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">Category</label>
                    <select 
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="tour">Tour</option>
                      <option value="flight">Flight</option>
                      <option value="hotel">Hotel</option>
                    </select>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center">
                    <input 
                      type="checkbox"
                      id="featured"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="featured" className="ml-2 block text-gray-700">
                      Featured Destination
                    </label>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-medium mb-1">Image</label>
                  <div className="mt-1 flex items-center">
                    <input
                      type="file"
                      name="image"
                      onChange={handleImageChange}
                      accept="image/*"
                      className="flex-1"
                      required
                    />
                  </div>
                  
                  {imagePreview && (
                    <div className="mt-2">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="h-24 w-auto object-cover rounded-md"
                      />
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button 
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    disabled={loading}
                  >
                    {loading ? 'Adding...' : 'Add Destination'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Destination Modal */}
      {showEditModal && currentDestination && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Edit Destination</h2>
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleEditSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">Name</label>
                    <input 
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">Country</label>
                    <input 
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-1">Description</label>
                  <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    required
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">Price ($)</label>
                    <input 
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">Rating (0-5)</label>
                    <input 
                      type="number"
                      name="rating"
                      value={formData.rating}
                      onChange={handleInputChange}
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      max="5"
                      step="0.1"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">Category</label>
                    <select 
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="tour">Tour</option>
                      <option value="flight">Flight</option>
                      <option value="hotel">Hotel</option>
                    </select>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center">
                    <input 
                      type="checkbox"
                      id="featured"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="featured" className="ml-2 block text-gray-700">
                      Featured Destination
                    </label>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-medium mb-1">Image</label>
                  <div className="mt-1 flex items-center">
                    <input
                      type="file"
                      name="image"
                      onChange={handleImageChange}
                      accept="image/*"
                      className="flex-1"
                    />
                  </div>
                  
                  {imagePreview && (
                    <div className="mt-2">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="h-24 w-auto object-cover rounded-md"
                      />
                    </div>
                  )}
                  
                  <p className="text-sm text-gray-500 mt-1">
                    Leave empty to keep the current image
                  </p>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button 
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
} 
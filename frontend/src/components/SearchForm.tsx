'use client';

import React, { useState, ChangeEvent, FormEvent, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { africanCities, popularDestinations } from '@/lib/locationData';

type TabType = 'flights' | 'hotels' | 'tours';

const SearchForm = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('flights');
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [travelers, setTravelers] = useState('1 Adult');
  
  // Autocomplete states
  const [showDepartureSuggestions, setShowDepartureSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  const [filteredDepartures, setFilteredDepartures] = useState<string[]>([]);
  const [filteredDestinations, setFilteredDestinations] = useState<{name: string, country: string}[]>([]);
  
  // Refs for clicking outside detection
  const departureRef = useRef<HTMLDivElement>(null);
  const destinationRef = useRef<HTMLDivElement>(null);
  
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };
  
  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // In a real application, you would navigate to search results page with query params
    router.push(`/search?type=${activeTab}&from=${departure}&to=${destination}&date=${travelDate}&travelers=${travelers}`);
  };
  
  // Filter departure suggestions based on input
  const handleDepartureChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDeparture(value);
    
    if (value.length > 0) {
      const filtered = africanCities.filter(city => 
        city.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5);
      setFilteredDepartures(filtered);
      setShowDepartureSuggestions(true);
    } else {
      setShowDepartureSuggestions(false);
    }
  };
  
  // Filter destination suggestions based on input
  const handleDestinationChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDestination(value);
    
    if (value.length > 0) {
      const filtered = popularDestinations
        .filter(dest => 
          dest.name.toLowerCase().includes(value.toLowerCase()) || 
          dest.country.toLowerCase().includes(value.toLowerCase())
        )
        .map(dest => ({ name: dest.name, country: dest.country }))
        .slice(0, 5);
      setFilteredDestinations(filtered);
      setShowDestinationSuggestions(true);
    } else {
      setShowDestinationSuggestions(false);
    }
  };
  
  // Click outside handler to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (departureRef.current && !departureRef.current.contains(event.target as Node)) {
        setShowDepartureSuggestions(false);
      }
      if (destinationRef.current && !destinationRef.current.contains(event.target as Node)) {
        setShowDestinationSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Search Tabs */}
        <div className="flex border-b">
          <button 
            className={`flex-1 px-6 py-3 text-sm font-medium text-center ${activeTab === 'flights' ? 'border-b-2 border-blue-500 text-blue-500 bg-white/80' : 'text-gray-500 hover:text-blue-500'}`}
            onClick={() => handleTabChange('flights')}
            type="button"
          >
            FLIGHTS
          </button>
          <button 
            className={`flex-1 px-6 py-3 text-sm font-medium text-center ${activeTab === 'hotels' ? 'border-b-2 border-blue-500 text-blue-500 bg-white/80' : 'text-gray-500 hover:text-blue-500'}`}
            onClick={() => handleTabChange('hotels')}
            type="button"
          >
            HOTELS
          </button>
          <button 
            className={`flex-1 px-6 py-3 text-sm font-medium text-center ${activeTab === 'tours' ? 'border-b-2 border-blue-500 text-blue-500 bg-white/80' : 'text-gray-500 hover:text-blue-500'}`}
            onClick={() => handleTabChange('tours')}
            type="button"
          >
            TOURS
          </button>
        </div>

        {/* Search Fields */}
        <form onSubmit={handleSearch}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-gray-200 p-px">
            {/* From Field with Autocomplete */}
            <div ref={departureRef} className="bg-white p-4 relative">
              <div className="text-xs text-gray-500 mb-1">From</div>
              <input 
                type="text" 
                placeholder="African City" 
                className="w-full border-none p-0 focus:ring-0 text-sm"
                value={departure}
                onChange={handleDepartureChange}
                onFocus={() => setShowDepartureSuggestions(departure.length > 0)}
                required
              />
              
              {/* Departure Suggestions */}
              {showDepartureSuggestions && filteredDepartures.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                  {filteredDepartures.map((city, index) => (
                    <div 
                      key={index} 
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => {
                        setDeparture(city);
                        setShowDepartureSuggestions(false);
                      }}
                    >
                      {city}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* To Field with Autocomplete */}
            <div ref={destinationRef} className="bg-white p-4 relative">
              <div className="text-xs text-gray-500 mb-1">To</div>
              <input 
                type="text" 
                placeholder="Popular Destination" 
                className="w-full border-none p-0 focus:ring-0 text-sm"
                value={destination}
                onChange={handleDestinationChange}
                onFocus={() => setShowDestinationSuggestions(destination.length > 0)}
                required
              />
              
              {/* Destination Suggestions */}
              {showDestinationSuggestions && filteredDestinations.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                  {filteredDestinations.map((dest, index) => (
                    <div 
                      key={index} 
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => {
                        setDestination(dest.name);
                        setShowDestinationSuggestions(false);
                      }}
                    >
                      <div>{dest.name}</div>
                      <div className="text-xs text-gray-500">{dest.country}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="bg-white p-4">
              <div className="text-xs text-gray-500 mb-1">Travel Date</div>
              <input 
                type="date" 
                className="w-full border-none p-0 focus:ring-0 text-sm text-gray-700"
                value={travelDate}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setTravelDate(e.target.value)}
                required
              />
            </div>
            <div className="bg-white p-4">
              <div className="text-xs text-gray-500 mb-1">Travelers</div>
              <select 
                className="w-full border-none p-0 focus:ring-0 text-sm text-gray-700 bg-transparent"
                value={travelers}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setTravelers(e.target.value)}
              >
                <option>1 Adult</option>
                <option>2 Adults</option>
                <option>3 Adults</option>
                <option>4+ Adults</option>
              </select>
            </div>
          </div>

          {/* Search Button */}
          <div className="p-4 bg-white">
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors text-sm font-medium">
              Search Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchForm; 
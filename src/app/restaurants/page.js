'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaSearch, FaMapMarkerAlt, FaUtensils, FaStar, FaArrowRight, FaFilter } from 'react-icons/fa';
import Link from 'next/link';
import apiClient from '../../lib/api';

// Metadata for SEO (handled in layout or server component if converting)
// For client component, we rely on parent layout metadata

export default function RestaurantsDirectory() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || 'all');
  const [cities, setCities] = useState(['Bangalore', 'Mumbai', 'Delhi', 'Pune', 'Hyderabad', 'Chennai']); // Default major cities

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const filters = {};
        if (selectedCity !== 'all') filters.city = selectedCity;
        if (searchTerm) filters.search = searchTerm;

        const response = await apiClient.getPublicRestaurants(filters);
        
        if (response.success) {
          setRestaurants(response.restaurants);
          
          // Extract unique cities from data to update filter list dynamically
          const dataCities = [...new Set(response.restaurants.map(r => r.city).filter(Boolean))];
          if (dataCities.length > 0) {
            setCities(prev => [...new Set([...prev, ...dataCities])]);
          }
        }
      } catch (error) {
        console.error('Failed to load directory:', error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timer = setTimeout(() => {
      fetchRestaurants();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedCity]);

  const handleCityChange = (city) => {
    setSelectedCity(city);
    // Update URL without refresh
    const params = new URLSearchParams(searchParams);
    if (city === 'all') params.delete('city');
    else params.set('city', city);
    router.replace(`/restaurants?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Discover the Best Restaurants</h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Explore curated menus, authentic flavors, and seamless digital ordering experiences.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-3xl mx-auto bg-white rounded-full p-2 flex flex-col md:flex-row items-center gap-2 shadow-xl">
            <div className="flex-1 flex items-center px-4 w-full h-12 md:h-auto border-b md:border-b-0 border-gray-200">
              <FaSearch className="text-gray-400 mr-3" />
              <input
                type="text"
                placeholder="Search for restaurants, cuisines..."
                className="w-full text-gray-800 outline-none bg-transparent placeholder-gray-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="h-8 w-[1px] bg-gray-300 hidden md:block"></div>
            <div className="w-full md:w-48 px-4 h-12 md:h-auto flex items-center border-b md:border-b-0 border-gray-200">
              <FaMapMarkerAlt className="text-red-500 mr-2" />
              <select 
                className="w-full bg-transparent text-gray-800 outline-none cursor-pointer"
                value={selectedCity}
                onChange={(e) => handleCityChange(e.target.value)}
              >
                <option value="all">All Cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            <button className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-bold transition-colors">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Directory Grid */}
      <div className="max-w-7xl mx-auto py-16 px-4">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            {selectedCity === 'all' ? 'Popular Restaurants' : `Restaurants in ${selectedCity}`}
          </h2>
          <div className="hidden md:flex gap-2">
            {cities.slice(0, 4).map(city => (
              <button
                key={city}
                onClick={() => handleCityChange(city)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCity === city 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm h-80 animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : restaurants.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
            <FaUtensils className="mx-auto text-4xl text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-900">No restaurants found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search or city filter.</p>
            <button 
              onClick={() => { setSearchTerm(''); handleCityChange('all'); }}
              className="mt-6 text-red-600 font-semibold hover:text-red-700"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {restaurants.map((restaurant) => (
              <Link 
                href={`/placeorder?restaurant=${restaurant.id}`} 
                key={restaurant.id}
                className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
              >
                {/* Card Image */}
                <div className="h-48 bg-gray-200 relative overflow-hidden">
                  <img 
                    src={restaurant.menuTheme?.headerImage || restaurant.logo || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop"} 
                    alt={restaurant.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold text-gray-900 shadow-sm flex items-center gap-1">
                    <FaStar className="text-yellow-400" />
                    <span>4.5</span>
                  </div>
                  {restaurant.city && (
                    <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white flex items-center gap-1">
                      <FaMapMarkerAlt size={10} />
                      {restaurant.city}
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 truncate group-hover:text-red-600 transition-colors">
                    {restaurant.name}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-4 h-10">
                    {restaurant.description || 'Experience authentic flavors and unforgettable dining moments.'}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {(Array.isArray(restaurant.cuisine) ? restaurant.cuisine : []).slice(0, 3).map((tag, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium">
                        {tag}
                      </span>
                    ))}
                    {(!restaurant.cuisine || (Array.isArray(restaurant.cuisine) && restaurant.cuisine.length === 0)) && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium">Multi-cuisine</span>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-sm font-semibold text-gray-400">View Menu</span>
                    <div className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
                      <FaArrowRight size={12} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* SEO Footer Section */}
      <div className="bg-white border-t border-gray-200 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Popular Cuisines</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-red-600">North Indian</a></li>
              <li><a href="#" className="hover:text-red-600">Chinese</a></li>
              <li><a href="#" className="hover:text-red-600">Italian</a></li>
              <li><a href="#" className="hover:text-red-600">South Indian</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Top Cities</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-red-600">Bangalore</a></li>
              <li><a href="#" className="hover:text-red-600">Mumbai</a></li>
              <li><a href="#" className="hover:text-red-600">Delhi</a></li>
              <li><a href="#" className="hover:text-red-600">Pune</a></li>
            </ul>
          </div>
          <div className="col-span-2">
            <h4 className="font-bold text-gray-900 mb-4">About DineOpen</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              DineOpen is the smartest way to discover restaurants and view digital menus. 
              Find the best places to eat near you, browse authentic menus with prices, and 
              enjoy a seamless dining experience powered by our advanced restaurant technology.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


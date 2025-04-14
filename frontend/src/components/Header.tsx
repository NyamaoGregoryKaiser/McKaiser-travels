'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuthStore();
  const router = useRouter();
  
  const isActive = (path: string) => {
    return pathname === path ? 'text-blue-500' : 'text-gray-700 hover:text-blue-500';
  };
  
  const isAdmin = user && user.role === 'admin';
  
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container-custom flex justify-between items-center py-4">
        {/* Logo */}
        <Link href="/">
          <span className="text-2xl font-bold text-blue-600">McKaiser Travels</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8">
          <Link href="/" className={`font-medium ${isActive('/')}`}>
            Home
          </Link>
          <Link href="/destinations" className={`font-medium ${isActive('/destinations')}`}>
            Destinations
          </Link>
          <Link href="/tours" className={`font-medium ${isActive('/tours')}`}>
            Tours
          </Link>
          <Link href="/about" className={`font-medium ${isActive('/about')}`}>
            About
          </Link>
          <Link href="/contact" className={`font-medium ${isActive('/contact')}`}>
            Contact
          </Link>
        </nav>
        
        {/* Auth Buttons */}
        <div className="hidden md:flex gap-4">
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <button 
                  onClick={() => router.push('/admin')}
                  className="flex items-center gap-1 text-purple-600 border border-purple-200 bg-purple-50 px-3 py-1 rounded-full text-sm font-medium hover:bg-purple-100 transition-colors"
                >
                  <span>Admin Dashboard</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
              <button
                onClick={() => router.push('/dashboard')}
                className="btn-outline py-2"
              >
                Dashboard
              </button>
              <button 
                onClick={logout} 
                className="text-gray-700 hover:text-blue-500 font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-700 hover:text-blue-500 font-medium">
                Login
              </Link>
              <Link href="/register" className="btn-primary">
                Register
              </Link>
            </>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container-custom py-4 flex flex-col gap-4">
            <Link href="/" className={`font-medium ${isActive('/')}`}>
              Home
            </Link>
            <Link href="/destinations" className={`font-medium ${isActive('/destinations')}`}>
              Destinations
            </Link>
            <Link href="/tours" className={`font-medium ${isActive('/tours')}`}>
              Tours
            </Link>
            <Link href="/about" className={`font-medium ${isActive('/about')}`}>
              About
            </Link>
            <Link href="/contact" className={`font-medium ${isActive('/contact')}`}>
              Contact
            </Link>
            
            <div className="flex gap-4 pt-4 border-t">
              {isAuthenticated ? (
                <>
                  {isAdmin && (
                    <button 
                      onClick={() => router.push('/admin')}
                      className="flex items-center gap-1 text-purple-600 border border-purple-200 bg-purple-50 px-3 py-1 rounded-full text-sm font-medium hover:bg-purple-100 transition-colors"
                    >
                      <span>Admin Dashboard</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="btn-outline py-2"
                  >
                    Dashboard
                  </button>
                  <button 
                    onClick={logout} 
                    className="text-gray-700 hover:text-blue-500 font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-gray-700 hover:text-blue-500 font-medium">
                    Login
                  </Link>
                  <Link href="/register" className="btn-primary">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 
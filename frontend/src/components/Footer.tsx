'use client';

import React from 'react';
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">McKaiser Travels</h3>
            <p className="text-gray-400">Your trusted partner in travel and adventure.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white">Home</Link></li>
              <li><Link href="/destinations" className="text-gray-400 hover:text-white">Destinations</Link></li>
              <li><Link href="/tours" className="text-gray-400 hover:text-white">Tours</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact Us</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-white">FAQs</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-white">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Westlands, Nairobi</li>
              <li>P.O. Box 12345-00100</li>
              <li>Email: info@mckaiser.co.ke</li>
              <li>Phone: +254 700 123 456</li>
              <li>Developer: Nyamao Kaiser</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>© {currentYear} McKaiser Travels. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
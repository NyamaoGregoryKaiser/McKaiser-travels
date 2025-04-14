'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuthStore } from '@/lib/store';
import { bookingService, paymentService } from '@/lib/api';
import { v4 as uuidv4 } from 'uuid';

export default function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuthStore();
  
  // Get the tour name from the query parameter
  const tourName = searchParams.get('name') || 'Tour Package';
  
  // Form state
  const [travelDate, setTravelDate] = useState('');
  const [numberOfTravelers, setNumberOfTravelers] = useState(1);
  const [departureLocation, setDepartureLocation] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  // Payment transaction state
  const [transactionStatus, setTransactionStatus] = useState<'initial' | 'processing' | 'checking' | 'success' | 'failed'>('initial');
  const [checkoutRequestID, setCheckoutRequestID] = useState<string | null>(null);
  const [paymentStatusMessage, setPaymentStatusMessage] = useState('');
  
  // Calculate tomorrow's date for min date on calendar
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowFormatted = tomorrow.toISOString().split('T')[0];
  
  // Handle booking submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      // If not logged in, redirect to login
      router.push('/login?redirect=/booking&name=' + encodeURIComponent(tourName));
      return;
    }
    
    if (paymentMethod === 'mpesa' && (!phoneNumber || !phoneNumber.match(/^\d{9,12}$/))) {
      setError('Please enter a valid M-Pesa phone number');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // Generate a unique booking reference
      const bookingRef = uuidv4().substring(0, 8);
      
      // Calculate price (in a real app, this would come from the API)
      const pricePerPerson = 2500; // Example price
      const totalAmount = numberOfTravelers * pricePerPerson;
      
      if (paymentMethod === 'mpesa') {
        setTransactionStatus('processing');
        setPaymentStatusMessage('Initiating M-Pesa payment...');
        
        // Initiate M-Pesa STK Push
        const mpesaResponse = await paymentService.initiateSTKPush({
          phoneNumber,
          amount: totalAmount,
          bookingRef
        });
        
        if (mpesaResponse.success) {
          // Store checkout request ID for status checking
          setCheckoutRequestID(mpesaResponse.data.checkoutRequestID);
          setPaymentStatusMessage('M-Pesa payment initiated. Please check your phone to complete the transaction.');
          setTransactionStatus('checking');
          
          // Start polling for transaction status
          await checkPaymentStatus(mpesaResponse.data.checkoutRequestID, bookingRef);
        } else {
          throw new Error(mpesaResponse.message || 'Failed to initiate M-Pesa payment');
        }
      } else {
        // Handle other payment methods here
        throw new Error('Only M-Pesa payments are currently supported');
      }
      
    } catch (err) {
      console.error('Error processing payment:', err);
      setError('Failed to process payment. Please try again later.');
      setTransactionStatus('failed');
      setPaymentStatusMessage('Payment failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Check payment status with polling
  const checkPaymentStatus = async (requestId: string, bookingRef: string) => {
    try {
      let attempts = 0;
      const maxAttempts = 10;
      const pollingInterval = 3000; // 3 seconds
      
      const checkStatus = async () => {
        if (attempts >= maxAttempts) {
          throw new Error('Payment confirmation timed out');
        }
        
        attempts++;
        
        // Check transaction status
        const statusResponse = await paymentService.checkTransactionStatus(requestId);
        
        if (statusResponse.success) {
          const result = statusResponse.data;
          
          if (result.ResultCode === '0') {
            // Payment successful
            setTransactionStatus('success');
            setPaymentStatusMessage('Payment successful! Completing your booking...');
            
            // Create booking in the database
            await createBookingAfterPayment(bookingRef);
            
            // Redirect to success page or dashboard
            setTimeout(() => {
              router.push('/dashboard?bookingSuccess=true');
            }, 2000);
            
            return;
          } else if (result.ResultCode === '1032') { // Cancelled by user
            throw new Error('Payment was cancelled');
          } else if (result.ResultCode === '1037') { // Timeout
            throw new Error('Payment request timed out');
          } else if (attempts < maxAttempts) {
            // Still processing, continue polling
            setPaymentStatusMessage(`Waiting for payment confirmation... (${attempts}/${maxAttempts})`);
            setTimeout(checkStatus, pollingInterval);
          } else {
            throw new Error('Payment confirmation timed out');
          }
        } else {
          if (attempts < maxAttempts) {
            // Still processing, continue polling
            setTimeout(checkStatus, pollingInterval);
          } else {
            throw new Error('Failed to check payment status');
          }
        }
      };
      
      // Start the polling process
      await checkStatus();
      
    } catch (err: any) {
      console.error('Error checking payment status:', err);
      setTransactionStatus('failed');
      setPaymentStatusMessage(`Payment failed: ${err.message}`);
      setError(`Payment failed: ${err.message}`);
    }
  };
  
  // Create the booking after successful payment
  const createBookingAfterPayment = async (bookingRef: string) => {
    try {
      const bookingData = {
        destinationId: 'placeholder-id', // This would come from the API in a real app
        travelDate,
        numberOfTravelers,
        departureLocation,
        specialRequests,
        paymentMethod,
        paymentDetails: {
          phoneNumber,
          transactionId: bookingRef,
          status: 'completed'
        }
      };
      
      await bookingService.createBooking(bookingData);
    } catch (err) {
      console.error('Error creating booking after payment:', err);
      // Even if booking creation fails, payment was successful
      // You would implement a retry mechanism in a real application
    }
  };
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      console.log('User not authenticated, redirecting to login page');
    }
  }, [isAuthenticated]);
  
  // Render different UI based on transaction status
  if (transactionStatus === 'processing' || transactionStatus === 'checking') {
    return (
      <div className="font-sans text-gray-800 min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow py-12 bg-gray-50">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                  {transactionStatus === 'processing' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <h2 className="text-2xl font-bold mb-2">M-Pesa Payment {transactionStatus === 'processing' ? 'Initiated' : 'Processing'}</h2>
                <p className="text-gray-600 mb-8">{paymentStatusMessage}</p>
                <div className="spinner mx-auto"></div>
                
                {transactionStatus === 'checking' && (
                  <div className="mt-8 text-sm text-gray-500">
                    <p>Please check your phone and enter your M-Pesa PIN to complete the payment.</p>
                    <p className="mt-2">Do not close this page until the transaction is complete.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }
  
  if (transactionStatus === 'success') {
    return (
      <div className="font-sans text-gray-800 min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow py-12 bg-gray-50">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
                <p className="text-gray-600 mb-8">{paymentStatusMessage}</p>
                <div className="spinner mx-auto"></div>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="font-sans text-gray-800 min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[30vh] bg-cover bg-center" style={{ backgroundImage: "url('/images/about.png')" }}>
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 font-serif">Book Your Adventure</h1>
            <p className="text-xl text-white italic">{tourName}</p>
          </div>
        </div>
      </section>
      
      <main className="flex-grow py-12 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-6">Booking Details</h2>
              
              {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="travelDate">
                      Travel Date
                    </label>
                    <input
                      type="date"
                      id="travelDate"
                      min={tomorrowFormatted}
                      className="form-input"
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="numberOfTravelers">
                      Number of Travelers
                    </label>
                    <select
                      id="numberOfTravelers"
                      className="form-input"
                      value={numberOfTravelers}
                      onChange={(e) => setNumberOfTravelers(Number(e.target.value))}
                      required
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'Traveler' : 'Travelers'}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="departureLocation">
                      Departure Location
                    </label>
                    <input
                      type="text"
                      id="departureLocation"
                      placeholder="City of departure"
                      className="form-input"
                      value={departureLocation}
                      onChange={(e) => setDepartureLocation(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="specialRequests">
                      Special Requests (Optional)
                    </label>
                    <textarea
                      id="specialRequests"
                      rows={4}
                      placeholder="Any special requirements or requests"
                      className="form-input"
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                    ></textarea>
                  </div>
                  
                  {/* Payment Info */}
                  <div className="bg-blue-50 p-4 rounded-md mb-4">
                    <h3 className="font-medium text-blue-800 mb-2">Price Information</h3>
                    <div className="flex justify-between border-b pb-2 mb-2">
                      <span>Price per person:</span>
                      <span className="font-medium">KES 2,500</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Total:</span>
                      <span className="font-bold">KES {(numberOfTravelers * 2500).toLocaleString()}</span>
                    </div>
                  </div>
                  
                  {/* Payment Method Section */}
                  <div className="pt-6 border-t border-gray-200 mt-6">
                    <h3 className="text-xl font-bold mb-4">Payment Method</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="mpesa"
                          name="paymentMethod"
                          value="mpesa"
                          checked={paymentMethod === 'mpesa'}
                          onChange={() => setPaymentMethod('mpesa')}
                          className="h-5 w-5 text-blue-600"
                        />
                        <label htmlFor="mpesa" className="ml-3 block text-gray-700">
                          <div className="flex items-center">
                            <span className="font-medium">M-Pesa</span>
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded ml-2">Recommended</span>
                          </div>
                          <span className="text-gray-500 text-sm">Fast and secure mobile money payments</span>
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="card"
                          name="paymentMethod"
                          value="card"
                          checked={paymentMethod === 'card'}
                          onChange={() => setPaymentMethod('card')}
                          className="h-5 w-5 text-blue-600"
                        />
                        <label htmlFor="card" className="ml-3 block text-gray-700">
                          <span className="font-medium">Credit/Debit Card</span>
                          <span className="text-gray-500 text-sm block">Pay with Visa, Mastercard, or other cards</span>
                        </label>
                      </div>
                    </div>
                    
                    {/* M-Pesa Payment Details */}
                    {paymentMethod === 'mpesa' && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-md">
                        <div className="mb-4">
                          <label className="block text-gray-700 font-medium mb-2" htmlFor="phoneNumber">
                            M-Pesa Phone Number
                          </label>
                          <input
                            type="text"
                            id="phoneNumber"
                            placeholder="e.g., 254712345678"
                            className="form-input"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                          />
                          <p className="text-sm text-gray-500 mt-1">Enter the phone number registered with M-Pesa</p>
                        </div>
                        
                        <div className="text-sm text-gray-600 bg-white p-3 rounded border border-gray-200">
                          <h4 className="font-medium mb-2">How M-Pesa payment works:</h4>
                          <ol className="list-decimal pl-5 space-y-1">
                            <li>Enter your M-Pesa registered phone number</li>
                            <li>You'll receive an STK push notification on your phone</li>
                            <li>Enter your M-Pesa PIN to authorize the payment</li>
                            <li>Wait for confirmation (typically takes 15-30 seconds)</li>
                          </ol>
                        </div>
                      </div>
                    )}
                    
                    {/* Credit Card Payment Details - Just a placeholder, not implemented */}
                    {paymentMethod === 'card' && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-md">
                        <p className="text-amber-600">Credit card payments are currently under maintenance. Please use M-Pesa for now.</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="btn-primary w-full py-3 text-lg font-medium"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Processing Payment...' : `Pay & Complete Booking`}
                    </button>
                  </div>
                </div>
              </form>
              
              <div className="mt-8 text-center text-sm text-gray-500">
                <p>By completing this booking you agree to our <a href="#" className="text-blue-600 hover:underline">Terms and Conditions</a>.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 
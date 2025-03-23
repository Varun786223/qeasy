import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { QrReader } from 'react-qr-reader';

const Join = () => {
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState('');
  const [restaurantId, setRestaurantId] = useState('');
  const navigate = useNavigate();

  const handleScan = (result) => {
    if (result) {
      try {
        // Extract restaurant ID from QR code URL
        // Expected format: https://qeasy-demo.web.app/menu/RESTAURANT_ID
        const url = result?.text;
        
        if (url && url.includes('/menu/')) {
          const id = url.split('/menu/')[1];
          navigate(`/menu/${id}`);
        } else {
          setScanError('Invalid QR code. Please try again.');
        }
      } catch (err) {
        console.error('Error processing QR code:', err);
        setScanError('Could not process QR code. Please try again.');
      }
    }
  };

  const handleError = (err) => {
    console.error('QR Scanner error:', err);
    setScanError('Error accessing camera. Please check permissions and try again.');
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (restaurantId.trim()) {
      navigate(`/menu/${restaurantId}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-3xl font-bold text-blue-500 mb-4">Join a Restaurant</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Scan a QR code or enter a restaurant ID to view the menu and place orders.
            </p>
          </div>
          
          {/* QR Scanner Section */}
          <div className="flex flex-col md:flex-row gap-12 mb-16">
            <div className="md:w-1/2">
              <h2 className="text-2xl font-bold mb-6">Scan QR Code</h2>
              
              {scanning ? (
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <QrReader
                    constraints={{ facingMode: 'environment' }}
                    onResult={handleScan}
                    onError={handleError}
                    className="w-full max-w-sm mx-auto"
                    scanDelay={500}
                  />
                  {scanError && (
                    <div className="mt-4 text-red-500">{scanError}</div>
                  )}
                  <button
                    onClick={() => setScanning(false)}
                    className="mt-4 w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition duration-300"
                  >
                    Cancel Scanning
                  </button>
                </div>
              ) : (
                <div className="bg-white p-8 rounded-lg shadow-md">
                  <div className="flex justify-center items-center h-48 bg-gray-100 rounded-lg mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <button 
                    onClick={() => {
                      setScanning(true);
                      setScanError('');
                    }}
                    className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 transition duration-300"
                  >
                    Start Scanning
                  </button>
                </div>
              )}
            </div>
            
            <div className="md:w-1/2">
              <h2 className="text-2xl font-bold mb-6">Enter Restaurant ID</h2>
              <div className="bg-white p-8 rounded-lg shadow-md">
                <p className="text-gray-600 mb-6">
                  If you know the restaurant's ID, you can enter it directly below.
                </p>
                <form onSubmit={handleManualSubmit}>
                  <div className="mb-4">
                    <label htmlFor="restaurantId" className="block text-sm font-medium text-gray-700 mb-1">
                      Restaurant ID
                    </label>
                    <input
                      type="text"
                      id="restaurantId"
                      value={restaurantId}
                      onChange={(e) => setRestaurantId(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter restaurant ID"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 transition duration-300"
                    disabled={!restaurantId.trim()}
                  >
                    Go to Menu
                  </button>
                </form>
                
                <div className="mt-6">
                  <p className="text-sm text-gray-500">
                    For demo purposes, try using "demo" as the restaurant ID.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* How It Works Section */}
          <div className="bg-gray-50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-8 text-center">How It Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center">
                <div className="bg-blue-100 rounded-full p-4 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-2">1. Scan QR Code</h3>
                <p className="text-gray-600 text-center">
                  Scan the QR code displayed at the restaurant table or entrance.
                </p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="bg-blue-100 rounded-full p-4 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-2">2. Browse Menu</h3>
                <p className="text-gray-600 text-center">
                  View the digital menu with personalized recommendations and filter by categories.
                </p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="bg-blue-100 rounded-full p-4 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-2">3. Place Order</h3>
                <p className="text-gray-600 text-center">
                  Add items to your cart and place your order directly from your device.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Join; 
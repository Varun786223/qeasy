import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-16 px-4">
        <div className="max-w-2xl w-full text-center">
          <h1 className="text-9xl font-bold text-blue-500 mb-4">404</h1>
          <h2 className="text-3xl font-semibold mb-6">Page Not Found</h2>
          <p className="text-xl text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              to="/" 
              className="bg-blue-500 text-white hover:bg-blue-600 font-medium px-6 py-3 rounded-lg text-center transition duration-300"
            >
              Back to Home
            </Link>
            <Link 
              to="/join" 
              className="border border-blue-500 text-blue-500 hover:bg-blue-50 font-medium px-6 py-3 rounded-lg text-center transition duration-300"
            >
              Scan QR Code
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound; 
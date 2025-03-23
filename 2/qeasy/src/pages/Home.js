import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                  Simplify Dining With QR Menu
                </h1>
                <p className="text-xl mb-8 text-blue-100">
                  QEasy helps restaurants create digital menus accessible via QR codes, 
                  improving customer experience and streamlining operations.
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link 
                    to="/join" 
                    className="bg-white text-blue-600 hover:bg-blue-50 font-medium px-6 py-3 rounded-lg text-center transition duration-300"
                  >
                    Get Started
                  </Link>
                  <Link 
                    to="/demo" 
                    className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 font-medium px-6 py-3 rounded-lg text-center transition duration-300"
                  >
                    Request Demo
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <img 
                  src="/images/hero-illustration.svg" 
                  alt="QR Menu Illustration" 
                  className="max-w-full md:max-w-lg"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/500x400?text=QEasy+QR+Menu";
                  }}
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Why Choose QEasy?</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our digital menu solution offers numerous benefits for both restaurant owners and customers.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Save Time</h3>
                <p className="text-gray-600">
                  Reduce wait times and improve table turnover with quick, contactless ordering directly from customer phones.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Increase Sales</h3>
                <p className="text-gray-600">
                  Intelligent recommendations based on time of day and popular items help increase average order value.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Enhanced Safety</h3>
                <p className="text-gray-600">
                  Provide a contactless ordering experience that prioritizes health and safety for both customers and staff.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                QEasy makes the transition to digital menus simple and straightforward.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6">1</div>
                  <div className="hidden md:block absolute top-8 left-16 w-full h-1 bg-blue-200"></div>
                </div>
                <h3 className="text-xl font-bold mb-3">Create Account</h3>
                <p className="text-gray-600">
                  Sign up for QEasy and upload your menu items, categorize them, and set prices.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6">2</div>
                  <div className="hidden md:block absolute top-8 left-16 w-full h-1 bg-blue-200"></div>
                </div>
                <h3 className="text-xl font-bold mb-3">Generate QR Codes</h3>
                <p className="text-gray-600">
                  QEasy generates unique QR codes for your restaurant that you can print and place on tables.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div>
                  <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6">3</div>
                </div>
                <h3 className="text-xl font-bold mb-3">Customers Order</h3>
                <p className="text-gray-600">
                  Customers scan the QR code, browse your menu, and place orders directly from their phones.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Join hundreds of satisfied restaurant owners who've improved their business with QEasy.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xl">
                    JC
                  </div>
                  <div className="ml-4">
                    <h3 className="font-bold">Jane Cooper</h3>
                    <p className="text-gray-500 text-sm">Café Sunshine</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "QEasy has transformed our small café. Our customers love the convenience, and we've seen a 20% increase in orders since implementation."
                </p>
                <div className="flex mt-4 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xl">
                    MT
                  </div>
                  <div className="ml-4">
                    <h3 className="font-bold">Mike Thompson</h3>
                    <p className="text-gray-500 text-sm">Urban Grill</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "The personalized recommendations feature has been a game-changer. Our customers often discover new menu items they wouldn't have tried otherwise."
                </p>
                <div className="flex mt-4 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xl">
                    AL
                  </div>
                  <div className="ml-4">
                    <h3 className="font-bold">Anna Lee</h3>
                    <p className="text-gray-500 text-sm">Fusion Kitchen</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "QEasy has completely streamlined our ordering process. We've reduced wait times and our staff can focus more on providing great service."
                </p>
                <div className="flex mt-4 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Restaurant?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join hundreds of restaurants already using QEasy to streamline operations and enhance customer experience.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link 
                to="/join" 
                className="bg-white text-blue-600 hover:bg-blue-50 font-medium px-8 py-4 rounded-lg text-center transition duration-300"
              >
                Get Started For Free
              </Link>
              <Link 
                to="/pricing" 
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 font-medium px-8 py-4 rounded-lg text-center transition duration-300"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home; 
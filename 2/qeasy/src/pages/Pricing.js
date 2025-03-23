import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PricingCard = ({ title, price, features, buttonText, isPopular, buttonLink }) => {
  return (
    <div className={`bg-white p-8 rounded-lg shadow-md flex flex-col relative ${isPopular ? 'border-2 border-blue-500' : ''}`}>
      {isPopular && (
        <span className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 text-sm font-bold uppercase transform translate-y-[-50%] rounded-full">
          Popular
        </span>
      )}
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <div className="mb-6">
        <span className="text-3xl font-bold">${price}</span>
        <span className="text-gray-600">/month</span>
      </div>
      <ul className="mb-8 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start mb-3">
            <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>
      <Link 
        to={buttonLink} 
        className={`text-center py-3 rounded-md ${
          isPopular 
            ? 'bg-blue-500 text-white hover:bg-blue-600' 
            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
        } transition duration-300`}
      >
        {buttonText}
      </Link>
    </div>
  );
};

const Pricing = () => {
  const plans = [
    {
      title: 'Free',
      price: '0',
      features: [
        'Basic QR menu',
        'Up to 20 menu items',
        'Email support',
        '30-day trial'
      ],
      buttonText: 'Start',
      buttonLink: '/signup',
      isPopular: false
    },
    {
      title: 'Basic',
      price: '15',
      features: [
        'All Free features',
        'Unlimited menu items',
        'Personalized recommendations',
        'Priority support',
        'Menu analytics'
      ],
      buttonText: 'Sign Up',
      buttonLink: '/signup',
      isPopular: true
    },
    {
      title: 'Pro',
      price: '30',
      features: [
        'All Basic features',
        'POS integration',
        'Advanced analytics',
        'Multiple restaurants',
        'Custom branding',
        '24/7 support'
      ],
      buttonText: 'Sign Up',
      buttonLink: '/signup',
      isPopular: false
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-3xl font-bold text-blue-500 mb-4">QEasy Plans</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the plan that works best for your restaurant.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <PricingCard key={index} {...plan} />
            ))}
          </div>
          
          <div className="mt-16 bg-white p-8 rounded-lg shadow-md max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Can I cancel my subscription?</h3>
                <p className="text-gray-600">Yes, you can cancel your subscription at any time. There are no long-term contracts or cancellation fees.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">Do you offer custom plans for larger restaurants?</h3>
                <p className="text-gray-600">Absolutely! Contact our sales team for custom enterprise solutions tailored to your specific needs.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">How does the POS integration work?</h3>
                <p className="text-gray-600">Our system integrates with popular POS solutions. Orders placed through QEasy are automatically synced to your existing system.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">Is there a setup fee?</h3>
                <p className="text-gray-600">No, there are no setup fees. The monthly subscription covers all services outlined in your chosen plan.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Pricing; 
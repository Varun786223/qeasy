import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const OrderConfirmation = () => {
  const location = useLocation();
  const orderData = location.state || {
    orderNumber: 'N/A',
    tableInfo: { name: 'Unknown', location: 'Unknown' },
    orderTime: new Date().toLocaleString(),
    items: [],
    total: '0.00'
  };

  const { orderNumber, tableInfo, orderTime, items, total } = orderData;

  // Calculate estimated time (20-30 minutes from now)
  const getEstimatedTime = () => {
    const now = new Date();
    const minTime = new Date(now.getTime() + 20 * 60000);
    const maxTime = new Date(now.getTime() + 30 * 60000);
    
    return {
      min: minTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      max: maxTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const estimatedTime = getEstimatedTime();

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="text-center mb-8">
        <div className="inline-block p-2 rounded-full bg-green-100 mb-4">
          <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-800">Order Confirmed!</h1>
        <p className="text-gray-600 mt-2">Your order has been received and is being prepared.</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <div>
            <h2 className="text-lg font-semibold">Order #{orderNumber}</h2>
            <p className="text-gray-500 text-sm">{orderTime}</p>
          </div>
          <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
            Being prepared
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-medium text-gray-700 mb-3">Order Details</h3>
          <div className="space-y-3">
            {items && items.length > 0 ? (
              items.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-gray-800 font-medium">{item.quantity}x</span>
                    <span className="ml-2">{item.name}</span>
                  </div>
                  <span className="text-gray-700">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No items in order</p>
            )}
          </div>
        </div>

        <div className="border-t pt-4 mb-4">
          <div className="flex justify-between items-center text-lg font-medium">
            <span>Total:</span>
            <span>${total}</span>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-md mb-4">
          <div className="flex items-center mb-2">
            <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 className="font-medium text-gray-700">Estimated Delivery Time</h3>
          </div>
          <p className="text-gray-600">Between <span className="font-medium">{estimatedTime.min}</span> and <span className="font-medium">{estimatedTime.max}</span></p>
          <p className="text-sm text-gray-500 mt-1">Your order will be delivered to Table {tableInfo.name} in {tableInfo.location}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          <div className="flex items-center mb-2">
            <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            <h3 className="font-medium text-gray-700">Order Status Updates</h3>
          </div>
          <ul className="mt-2 space-y-3">
            <li className="flex items-center">
              <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center mr-3">
                <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-800">Order received</p>
                <p className="text-xs text-gray-500">{orderTime}</p>
              </div>
            </li>
            <li className="flex items-center">
              <div className="h-5 w-5 rounded-full bg-yellow-500 flex items-center justify-center mr-3">
                <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-800">Preparing your order</p>
                <p className="text-xs text-gray-500">Current status</p>
              </div>
            </li>
            <li className="flex items-center opacity-50">
              <div className="h-5 w-5 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                <span className="text-xs text-white">3</span>
              </div>
              <p className="text-gray-500">Out for delivery</p>
            </li>
            <li className="flex items-center opacity-50">
              <div className="h-5 w-5 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                <span className="text-xs text-white">4</span>
              </div>
              <p className="text-gray-500">Delivered to your table</p>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col space-y-3">
        <Link 
          to="/"
          className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 text-center"
        >
          Return to Homepage
        </Link>
        <button
          className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50"
        >
          Need Help?
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation; 
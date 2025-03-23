import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrReader } from 'react-qr-reader';

const QRScanner = () => {
  const [scanResult, setScanResult] = useState('');
  const [hasScanned, setHasScanned] = useState(false);
  const [showOrderSection, setShowOrderSection] = useState(false);
  const [tableInfo, setTableInfo] = useState({ id: '', name: '', location: '' });
  const [order, setOrder] = useState([]);
  const [availableItems, setAvailableItems] = useState([]);
  const [orderTime, setOrderTime] = useState('');
  const [orderComplete, setOrderComplete] = useState(false);
  const navigate = useNavigate();

  // Simulated menu data - in a real app, this would come from your database
  useEffect(() => {
    // Simulate fetching menu items from API
    const fetchMenuItems = () => {
      const menuItems = [
        { id: 1, name: 'Margherita Pizza', price: 12.99, category: 'Pizza', image: 'https://via.placeholder.com/150', description: 'Classic pizza with tomato sauce, mozzarella, and basil.' },
        { id: 2, name: 'Spaghetti Carbonara', price: 14.99, category: 'Pasta', image: 'https://via.placeholder.com/150', description: 'Creamy pasta with pancetta, eggs, and cheese.' },
        { id: 3, name: 'Caesar Salad', price: 9.99, category: 'Salad', image: 'https://via.placeholder.com/150', description: 'Romaine lettuce with croutons, parmesan, and Caesar dressing.' },
        { id: 4, name: 'Garlic Bread', price: 5.99, category: 'Sides', image: 'https://via.placeholder.com/150', description: 'Toasted bread with garlic butter and herbs.' },
        { id: 5, name: 'Tiramisu', price: 7.99, category: 'Dessert', image: 'https://via.placeholder.com/150', description: 'Italian dessert with coffee-soaked ladyfingers and mascarpone cream.' },
        { id: 6, name: 'Soft Drink', price: 2.99, category: 'Beverages', image: 'https://via.placeholder.com/150', description: 'Various soft drinks available.' },
      ];
      setAvailableItems(menuItems);
    };

    fetchMenuItems();
  }, []);

  const handleScan = (data) => {
    if (data && !hasScanned) {
      setScanResult(data.text);
      setHasScanned(true);
      
      try {
        // Parse QR data - expecting format: table-id_table-name_location
        const qrData = data.text.split('_');
        if (qrData.length >= 3) {
          setTableInfo({
            id: qrData[0],
            name: qrData[1],
            location: qrData[2]
          });
          
          // Set order time
          const now = new Date();
          setOrderTime(now.toLocaleString());
          
          // Show order section
          setShowOrderSection(true);
        } else {
          console.error('Invalid QR code format');
        }
      } catch (error) {
        console.error('Error parsing QR code data:', error);
      }
    }
  };

  const handleScanError = (err) => {
    console.error(err);
  };

  const addToOrder = (item) => {
    // Check if item is already in order
    const existingItem = order.find(orderItem => orderItem.id === item.id);
    
    if (existingItem) {
      // If item exists, increase quantity
      setOrder(order.map(orderItem => 
        orderItem.id === item.id 
          ? { ...orderItem, quantity: orderItem.quantity + 1 } 
          : orderItem
      ));
    } else {
      // If item doesn't exist, add to order with quantity 1
      setOrder([...order, { ...item, quantity: 1 }]);
    }
  };

  const removeFromOrder = (itemId) => {
    const existingItem = order.find(item => item.id === itemId);
    
    if (existingItem.quantity > 1) {
      // If quantity is more than 1, decrease quantity
      setOrder(order.map(item => 
        item.id === itemId 
          ? { ...item, quantity: item.quantity - 1 } 
          : item
      ));
    } else {
      // If quantity is 1, remove item from order
      setOrder(order.filter(item => item.id !== itemId));
    }
  };

  const calculateTotal = () => {
    return order.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const placeOrder = () => {
    // In a real app, this would send the order to your backend
    console.log('Order placed:', {
      tableInfo,
      orderTime,
      items: order,
      total: calculateTotal()
    });
    
    // Show order confirmation
    setOrderComplete(true);
    
    // In a real app, this might redirect to a tracking page or back to home
    setTimeout(() => {
      setShowOrderSection(false);
      navigate('/order-confirmation', { 
        state: { 
          orderNumber: Math.floor(1000 + Math.random() * 9000),
          tableInfo,
          orderTime,
          items: order,
          total: calculateTotal()
        } 
      });
    }, 3000);
  };

  const resetScanner = () => {
    setScanResult('');
    setHasScanned(false);
    setShowOrderSection(false);
    setOrder([]);
    setOrderComplete(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">QEasy Scanner</h1>
      
      {!hasScanned && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Scan QR Code</h2>
          <p className="text-gray-600 mb-4">Position the QR code from your table within the scanner to place your order.</p>
          
          <div className="max-w-md mx-auto">
            <QrReader
              constraints={{ facingMode: 'environment' }}
              onResult={handleScan}
              className="w-full border-2 border-blue-300 rounded-lg overflow-hidden"
              scanDelay={500}
            />
          </div>
          
          <div className="mt-4 text-center text-sm text-gray-500">
            Make sure the QR code is well-lit and centered in the scanner.
          </div>
        </div>
      )}
      
      {scanResult && !showOrderSection && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 text-center">
          <div className="text-green-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-lg font-medium">QR Code Scanned Successfully!</p>
          <p className="text-gray-600 mt-2">Loading your menu...</p>
        </div>
      )}
      
      {showOrderSection && !orderComplete && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-semibold">Place Your Order</h2>
              <p className="text-gray-600">Table: {tableInfo.name} ({tableInfo.location})</p>
              <p className="text-gray-500 text-sm">Order Time: {orderTime}</p>
            </div>
            <button 
              onClick={resetScanner}
              className="text-blue-500 hover:text-blue-700"
            >
              Scan Different QR
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-3 pb-2 border-b">Menu Items</h3>
              
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {availableItems.map(item => (
                  <div key={item.id} className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md mr-3" />
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-500">{item.description}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="font-medium">${item.price.toFixed(2)}</span>
                        <button 
                          onClick={() => addToOrder(item)}
                          className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-3 pb-2 border-b">Your Order</h3>
              
              {order.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-12 h-12 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p>Your order is empty</p>
                  <p className="text-sm mt-2">Add items from the menu to get started</p>
                </div>
              ) : (
                <div>
                  <div className="space-y-3 max-h-[40vh] overflow-y-auto mb-4">
                    {order.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-gray-500">${item.price.toFixed(2)} × {item.quantity}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => removeFromOrder(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="font-medium">{item.quantity}</span>
                          <button 
                            onClick={() => addToOrder(item)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-4 mb-4">
                    <div className="flex justify-between items-center font-medium">
                      <span>Total:</span>
                      <span>${calculateTotal()}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={placeOrder}
                    className="w-full bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600"
                  >
                    Place Order
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {orderComplete && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 text-center">
          <div className="text-green-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Order Placed Successfully!</h2>
          <p className="text-gray-600">Your order has been sent to the kitchen.</p>
          <p className="text-gray-500 text-sm mt-2">Order Time: {orderTime}</p>
          <p className="text-gray-500 text-sm">Table: {tableInfo.name} ({tableInfo.location})</p>
          <div className="mt-4">
            <p className="font-medium">Redirecting you to order tracking...</p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">How to Use QEasy Scanner</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mb-4">
              <span className="text-lg font-semibold">1</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Scan QR Code</h3>
            <p className="text-gray-600">Find the QR code on your table and scan it with this scanner.</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mb-4">
              <span className="text-lg font-semibold">2</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Browse Menu & Order</h3>
            <p className="text-gray-600">Browse the digital menu and add items to your order.</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mb-4">
              <span className="text-lg font-semibold">3</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Enjoy Your Meal</h3>
            <p className="text-gray-600">Place your order and it will be prepared and delivered to your table.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScanner; 
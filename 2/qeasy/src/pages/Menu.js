import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const Menu = () => {
  const { id } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [cart, setCart] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [restaurant, setRestaurant] = useState(null);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [tableNumber, setTableNumber] = useState('');

  // Fetch restaurant data and menu items
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch restaurant details
        const restaurantDoc = await getDoc(doc(db, 'restaurants', id));
        if (restaurantDoc.exists()) {
          setRestaurant(restaurantDoc.data());
        } else {
          setError('Restaurant not found');
        }
        
        // For demo purposes, we'll fetch all menu items
        // In a real app, you'd filter by restaurant ID
        const menuQuery = query(collection(db, 'menu'), where('restaurantId', '==', id));
        const menuSnapshot = await getDocs(menuQuery);
        const menuData = menuSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        setMenuItems(menuData);
        
        // Extract unique categories
        const uniqueCategories = ['All', ...new Set(menuData.map(item => item.category))];
        setCategories(uniqueCategories);
        
        // Generate recommendations based on time of day
        generateRecommendations(menuData);
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load menu. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Generate recommendations based on time of day
  const generateRecommendations = (items) => {
    const currentHour = new Date().getHours();
    let recommendedItems = [];
    
    // Morning recommendations (6AM - 11AM)
    if (currentHour >= 6 && currentHour < 11) {
      recommendedItems = items.filter(item => 
        item.available_time === 'morning' || 
        item.available_time === 'all-day'
      ).slice(0, 3);
    } 
    // Afternoon recommendations (11AM - 5PM)
    else if (currentHour >= 11 && currentHour < 17) {
      recommendedItems = items.filter(item => 
        item.available_time === 'afternoon' || 
        item.available_time === 'all-day'
      ).slice(0, 3);
    } 
    // Evening recommendations (5PM - 10PM)
    else {
      recommendedItems = items.filter(item => 
        item.available_time === 'evening' || 
        item.available_time === 'all-day'
      ).slice(0, 3);
    }
    
    // If we don't have enough recommendations, add some random items
    if (recommendedItems.length < 3) {
      const randomItems = items
        .filter(item => !recommendedItems.includes(item))
        .sort(() => 0.5 - Math.random())
        .slice(0, 3 - recommendedItems.length);
      
      recommendedItems = [...recommendedItems, ...randomItems];
    }
    
    setRecommendations(recommendedItems);
  };

  // Add item to cart
  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      // If item already exists in cart, increase quantity
      setCart(cart.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 } 
          : cartItem
      ));
    } else {
      // Otherwise add new item to cart
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    const existingItem = cart.find(cartItem => cartItem.id === itemId);
    
    if (existingItem.quantity === 1) {
      // If only 1 quantity, remove item entirely
      setCart(cart.filter(cartItem => cartItem.id !== itemId));
    } else {
      // Otherwise reduce quantity by 1
      setCart(cart.map(cartItem => 
        cartItem.id === itemId 
          ? { ...cartItem, quantity: cartItem.quantity - 1 } 
          : cartItem
      ));
    }
  };

  // Calculate total price
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Place order
  const placeOrder = async () => {
    if (cart.length === 0) return;
    
    try {
      setLoading(true);
      
      await addDoc(collection(db, 'orders'), {
        items: cart,
        restaurantId: id,
        timestamp: serverTimestamp(),
        status: 'new',
        tableNumber: tableNumber,
        specialInstructions: specialInstructions,
        total: calculateTotal()
      });
      
      setCart([]);
      setOrderPlaced(true);
      setSpecialInstructions('');
      setTableNumber('');
      
      // Reset order placed message after 5 seconds
      setTimeout(() => {
        setOrderPlaced(false);
      }, 5000);
      
    } catch (err) {
      console.error('Error placing order:', err);
      setError('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter menu items by category
  const filteredItems = selectedCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  // Get current status based on time
  const getCurrentStatus = () => {
    if (!restaurant) return 'Closed';
    
    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDay(); // 0 = Sunday, 6 = Saturday
    
    const openingHour = 8; // Default 8 AM
    const closingHour = 22; // Default 10 PM
    
    // Check if restaurant is open today
    if (currentDay === 0 && !restaurant.openOnSunday) return 'Closed';
    
    // Check if current time is within operating hours
    if (currentHour >= openingHour && currentHour < closingHour) {
      return 'Open Now';
    } else {
      return 'Closed';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 relative">
      <header className="bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-500">QEasy</h1>
          <button 
            className="relative bg-blue-500 text-white p-2 rounded-full"
            onClick={() => setCartOpen(!cartOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {cart.reduce((total, item) => total + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </header>
      
      <main className="container mx-auto py-8 px-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {orderPlaced && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Your order has been placed successfully!
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Restaurant Banner */}
            {restaurant && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                <div className="h-48 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
                  {restaurant.coverImage ? (
                    <img 
                      src={restaurant.coverImage} 
                      alt={restaurant.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/800x300?text=Restaurant+Image";
                      }}
                    />
                  ) : (
                    <img 
                      src="https://via.placeholder.com/800x300?text=Restaurant+Image" 
                      alt={restaurant.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
                    <div className="p-6 text-white">
                      <h1 className="text-3xl font-bold mb-1">{restaurant.name}</h1>
                      <p className="text-white text-opacity-90">{restaurant.cuisine} • {restaurant.priceRange}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 flex flex-wrap justify-between items-center">
                  <div className="flex items-center mb-2 md:mb-0">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold mr-2 ${
                      getCurrentStatus() === 'Open Now' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {getCurrentStatus()}
                    </span>
                    <div className="text-gray-600 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {restaurant.address}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex items-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-gray-700 ml-1">{restaurant.rating || '4.5'}</span>
                    </div>
                    <div className="text-gray-600 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {restaurant.deliveryTime || '30-45 min'}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Categories Filter */}
            <div className="flex overflow-x-auto pb-2 mb-6 scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 mr-2 rounded-full text-sm font-medium ${
                    selectedCategory === category
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            
            {/* Recommendations Section */}
            {recommendations.length > 0 && (
              <section className="mb-10">
                <h2 className="text-xl font-bold mb-4">Recommended For You</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {recommendations.map((item) => (
                    <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                      {item.image && (
                        <div className="h-40 overflow-hidden">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://via.placeholder.com/300x200?text=${encodeURIComponent(item.name)}`;
                            }}
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-lg">{item.name}</h3>
                            <p className="text-gray-500 text-sm">{item.category}</p>
                            {item.description && (
                              <p className="text-gray-600 text-sm mt-1 line-clamp-2">{item.description}</p>
                            )}
                          </div>
                          <span className="font-bold">${parseFloat(item.price).toFixed(2)}</span>
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Recommended</span>
                          <button 
                            onClick={() => addToCart(item)} 
                            className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors duration-300"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
            
            {/* Menu Items */}
            <section>
              <h2 className="text-xl font-bold mb-4">Menu</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    {item.image && (
                      <div className="h-40 overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://via.placeholder.com/300x200?text=${encodeURIComponent(item.name)}`;
                          }}
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg">{item.name}</h3>
                          <p className="text-gray-500 text-sm">{item.category}</p>
                          {item.description && (
                            <p className="text-gray-600 text-sm mt-1 line-clamp-2">{item.description}</p>
                          )}
                        </div>
                        <span className="font-bold">${parseFloat(item.price).toFixed(2)}</span>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <button 
                          onClick={() => addToCart(item)} 
                          className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors duration-300"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {filteredItems.length === 0 && (
                <p className="text-gray-600 text-center py-8">No items found in this category.</p>
              )}
            </section>
          </>
        )}
      </main>
      
      {/* Cart Sidebar */}
      <div className={`fixed inset-y-0 right-0 w-80 bg-white shadow-lg transform ${cartOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-50`}>
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-bold">Your Cart</h2>
            <button 
              onClick={() => setCartOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex-grow overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="text-center py-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-gray-600">Your cart is empty.</p>
                <p className="text-gray-500 text-sm mt-2">Add items to get started!</p>
              </div>
            ) : (
              <>
                <ul className="divide-y divide-gray-200">
                  {cart.map((item) => (
                    <li key={item.id} className="py-4">
                      <div className="flex justify-between">
                        <div className="flex-1 pr-4">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-gray-500 text-sm">${parseFloat(item.price).toFixed(2)} each</p>
                        </div>
                        <div className="flex items-center">
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-500 hover:text-red-500 border border-gray-300 rounded-full w-6 h-6 flex items-center justify-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="mx-2">{item.quantity}</span>
                          <button 
                            onClick={() => addToCart(item)}
                            className="text-gray-500 hover:text-blue-500 border border-gray-300 rounded-full w-6 h-6 flex items-center justify-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-6">
                  <div className="mb-4">
                    <label htmlFor="tableNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Table Number
                    </label>
                    <input
                      type="text"
                      id="tableNumber"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter table number"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="specialInstructions" className="block text-sm font-medium text-gray-700 mb-1">
                      Special Instructions
                    </label>
                    <textarea
                      id="specialInstructions"
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Any special requests?"
                      rows="3"
                    ></textarea>
                  </div>
                </div>
              </>
            )}
          </div>
          
          <div className="p-4 border-t border-gray-200">
            {cart.length > 0 && (
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tax (10%)</span>
                  <span>${(calculateTotal() * 0.1).toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span>${(calculateTotal() * 1.1).toFixed(2)}</span>
                </div>
              </div>
            )}
            
            <button
              onClick={placeOrder}
              disabled={cart.length === 0 || loading}
              className={`w-full py-3 px-4 rounded-md ${
                cart.length === 0 || loading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              } transition duration-300 flex items-center justify-center`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>Place Order</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu; 
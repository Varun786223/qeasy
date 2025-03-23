import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, getDocs, addDoc, deleteDoc, doc, updateDoc, orderBy } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from '../firebase';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('menu');
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newMenuItem, setNewMenuItem] = useState({ 
    name: '', 
    price: '', 
    category: 'Beverage',
    available_time: 'all-day'
  });
  const [editingItem, setEditingItem] = useState(null);
  const [showPersonalizedMenu, setShowPersonalizedMenu] = useState(false);
  const [personalizedMenuData, setPersonalizedMenuData] = useState({
    customerName: '',
    preferences: [],
    allergies: [],
    previousOrders: []
  });
  const navigate = useNavigate();

  // Authentication check
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (!user) {
        navigate('/login');
      }
    });

    return unsubscribe;
  }, [navigate]);

  // Fetch menu items and orders
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch menu items
        const menuQuery = query(collection(db, 'menu'), orderBy('category'));
        const menuSnapshot = await getDocs(menuQuery);
        const menuData = menuSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMenuItems(menuData);
        
        // Fetch orders
        const ordersQuery = query(collection(db, 'orders'), orderBy('timestamp', 'desc'));
        const ordersSnapshot = await getDocs(ordersQuery);
        const ordersData = ordersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(ordersData);
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Add new menu item
  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    
    if (!newMenuItem.name || !newMenuItem.price) {
      setError('Please fill in all required fields');
      return;
    }
    
    try {
      setLoading(true);
      
      const itemToAdd = {
        ...newMenuItem,
        price: parseFloat(newMenuItem.price),
      };
      
      const docRef = await addDoc(collection(db, 'menu'), itemToAdd);
      
      setMenuItems([...menuItems, { id: docRef.id, ...itemToAdd }]);
      setNewMenuItem({ 
        name: '', 
        price: '', 
        category: 'Beverage',
        available_time: 'all-day'
      });
      setError('');
    } catch (err) {
      console.error('Error adding item:', err);
      setError('Failed to add item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Delete menu item
  const handleDeleteMenuItem = async (id) => {
    try {
      setLoading(true);
      await deleteDoc(doc(db, 'menu', id));
      setMenuItems(menuItems.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error deleting item:', err);
      setError('Failed to delete item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Update menu item
  const handleUpdateMenuItem = async (e) => {
    e.preventDefault();
    
    if (!editingItem.name || !editingItem.price) {
      setError('Please fill in all required fields');
      return;
    }
    
    try {
      setLoading(true);
      
      const itemToUpdate = {
        ...editingItem,
        price: parseFloat(editingItem.price),
      };
      
      await updateDoc(doc(db, 'menu', editingItem.id), {
        name: itemToUpdate.name,
        price: itemToUpdate.price,
        category: itemToUpdate.category,
        available_time: itemToUpdate.available_time,
      });
      
      setMenuItems(menuItems.map(item => 
        item.id === editingItem.id ? itemToUpdate : item
      ));
      
      setEditingItem(null);
      setError('');
    } catch (err) {
      console.error('Error updating item:', err);
      setError('Failed to update item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (err) {
      console.error('Error signing out:', err);
      setError('Failed to sign out. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-white shadow-md md:min-h-screen">
          <div className="p-4 border-b">
            <h2 className="text-2xl font-bold text-gray-800">QEasy</h2>
            <p className="text-sm text-gray-600">Restaurant Dashboard</p>
          </div>
          
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <button
                  className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${activeTab === 'menu' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => setActiveTab('menu')}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Menu Management
                </button>
              </li>
              <li>
                <button
                  className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${activeTab === 'orders' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => setActiveTab('orders')}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                  Order Management
                </button>
              </li>
              <li>
                <button
                  className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${activeTab === 'qr' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => setActiveTab('qr')}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
                  </svg>
                  QR Code Manager
                </button>
              </li>
              <li>
                <button
                  className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${activeTab === 'analytics' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => setActiveTab('analytics')}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                  Analytics
                </button>
              </li>
              <li>
                <button
                  className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${activeTab === 'kds' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => setActiveTab('kds')}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  Kitchen Display
                </button>
              </li>
              <li>
                <button
                  className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${activeTab === 'pos' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => setActiveTab('pos')}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                  </svg>
                  POS System
                </button>
              </li>
              <li>
                <button
                  className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${activeTab === 'loyalty' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => setActiveTab('loyalty')}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Loyalty Program
                </button>
              </li>
              {/* New Settings Tab */}
              <li>
                <button
                  className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${activeTab === 'settings' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => setActiveTab('settings')}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  Settings
                </button>
              </li>
              {/* Help & Support Tab */}
              <li>
                <button
                  className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${activeTab === 'help' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => setActiveTab('help')}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Help & Support
                </button>
              </li>
            </ul>
          </nav>
          
          <div className="mt-auto p-4 border-t">
            <button
              className="w-full flex items-center px-4 py-2 text-sm text-red-600 rounded-lg hover:bg-red-100"
              onClick={handleLogout}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              Logout
            </button>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 p-8 overflow-auto">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {loading && <p className="text-gray-600">Loading...</p>}
          
          {/* Menu Management Tab */}
          {activeTab === 'menu' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Menu Management</h2>
              
              <div className="mb-6 flex justify-between items-center">
                <button
                  onClick={() => setShowPersonalizedMenu(true)}
                  className="flex items-center bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                  Create Personalized Menu
                </button>
              </div>
              
              {/* Add Menu Item Form */}
              <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h3 className="text-lg font-semibold mb-4">Add New Menu Item</h3>
                <form onSubmit={handleAddMenuItem}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Item Name*
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={newMenuItem.name}
                        onChange={(e) => setNewMenuItem({ ...newMenuItem, name: e.target.value })}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                        Price*
                      </label>
                      <input
                        id="price"
                        type="number"
                        step="0.01"
                        value={newMenuItem.price}
                        onChange={(e) => setNewMenuItem({ ...newMenuItem, price: e.target.value })}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <select
                        id="category"
                        value={newMenuItem.category}
                        onChange={(e) => setNewMenuItem({ ...newMenuItem, category: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Beverage">Beverage</option>
                        <option value="Appetizer">Appetizer</option>
                        <option value="Main">Main Course</option>
                        <option value="Dessert">Dessert</option>
                        <option value="Special">Special</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="available_time" className="block text-sm font-medium text-gray-700 mb-1">
                        Available Time
                      </label>
                      <select
                        id="available_time"
                        value={newMenuItem.available_time}
                        onChange={(e) => setNewMenuItem({ ...newMenuItem, available_time: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="all-day">All Day</option>
                        <option value="morning">Morning</option>
                        <option value="afternoon">Afternoon</option>
                        <option value="evening">Evening</option>
                      </select>
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
                  >
                    {loading ? 'Adding...' : 'Add Item'}
                  </button>
                </form>
              </div>
              
              {/* Menu Items List */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">Current Menu Items</h3>
                
                {menuItems.length === 0 ? (
                  <p className="text-gray-600">No menu items yet. Add your first item above.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Category
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Available Time
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {menuItems.map((item) => (
                          <tr key={item.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {item.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ${parseFloat(item.price).toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.category}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.available_time === 'all-day' ? 'All Day' : 
                               item.available_time === 'morning' ? 'Morning' : 
                               item.available_time === 'afternoon' ? 'Afternoon' : 'Evening'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => setEditingItem(item)}
                                className="text-blue-600 hover:text-blue-900 mr-3"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteMenuItem(item.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              
              {/* Edit Menu Item Modal */}
              {editingItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                    <h3 className="text-lg font-semibold mb-4">Edit Menu Item</h3>
                    
                    <form onSubmit={handleUpdateMenuItem}>
                      <div className="space-y-4 mb-4">
                        <div>
                          <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">
                            Item Name*
                          </label>
                          <input
                            id="edit-name"
                            type="text"
                            value={editingItem.name}
                            onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="edit-price" className="block text-sm font-medium text-gray-700 mb-1">
                            Price*
                          </label>
                          <input
                            id="edit-price"
                            type="number"
                            step="0.01"
                            value={editingItem.price}
                            onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="edit-category" className="block text-sm font-medium text-gray-700 mb-1">
                            Category
                          </label>
                          <select
                            id="edit-category"
                            value={editingItem.category}
                            onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="Beverage">Beverage</option>
                            <option value="Appetizer">Appetizer</option>
                            <option value="Main">Main Course</option>
                            <option value="Dessert">Dessert</option>
                            <option value="Special">Special</option>
                          </select>
                        </div>
                        
                        <div>
                          <label htmlFor="edit-available_time" className="block text-sm font-medium text-gray-700 mb-1">
                            Available Time
                          </label>
                          <select
                            id="edit-available_time"
                            value={editingItem.available_time}
                            onChange={(e) => setEditingItem({ ...editingItem, available_time: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="all-day">All Day</option>
                            <option value="morning">Morning</option>
                            <option value="afternoon">Afternoon</option>
                            <option value="evening">Evening</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => setEditingItem(null)}
                          className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition duration-300"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
                        >
                          {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Personalized Menu Popup */}
              {showPersonalizedMenu && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold">Create Personalized Menu</h3>
                      <button 
                        onClick={() => setShowPersonalizedMenu(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </button>
                    </div>
                    
                    <div className="overflow-y-auto max-h-[70vh] px-1">
                      <p className="text-gray-600 mb-4">
                        Create a personalized menu experience for your customers based on their preferences, dietary restrictions, and order history.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Customer Name or Identifier
                            </label>
                            <input 
                              type="text" 
                              value={personalizedMenuData.customerName}
                              onChange={(e) => setPersonalizedMenuData({...personalizedMenuData, customerName: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                              placeholder="e.g. John Smith or Table 5"
                            />
                          </div>
                          
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Dietary Preferences
                            </label>
                            <div className="space-y-2">
                              {['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Low-Carb'].map((pref) => (
                                <div key={pref} className="flex items-center">
                                  <input 
                                    type="checkbox" 
                                    id={`pref-${pref}`}
                                    checked={personalizedMenuData.preferences.includes(pref)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setPersonalizedMenuData({
                                          ...personalizedMenuData, 
                                          preferences: [...personalizedMenuData.preferences, pref]
                                        });
                                      } else {
                                        setPersonalizedMenuData({
                                          ...personalizedMenuData, 
                                          preferences: personalizedMenuData.preferences.filter(p => p !== pref)
                                        });
                                      }
                                    }}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" 
                                  />
                                  <label htmlFor={`pref-${pref}`} className="ml-2 text-sm text-gray-700">{pref}</label>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Allergies & Restrictions
                            </label>
                            <div className="space-y-2">
                              {['Nuts', 'Shellfish', 'Eggs', 'Soy', 'Wheat', 'Peanuts', 'Fish', 'Milk'].map((allergy) => (
                                <div key={allergy} className="flex items-center">
                                  <input 
                                    type="checkbox" 
                                    id={`allergy-${allergy}`}
                                    checked={personalizedMenuData.allergies.includes(allergy)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setPersonalizedMenuData({
                                          ...personalizedMenuData, 
                                          allergies: [...personalizedMenuData.allergies, allergy]
                                        });
                                      } else {
                                        setPersonalizedMenuData({
                                          ...personalizedMenuData, 
                                          allergies: personalizedMenuData.allergies.filter(a => a !== allergy)
                                        });
                                      }
                                    }}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" 
                                  />
                                  <label htmlFor={`allergy-${allergy}`} className="ml-2 text-sm text-gray-700">{allergy}</label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Previous Orders (Optional)
                            </label>
                            <div className="border border-gray-300 rounded-md p-4 bg-gray-50 h-48 overflow-y-auto">
                              {orders.length > 0 ? (
                                <div className="space-y-2">
                                  {orders.slice(0, 3).map((order, index) => (
                                    <div key={index} className="p-2 bg-white rounded border border-gray-200">
                                      <p className="text-sm font-medium">{new Date(order.timestamp.seconds * 1000).toLocaleDateString()}</p>
                                      <ul className="text-xs text-gray-600 mt-1">
                                        {order.items.map((item, i) => (
                                          <li key={i}>
                                            <div className="flex items-center">
                                              <input 
                                                type="checkbox" 
                                                id={`order-item-${index}-${i}`}
                                                checked={personalizedMenuData.previousOrders.some(po => 
                                                  po.name === item.name && po.price === item.price
                                                )}
                                                onChange={(e) => {
                                                  if (e.target.checked) {
                                                    setPersonalizedMenuData({
                                                      ...personalizedMenuData, 
                                                      previousOrders: [...personalizedMenuData.previousOrders, item]
                                                    });
                                                  } else {
                                                    setPersonalizedMenuData({
                                                      ...personalizedMenuData, 
                                                      previousOrders: personalizedMenuData.previousOrders.filter(po => 
                                                        !(po.name === item.name && po.price === item.price)
                                                      )
                                                    });
                                                  }
                                                }}
                                                className="h-3 w-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-1" 
                                              />
                                              <label htmlFor={`order-item-${index}-${i}`} className="text-xs">
                                                {item.quantity || 1}x {item.name} (${parseFloat(item.price).toFixed(2)})
                                              </label>
                                            </div>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-gray-500 text-sm text-center pt-16">No previous orders found</p>
                              )}
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Personalization Options
                            </label>
                            <div className="space-y-2">
                              <div className="flex items-center">
                                <input type="checkbox" id="recommended" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" checked />
                                <label htmlFor="recommended" className="ml-2 text-sm text-gray-700">Show personalized recommendations</label>
                              </div>
                              <div className="flex items-center">
                                <input type="checkbox" id="highlight" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" checked />
                                <label htmlFor="highlight" className="ml-2 text-sm text-gray-700">Highlight compatible menu items</label>
                              </div>
                              <div className="flex items-center">
                                <input type="checkbox" id="hide-allergens" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" checked />
                                <label htmlFor="hide-allergens" className="ml-2 text-sm text-gray-700">Hide items with allergens</label>
                              </div>
                              <div className="flex items-center">
                                <input type="checkbox" id="special-offers" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" checked />
                                <label htmlFor="special-offers" className="ml-2 text-sm text-gray-700">Include special offers</label>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Special Message (Optional)
                            </label>
                            <textarea 
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                              rows="2"
                              placeholder="Add a personalized welcome message"
                            ></textarea>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                          <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z"></path>
                          </svg>
                          AI-Generated Preview
                        </h4>
                        <p className="text-sm text-blue-600">
                          Based on the selected preferences and order history, this customer will likely be interested in:
                        </p>
                        <ul className="mt-2 text-sm text-blue-700 space-y-1 ml-6 list-disc">
                          {personalizedMenuData.preferences.includes('Vegetarian') && (
                            <li>Vegetarian dishes from our menu</li>
                          )}
                          {personalizedMenuData.previousOrders.length > 0 && (
                            <li>Their previous orders with personalized recommendations</li>
                          )}
                          {personalizedMenuData.allergies.length > 0 && (
                            <li>Menu items excluding their allergens: {personalizedMenuData.allergies.join(', ')}</li>
                          )}
                          {personalizedMenuData.preferences.length === 0 && personalizedMenuData.allergies.length === 0 && (
                            <li>Our most popular dishes based on current trends</li>
                          )}
                          <li>Seasonal specials and chef recommendations</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-6 space-x-2">
                      <button
                        onClick={() => setShowPersonalizedMenu(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                        onClick={() => {
                          // Here you would save the personalized menu data
                          setShowPersonalizedMenu(false);
                          // Show success notification
                          setError('');
                          alert('Personalized menu created successfully! QR code sent to customer.');
                        }}
                      >
                        Generate & Send
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Order Management</h2>
              
              {orders.length === 0 ? (
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <p className="text-gray-600">No orders yet.</p>
                </div>
              ) : (
                <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Items
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.map((order) => (
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {order.id.substring(0, 8)}...
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            <ul>
                              {order.items.map((item, index) => (
                                <li key={index}>
                                  {item.quantity || 1}x {item.name} - ${parseFloat(item.price).toFixed(2)}
                                </li>
                              ))}
                            </ul>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${order.items.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(order.timestamp.seconds * 1000).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                              order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {order.status || 'new'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
          
          {/* QR Code Management Tab */}
          {activeTab === 'qr' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">QR Code Manager</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* QR Generation Panel */}
                <div className="md:col-span-1">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Create New QR Code</h3>
                    
                    <form className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Table Number/Name
                        </label>
                        <input 
                          type="text" 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g. Table 5 or Patio 2"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Location/Area
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                          <option>Main Dining</option>
                          <option>Outdoor Patio</option>
                          <option>Bar Area</option>
                          <option>Private Room</option>
                          <option>Takeout Counter</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          QR Link Format
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                          <option value="direct">Direct Menu Link</option>
                          <option value="table-specific" selected>Table-Specific Format</option>
                          <option value="custom">Custom URL</option>
                        </select>
                        <p className="mt-1 text-sm text-gray-500">Table-specific format allows customers to place orders directly from their table.</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          QR Code Style
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="border border-blue-500 rounded-md p-2 flex items-center justify-center">
                            <div className="w-full aspect-square bg-gray-100 flex items-center justify-center">
                              <svg className="w-10 h-10 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3 3h7v7H3V3zm2 2v3h3V5H5zm7-2h7v7h-7V3zm2 2v3h3V5h-3zM3 12h7v7H3v-7zm2 2v3h3v-3H5zm7-2h7v7h-7v-7zm2 2v3h3v-3h-3z"/>
                              </svg>
                            </div>
                          </div>
                          <div className="border border-gray-200 rounded-md p-2 flex items-center justify-center">
                            <div className="w-full aspect-square bg-gray-100 flex items-center justify-center">
                              <svg className="w-10 h-10 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3 3h7v7H3V3zm2 2v3h3V5H5zm7-2h7v7h-7V3zm2 2v3h3V5h-3zM3 12h7v7H3v-7zm2 2v3h3v-3H5zm9-2h2v2h-2v-2zm2 2h2v2h-2v-2zm-2 2h2v2h-2v-2zm2 2h2v2h-2v-2z"/>
                              </svg>
                            </div>
                          </div>
                          <div className="border border-gray-200 rounded-md p-2 flex items-center justify-center">
                            <div className="w-full aspect-square bg-gray-100 flex items-center justify-center">
                              <svg className="w-10 h-10 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Logo (Optional)
                        </label>
                        <div className="flex items-center">
                          <span className="inline-block h-12 w-12 rounded-md overflow-hidden bg-gray-100 mr-3">
                            <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                          </span>
                          <button
                            type="button"
                            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Upload Logo
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          QR Code Color
                        </label>
                        <div className="grid grid-cols-6 gap-2">
                          <div className="h-6 w-6 bg-black rounded-full cursor-pointer ring-2 ring-offset-2 ring-blue-500"></div>
                          <div className="h-6 w-6 bg-red-600 rounded-full cursor-pointer"></div>
                          <div className="h-6 w-6 bg-blue-600 rounded-full cursor-pointer"></div>
                          <div className="h-6 w-6 bg-green-600 rounded-full cursor-pointer"></div>
                          <div className="h-6 w-6 bg-purple-600 rounded-full cursor-pointer"></div>
                          <div className="h-6 w-6 bg-gray-300 rounded-full cursor-pointer flex items-center justify-center">
                            <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="flex items-center text-sm text-gray-700">
                          <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2" />
                          Add description text on QR
                        </label>
                      </div>
                      
                      <div>
                        <label className="flex items-center text-sm text-gray-700">
                          <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2" />
                          Generate bulk QR codes
                        </label>
                      </div>
                      
                      <div className="pt-2 border-t">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Python Integration (Advanced)
                        </label>
                        <div className="bg-gray-50 p-3 rounded-md">
                          <p className="text-sm text-gray-600 mb-2">Generate custom QR codes using our Python script:</p>
                          <code className="block text-xs bg-gray-100 p-2 rounded-md overflow-x-auto">
                            python scripts/generate_qr.py "https://qeasy.com/menu?id=table1_Table1_MainDining" "Table1_QR.png"
                          </code>
                          <button
                            type="button"
                            className="mt-2 w-full flex items-center justify-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path>
                            </svg>
                            Copy Command
                          </button>
                        </div>
                      </div>
                      
                      <button
                        type="submit"
                        className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Generate QR Code
                      </button>
                    </form>
                  </div>
                </div>
                
                {/* QR Preview and Management */}
                <div className="md:col-span-2">
                  <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">QR Code Preview</h3>
                      <div className="flex space-x-2">
                        <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200">
                          <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                          </svg>
                          Download
                        </button>
                        <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200">
                          <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                          </svg>
                          Copy
                        </button>
                        <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200">
                          <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
                          </svg>
                          Print
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex justify-center">
                      <div className="w-48 h-48 border border-gray-200 rounded-lg p-4 flex items-center justify-center">
                        <svg className="w-full h-full text-black" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M3 3h7v7H3V3zm2 2v3h3V5H5zm7-2h7v7h-7V3zm2 2v3h3V5h-3zM3 12h7v7H3v-7zm2 2v3h3v-3H5zm7-2h7v7h-7v-7zm2 2v3h3v-3h-3z"/>
                        </svg>
                      </div>
                    </div>
                    
                    <div className="mt-4 text-center">
                      <p className="text-gray-700 text-sm font-medium">Table 5 - Main Dining</p>
                      <p className="text-gray-500 text-xs">Scan to order</p>
                    </div>
                    
                    <div className="mt-6 bg-gray-50 p-4 rounded-md border border-gray-200">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">QR Code Information</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-500">Format:</span>
                          <span className="ml-1 text-gray-700">Table-Specific</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Created:</span>
                          <span className="ml-1 text-gray-700">May 20, 2023</span>
                        </div>
                        <div>
                          <span className="text-gray-500">URL:</span>
                          <span className="ml-1 text-blue-500 break-all">https://qeasy.com/scan/table5_Table5_MainDining</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Orders:</span>
                          <span className="ml-1 text-gray-700">142 (see analytics)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">QR Code Management</h3>
                      <div className="relative">
                        <input type="text" placeholder="Search QR codes..." className="px-3 py-2 pl-9 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" />
                        <svg className="w-5 h-5 text-gray-400 absolute left-2 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                      </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Table/Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Table 1</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Main Dining</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">May 12, 2023</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <button className="text-blue-500 hover:text-blue-700 mr-3">Edit</button>
                              <button className="text-red-500 hover:text-red-700">Delete</button>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Table 2</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Main Dining</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">May 12, 2023</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <button className="text-blue-500 hover:text-blue-700 mr-3">Edit</button>
                              <button className="text-red-500 hover:text-red-700">Delete</button>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Bar Area</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Bar</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">May 10, 2023</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <button className="text-blue-500 hover:text-blue-700 mr-3">Edit</button>
                              <button className="text-red-500 hover:text-red-700">Delete</button>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Patio 1</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Outdoor Patio</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Apr 28, 2023</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Seasonal</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <button className="text-blue-500 hover:text-blue-700 mr-3">Edit</button>
                              <button className="text-red-500 hover:text-red-700">Delete</button>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Takeout Counter</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Front</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Apr 15, 2023</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <button className="text-blue-500 hover:text-blue-700 mr-3">Edit</button>
                              <button className="text-red-500 hover:text-red-700">Delete</button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-sm text-gray-700">
                        Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of <span className="font-medium">12</span> results
                      </div>
                      <div className="flex space-x-2">
                        <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                          Previous
                        </button>
                        <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Analytics Tab with AI Peak Hours */}
          {activeTab === 'analytics' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">AI-Powered Analytics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold mb-2">Today's Sales</h3>
                  <p className="text-3xl font-bold text-blue-500">$845.25</p>
                  <div className="flex items-center mt-2 text-sm">
                    <span className="text-green-500 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                      </svg>
                      12.5%
                    </span>
                    <span className="text-gray-500 ml-2">vs yesterday</span>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold mb-2">Orders Completed</h3>
                  <p className="text-3xl font-bold text-blue-500">68</p>
                  <div className="flex items-center mt-2 text-sm">
                    <span className="text-green-500 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                      </svg>
                      8.2%
                    </span>
                    <span className="text-gray-500 ml-2">vs yesterday</span>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold mb-2">Average Order Value</h3>
                  <p className="text-3xl font-bold text-blue-500">$32.75</p>
                  <div className="flex items-center mt-2 text-sm">
                    <span className="text-red-500 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                      </svg>
                      2.1%
                    </span>
                    <span className="text-gray-500 ml-2">vs yesterday</span>
                  </div>
                </div>
              </div>
              
              {/* AI Peak Hours Analysis */}
              <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">AI-Detected Peak Hours</h3>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-3">Last 30 days</span>
                    <button className="text-blue-500 hover:text-blue-700">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 4a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1V5a1 1 0 00-1-1H5zm6 7a1 1 0 10-2 0v3a1 1 0 102 0v-3z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* Peak hours chart */}
                <div className="h-64 mb-6 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-lg font-medium text-gray-600 mb-2">Peak Hours Visualization</p>
                    <p className="text-sm text-gray-500">Busiest times: Fridays 6-8 PM, Saturdays 7-9 PM</p>
                  </div>
                </div>
                
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        <strong>AI Insight:</strong> Consider adding more staff on Friday and Saturday evenings to handle increased customer volume. Our analysis shows these are your busiest periods.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Most Ordered Items During Peak</h4>
                    <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
                      <li>Margherita Pizza (23%)</li>
                      <li>Spaghetti Carbonara (18%)</li>
                      <li>Tiramisu (12%)</li>
                      <li>House Red Wine (10%)</li>
                      <li>Garlic Bread (8%)</li>
                    </ol>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Average Wait Times</h4>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Mon-Thu</span>
                          <span>12 min</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Fri-Sat</span>
                          <span>24 min</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Sunday</span>
                          <span>18 min</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Loyalty Program Analytics */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">Loyalty Program Performance</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">Member Growth</h4>
                    <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">Membership graph visualization</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">Points Redemption</h4>
                    <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">Redemption graph visualization</p>
                    </div>
                  </div>
                </div>
                
                <h4 className="font-medium text-gray-700 mb-3">Top Loyal Customers</h4>
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold mr-3">
                      JD
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">John Doe</p>
                      <div className="flex items-center">
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded mr-2">Platinum</span>
                        <span className="text-gray-500 text-sm">2,340 points</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-bold mr-3">
                      MS
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Mary Smith</p>
                      <div className="flex items-center">
                        <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded mr-2">Gold</span>
                        <span className="text-gray-500 text-sm">1,250 points</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-red-200 flex items-center justify-center text-red-700 font-bold mr-3">
                      RJ
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Robert Johnson</p>
                      <div className="flex items-center">
                        <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded mr-2">Gold</span>
                        <span className="text-gray-500 text-sm">980 points</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-yellow-200 flex items-center justify-center text-yellow-700 font-bold mr-3">
                      LW
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Lisa Wilson</p>
                      <div className="flex items-center">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded mr-2">Silver</span>
                        <span className="text-gray-500 text-sm">450 points</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <button className="w-full mt-4 text-blue-500 hover:text-blue-700 text-sm font-medium">
                  View All Members
                </button>
              </div>
            </div>
          )}
          
          {/* Settings Tab with Multi-Language and Payment Gateways */}
          {activeTab === 'settings' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Restaurant Profile */}
                <div className="md:col-span-1">
                  <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <h3 className="text-lg font-semibold mb-4">Restaurant Profile</h3>
                    
                    <div className="flex flex-col items-center mb-4">
                      <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden mb-3">
                        <img 
                          src="https://via.placeholder.com/200x200?text=Restaurant" 
                          alt="Restaurant Logo"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button className="text-blue-500 text-sm hover:text-blue-700">
                        Change Logo
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Restaurant Name
                        </label>
                        <input 
                          type="text" 
                          value="Italian Delight"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input 
                          type="text" 
                          value="+1 (555) 123-4567"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input 
                          type="email" 
                          value="contact@italiandelight.com"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address
                        </label>
                        <textarea 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          rows="2"
                        >123 Restaurant Street, Foodville, NY 10001</textarea>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Operating Hours</h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Monday</span>
                        <div className="flex items-center">
                          <span className="text-sm">11:00 AM - 10:00 PM</span>
                          <button className="ml-2 text-blue-500 hover:text-blue-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Tuesday</span>
                        <div className="flex items-center">
                          <span className="text-sm">11:00 AM - 10:00 PM</span>
                          <button className="ml-2 text-blue-500 hover:text-blue-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Wednesday</span>
                        <div className="flex items-center">
                          <span className="text-sm">11:00 AM - 10:00 PM</span>
                          <button className="ml-2 text-blue-500 hover:text-blue-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Thursday</span>
                        <div className="flex items-center">
                          <span className="text-sm">11:00 AM - 10:00 PM</span>
                          <button className="ml-2 text-blue-500 hover:text-blue-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Friday</span>
                        <div className="flex items-center">
                          <span className="text-sm">11:00 AM - 11:00 PM</span>
                          <button className="ml-2 text-blue-500 hover:text-blue-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Saturday</span>
                        <div className="flex items-center">
                          <span className="text-sm">11:00 AM - 11:00 PM</span>
                          <button className="ml-2 text-blue-500 hover:text-blue-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Sunday</span>
                        <div className="flex items-center">
                          <span className="text-sm">12:00 PM - 9:00 PM</span>
                          <button className="ml-2 text-blue-500 hover:text-blue-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Multi-Language and Main Settings */}
                <div className="md:col-span-2">
                  {/* Multi-Language Support */}
                  <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Multi-Language Support</h3>
                      <div className="flex items-center">
                        <span className="mr-2 text-sm font-medium text-green-600">Enabled</span>
                        <button className="relative inline-flex items-center h-6 rounded-full w-11 bg-green-500">
                          <span className="inline-block w-4 h-4 transform translate-x-6 rounded-full bg-white"></span>
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4">
                      Configure which languages your menu and QR ordering system will be available in. Customers will be able to switch languages when viewing your menu.
                    </p>
                    
                    <div className="mb-6">
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Default Language
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                          <option>English (US)</option>
                          <option>Spanish</option>
                          <option>French</option>
                          <option>Italian</option>
                          <option>German</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Supported Languages
                        </label>
                        
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" checked />
                            <label className="ml-2 text-gray-700">English (US)</label>
                          </div>
                          
                          <div className="flex items-center">
                            <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" checked />
                            <label className="ml-2 text-gray-700">Spanish</label>
                          </div>
                          
                          <div className="flex items-center">
                            <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" checked />
                            <label className="ml-2 text-gray-700">French</label>
                          </div>
                          
                          <div className="flex items-center">
                            <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" checked />
                            <label className="ml-2 text-gray-700">Italian</label>
                          </div>
                          
                          <div className="flex items-center">
                            <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                            <label className="ml-2 text-gray-700">German</label>
                          </div>
                          
                          <div className="flex items-center">
                            <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                            <label className="ml-2 text-gray-700">Chinese (Simplified)</label>
                          </div>
                          
                          <button className="text-blue-500 text-sm hover:text-blue-700 mt-2">
                            + Add more languages
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Voice Reading
                      </label>
                      <div className="flex items-center">
                        <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" checked />
                        <label className="ml-2 text-gray-700">Enable text-to-speech for menu items</label>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 ml-6">
                        This will add a speaker icon next to menu items that customers can click to hear the description
                      </p>
                    </div>
                  </div>
                  
                  {/* Payment Gateway Setup */}
                  <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <h3 className="text-lg font-semibold mb-4">Payment Gateways</h3>
                    
                    <div className="space-y-6">
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center">
                            <img src="https://via.placeholder.com/40x25?text=Stripe" alt="Stripe" className="h-8 mr-3" />
                            <h4 className="font-medium">Stripe</h4>
                          </div>
                          <div className="flex items-center">
                            <span className="mr-2 text-sm font-medium text-green-600">Active</span>
                            <button className="relative inline-flex items-center h-6 rounded-full w-11 bg-green-500">
                              <span className="inline-block w-4 h-4 transform translate-x-6 rounded-full bg-white"></span>
                            </button>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              API Key
                            </label>
                            <div className="flex">
                              <input 
                                type="password" 
                                value="••••••••••••••••••••••••"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                                disabled
                              />
                              <button className="bg-gray-100 px-3 py-2 border border-l-0 border-gray-300 rounded-r-md text-gray-600 hover:bg-gray-200">
                                Show
                              </button>
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Webhook Secret
                            </label>
                            <div className="flex">
                              <input 
                                type="password" 
                                value="••••••••••••••••••••••••"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                                disabled
                              />
                              <button className="bg-gray-100 px-3 py-2 border border-l-0 border-gray-300 rounded-r-md text-gray-600 hover:bg-gray-200">
                                Show
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-end">
                          <button className="text-blue-500 hover:text-blue-700 text-sm font-medium">
                            Edit Configuration
                          </button>
                        </div>
                      </div>
                      
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center">
                            <img src="https://via.placeholder.com/40x25?text=PayPal" alt="PayPal" className="h-8 mr-3" />
                            <h4 className="font-medium">PayPal</h4>
                          </div>
                          <div className="flex items-center">
                            <span className="mr-2 text-sm font-medium text-gray-400">Inactive</span>
                            <button className="relative inline-flex items-center h-6 rounded-full w-11 bg-gray-300">
                              <span className="inline-block w-4 h-4 transform translate-x-1 rounded-full bg-white"></span>
                            </button>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 text-sm">
                          Connect your PayPal account to accept payments through PayPal.
                        </p>
                        
                        <div className="mt-4">
                          <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">
                            Connect PayPal
                          </button>
                        </div>
                      </div>
                      
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <img src="https://via.placeholder.com/40x25?text=Square" alt="Square" className="h-8 mr-3" />
                            <h4 className="font-medium">Square</h4>
                          </div>
                          <button className="bg-gray-100 text-gray-700 py-1 px-3 rounded text-sm hover:bg-gray-200 transition duration-200">
                            Set Up
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Inventory Settings */}
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Inventory & Availability</h3>
                      <div className="flex items-center">
                        <span className="mr-2 text-sm font-medium text-green-600">Enabled</span>
                        <button className="relative inline-flex items-center h-6 rounded-full w-11 bg-green-500">
                          <span className="inline-block w-4 h-4 transform translate-x-6 rounded-full bg-white"></span>
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4">
                      Configure inventory tracking to automatically update menu item availability based on stock levels.
                    </p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg justify-between">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                          <span className="text-sm">Low Stock Alert</span>
                        </div>
                        <input 
                          type="number" 
                          value="5"
                          className="w-16 px-2 py-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-center"
                        />
                      </div>
                      
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg justify-between">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                          <span className="text-sm">Medium Stock Alert</span>
                        </div>
                        <input 
                          type="number" 
                          value="15"
                          className="w-16 px-2 py-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-center"
                        />
                      </div>
                      
                      <div className="flex items-center">
                        <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" checked />
                        <label className="ml-2 text-gray-700">Auto-hide menu items when out of stock</label>
                      </div>
                      
                      <div className="flex items-center">
                        <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" checked />
                        <label className="ml-2 text-gray-700">Send email notifications on low stock</label>
                      </div>
                      
                      <div className="flex items-center">
                        <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                        <label className="ml-2 text-gray-700">Auto-generate purchase orders</label>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">
                        Save Settings
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 
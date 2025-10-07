import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import ProductList from './components/ProductList.jsx';
import Cart from './components/Cart.jsx';
import AdminPanel from './components/AdminPanel.jsx';
import Login from './components/Login.jsx';
import './App.css';

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:5000/api';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setIsLoading(false);
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/products');
      setProducts(response.data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.productId === product._id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.productId === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { productId: product._id, product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity === 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item =>
        item.productId === productId
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const submitCart = async (customerInfo) => {
    try {
      const cartData = {
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        items: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      };

      const response = await axios.post('/carts/submit', cartData);
      alert('Cart submitted successfully for approval!');
      setCart([]);
      return response.data;
    } catch (error) {
      console.error('Error submitting cart:', error);
      alert('Error submitting cart');
    }
  };

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <h1>Shopping Cart</h1>
          <div className="nav-links">
            {user ? (
              <>
                <span>Welcome, {user.username}</span>
                {user.role === 'admin' && <a href="/admin">Admin Panel</a>}
                <button onClick={logout}>Logout</button>
              </>
            ) : (
              <a href="/login">Login</a>
            )}
            <span className="cart-count">Cart ({cart.length})</span>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={
            <div className="main-content">
              <ProductList 
                products={products} 
                onAddToCart={addToCart} 
              />
              <Cart 
                cart={cart}
                onRemoveFromCart={removeFromCart}
                onUpdateQuantity={updateCartQuantity}
                onSubmitCart={submitCart}
              />
            </div>
          } />
          
          <Route path="/login" element={
            user ? <Navigate to="/" /> : <Login onLogin={login} />
          } />
          
          <Route path="/admin" element={
            user && user.role === 'admin' ? 
              <AdminPanel 
                products={products} 
                onProductsUpdate={fetchProducts} 
              /> : 
              <Navigate to="/login" />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App

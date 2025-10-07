import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = ({ products, onProductsUpdate }) => {
  const [activeTab, setActiveTab] = useState('products');
  const [productForm, setProductForm] = useState({
    name: '', description: '', price: '', category: 'Electronics', stock: '', image: ''
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [carts, setCarts] = useState([]);

  useEffect(() => {
    if (activeTab === 'carts') {
      fetchCarts();
    }
  }, [activeTab]);

  const fetchCarts = async () => {
    try {
      const response = await axios.get('/carts');
      setCarts(response.data.data);
    } catch (error) {
      console.error('Error fetching carts:', error);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await axios.put(`/products/${editingProduct._id}`, productForm);
        alert('Product updated successfully');
      } else {
        await axios.post('/products', productForm);
        alert('Product added successfully');
      }
      resetForm();
      onProductsUpdate();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product');
    }
  };

  const deleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/products/${productId}`);
        alert('Product deleted successfully');
        onProductsUpdate();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product');
      }
    }
  };

  const editProduct = (product) => {
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      image: product.image
    });
    setEditingProduct(product);
  };

  const resetForm = () => {
    setProductForm({
      name: '', description: '', price: '', category: 'Electronics', stock: '', image: ''
    });
    setEditingProduct(null);
  };

  const reviewCart = async (cartId, status, notes = '') => {
    try {
      await axios.put(`/carts/${cartId}/review`, {
        status,
        reviewedBy: 'Admin',
        notes
      });
      alert(`Cart ${status} successfully`);
      fetchCarts();
    } catch (error) {
      console.error('Error reviewing cart:', error);
      alert('Error reviewing cart');
    }
  };

  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>
      
      <div className="admin-tabs">
        <button 
          className={activeTab === 'products' ? 'active' : ''}
          onClick={() => setActiveTab('products')}
        >
          Manage Products
        </button>
        <button 
          className={activeTab === 'carts' ? 'active' : ''}
          onClick={() => setActiveTab('carts')}
        >
          Review Carts
        </button>
      </div>

      {activeTab === 'products' && (
        <div className="products-tab">
          <div className="product-form">
            <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
            <form onSubmit={handleProductSubmit}>
              <input
                type="text"
                placeholder="Product Name"
                value={productForm.name}
                onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                required
              />
              <textarea
                placeholder="Description"
                value={productForm.description}
                onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                required
              />
              <input
                type="number"
                placeholder="Price"
                value={productForm.price}
                onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                required
              />
              <select
                value={productForm.category}
                onChange={(e) => setProductForm({...productForm, category: e.target.value})}
              >
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Books">Books</option>
                <option value="Home">Home</option>
                <option value="Sports">Sports</option>
                <option value="Other">Other</option>
              </select>
              <input
                type="number"
                placeholder="Stock"
                value={productForm.stock}
                onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                required
              />
              <input
                type="url"
                placeholder="Image URL"
                value={productForm.image}
                onChange={(e) => setProductForm({...productForm, image: e.target.value})}
              />
              <div className="form-buttons">
                <button type="submit">
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
                {editingProduct && (
                  <button type="button" onClick={resetForm}>Cancel</button>
                )}
              </div>
            </form>
          </div>

          <div className="products-list">
            <h3>Existing Products</h3>
            {products.map(product => (
              <div key={product._id} className="product-row">
                <span>{product.name} - ${product.price} (Stock: {product.stock})</span>
                <div>
                  <button onClick={() => editProduct(product)}>Edit</button>
                  <button onClick={() => deleteProduct(product._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'carts' && (
        <div className="carts-tab">
          <h3>Cart Submissions</h3>
          {carts.map(cart => (
            <div key={cart._id} className="cart-review">
              <div className="cart-header">
                <h4>Cart by {cart.customerName} ({cart.customerEmail})</h4>
                <span className={`status ${cart.status}`}>{cart.status}</span>
              </div>
              <div className="cart-items">
                {cart.items.map(item => (
                  <div key={item._id} className="cart-item-row">
                    {item.product.name} - Qty: {item.quantity} - ${item.price}
                  </div>
                ))}
              </div>
              <div className="cart-total">Total: ${cart.totalAmount}</div>
              {cart.status === 'pending' && (
                <div className="review-actions">
                  <button 
                    onClick={() => reviewCart(cart._id, 'approved')}
                    className="approve-btn"
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => reviewCart(cart._id, 'declined')}
                    className="decline-btn"
                  >
                    Decline
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
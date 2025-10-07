# Shopping Cart Application

A full-stack shopping cart application with React frontend, Node.js Express backend, and MongoDB database.

## Features

### Customer Features
- ✅ View products
- ✅ Add products to cart
- ✅ Remove products from cart
- ✅ Submit cart for approval

### Admin Features
- ✅ Add new products
- ✅ Remove products
- ✅ Approve/decline cart submissions

## Tech Stack

- **Frontend**: React 19, Vite, Axios, React Router DOM
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT, bcryptjs
- **Architecture**: MVC Pattern
- **Development**: Nodemon, ESLint

## Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB (running locally or connection string)

### Backend Setup

1. Navigate to backend directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create .env file in server directory:
```bash
# server/.env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/shopping-cart
JWT_SECRET=our-ahad-secret-jwt-key-here
NODE_ENV=development
```

4. Start the backend server:
```bash
npm run dev
```

Backend will run on http://localhost:5000

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm run dev
```

Frontend will run on http://localhost:5173

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Carts
- `POST /api/carts/submit` - Submit cart for approval
- `GET /api/carts` - Get all carts (Admin)
- `PUT /api/carts/:id/review` - Approve/decline cart (Admin)

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

## Usage

1. **Register/Login**: Create an account (choose 'admin' role for admin access)
2. **Browse Products**: View available products on the homepage
3. **Add to Cart**: Click "Add to Cart" on any product
4. **Manage Cart**: Adjust quantities or remove items
5. **Submit Cart**: Fill in customer details and submit for approval
6. **Admin Panel**: Login as admin to manage products and review carts

## Demo Credentials

Create an admin user by registering with role 'admin' or use the registration form.

## Additional Features

- ✅ **Form Validation**: Client-side and server-side validation
- ✅ **Error Handling**: Comprehensive error messages
- ✅ **Loading States**: Visual feedback during operations
- ✅ **Responsive Design**: Mobile-friendly interface
- ✅ **JWT Authentication**: Secure user sessions
- ✅ **Role-based Access**: Customer and Admin roles

## Quick Start (Both Client & Server)

Run both client and server simultaneously:
```bash
npm run dev
```

This will start:
- Backend server on http://localhost:5000
- Frontend client on http://localhost:5173

## Project Structure

```
knikam3027-task/
├── server/              # Backend API
│   ├── src/
│   │   ├── controllers/ # Business logic
│   │   ├── middleware/  # Authentication & validation
│   │   ├── models/      # MongoDB schemas
│   │   ├── routes/      # API routes
│   │   └── server.js    # Main server file
│   └── package.json
├── client/              # Frontend React App
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── App.jsx      # Main app component
│   │   ├── App.css      # Styles
│   │   └── main.jsx     # Entry point
│   ├── vite.config.js   # Vite configuration
│   └── package.json
├── package.json         # Root package for scripts
└── .gitignore           # Git ignore file
```
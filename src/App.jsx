import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RoleSelection from './pages/RoleSelection';
import Registration from './pages/Registration';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SupplierDashboard from './pages/supplier/SupplierDashboard';
import MyProducts from './pages/supplier/MyProducts';
import AddProduct from './pages/supplier/AddProduct';
import BuyerDashboard from './pages/buyer/BuyerDashboard';
import SearchProducts from './pages/buyer/SearchProducts';
import Negotiation from './pages/buyer/Negotiation';
import OfferSummary from './pages/buyer/OfferSummary';
import InvoicePreview from './pages/buyer/InvoicePreview';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoleSelection />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Supplier Routes */}
        <Route path="/supplier/dashboard" element={<SupplierDashboard />} />
        <Route path="/supplier/products" element={<MyProducts />} />
        <Route path="/supplier/add-product" element={<AddProduct />} />

        {/* Buyer Routes */}
        <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
        <Route path="/buyer/search" element={<SearchProducts />} />
        <Route path="/buyer/negotiation" element={<Negotiation />} />
        <Route path="/buyer/offer-summary" element={<OfferSummary />} />
        <Route path="/buyer/invoice-preview" element={<InvoicePreview />} />
      </Routes>
    </Router>
  );
}

export default App;

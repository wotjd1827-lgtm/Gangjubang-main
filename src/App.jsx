import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Layout & Common Components
import Header from './components/Header';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';

// Pages
import Homepage from './pages/Homepage';
import AdminLayout from './pages/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminCustomers from './pages/AdminCustomers';
import AdminReports from './pages/AdminReports';

// Mock Data
import { initialCustomers, mockInquiries } from './data/mockData';

// Scroll Restoration helper
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [inquiries, setInquiries] = useState(mockInquiries);
  
  // Auth Modal State
  const [authModal, setAuthModal] = useState({
    isOpen: false,
    mode: 'login' // 'login' or 'signup'
  });

  const handleOpenLogin = (mode = 'login') => {
    setAuthModal({
      isOpen: true,
      mode
    });
  };

  const handleCloseLogin = () => {
    setAuthModal(prev => ({
      ...prev,
      isOpen: false
    }));
  };

  return (
    <>
      <ScrollToTop />
      
      <Routes>
        {/* Public Homepage Route */}
        <Route 
          path="/" 
          element={
            <div className="app-public-container">
              <Header onOpenLogin={handleOpenLogin} />
              <main className="app-main-content" style={{ paddingTop: '0' }}>
                <Homepage onOpenLogin={handleOpenLogin} />
              </main>
              <Footer />
            </div>
          } 
        />

        {/* Admin CRM Console Routes */}
        <Route 
          path="/admin" 
          element={
            <AdminLayout 
              customers={customers} 
              setCustomers={setCustomers} 
              inquiries={inquiries} 
              setInquiries={setInquiries} 
            />
          }
        >
          {/* Default admin redirect to dashboard */}
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          
          <Route 
            path="dashboard" 
            element={
              <AdminDashboard />
            } 
          />
          
          <Route 
            path="customers" 
            element={
              <AdminCustomers />
            } 
          />
          
          <Route 
            path="reports" 
            element={
              <AdminReports />
            } 
          />
        </Route>

        {/* Fallback redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global Auth Modal */}
      <LoginModal 
        isOpen={authModal.isOpen} 
        mode={authModal.mode} 
        onClose={handleCloseLogin} 
      />
    </>
  );
}

import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { supabase } from './supabaseClient';

// Layout & Common Components
import Header from './components/Header';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';

// Static page import for homepage
import Homepage from './pages/Homepage';

// Lazy-loaded routes for code splitting
const SignupPage = lazy(() => import('./pages/SignupPage'));
const AdminLayout = lazy(() => import('./pages/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminCustomers = lazy(() => import('./pages/AdminCustomers'));
const AdminReports = lazy(() => import('./pages/AdminReports'));

// Mock Data
import { mockInquiries } from './data/mockData';

// Fallback Loading Component
function PageLoader() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid rgba(255, 255, 255, 0.1)',
        borderTopColor: '#ff5722',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <span style={{ color: '#888', fontSize: '14px' }}>페이지 로딩 중...</span>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// Scroll Restoration helper
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function deduplicateCustomers(list) {
  if (!Array.isArray(list)) return [];
  const seen = new Set();
  return list.filter(c => {
    const key = (c.phone && String(c.phone).trim()) 
      ? `${String(c.name || '').trim()}_${String(c.phone).trim()}` 
      : `${String(c.name || '').trim()}_${c.id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export default function App() {
  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('gangjubang_customers');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return deduplicateCustomers(parsed);
      } catch (e) {
        console.error('Error loading saved customers:', e);
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('gangjubang_customers', JSON.stringify(deduplicateCustomers(customers)));
  }, [customers]);

  const [inquiries, setInquiries] = useState(mockInquiries);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Auth Modal State
  const [authModal, setAuthModal] = useState({
    isOpen: false,
    mode: 'login' // 'login' or 'signup'
  });

  // Track Supabase Auth Session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch initial data from Supabase DB
  useEffect(() => {
    async function loadSupabaseData() {
      try {
        const { data: dbCustomers } = await supabase.from('customers').select('*');
        if (dbCustomers && dbCustomers.length > 0) {
          const formatted = dbCustomers.map(c => ({
            id: c.id,
            name: c.name,
            grade: c.grade || 'BRONZE',
            age: c.age || 30,
            gender: c.gender || '남',
            frequency: c.frequency || 1,
            totalAmount: Number(c.total_amount || 0),
            points: Number(c.points || 0),
            phone: c.phone || '',
            email: c.email || '',
            regDate: c.reg_date || new Date().toISOString().split('T')[0],
            address: c.address || ''
          }));
          setCustomers(deduplicateCustomers(formatted));
        }
      } catch (err) {
        console.log('Customers table fetch fallback active:', err?.message || err);
      }

      try {
        const { data: dbInquiries } = await supabase.from('inquiries').select('*');
        if (dbInquiries && dbInquiries.length > 0) {
          const formattedInq = dbInquiries.map(i => ({
            id: i.id,
            name: i.name,
            type: i.consult_type || i.type || '3D 도면 컨설팅',
            status: i.status || '대기',
            date: i.created_at ? i.created_at.split('T')[0] : '2026-08-11'
          }));
          setInquiries(formattedInq);
        }
      } catch (err) {
        console.log('Inquiries table fetch fallback active:', err?.message || err);
      }
    }

    loadSupabaseData();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setCurrentUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

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
      
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Homepage Route */}
          <Route 
            path="/" 
            element={
              <div className="app-public-container">
                <Header onOpenLogin={handleOpenLogin} currentUser={currentUser} onLogout={handleLogout} />
                <main className="app-main-content" style={{ paddingTop: '0' }}>
                  <Homepage onOpenLogin={handleOpenLogin} />
                </main>
                <Footer />
              </div>
            } 
          />

          {/* Signup Page Route */}
          <Route 
            path="/signup" 
            element={
              <SignupPage onOpenLogin={handleOpenLogin} />
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
      </Suspense>

      {/* Global Auth Modal */}
      <LoginModal 
        isOpen={authModal.isOpen} 
        mode={authModal.mode} 
        onClose={handleCloseLogin} 
      />
    </>
  );
}

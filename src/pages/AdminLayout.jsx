import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard, Users, BarChart3, Home, Menu, X, LogOut, Shield } from 'lucide-react';

const BASE = '/';

export default function AdminLayout({ customers, setCustomers, inquiries, setInquiries }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("관리자 로그아웃 하시겠습니까?")) {
      navigate('/');
    }
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <Link to="/" className="sidebar-logo">
            <img src={`${BASE}images/logo.png`} alt="강주방 CRM" className="sidebar-logo-img" />
          </Link>
          <button className="sidebar-close-btn" onClick={() => setIsSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <NavLink 
            to="/admin/dashboard" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <LayoutDashboard size={18} />
            <span>대시보드</span>
          </NavLink>
          
          <NavLink 
            to="/admin/customers" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <Users size={18} />
            <span>고객관리 (CRM)</span>
          </NavLink>
          
          <NavLink 
            to="/admin/reports" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <BarChart3 size={18} />
            <span>통계 / 리포트</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <Link to="/" className="sidebar-link-btn text-link">
            <Home size={18} />
            <span>메인 홈페이지 가기</span>
          </Link>
          <button onClick={handleLogout} className="sidebar-link-btn logout-link">
            <LogOut size={18} />
            <span>로그아웃</span>
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="admin-main">
        {/* Top Navbar */}
        <header className="admin-topbar">
          <div className="topbar-left">
            <button className="sidebar-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <Menu size={20} />
            </button>
            <h2 className="topbar-page-title">강주방 관리 서비스</h2>
          </div>

          <div className="topbar-right">
            <div className="admin-badge">
              <Shield size={14} />
              <span>최고 관리자</span>
            </div>
            <div className="admin-profile">
              <div className="profile-avatar">김</div>
              <div className="profile-info">
                <span className="profile-name">김재성 대표</span>
                <span className="profile-role">경상코리아</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="admin-content-viewport">
          <Outlet context={{ customers, setCustomers, inquiries, setInquiries }} />
        </main>
      </div>

      <style>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
          background-color: var(--color-gray-ultra);
          color: var(--color-charcoal);
        }
        
        /* Sidebar Styles */
        .admin-sidebar {
          width: 260px;
          background-color: var(--color-charcoal);
          color: var(--color-gray-light);
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          z-index: 1001;
          transition: transform var(--transition-normal);
          border-right: 1px solid var(--color-gray-dark);
        }
        
        .admin-sidebar.closed {
          transform: translateX(-260px);
        }
        
        .sidebar-header {
          padding: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .sidebar-logo {
          display: flex;
          align-items: center;
          width: 100%;
        }
        
        .sidebar-logo-img {
          height: 40px;
          object-fit: contain;
          background-color: #FAF7F2;
          padding: 4px 14px;
          border-radius: var(--radius-md);
        }
        
        .sidebar-close-btn {
          display: none;
          color: var(--color-gray-medium);
        }
        
        .sidebar-nav {
          padding: 24px 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex-grow: 1;
        }
        
        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: var(--radius-md);
          font-size: 14px;
          color: var(--color-gray-medium);
          transition: all var(--transition-fast);
        }
        
        .sidebar-link:hover {
          color: white;
          background-color: rgba(255, 255, 255, 0.05);
        }
        
        .sidebar-link.active {
          color: white;
          background-color: var(--color-primary);
          font-weight: 700;
          box-shadow: var(--shadow-sm);
        }
        
        .sidebar-footer {
          padding: 24px 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .sidebar-link-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 16px;
          border-radius: var(--radius-md);
          font-size: 13px;
          width: 100%;
          text-align: left;
          transition: all var(--transition-fast);
        }
        
        .text-link {
          color: var(--color-gray-medium);
        }
        
        .text-link:hover {
          color: white;
          background-color: rgba(255, 255, 255, 0.05);
        }
        
        .logout-link {
          color: #E29A8A;
        }
        
        .logout-link:hover {
          background-color: rgba(226, 154, 138, 0.08);
        }
        
        /* Main Panel Styles */
        .admin-main {
          flex-grow: 1;
          margin-left: 260px;
          min-width: 0;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          transition: margin var(--transition-normal);
        }
        
        .admin-sidebar.closed ~ .admin-main {
          margin-left: 0;
        }
        
        /* Top bar */
        .admin-topbar {
          height: 70px;
          background-color: #ffffff;
          border-bottom: 1px solid var(--color-gray-light);
          padding: 0 30px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 1000;
        }
        
        .topbar-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .sidebar-toggle {
          color: var(--color-gray-dark);
          padding: 6px;
          border-radius: 4px;
        }
        
        .sidebar-toggle:hover {
          background-color: var(--color-gray-ultra);
        }
        
        .topbar-page-title {
          font-size: 18px;
          font-weight: 700;
          color: var(--color-charcoal);
        }
        
        .topbar-right {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        
        .admin-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background-color: var(--color-primary-light);
          color: var(--color-primary-dark);
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 50px;
        }
        
        .admin-profile {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .profile-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: var(--color-secondary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }
        
        .profile-info {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
        }
        
        .profile-name {
          font-size: 13px;
          font-weight: 700;
          color: var(--color-charcoal);
        }
        
        .profile-role {
          font-size: 11px;
          color: var(--color-gray-dark);
        }
        
        /* Viewport */
        .admin-content-viewport {
          padding: 30px;
          flex-grow: 1;
          overflow-y: auto;
        }
        
        @media (max-width: 991px) {
          .admin-sidebar {
            transform: translateX(-260px);
          }
          
          .admin-sidebar.open {
            transform: translateX(0);
          }
          
          .admin-main {
            margin-left: 0 !important;
          }
          
          .sidebar-close-btn {
            display: flex;
          }
        }
      `}</style>
    </div>
  );
}

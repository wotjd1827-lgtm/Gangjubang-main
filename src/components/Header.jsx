import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Menu, X, LogOut, ShieldCheck } from 'lucide-react';

const BASE = '/';

export default function Header({ onOpenLogin, currentUser, onLogout }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    if (location.pathname !== '/') {
      window.location.href = '/#' + targetId;
    } else {
      const element = document.getElementById(targetId);
      if (element) {
        const offset = 75;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }
  };

  const displayName = currentUser?.user_metadata?.name || currentUser?.email?.split('@')[0] || '회원';

  return (
    <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
      <Link to="/" className="header-logo">
        <img 
          src={`${BASE}images/logo.png`}
          alt="강주방" 
          className="logo-img" 
        />
      </Link>

      <nav className="header-nav">
        <ul>
          <li><a href="#about" onClick={(e) => handleNavClick(e, 'about')}>회사소개</a></li>
          <li><a href="#business" onClick={(e) => handleNavClick(e, 'business')}>사업영역</a></li>
          <li><a href="#strengths" onClick={(e) => handleNavClick(e, 'strengths')}>경쟁력</a></li>
          <li><a href="#portfolio" onClick={(e) => handleNavClick(e, 'portfolio')}>납품실적</a></li>
          <li><a href="#consulting" onClick={(e) => handleNavClick(e, 'consulting')}>문의하기</a></li>
        </ul>
      </nav>

      <div className="header-right">
        {currentUser ? (
          <>
            <div className="user-profile-badge">
              <User size={14} />
              <span><strong>{displayName}</strong>님</span>
            </div>
            <Link to="/admin" className="header-auth-btn admin-link" style={{ textDecoration: 'none' }}>
              <ShieldCheck size={14} />
              <span>관리자 CRM</span>
            </Link>
            <button onClick={onLogout} className="header-auth-btn logout">
              <LogOut size={14} />
              <span>로그아웃</span>
            </button>
          </>
        ) : (
          <>
            <button onClick={() => onOpenLogin('login')} className="header-auth-btn">
              <User size={16} />
              <span>로그인</span>
            </button>
            <Link to="/signup" className="header-auth-btn signup" style={{ textDecoration: 'none' }}>
              <span>회원가입</span>
            </Link>
          </>
        )}
      </div>

      {/* Mobile Toggle */}
      <button className="mobile-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <nav>
            <a href="#about" onClick={(e) => handleNavClick(e, 'about')}>회사소개</a>
            <a href="#business" onClick={(e) => handleNavClick(e, 'business')}>사업영역</a>
            <a href="#strengths" onClick={(e) => handleNavClick(e, 'strengths')}>경쟁력</a>
            <a href="#portfolio" onClick={(e) => handleNavClick(e, 'portfolio')}>납품실적</a>
            <a href="#consulting" onClick={(e) => handleNavClick(e, 'consulting')}>문의하기</a>
          </nav>
          <div className="mobile-auth">
            {currentUser ? (
              <>
                <div className="text-center font-bold mb-2">
                  <span>{displayName}님 로그인됨</span>
                </div>
                <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="btn btn-secondary w-full text-center" style={{ textDecoration: 'none' }}>
                  관리자 CRM 바로가기
                </Link>
                <button onClick={() => { setIsMobileMenuOpen(false); onLogout(); }} className="btn btn-primary w-full">
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <button onClick={() => { setIsMobileMenuOpen(false); onOpenLogin('login'); }} className="btn btn-secondary w-full">로그인</button>
                <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="btn btn-primary w-full text-center" style={{ textDecoration: 'none' }}>회원가입</Link>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        .site-header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 75px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 40px;
          z-index: 1000;
          background: transparent;
          border-bottom: 1px solid rgba(255, 255, 255, 0.25);
          transition: all 0.35s ease;
        }

        .site-header.scrolled {
          background: rgba(255, 255, 255, 0.97);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid #ebe5df;
          box-shadow: 0 2px 16px rgba(0,0,0,0.06);
        }

        /* Logo */
        .header-logo {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        .logo-img {
          width: 120px;
          height: auto;
          object-fit: contain;
          transition: all 0.3s ease;
          /* On transparent header over dark hero: crisp white with subtle blue glow */
          filter: brightness(0) invert(1) drop-shadow(0 0 8px rgba(37, 99, 235, 0.4));
        }

        .site-header.scrolled .logo-img {
          /* On scrolled header: Deep Navy Blue (#0F2C59) */
          filter: brightness(0) saturate(100%) invert(11%) sepia(94%) saturate(3695%) hue-rotate(213deg) brightness(92%) contrast(98%);
          width: 110px;
        }

        /* Navigation */
        .header-nav {
          flex: 1;
          display: flex;
          justify-content: center;
        }

        .header-nav ul {
          display: flex;
          align-items: center;
          list-style: none;
          gap: 0;
          height: 75px;
        }

        .header-nav ul li {
          height: 100%;
          display: flex;
          align-items: center;
        }

        .header-nav ul li a {
          display: flex;
          align-items: center;
          height: 100%;
          padding: 0 28px;
          font-size: 16px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.9);
          letter-spacing: -0.3px;
          transition: all 0.25s ease;
          border-bottom: 3px solid transparent;
          text-decoration: none;
        }

        .header-nav ul li a:hover {
          font-weight: 700;
          color: #fff;
          border-bottom-color: #fff;
        }

        .site-header.scrolled .header-nav ul li a {
          color: var(--color-charcoal);
        }

        .site-header.scrolled .header-nav ul li a:hover {
          color: var(--color-primary);
          border-bottom-color: var(--color-primary);
        }

        /* Right section */
        .header-right {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        .header-auth-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          font-size: 14px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.85);
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .header-auth-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          color: #fff;
        }

        .header-auth-btn.signup {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.4);
        }

        .user-profile-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.95);
          background: rgba(255, 255, 255, 0.12);
          padding: 6px 14px;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.25);
        }

        .site-header.scrolled .user-profile-badge {
          color: var(--color-charcoal);
          background: var(--color-primary-light);
          border-color: var(--color-primary);
        }

        .header-auth-btn.admin-link {
          background: var(--color-primary);
          color: #fff;
          border-color: var(--color-primary);
        }

        .header-auth-btn.logout {
          color: #fca5a5;
          border-color: rgba(239, 68, 68, 0.4);
        }

        .site-header.scrolled .header-auth-btn.logout {
          color: #dc2626;
          border-color: rgba(220, 38, 38, 0.3);
        }

        .site-header.scrolled .header-auth-btn {
          color: var(--color-charcoal);
          border-color: var(--color-gray-light);
        }

        .site-header.scrolled .header-auth-btn:hover {
          background: var(--color-primary-light);
          border-color: var(--color-primary);
          color: var(--color-primary);
        }

        .site-header.scrolled .header-auth-btn.signup {
          background: var(--color-primary);
          color: #fff;
          border-color: var(--color-primary);
        }

        .site-header.scrolled .header-auth-btn.signup:hover {
          background: var(--color-primary-hover);
        }

        /* Mobile */
        .mobile-toggle {
          display: none;
          color: rgba(255, 255, 255, 0.9);
          padding: 4px;
        }

        .site-header.scrolled .mobile-toggle {
          color: var(--color-charcoal);
        }

        .mobile-menu {
          display: none;
        }

        @media (max-width: 991px) {
          .site-header {
            padding: 0 20px;
          }

          .header-nav, .header-right {
            display: none;
          }

          .mobile-toggle {
            display: flex;
            align-items: center;
          }

          .mobile-menu {
            display: flex;
            flex-direction: column;
            position: fixed;
            top: 75px;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(20px);
            padding: 24px;
            z-index: 999;
            animation: fadeIn 0.2s ease;
          }

          .mobile-menu nav {
            display: flex;
            flex-direction: column;
          }

          .mobile-menu nav a {
            padding: 16px 0;
            font-size: 18px;
            font-weight: 600;
            color: var(--color-charcoal);
            border-bottom: 1px solid var(--color-gray-light);
            text-decoration: none;
          }

          .mobile-menu nav a:hover {
            color: var(--color-primary);
          }

          .mobile-auth {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-top: 24px;
          }
        }
      `}</style>
    </header>
  );
}

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, Lock, Mail, User, Phone, CheckCircle2, Loader2, 
  Eye, EyeOff, UserPlus, LogIn, ArrowRight 
} from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function LoginModal({ isOpen, mode, onClose }) {
  const navigate = useNavigate();
  const [currentMode, setCurrentMode] = useState(mode); // 'login' or 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Sync state with prop mode on open
  useEffect(() => {
    setCurrentMode(mode);
    setShowPassword(false);
    setIsSuccess(false);
    setError('');
    setEmail('');
    setPassword('');
    setName('');
    setPhone('');
  }, [mode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Simple validation
    if (!email || !password) {
      setError('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }
    
    if (currentMode === 'signup' && (!name || !phone)) {
      setError('이름과 전화번호를 모두 입력해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      if (currentMode === 'signup') {
        const { error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name, phone }
          }
        });
        if (authError) throw authError;

        // Also add customer record to customers table if available
        try {
          await supabase.from('customers').insert([
            { name, email, phone, grade: 'BRONZE', age: 30, gender: '남', frequency: 1, total_amount: 0, points: 1000 }
          ]);
        } catch (dbErr) {
          console.log('Customers table sync skipped:', dbErr);
        }

        setIsSuccess(true);
      } else {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (authError) throw authError;

        setIsSuccess(true);
      }
    } catch (err) {
      console.error('Supabase Auth error:', err);
      let msg = err.message || '인증 처리 중 오류가 발생했습니다.';
      if (msg.includes('Email not confirmed')) {
        msg = '이메일 인증이 아직 완료되지 않은 계정입니다. 수신함의 인증 링크를 확인하시거나 Supabase 설정에서 Confirm Email을 해제해 주세요.';
      } else if (msg.includes('Invalid login credentials')) {
        msg = '이메일 주소 또는 비밀번호가 일치하지 않습니다.';
      }
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content glass-card animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="닫기">
          <X size={20} />
        </button>

        {/* Header Tab Switcher */}
        <div className="modal-header-nav">
          <button 
            type="button" 
            className={`nav-tab-btn ${currentMode === 'login' ? 'active' : ''}`}
            onClick={() => setCurrentMode('login')}
          >
            <LogIn size={16} />
            <span>로그인</span>
          </button>
          <button 
            type="button" 
            className={`nav-tab-btn signup-tab ${currentMode === 'signup' ? 'active' : ''}`}
            onClick={() => setCurrentMode('signup')}
          >
            <UserPlus size={16} />
            <span>회원가입</span>
          </button>
        </div>

        {isSuccess ? (
          <div className="modal-success text-center">
            <CheckCircle2 size={64} className="success-icon animate-pulse" />
            <h3 className="success-title">
              {currentMode === 'login' ? '로그인 완료' : '회원가입 완료'}
            </h3>
            <p className="success-desc">
              {currentMode === 'login' 
                ? '강주방 CRM 시스템에 성공적으로 로그인하셨습니다.' 
                : '강주방의 새로운 회원이 되신 것을 진심으로 환영합니다!'}
            </p>
            <div className="supabase-alert">
              <strong>[Supabase 실시간 인증 연동 완료]</strong>
              <p>Supabase 클라우드 보안 인증 및 사용자 세션이 성공적으로 동기화되었습니다.</p>
            </div>
            <button className="btn btn-primary w-full" onClick={onClose}>
              확인
            </button>
          </div>
        ) : (
          <div>
            <div className="brand-badge-header">
              <span className="brand-logo-text">강주방 STRONG KITCHEN</span>
            </div>

            <h3 className="modal-title">
              {currentMode === 'login' ? '강주방 계정 로그인' : '강주방 신규 회원가입'}
            </h3>
            <p className="modal-subtitle">
              {currentMode === 'login' 
                ? '관리자 및 파트너 서비스를 이용하시려면 로그인해 주세요.' 
                : '강주방 파트너가 되어 맞춤 3D 주방 컨설팅을 시작해 보세요.'}
            </p>

            {error && <div className="form-error-msg">{error}</div>}

            <form onSubmit={handleSubmit} className="modal-form">
              {currentMode === 'signup' && (
                <>
                  <div className="form-group">
                    <label className="form-label">성함 / 대표자명</label>
                    <div className="input-with-icon">
                      <User size={18} className="input-icon" />
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="홍길동 대표"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">연락처 (전화번호)</label>
                    <div className="input-with-icon">
                      <Phone size={18} className="input-icon" />
                      <input 
                        type="tel" 
                        className="form-control" 
                        placeholder="010-1234-5678"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="form-group">
                <label className="form-label">이메일 주소</label>
                <div className="input-with-icon">
                  <Mail size={18} className="input-icon" />
                  <input 
                    type="email" 
                    className="form-control" 
                    placeholder="example@gangjubang.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">비밀번호</label>
                <div className="input-with-icon password-input-group">
                  <Lock size={18} className="input-icon" />
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    className="form-control password-input" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button 
                    type="button" 
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                    aria-label="비밀번호 표시 토글"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-full modal-submit-btn" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={18} className="animate-spin" />
                    <span>인증 처리 중...</span>
                  </span>
                ) : (
                  currentMode === 'login' ? '로그인하기' : '회원가입 등록'
                )}
              </button>
            </form>

            {/* Clear Signup Promotion Action Card */}
            {currentMode === 'login' && (
              <div className="signup-highlight-card">
                <div className="signup-card-info">
                  <span className="signup-badge">신규 혜택</span>
                  <div>
                    <strong>강주방 회원이 아니신가요?</strong>
                    <p>간편 회원가입 시 3D 주방 컨설팅 및 1,000p 포인트를 즉시 드립니다.</p>
                  </div>
                </div>
                <button 
                  type="button" 
                  className="btn btn-signup-highlight"
                  onClick={() => {
                    onClose();
                    navigate('/signup');
                  }}
                >
                  <UserPlus size={15} />
                  <span>회원가입 전용 페이지로 이동</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            )}

            {currentMode === 'signup' && (
              <div className="modal-mode-toggle text-center">
                <p>
                  이미 가입된 계정이 있으신가요?{' '}
                  <button onClick={() => setCurrentMode('login')} className="toggle-link">
                    로그인하기
                  </button>
                </p>
              </div>
            )}
            
            <div className="supabase-badge-mini">
              <span>POWERED BY SUPABASE AUTH</span>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(7, 19, 37, 0.65);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        
        .modal-content {
          width: 100%;
          max-width: 460px;
          padding: 36px 32px 32px;
          position: relative;
          background: #ffffff;
          border-radius: 24px;
          box-shadow: 0 25px 60px -10px rgba(15, 44, 89, 0.35);
          border: 1px solid #E2E8F0;
          color: #0F172A;
          text-align: left;
        }
        
        .modal-close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          color: #94A3B8;
          padding: 6px;
          border-radius: 50%;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .modal-close-btn:hover {
          background-color: #E2E8F0;
          color: #0F2C59;
        }

        .modal-header-nav {
          display: flex;
          background: #F1F5F9;
          padding: 4px;
          border-radius: 12px;
          margin-bottom: 20px;
          border: 1px solid #E2E8F0;
        }

        .nav-tab-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 12px;
          border-radius: 9px;
          font-size: 13px;
          font-weight: 700;
          color: #64748B;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .nav-tab-btn.active {
          background: #0F2C59;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(15, 44, 89, 0.2);
        }

        .nav-tab-btn.signup-tab.active {
          background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
        }

        .brand-badge-header {
          margin-bottom: 6px;
        }

        .brand-logo-text {
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 1.5px;
          color: #2563EB;
          background: #EFF6FF;
          padding: 3px 8px;
          border-radius: 6px;
          display: inline-block;
        }
        
        .modal-title {
          font-size: 22px;
          font-weight: 800;
          color: #0F2C59;
          margin-bottom: 4px;
        }
        
        .modal-subtitle {
          font-size: 13px;
          color: #64748B;
          margin-bottom: 20px;
        }
        
        .modal-form {
          margin-bottom: 16px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-label {
          font-size: 13px;
          font-weight: 700;
          color: #334155;
        }
        
        .input-with-icon {
          position: relative;
        }
        
        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #94A3B8;
          pointer-events: none;
        }
        
        .input-with-icon .form-control {
          width: 100%;
          padding: 10px 42px 10px 42px;
          border-radius: 10px;
          border: 1px solid #CBD5E1;
          font-size: 14px;
          color: #0F172A;
          background: #ffffff;
          transition: all 0.2s ease;
          outline: none;
          box-sizing: border-box;
        }

        .input-with-icon .form-control:focus {
          border-color: #2563EB;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
        }

        .password-toggle-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #94A3B8;
          padding: 4px;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s ease;
        }

        .password-toggle-btn:hover {
          color: #0F2C59;
          background: #F1F5F9;
        }
        
        .modal-submit-btn {
          margin-top: 8px;
          padding: 12px;
          font-size: 15px;
          font-weight: 800;
          border-radius: 10px;
          background: linear-gradient(135deg, #0F2C59 0%, #2563EB 100%);
          color: #ffffff;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 14px rgba(37, 99, 235, 0.25);
        }

        .modal-submit-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(37, 99, 235, 0.35);
        }
        
        .form-error-msg {
          background-color: #FEF2F2;
          border: 1px solid #FCA5A5;
          color: #991B1B;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 16px;
          text-align: left;
        }
        
        .signup-highlight-card {
          background: linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%);
          border: 1px solid #BFDBFE;
          border-radius: 14px;
          padding: 14px 16px;
          margin-top: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .signup-card-info {
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }

        .signup-badge {
          background: #2563EB;
          color: #ffffff;
          font-size: 10px;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 4px;
          white-space: nowrap;
          margin-top: 2px;
        }

        .signup-card-info strong {
          font-size: 13px;
          color: #0F2C59;
          display: block;
        }

        .signup-card-info p {
          font-size: 12px;
          color: #475569;
          margin-top: 2px;
          line-height: 1.4;
        }

        .btn-signup-highlight {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 9px 14px;
          border-radius: 9px;
          background: linear-gradient(135deg, #1E3E62 0%, #2563EB 100%);
          color: #ffffff;
          font-size: 13px;
          font-weight: 700;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-signup-highlight:hover {
          background: linear-gradient(135deg, #0F2C59 0%, #1D4ED8 100%);
          transform: translateY(-1px);
        }

        .modal-mode-toggle {
          font-size: 13px;
          color: #64748B;
          margin-top: 12px;
        }
        
        .toggle-link {
          color: #2563EB;
          font-weight: 700;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
        }
        
        .toggle-link:hover {
          text-decoration: underline;
        }
        
        .supabase-badge-mini {
          display: flex;
          justify-content: center;
          margin-top: 16px;
          padding-top: 12px;
          border-top: 1px solid #F1F5F9;
        }
        
        .supabase-badge-mini span {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1px;
          color: #2563EB;
          background: #EFF6FF;
          padding: 3px 10px;
          border-radius: 50px;
          border: 1px solid #BFDBFE;
        }

        /* Success screen styling */
        .modal-success {
          padding: 20px 0;
        }
        
        .success-icon {
          color: #10B981;
          margin-bottom: 16px;
          display: inline-block;
        }
        
        .success-title {
          font-size: 22px;
          font-weight: 800;
          color: #0F2C59;
          margin-bottom: 8px;
        }
        
        .success-desc {
          font-size: 14px;
          color: #475569;
          margin-bottom: 20px;
        }
        
        .supabase-alert {
          background-color: #EFF6FF;
          border-left: 4px solid #2563EB;
          color: #1E3E62;
          padding: 14px;
          border-radius: 8px;
          font-size: 12px;
          text-align: left;
          margin-bottom: 24px;
        }
        
        .supabase-alert strong {
          display: block;
          margin-bottom: 4px;
          font-weight: 700;
          color: #0F2C59;
        }
      `}</style>
    </div>
  );
}


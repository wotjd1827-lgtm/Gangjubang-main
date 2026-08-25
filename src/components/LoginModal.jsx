import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function LoginModal({ isOpen, mode, onClose }) {
  const [currentMode, setCurrentMode] = useState(mode); // 'login' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Sync state with prop mode on open
  React.useEffect(() => {
    setCurrentMode(mode);
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
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {isSuccess ? (
          <div className="modal-success text-center">
            <CheckCircle2 size={64} className="success-icon animate-pulse" />
            <h3 className="success-title">
              {currentMode === 'login' ? '로그인 완료' : '회원가입 완료'}
            </h3>
            <p className="success-desc">
              {currentMode === 'login' 
                ? '강주방 시스템에 성공적으로 로그인했습니다.' 
                : '강주방의 새로운 회원이 되신 것을 축하합니다!'}
            </p>
            <div className="supabase-alert">
              <strong>[Supabase 실시간 연동 완료]</strong>
              <p>Supabase 인증(Authentication) 및 데이터베이스에 성공적으로 연결되었습니다.</p>
            </div>
            <button className="btn btn-primary w-full" onClick={onClose}>
              확인
            </button>
          </div>
        ) : (
          <div>
            <h3 className="modal-title">
              {currentMode === 'login' ? '강주방 로그인' : '강주방 회원가입'}
            </h3>
            <p className="modal-subtitle">
              {currentMode === 'login' 
                ? '관리자 및 파트너 서비스를 이용하시려면 로그인하세요.' 
                : '강주방의 파트너가 되어 주방 설계를 시작해보세요.'}
            </p>

            {error && <div className="form-error-msg">{error}</div>}

            <form onSubmit={handleSubmit} className="modal-form">
              {currentMode === 'signup' && (
                <>
                  <div className="form-group">
                    <label className="form-label">이름</label>
                    <div className="input-with-icon">
                      <User size={18} className="input-icon" />
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="홍길동"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">연락처</label>
                    <div className="input-with-icon">
                      <Phone size={18} className="input-icon" />
                      <input 
                        type="tel" 
                        className="form-control" 
                        placeholder="010-1234-5678"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
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
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">비밀번호</label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input 
                    type="password" 
                    className="form-control" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-full modal-submit-btn" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={18} className="animate-spin" />
                    <span>처리 중...</span>
                  </span>
                ) : (
                  currentMode === 'login' ? '로그인' : '회원가입'
                )}
              </button>
            </form>

            <div className="modal-mode-toggle text-center">
              {currentMode === 'login' ? (
                <p>
                  계정이 없으신가요?{' '}
                  <button onClick={() => setCurrentMode('signup')} className="toggle-link">
                    회원가입하기
                  </button>
                </p>
              ) : (
                <p>
                  이미 계정이 있으신가요?{' '}
                  <button onClick={() => setCurrentMode('login')} className="toggle-link">
                    로그인하기
                  </button>
                </p>
              )}
            </div>
            
            <div className="supabase-badge-mini">
              <span>POWERED BY SUPABASE</span>
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
          background: rgba(46, 41, 37, 0.4);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        
        .modal-content {
          width: 100%;
          max-width: 440px;
          padding: 40px;
          position: relative;
          color: var(--color-charcoal);
        }
        
        .modal-close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          color: var(--color-gray-medium);
          padding: 6px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .modal-close-btn:hover {
          background-color: var(--color-gray-ultra);
          color: var(--color-charcoal);
        }
        
        .modal-title {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        
        .modal-subtitle {
          font-size: 14px;
          color: var(--color-gray-dark);
          margin-bottom: 24px;
        }
        
        .modal-form {
          margin-bottom: 20px;
        }
        
        .input-with-icon {
          position: relative;
        }
        
        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-gray-medium);
        }
        
        .input-with-icon .form-control {
          padding-left: 44px;
        }
        
        .modal-submit-btn {
          margin-top: 24px;
        }
        
        .form-error-msg {
          background-color: #FDF2F0;
          border: 1px solid var(--color-danger);
          color: var(--color-danger);
          padding: 10px 14px;
          border-radius: var(--radius-sm);
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 20px;
          text-align: left;
        }
        
        .modal-mode-toggle {
          font-size: 13px;
          color: var(--color-gray-dark);
        }
        
        .toggle-link {
          color: var(--color-primary);
          font-weight: 700;
        }
        
        .toggle-link:hover {
          text-decoration: underline;
        }
        
        .supabase-badge-mini {
          display: flex;
          justify-content: center;
          margin-top: 24px;
          padding-top: 16px;
          border-top: 1px solid var(--color-gray-light);
        }
        
        .supabase-badge-mini span {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1px;
          color: #3ECF8E;
          background: rgba(62, 207, 142, 0.08);
          padding: 3px 10px;
          border-radius: 50px;
          border: 1px solid rgba(62, 207, 142, 0.2);
        }

        /* Success screen styling */
        .modal-success {
          padding: 20px 0;
        }
        
        .success-icon {
          color: var(--color-success);
          margin-bottom: 20px;
          display: inline-block;
        }
        
        .success-title {
          font-size: 22px;
          font-weight: 700;
          margin-bottom: 10px;
        }
        
        .success-desc {
          font-size: 14px;
          color: var(--color-gray-dark);
          margin-bottom: 24px;
        }
        
        .supabase-alert {
          background-color: var(--color-primary-light);
          border-left: 4px solid var(--color-primary);
          color: var(--color-primary-dark);
          padding: 16px;
          border-radius: var(--radius-sm);
          font-size: 12px;
          text-align: left;
          margin-bottom: 30px;
        }
        
        .supabase-alert strong {
          display: block;
          margin-bottom: 4px;
          font-weight: 700;
        }
      `}</style>
    </div>
  );
}

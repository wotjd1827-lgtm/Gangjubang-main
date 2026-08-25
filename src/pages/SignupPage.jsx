import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Mail, Lock, Eye, EyeOff, User, Phone, CheckCircle2, 
  AlertCircle, ArrowLeft, Check, Sparkles, Loader2
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function SignupPage({ onOpenLogin }) {
  const navigate = useNavigate();

  // Form Fields State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  // UI State
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Terms Agreement State
  const [terms, setTerms] = useState({
    tos: false,       // [필수] 이용약관 동의
    privacy: false,   // [필수] 개인정보 수집 및 이용 동의
    marketing: false  // [선택] 마케팅 정보 수신 동의
  });

  // Auto-format phone number with hyphens (010-XXXX-XXXX)
  const handlePhoneChange = (e) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    let formatted = rawValue;

    if (rawValue.length > 3 && rawValue.length <= 7) {
      formatted = `${rawValue.slice(0, 3)}-${rawValue.slice(3)}`;
    } else if (rawValue.length > 7) {
      formatted = `${rawValue.slice(0, 3)}-${rawValue.slice(3, 7)}-${rawValue.slice(7, 11)}`;
    }

    setPhone(formatted);
  };

  // Email format validation
  const isEmailValid = useMemo(() => {
    if (!email) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, [email]);

  // Password rules validation
  const passwordLengthValid = useMemo(() => password.length >= 8, [password]);
  const passwordSpecialValid = useMemo(() => /[!@#$%^&*(),.?":{}|<>_~\-=+]/.test(password), [password]);
  const isPasswordValid = useMemo(() => passwordLengthValid && passwordSpecialValid, [passwordLengthValid, passwordSpecialValid]);

  // Password confirmation match validation
  const isPasswordMatch = useMemo(() => {
    if (!passwordConfirm) return null;
    return password === passwordConfirm;
  }, [password, passwordConfirm]);

  // Name validation
  const isNameValid = useMemo(() => name.trim().length >= 2, [name]);

  // Phone validation (10 to 11 digits)
  const isPhoneValid = useMemo(() => {
    const rawDigits = phone.replace(/[^0-9]/g, '');
    return rawDigits.length >= 10 && rawDigits.length <= 11;
  }, [phone]);

  // Terms checkbox all state
  const isAllTermsChecked = useMemo(() => {
    return terms.tos && terms.privacy && terms.marketing;
  }, [terms]);

  const handleToggleAllTerms = () => {
    const nextState = !isAllTermsChecked;
    setTerms({
      tos: nextState,
      privacy: nextState,
      marketing: nextState
    });
  };

  const handleTermChange = (key) => {
    setTerms(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Form overall validity check
  const isFormValid = useMemo(() => {
    return (
      isEmailValid === true &&
      isPasswordValid &&
      isPasswordMatch === true &&
      isNameValid &&
      isPhoneValid &&
      terms.tos &&
      terms.privacy
    );
  }, [isEmailValid, isPasswordValid, isPasswordMatch, isNameValid, isPhoneValid, terms]);

  // Submit Handler with Supabase Auth & DB sync
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!isFormValid) {
      setErrorMessage('모든 필수 항목을 올바르게 작성하고 필수 약관에 동의해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Supabase Auth signup
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone,
            marketing_agreed: terms.marketing
          }
        }
      });

      if (authError) throw authError;

      // 2. Insert into Supabase customers table
      try {
        await supabase.from('customers').insert([
          {
            name,
            email,
            phone,
            grade: 'BRONZE',
            age: 30,
            gender: '남',
            frequency: 1,
            total_amount: 0,
            points: 2000,
            address: '서울시',
            reg_date: new Date().toISOString().split('T')[0]
          }
        ]);
      } catch (dbErr) {
        console.log('Customer table sync skipped/handled:', dbErr);
      }

      setIsSuccess(true);
    } catch (err) {
      console.error('Signup error:', err);
      setErrorMessage(err.message || '회원가입 처리 중 오류가 발생했습니다. 입력 정보를 확인해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="signup-page-wrapper">
      <Header onOpenLogin={onOpenLogin} />

      <main className="signup-main-viewport">
        <div className="signup-container">
          
          {/* Back to Home Navigation */}
          <Link to="/" className="back-link">
            <ArrowLeft size={16} />
            <span>메인으로 돌아가기</span>
          </Link>

          {/* Main Card */}
          <div className="signup-card glass-card animate-fade-in">
            
            {/* Header / Branding */}
            <div className="signup-card-header text-center">
              <div className="badge-pill">
                <Sparkles size={14} className="text-primary" />
                <span>강주방 파트너스 회원가입</span>
              </div>
              <h2 className="signup-title">반갑습니다! 계정을 생성하세요</h2>
              <p className="signup-subtitle">
                강주방의 3D 도면 컨설팅 및 업소용 주방기기 특가 혜택을 자유롭게 이용하세요.
              </p>
            </div>

            {isSuccess ? (
              /* Success Screen */
              <div className="signup-success-view text-center animate-fade-in">
                <CheckCircle2 size={72} className="success-icon animate-pulse" />
                <h3 className="success-head-title">회원가입이 완료되었습니다!</h3>
                <p className="success-head-desc">
                  <strong>{name}</strong>님, 강주방의 회원이 되신 것을 진심으로 축하합니다.<br />
                  가입 기념 **2,000 포인트**가 즉시 적립되었습니다.
                </p>
                
                <div className="success-info-box">
                  <div className="info-item">
                    <span>이메일 아이디</span>
                    <strong>{email}</strong>
                  </div>
                  <div className="info-item">
                    <span>연락처</span>
                    <strong>{phone}</strong>
                  </div>
                  <div className="info-item">
                    <span>인증 상태</span>
                    <strong className="color-primary">Supabase Auth 연동 완료</strong>
                  </div>
                </div>

                <div className="success-actions">
                  <button 
                    onClick={() => { onOpenLogin('login'); navigate('/'); }} 
                    className="btn btn-primary w-full"
                  >
                    로그인하고 서비스 이용하기
                  </button>
                  <Link to="/" className="btn btn-secondary w-full">
                    메인 홈으로 이동
                  </Link>
                </div>
              </div>
            ) : (
              /* Signup Form */
              <form onSubmit={handleSubmit} className="signup-form">
                
                {errorMessage && (
                  <div className="error-banner animate-fade-in">
                    <AlertCircle size={18} />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* 1. Email Field */}
                <div className="form-group">
                  <label className="form-label required">이메일 (아이디)</label>
                  <div className="input-with-icon-wrapper">
                    <Mail size={18} className="field-icon" />
                    <input 
                      type="email" 
                      className={`form-control ${isEmailValid === true ? 'valid' : isEmailValid === false ? 'invalid' : ''}`}
                      placeholder="example@gangjubang.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  {isEmailValid === false && (
                    <span className="field-hint error">올바른 이메일 형식을 입력해주세요. (예: user@domain.com)</span>
                  )}
                  {isEmailValid === true && (
                    <span className="field-hint success">사용 가능한 올바른 이메일 형식입니다.</span>
                  )}
                </div>

                {/* 2. Password Field */}
                <div className="form-group">
                  <label className="form-label required">비밀번호</label>
                  <div className="input-with-icon-wrapper">
                    <Lock size={18} className="field-icon" />
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      className={`form-control ${password ? (isPasswordValid ? 'valid' : 'invalid') : ''}`}
                      placeholder="8자 이상, 특수문자를 조합하여 입력하세요" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button 
                      type="button" 
                      className="eye-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex="-1"
                      title={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  
                  {/* Password Strength Checklist */}
                  <div className="password-rules-row">
                    <span className={`rule-badge ${passwordLengthValid ? 'pass' : ''}`}>
                      <Check size={12} /> 8자 이상
                    </span>
                    <span className={`rule-badge ${passwordSpecialValid ? 'pass' : ''}`}>
                      <Check size={12} /> 특수문자 조합 (!@#$%^&* 등)
                    </span>
                  </div>
                </div>

                {/* 3. Password Confirm Field */}
                <div className="form-group">
                  <label className="form-label required">비밀번호 확인</label>
                  <div className="input-with-icon-wrapper">
                    <Lock size={18} className="field-icon" />
                    <input 
                      type={showPasswordConfirm ? 'text' : 'password'} 
                      className={`form-control ${isPasswordMatch === true ? 'valid' : isPasswordMatch === false ? 'invalid' : ''}`}
                      placeholder="비밀번호를 한번 더 입력하세요" 
                      value={passwordConfirm}
                      onChange={(e) => setPasswordConfirm(e.target.value)}
                      required
                    />
                    <button 
                      type="button" 
                      className="eye-toggle-btn"
                      onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                      tabIndex="-1"
                      title={showPasswordConfirm ? '비밀번호 숨기기' : '비밀번호 보기'}
                    >
                      {showPasswordConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {isPasswordMatch === false && (
                    <span className="field-hint error">비밀번호가 일치하지 않습니다.</span>
                  )}
                  {isPasswordMatch === true && (
                    <span className="field-hint success">비밀번호가 일치합니다.</span>
                  )}
                </div>

                {/* 4. Name Field */}
                <div className="form-group">
                  <label className="form-label required">이름 (닉네임)</label>
                  <div className="input-with-icon-wrapper">
                    <User size={18} className="field-icon" />
                    <input 
                      type="text" 
                      className={`form-control ${name ? (isNameValid ? 'valid' : 'invalid') : ''}`}
                      placeholder="홍길동 사장님" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* 5. Phone Field */}
                <div className="form-group">
                  <label className="form-label required">휴대폰 번호</label>
                  <div className="input-with-icon-wrapper">
                    <Phone size={18} className="field-icon" />
                    <input 
                      type="tel" 
                      className={`form-control ${phone ? (isPhoneValid ? 'valid' : 'invalid') : ''}`}
                      placeholder="010-1234-5678" 
                      value={phone}
                      onChange={handlePhoneChange}
                      maxLength="13"
                      required
                    />
                  </div>
                  <span className="field-hint">숫자만 입력하시면 하이픈(-)이 자동으로 포맷팅됩니다.</span>
                </div>

                {/* Section Divider */}
                <div className="form-divider"></div>

                {/* Terms Agreement Section */}
                <div className="terms-section">
                  <h4 className="terms-title">약관 동의</h4>
                  
                  {/* Select All Checkbox */}
                  <label className="terms-checkbox-card select-all">
                    <input 
                      type="checkbox" 
                      checked={isAllTermsChecked}
                      onChange={handleToggleAllTerms}
                    />
                    <span className="checkbox-custom"></span>
                    <span className="terms-label-text">
                      <strong>전체 동의하기</strong>
                      <span className="sub-desc">이용약관, 개인정보 수집 및 마케팅 정보 수신(선택)에 전체 동의합니다.</span>
                    </span>
                  </label>

                  <div className="terms-list">
                    {/* TOS */}
                    <label className="terms-checkbox-item">
                      <input 
                        type="checkbox" 
                        checked={terms.tos}
                        onChange={() => handleTermChange('tos')}
                      />
                      <span className="checkbox-custom"></span>
                      <span className="terms-text"><strong className="color-primary">[필수]</strong> 이용약관 동의</span>
                    </label>

                    {/* Privacy */}
                    <label className="terms-checkbox-item">
                      <input 
                        type="checkbox" 
                        checked={terms.privacy}
                        onChange={() => handleTermChange('privacy')}
                      />
                      <span className="checkbox-custom"></span>
                      <span className="terms-text"><strong className="color-primary">[필수]</strong> 개인정보 수집 및 이용 동의</span>
                    </label>

                    {/* Marketing */}
                    <label className="terms-checkbox-item">
                      <input 
                        type="checkbox" 
                        checked={terms.marketing}
                        onChange={() => handleTermChange('marketing')}
                      />
                      <span className="checkbox-custom"></span>
                      <span className="terms-text">
                        <strong className="color-muted">[선택]</strong> 마케팅 정보 수신 동의 
                        <span className="channel-badges">(SMS / 이메일 / 카카오 알림톡)</span>
                      </span>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  className={`btn btn-primary w-full signup-submit-btn ${!isFormValid ? 'disabled-style' : ''}`}
                  disabled={!isFormValid || isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 size={18} className="animate-spin" />
                      <span>회원가입 처리 중...</span>
                    </span>
                  ) : (
                    <span>회원가입하기</span>
                  )}
                </button>

                {/* Link to Login */}
                <div className="login-redirect-row text-center">
                  <p>
                    이미 계정이 있으신가요?{' '}
                    <button 
                      type="button" 
                      onClick={() => onOpenLogin('login')} 
                      className="login-link-btn"
                    >
                      로그인하기
                    </button>
                  </p>
                </div>
              </form>
            )}

          </div>
        </div>
      </main>

      <Footer />

      <style>{`
        .signup-page-wrapper {
          min-height: 100vh;
          background-color: var(--bg-main);
          display: flex;
          flex-direction: column;
        }

        .signup-main-viewport {
          flex: 1;
          padding: 120px 24px 80px 24px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .signup-container {
          width: 100%;
          max-width: 520px;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: var(--color-gray-dark);
          margin-bottom: 20px;
          font-weight: 500;
          transition: color 0.2s ease;
        }

        .back-link:hover {
          color: var(--color-primary);
        }

        .signup-card {
          padding: 44px 40px;
          border-radius: 20px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.08);
          border: 1px solid var(--color-gray-light);
          background: rgba(255, 255, 255, 0.95);
        }

        .signup-card-header {
          margin-bottom: 32px;
        }

        .badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 700;
          color: var(--color-primary-dark);
          background-color: var(--color-primary-light);
          padding: 4px 14px;
          border-radius: 50px;
          margin-bottom: 12px;
        }

        .signup-title {
          font-size: 24px;
          font-weight: 800;
          color: var(--color-charcoal);
          margin-bottom: 8px;
        }

        .signup-subtitle {
          font-size: 14px;
          color: var(--color-gray-dark);
          line-height: 1.5;
        }

        .error-banner {
          display: flex;
          align-items: center;
          gap: 10px;
          background-color: #FDF2F0;
          border: 1px solid var(--color-danger);
          color: var(--color-danger);
          padding: 12px 16px;
          border-radius: var(--radius-md);
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 24px;
        }

        .form-group {
          margin-bottom: 22px;
          text-align: left;
        }

        .form-label {
          display: block;
          font-size: 13px;
          font-weight: 700;
          color: var(--color-charcoal);
          margin-bottom: 6px;
        }

        .form-label.required::after {
          content: ' *';
          color: var(--color-primary);
        }

        .input-with-icon-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .field-icon {
          position: absolute;
          left: 14px;
          color: var(--color-gray-medium);
          pointer-events: none;
        }

        .input-with-icon-wrapper .form-control {
          padding-left: 44px;
          padding-right: 44px;
          height: 48px;
          border-radius: 10px;
          font-size: 14px;
          border: 1px solid var(--color-gray-light);
          transition: all 0.25s ease;
        }

        .input-with-icon-wrapper .form-control:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px var(--color-primary-light);
        }

        .input-with-icon-wrapper .form-control.valid {
          border-color: var(--color-success);
        }

        .input-with-icon-wrapper .form-control.invalid {
          border-color: var(--color-danger);
        }

        .eye-toggle-btn {
          position: absolute;
          right: 12px;
          padding: 6px;
          color: var(--color-gray-medium);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s ease;
        }

        .eye-toggle-btn:hover {
          color: var(--color-charcoal);
        }

        .field-hint {
          display: block;
          font-size: 12px;
          margin-top: 6px;
          color: var(--color-gray-medium);
        }

        .field-hint.error {
          color: var(--color-danger);
          font-weight: 500;
        }

        .field-hint.success {
          color: var(--color-success);
          font-weight: 500;
        }

        .password-rules-row {
          display: flex;
          gap: 12px;
          margin-top: 8px;
        }

        .rule-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: var(--color-gray-medium);
          background: var(--color-gray-ultra);
          padding: 3px 8px;
          border-radius: 4px;
          transition: all 0.25s ease;
        }

        .rule-badge.pass {
          color: var(--color-success);
          background: rgba(110, 142, 117, 0.12);
          font-weight: 700;
        }

        .form-divider {
          height: 1px;
          background-color: var(--color-gray-light);
          margin: 28px 0;
        }

        /* Terms Section */
        .terms-section {
          text-align: left;
          margin-bottom: 28px;
        }

        .terms-title {
          font-size: 15px;
          font-weight: 700;
          margin-bottom: 14px;
          color: var(--color-charcoal);
        }

        .terms-checkbox-card {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 14px 16px;
          background: var(--color-gray-ultra);
          border: 1px solid var(--color-gray-light);
          border-radius: 12px;
          cursor: pointer;
          margin-bottom: 12px;
          transition: border-color 0.2s ease;
        }

        .terms-checkbox-card:hover {
          border-color: var(--color-primary);
        }

        .terms-label-text {
          display: flex;
          flex-direction: column;
        }

        .terms-label-text strong {
          font-size: 14px;
          color: var(--color-charcoal);
        }

        .sub-desc {
          font-size: 12px;
          color: var(--color-gray-dark);
          margin-top: 2px;
        }

        .terms-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding-left: 4px;
        }

        .terms-checkbox-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: var(--color-charcoal);
          cursor: pointer;
        }

        .terms-text .color-primary {
          color: var(--color-primary);
        }

        .terms-text .color-muted {
          color: var(--color-gray-dark);
        }

        .channel-badges {
          font-size: 11px;
          color: var(--color-gray-medium);
          margin-left: 4px;
        }

        .signup-submit-btn {
          height: 52px;
          font-size: 16px;
          font-weight: 700;
          border-radius: 12px;
          margin-bottom: 20px;
        }

        .signup-submit-btn.disabled-style {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .login-redirect-row {
          font-size: 14px;
          color: var(--color-gray-dark);
        }

        .login-link-btn {
          color: var(--color-primary);
          font-weight: 700;
          background: none;
          border: none;
          cursor: pointer;
        }

        .login-link-btn:hover {
          text-decoration: underline;
        }

        /* Success View */
        .signup-success-view {
          padding: 20px 0;
        }

        .success-icon {
          color: var(--color-success);
          margin-bottom: 20px;
          display: inline-block;
        }

        .success-head-title {
          font-size: 24px;
          font-weight: 800;
          margin-bottom: 12px;
        }

        .success-head-desc {
          font-size: 15px;
          color: var(--color-gray-dark);
          line-height: 1.6;
          margin-bottom: 28px;
        }

        .success-info-box {
          background-color: var(--color-gray-ultra);
          border: 1px solid var(--color-gray-light);
          border-radius: 14px;
          padding: 20px;
          margin-bottom: 28px;
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
        }

        .info-item span {
          color: var(--color-gray-dark);
        }

        .info-item strong {
          color: var(--color-charcoal);
        }

        .success-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        @media (max-width: 576px) {
          .signup-card {
            padding: 30px 20px;
          }
        }
      `}</style>
    </div>
  );
}

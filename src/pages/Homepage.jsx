import React, { useState } from 'react';
import { 
  Award, Users, PenTool, MessageSquare, Settings, 
  ShieldCheck, Phone, Send, CheckCircle
} from 'lucide-react';
import { supabase } from '../supabaseClient';

const BASE = '/';

export default function Homepage({ _onOpenLogin }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    businessType: '',
    consultType: '3D 도면 컨설팅',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('이름과 연락처는 필수 입력 항목입니다.');
      return;
    }
    
    try {
      await supabase.from('inquiries').insert([
        {
          name: formData.name,
          phone: formData.phone,
          business_type: formData.businessType,
          consult_type: formData.consultType,
          message: formData.message,
          status: '대기'
        }
      ]);
    } catch (err) {
      console.log('Supabase inquiry insert fallback active:', err);
    } finally {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: '', phone: '', businessType: '', consultType: '3D 도면 컨설팅', message: '' });
      }, 4000);
    }
  };

  const portfolioImages = [
    { src: `${BASE}images/image57.jpg`, title: '강남 프랜차이즈 식당' },
    { src: `${BASE}images/image58.jpg`, title: '인천 대형 이자카야' },
    { src: `${BASE}images/image59.jpg`, title: '김포 베이커리 카페' },
    { src: `${BASE}images/image50.jpg`, title: '한식 전문 프랜차이즈' },
    { src: `${BASE}images/image52.jpg`, title: '일식 초밥 전문점' },
    { src: `${BASE}images/image53.jpg`, title: '고급 한우 레스토랑' },
    { src: `${BASE}images/image5.jpg`, title: '업소용 주방 전경' },
    { src: `${BASE}images/image10.jpeg`, title: '주방기기 대형 창고' },
  ];

  return (
    <div className="homepage-wrapper">

      {/* ── HERO ── 100vh immersive */}
      <section className="hero-section" style={{ backgroundImage: `url(${BASE}images/commercial_kitchen.png)` }}>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <p className="hero-eng">STRONG KITCHEN, TRUSTED PARTNER</p>
          <div className="hero-center">
            <img src={`${BASE}images/logo.png`} alt="강주방" className="hero-logo" />
            <p className="hero-tagline">
              고객의 니즈를 정확히 이해하고, 빠르게 실행하는<br className="pc-br" />업소용 주방 토탈 서비스
            </p>
          </div>
          <div className="hero-scroll">
            <span>SCROLL</span>
            <div className="scroll-bar"></div>
          </div>
        </div>
      </section>

      {/* ── STATS ── dark horizontal bar */}
      <section className="stats-bar">
        <div className="container stats-row">
          <div className="stat-item">
            <strong>25<span>년</span></strong>
            <p>업계 최장 수준 업력</p>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <strong>10<span>만+</span></strong>
            <p>누적 전국 최다 납품처</p>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <strong>20<span>년+</span></strong>
            <p>전문 엔지니어 직접 시공</p>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <strong>8<span>년째</span></strong>
            <p>'아프니까 사장이다' 입점</p>
          </div>
        </div>
      </section>

      {/* ── ABOUT ── Grid gallery like yourkitchen */}
      <section id="about" className="section-about">
        <div className="about-grid">
          <div className="about-cell img-cell">
            <img src={`${BASE}images/image5.jpg`} alt="" />
          </div>
          <div className="about-cell text-cell">
            <span>가장 편안한 주방을</span>
            <span>만들어 드립니다</span>
          </div>
          <div className="about-cell img-cell">
            <img src={`${BASE}images/image10.jpeg`} alt="" />
          </div>
          <div className="about-cell center-cell">
            <div className="center-inner">
              <p className="center-top">강주방은<br />'업소용 주방 전문 파트너'<br />입니다</p>
              <p className="center-sub">
                그 이름엔<br />
                "무엇보다 먼저, 사장님의 주방을 생각하겠다"는<br />
                우리의 다짐이 담겨있습니다.
              </p>
            </div>
          </div>
          <div className="about-cell img-cell">
            <img src={`${BASE}images/image11.jpeg`} alt="" />
          </div>
          <div className="about-cell text-cell sub">
            좋은 주방이<br />
            좋은 음식을 만듭니다
          </div>
        </div>
      </section>

      {/* ── COMPANY INFO ── clean card */}
      <section className="section-company">
        <div className="container">
          <div className="company-card">
            <div className="company-left">
              <span className="tag">COMPANY PROFILE</span>
              <h2>식당 및 프랜차이즈 전문<br className="pc-br" /><strong>업소용 주방 파트너, 강주방</strong></h2>
              <p>전국 주요 대표 브랜드 제조사 공장과의 직거래 네트워크를 통해, 검증된 정품 주방 기기를 불필요한 유통 거품 없이 가장 합리적인 가격에 공급합니다.</p>
              <p className="sub-text">25년 동안 현장에서 축적된 경험과 노하우를 바탕으로, 20년 경력의 베테랑 엔지니어들이 주방 기기 설치부터 마무리 전기, 가스, 급배수 연동까지 완벽하게 직접 시공합니다.</p>
              <div className="feature-list">
                <div className="feat"><ShieldCheck size={20} /><div><h5>완벽한 품질 보증</h5><p>정품 제조 공장 다이렉트 매입</p></div></div>
                <div className="feat"><Settings size={20} /><div><h5>원스톱 설비 및 AS</h5><p>전국 통합 서비스망 구축</p></div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BUSINESS ── alternating image+text */}
      <section id="business" className="section-business">
        <div className="container">
          <div className="section-head">
            <span className="tag">BUSINESS AREAS</span>
            <h2>강주방의 핵심 사업 영역</h2>
          </div>

          <div className="biz-block">
            <div className="biz-img"><img src={`${BASE}images/image10.jpeg`} alt="도소매" /></div>
            <div className="biz-text">
              <span className="biz-num">01</span>
              <h3>업소용 주방기기 도 / 소매</h3>
              <p>전국 브랜드 제조사와의 직거래를 통한 거품 없는 가격제시. 식당, 카페, 베이커리 등 맞춤형 기기 팩키지 제공.</p>
              <ul><li>한식, 일식, 중식, 양식 전용 화구 설계</li><li>작업대, 씽크대, 선반 맞춤 제작</li><li>테이블 냉장고 및 전문 제빙기 특가</li></ul>
            </div>
          </div>

          <div className="biz-block reverse">
            <div className="biz-img"><img src={`${BASE}images/image11.jpeg`} alt="OEM" /></div>
            <div className="biz-text">
              <span className="biz-num">02</span>
              <h3>제조 및 OEM 주문 생산</h3>
              <p>자체 생산 및 제휴 공장을 보유하여 기성품 규격을 벗어난 특수한 형태의 현장 맞춤형 스테인리스 제품 생산.</p>
              <ul><li>현장 상황에 맞춘 다단식 특수 씽크대</li><li>맞춤형 가스 렌지 및 배기 후드 설계</li><li>공간 맞춤형 캐비닛 및 보조 선반</li></ul>
            </div>
          </div>

          <div className="biz-block">
            <div className="biz-img"><img src={`${BASE}images/image9.jpeg`} alt="수출" /></div>
            <div className="biz-text">
              <span className="biz-num">03</span>
              <h3>K-푸드 글로벌 해외 수출</h3>
              <p>검증된 국내 최고의 기술력과 제품 안정성을 인정받아, 글로벌 K-푸드 프랜차이즈 및 해외 한식 매장에 설비 수출.</p>
              <ul><li>해외 현지 전압 맞춤 세팅</li><li>수출용 특수 패킹 및 물류 컨설팅</li><li>미국, 동남아, 유럽 다수 수출 레코드</li></ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── STRENGTHS ── big number blocks */}
      <section id="strengths" className="section-strengths">
        <div className="container">
          <div className="section-head">
            <span className="tag">WHY GANGJUBANG</span>
            <h2>왜 강주방이어야 하는가?</h2>
            <p className="section-sub">전국 최다 프랜차이즈가 강주방을 파트너로 선택하는 이유</p>
          </div>

          <div className="str-grid">
            {[
              { icon: <Award />, num: '01', title: '전국 제조사 공장 총판', desc: '제조공장 다이렉트 대량 계약 체결로 유통 마진을 파괴하고, 공장 단가 그대로 합리적인 가격을 실현합니다.' },
              { icon: <Users />, num: '02', title: '10만여 곳 전국 최다 납품', desc: '식당 개인 창업부터 대형 외식 프랜차이즈 본사까지, 전국 10만여 곳에 납품 레코드를 보유하고 있습니다.' },
              { icon: <PenTool />, num: '03', title: '맞춤형 3D 주방 동선 컨설팅', desc: '매장 구조와 조리 단계를 분석하여 최적의 동선을 설계하는 3D 시뮬레이션 컨설팅을 무료 제공합니다.' },
              { icon: <MessageSquare />, num: '04', title: '1:1 오픈채팅방 실시간 소통', desc: '가맹점주와 단독 채팅방을 개설하여 기획부터 사후 관리까지 실시간 밀착 대응합니다.' },
              { icon: <Settings />, num: '05', title: '전국 설치 및 A/S 시스템', desc: '수도권뿐만 아니라 영남, 호남, 강원 등 전국 도서 지역까지 광역 전문 엔지니어 출장 설치 및 AS망을 운영합니다.' },
              { icon: <ShieldCheck />, num: '06', title: "'아프니까 사장이다' 8년 입점", desc: '대한민국 1위 자영업자 커뮤니티에 최초 입점한 주방 전문 기업으로, 8년간 높은 만족도와 추천을 받아왔습니다.' },
            ].map((s, i) => (
              <div className="str-card" key={i}>
                <div className="str-icon">{s.icon}</div>
                <span className="str-num">{s.num}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PORTFOLIO ── large gallery grid */}
      <section id="portfolio" className="section-portfolio">
        <div className="container">
          <div className="section-head light">
            <span className="tag light">PORTFOLIO</span>
            <h2>함께한 주방</h2>
            <p className="section-sub light">수많은 사장님들과 함께 완성해 온 강주방의 리얼 주방 시공 현장</p>
          </div>
          <div className="port-grid">
            {portfolioImages.map((item, i) => (
              <div className="port-item" key={i}>
                <img src={item.src} alt={item.title} />
                <div className="port-hover">
                  <span>{item.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── dark bg + centered form */}
      <section id="consulting" className="section-contact">
        <div className="container contact-inner">
          <div className="contact-info">
            <span className="tag light">CONTACT US</span>
            <h2>성공적인 창업의 첫걸음,<br className="pc-br" />강주방과 시작하세요</h2>
            <p>3D 도면 컨설팅부터 맞춤 제작 견적, 전국 AS까지 원클릭으로 신청하세요.</p>
            <div className="contact-phone">
              <Phone size={24} />
              <div>
                <strong>1533-1524</strong>
                <span>010-3332-9155</span>
              </div>
            </div>
            <div className="contact-checks">
              <div><CheckCircle size={16} /><span>무상 현장 치수 실측</span></div>
              <div><CheckCircle size={16} /><span>3D 캐드 도면 무료</span></div>
              <div><CheckCircle size={16} /><span>전국 무상 하자보수 1년</span></div>
            </div>
          </div>

          <div className="contact-form-card">
            {isSubmitted ? (
              <div className="submit-ok">
                <CheckCircle size={56} />
                <h3>상담 신청 완료!</h3>
                <p>담당자가 빠른 시일 내에 연락드리겠습니다.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3>간편 견적 & 컨설팅 신청</h3>
                <div className="fg"><label>고객명 / 업체명</label><input type="text" name="name" placeholder="예: 김재성 사장님" value={formData.name} onChange={handleInputChange} required /></div>
                <div className="fg"><label>휴대폰 번호</label><input type="tel" name="phone" placeholder="예: 010-3332-9155" value={formData.phone} onChange={handleInputChange} required /></div>
                <div className="fg"><label>업종 / 매장 면적 (선택)</label><input type="text" name="businessType" placeholder="예: 삼겹살집 30평" value={formData.businessType} onChange={handleInputChange} /></div>
                <div className="fg"><label>신청 서비스</label>
                  <select name="consultType" value={formData.consultType} onChange={handleInputChange}>
                    <option value="3D 도면 컨설팅">3D 도면 컨설팅 (무료)</option>
                    <option value="주방기기 견적">주방 기기 대량 견적</option>
                    <option value="OEM 주문제작">주문제작/OEM 문의</option>
                    <option value="A/S 상담">AS 설치 및 시공 문의</option>
                  </select>
                </div>
                <div className="fg"><label>문의 내용 (선택)</label><textarea name="message" rows="3" placeholder="주방 크기, 오픈 일정 등" value={formData.message} onChange={handleInputChange}></textarea></div>
                <button type="submit" className="submit-btn"><span>견적 및 컨설팅 신청하기</span><Send size={16} /></button>
              </form>
            )}
          </div>
        </div>
      </section>

      <style>{`
        /* ===== HOMEPAGE STYLES ===== */
        .homepage-wrapper { width: 100%; }

        /* ── HERO ── */
        .hero-section {
          position: relative;
          width: 100%;
          height: 100vh;
          min-height: 600px;
          /* background-image set via inline style for BASE_URL */
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(15, 23, 42, 0.40) 0%, rgba(15, 44, 89, 0.25) 50%, rgba(7, 19, 37, 0.65) 100%);
          z-index: 1;
        }
        .hero-content {
          position: relative; z-index: 2;
          text-align: center; color: #fff;
          display: flex; flex-direction: column;
          align-items: center; gap: 24px;
          padding: 0 24px;
        }
        .hero-eng {
          font-size: 14px; font-weight: 700;
          letter-spacing: 5px;
          color: #60A5FA;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.7);
          animation: fadeIn 0.8s ease forwards;
        }
        .hero-center {
          display: flex; flex-direction: column;
          align-items: center; gap: 28px;
          animation: fadeIn 1s ease 0.2s forwards;
          opacity: 0;
        }
        .hero-logo {
          width: 220px; height: auto;
          filter: brightness(0) invert(1) drop-shadow(0 4px 16px rgba(0, 0, 0, 0.8));
        }
        .hero-tagline {
          font-size: 19px; font-weight: 400;
          line-height: 1.8;
          color: #FFFFFF;
          text-shadow: 0 2px 12px rgba(0, 0, 0, 0.85);
        }
        .hero-scroll {
          position: absolute; bottom: 40px;
          left: 50%; transform: translateX(-50%);
          display: flex; flex-direction: column;
          align-items: center; gap: 8px;
          animation: fadeIn 1s ease 0.6s forwards;
          opacity: 0;
        }
        .hero-scroll span {
          font-size: 10px; letter-spacing: 3px;
          color: #60A5FA;
        }
        .scroll-bar {
          width: 2px; height: 40px;
          background: linear-gradient(to bottom, #38BDF8, transparent);
          animation: scrollPulse 2s ease-in-out infinite;
        }
        @keyframes scrollPulse {
          0%,100% { opacity: 0.3; transform: scaleY(0.6); }
          50% { opacity: 1; transform: scaleY(1); }
        }

        /* ── STATS BAR ── */
        .stats-bar {
          background: #0B192C;
          border-y: 1px solid rgba(37, 99, 235, 0.2);
          padding: 48px 0;
        }
        .stats-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
        }
        .stat-item {
          flex: 1; text-align: center;
        }
        .stat-item strong {
          display: block;
          font-size: 42px; font-weight: 900;
          color: #60A5FA;
          line-height: 1;
        }
        .stat-item strong span {
          font-size: 16px; font-weight: 600;
          color: rgba(255,255,255,0.7);
          margin-left: 2px;
        }
        .stat-item p {
          font-size: 13px;
          color: rgba(255,255,255,0.6);
          margin-top: 8px;
        }
        .stat-divider {
          width: 1px; height: 50px;
          background: rgba(255,255,255,0.12);
          flex-shrink: 0;
        }

        /* ── ABOUT GRID ── */
        .section-about {
          padding: 0;
        }
        .about-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: repeat(2, 280px);
        }
        .about-cell {
          overflow: hidden;
          position: relative;
        }
        .about-cell.img-cell img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }
        .about-cell.img-cell:hover img {
          transform: scale(1.05);
        }
        .about-cell.text-cell {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          font-size: 22px;
          font-weight: 700;
          color: var(--color-charcoal);
          line-height: 1.5;
          word-break: keep-all;
          background: #fff;
          border: 1px solid var(--color-gray-light);
        }
        .about-cell.text-cell.sub {
          font-size: 18px;
          font-weight: 500;
          color: var(--color-gray-dark);
          background: var(--bg-main);
          border: 1px solid var(--color-gray-light);
        }
        .about-cell.center-cell {
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          background: linear-gradient(135deg, #0F2C59 0%, #1E3E62 100%);
          color: #fff;
          padding: 30px;
        }
        .center-top {
          font-size: 26px;
          font-weight: 700;
          line-height: 1.5;
          margin-bottom: 20px;
        }
        .center-sub {
          font-size: 14px;
          line-height: 1.8;
          color: rgba(255,255,255,0.6);
        }

        /* ── COMPANY INFO ── */
        .section-company {
          padding: 100px 0;
          background: #fff;
        }
        .company-card {
          max-width: 860px;
          margin: 0 auto;
        }
        .company-left .tag {
          display: inline-block;
          font-size: 13px; font-weight: 700;
          color: var(--color-primary);
          background: var(--color-primary-light);
          padding: 5px 14px;
          border-radius: 50px;
          margin-bottom: 16px;
          letter-spacing: 1px;
        }
        .company-left h2 {
          font-size: 32px; font-weight: 400;
          color: var(--color-charcoal);
          line-height: 1.4;
          margin-bottom: 24px;
        }
        .company-left h2 strong {
          font-weight: 800;
        }
        .company-left > p {
          font-size: 16px; line-height: 1.7;
          color: var(--color-charcoal);
          margin-bottom: 12px;
        }
        .company-left .sub-text {
          font-size: 14px; line-height: 1.7;
          color: var(--color-gray-dark);
          margin-bottom: 30px;
        }
        .feature-list {
          display: flex; flex-wrap: wrap; gap: 24px 48px;
        }
        .feat {
          display: flex; gap: 14px; align-items: flex-start;
        }
        .feat svg {
          color: var(--color-primary);
          background: var(--color-primary-light);
          padding: 6px; box-sizing: content-box;
          border-radius: 10px; flex-shrink: 0;
        }
        .feat h5 {
          font-size: 15px; font-weight: 700;
          color: var(--color-charcoal);
          margin-bottom: 2px;
        }
        .feat p {
          font-size: 13px; color: var(--color-gray-dark);
          margin-bottom: 0;
        }
        .info-table {
          background: var(--bg-main);
          border-radius: 16px;
          padding: 30px;
          border: 1px solid var(--color-gray-light);
        }
        .info-table h4 {
          font-size: 17px; font-weight: 700;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 2px solid var(--color-primary);
        }
        .info-table .row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid var(--color-gray-light);
          font-size: 14px;
        }
        .info-table .row:last-child { border-bottom: none; }
        .info-table .row span:first-child {
          font-weight: 600; color: var(--color-gray-dark);
          flex-shrink: 0; width: 90px;
        }
        .info-table .row span:last-child {
          text-align: right; color: var(--color-charcoal);
        }
        .info-table .row a {
          color: var(--color-primary);
          text-decoration: underline;
        }

        /* ── BUSINESS ── */
        .section-business {
          padding: 100px 0;
          background: var(--bg-main);
        }
        .section-head {
          text-align: center;
          margin-bottom: 60px;
        }
        .section-head .tag, .tag {
          display: inline-block;
          font-size: 13px; font-weight: 700;
          color: var(--color-primary);
          background: var(--color-primary-light);
          padding: 5px 14px;
          border-radius: 50px;
          margin-bottom: 12px;
          letter-spacing: 1px;
        }
        .section-head h2 {
          font-size: 34px; font-weight: 800;
          color: var(--color-charcoal);
          margin-bottom: 8px;
        }
        .section-sub {
          font-size: 15px;
          color: var(--color-gray-dark);
          margin-top: 8px;
        }
        .biz-block {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          margin-bottom: 2px;
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--color-gray-light);
          margin-bottom: 30px;
        }
        .biz-block.reverse .biz-img { order: 2; }
        .biz-block.reverse .biz-text { order: 1; }
        .biz-img {
          height: 100%; min-height: 320px;
          overflow: hidden;
        }
        .biz-img img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .biz-block:hover .biz-img img {
          transform: scale(1.05);
        }
        .biz-text {
          padding: 50px 45px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
        }
        .biz-num {
          font-size: 64px; font-weight: 900;
          color: rgba(192,130,97,0.08);
          position: absolute;
          top: 20px; right: 30px;
          line-height: 1;
        }
        .biz-text h3 {
          font-size: 22px; font-weight: 700;
          color: var(--color-charcoal);
          margin-bottom: 16px;
        }
        .biz-text > p {
          font-size: 15px; line-height: 1.7;
          color: var(--color-gray-dark);
          margin-bottom: 20px;
        }
        .biz-text ul {
          list-style: none;
          display: flex; flex-direction: column;
          gap: 8px;
        }
        .biz-text ul li {
          font-size: 14px; color: var(--color-charcoal);
          padding-left: 16px;
          position: relative;
        }
        .biz-text ul li::before {
          content: '•'; position: absolute;
          left: 4px; color: var(--color-primary);
          font-weight: bold;
        }

        /* ── STRENGTHS ── */
        .section-strengths {
          padding: 100px 0;
          background: #fff;
        }
        .str-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .str-card {
          background: var(--bg-main);
          border: 1px solid var(--color-gray-light);
          border-radius: 16px;
          padding: 32px;
          transition: all 0.3s ease;
          position: relative;
        }
        .str-card:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-lg);
          border-color: var(--color-primary);
        }
        .str-icon {
          width: 44px; height: 44px;
          background: var(--color-primary-light);
          color: var(--color-primary);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 16px;
        }
        .str-num {
          font-size: 12px; font-weight: 700;
          color: var(--color-primary);
          letter-spacing: 0.5px;
          position: absolute;
          top: 32px; right: 32px;
        }
        .str-card h3 {
          font-size: 17px; font-weight: 700;
          color: var(--color-charcoal);
          margin-bottom: 12px;
        }
        .str-card p {
          font-size: 14px; line-height: 1.7;
          color: var(--color-gray-dark);
        }

        /* ── PORTFOLIO ── */
        .section-portfolio {
          padding: 100px 0;
          background: #071325;
        }
        .section-head.light h2 {
          color: #fff;
        }
        .tag.light {
          background: rgba(37, 99, 235, 0.2);
          color: #60A5FA;
        }
        .section-sub.light {
          color: rgba(255,255,255,0.7);
        }
        .port-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 4px;
        }
        .port-item {
          position: relative;
          height: 240px;
          overflow: hidden;
          cursor: pointer;
        }
        .port-item img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .port-item:hover img {
          transform: scale(1.1);
        }
        .port-hover {
          position: absolute; inset: 0;
          background: rgba(0,0,0,0.6);
          display: flex; align-items: center; justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .port-item:hover .port-hover {
          opacity: 1;
        }
        .port-hover span {
          color: #fff;
          font-size: 15px; font-weight: 600;
          letter-spacing: -0.3px;
        }

        /* ── CONTACT ── */
        .section-contact {
          padding: 100px 0;
          background: var(--bg-main);
        }
        .contact-inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: flex-start;
          max-width: 1100px;
        }
        .contact-info .tag { margin-bottom: 16px; }
        .contact-info h2 {
          font-size: 32px; font-weight: 800;
          color: var(--color-charcoal);
          line-height: 1.4;
          margin-bottom: 16px;
        }
        .contact-info > p {
          font-size: 15px; line-height: 1.7;
          color: var(--color-gray-dark);
          margin-bottom: 30px;
        }
        .contact-phone {
          display: flex; gap: 16px; align-items: center;
          background: #fff;
          padding: 20px 24px;
          border-radius: 14px;
          border: 1px solid var(--color-gray-light);
          margin-bottom: 24px;
        }
        .contact-phone svg {
          color: #fff;
          background: var(--color-primary);
          padding: 10px; box-sizing: content-box;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .contact-phone strong {
          display: block;
          font-size: 22px; font-weight: 900;
          color: var(--color-primary-dark);
        }
        .contact-phone span {
          font-size: 14px;
          color: var(--color-gray-dark);
        }
        .contact-checks {
          display: flex; flex-direction: column; gap: 10px;
        }
        .contact-checks > div {
          display: flex; align-items: center; gap: 8px;
          font-size: 14px; font-weight: 500;
          color: var(--color-charcoal);
        }
        .contact-checks svg {
          color: var(--color-success);
          flex-shrink: 0;
        }
        .contact-form-card {
          background: #fff;
          padding: 40px;
          border-radius: 16px;
          border: 1px solid var(--color-gray-light);
          box-shadow: var(--shadow-md);
        }
        .contact-form-card h3 {
          font-size: 20px; font-weight: 700;
          margin-bottom: 24px;
          border-left: 4px solid var(--color-primary);
          padding-left: 12px;
          color: var(--color-charcoal);
        }
        .fg {
          margin-bottom: 18px;
        }
        .fg label {
          display: block;
          font-size: 13px; font-weight: 600;
          color: var(--color-charcoal);
          margin-bottom: 6px;
        }
        .fg input, .fg select, .fg textarea {
          width: 100%;
          padding: 11px 14px;
          font-size: 14px;
          border: 1px solid var(--color-gray-light);
          border-radius: 10px;
          background: #fff;
          color: var(--color-charcoal);
          font-family: inherit;
          transition: border-color 0.2s;
        }
        .fg input:focus, .fg select:focus, .fg textarea:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(192,130,97,0.12);
        }
        .fg select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%235C544E' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          background-size: 16px;
          padding-right: 40px;
        }
        .submit-btn {
          width: 100%;
          display: flex; align-items: center; justify-content: center;
          gap: 8px;
          padding: 14px;
          font-size: 16px; font-weight: 700;
          background: linear-gradient(135deg, #0F2C59 0%, #1E3E62 100%);
          color: #fff;
          border: none; border-radius: 12px;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .submit-btn:hover {
          background: linear-gradient(135deg, #1E3E62 0%, #2563EB 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(37, 99, 235, 0.3);
        }
        .submit-ok {
          text-align: center;
          padding: 40px 0;
        }
        .submit-ok svg {
          color: var(--color-success);
          margin-bottom: 16px;
        }
        .submit-ok h3 {
          font-size: 22px; font-weight: 700;
          margin-bottom: 8px; border: none; padding: 0;
        }
        .submit-ok p {
          font-size: 14px;
          color: var(--color-gray-dark);
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 991px) {
          .stats-row { flex-wrap: wrap; gap: 24px; }
          .stat-divider { display: none; }
          .stat-item { flex: 0 0 45%; }
          .about-grid {
            grid-template-columns: 1fr;
            grid-template-rows: auto;
          }
          .about-cell { min-height: 200px; }
          .company-card { grid-template-columns: 1fr; gap: 40px; }
          .biz-block { grid-template-columns: 1fr; }
          .biz-block.reverse .biz-img { order: 0; }
          .biz-block.reverse .biz-text { order: 0; }
          .biz-img { min-height: 240px; }
          .str-grid { grid-template-columns: 1fr; }
          .port-grid { grid-template-columns: repeat(2, 1fr); }
          .contact-inner { grid-template-columns: 1fr; }
          .hero-logo { width: 160px; }
          .hero-tagline { font-size: 16px; }

          /* Mobile heading optimization */
          .company-left h2 { font-size: 26px; }
          .section-head h2 { font-size: 28px; }
          .contact-info h2 { font-size: 26px; }
          .biz-text h3 { font-size: 20px; }
          
          /* Prevent awkward wraps in Korean typography */
          h1, h2, h3, h4, p, span, strong, li {
            word-break: keep-all;
            overflow-wrap: break-word;
          }
          .pc-br { display: none; }
        }

        @media (max-width: 600px) {
          .stat-item { flex: 0 0 100%; }
          .port-grid { grid-template-columns: 1fr; }
          .center-top { font-size: 20px; }
          .company-left h2 { font-size: 22px; }
          .section-head h2 { font-size: 24px; }
          .contact-info h2 { font-size: 22px; }
          .hero-tagline { font-size: 14px; line-height: 1.6; }
          .hero-logo { width: 140px; }
          .about-cell.text-cell { font-size: 18px; }
          .about-cell.text-cell.sub { font-size: 15px; }
        }
      `}</style>
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';

const BASE = '/';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <img src={`${BASE}images/logo.png`} alt="강주방" className="footer-logo" />
            <p className="footer-desc">
              25년 업력의 업소용 주방 전문 기업.<br />
              고객의 니즈를 정확히 이해하고, 빠르게 실행합니다.
            </p>
          </div>

          <div className="footer-links">
            <h5>바로가기</h5>
            <a href="#about">회사소개</a>
            <a href="#business">사업영역</a>
            <a href="#strengths">경쟁력</a>
            <a href="#portfolio">납품실적</a>
            <a href="#consulting">문의하기</a>
          </div>

          <div className="footer-contact">
            <h5>연락처</h5>
            <p className="phone">1533-1524</p>
            <p>010-3332-9155</p>
            <p>경상코리아 (강주방)</p>
            <div className="footer-sns">
              <a href="https://smartstore.naver.com/kangjubang" target="_blank" rel="noopener noreferrer" title="네이버 스마트스토어">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M2 2h7.5v7.5L10 10l2.5-2.5H18V18H2V2z"/></svg>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} 경상코리아 (강주방). All Rights Reserved. 사업자등록번호: 367-86-03414</p>
        </div>
      </div>

      <style>{`
        .site-footer {
          background: var(--color-charcoal);
          color: rgba(255,255,255,0.6);
          padding: 60px 0 0;
        }

        .footer-inner {
          max-width: 1100px;
        }

        .footer-top {
          display: grid;
          grid-template-columns: 1.4fr 0.8fr 0.8fr;
          gap: 48px;
          padding-bottom: 40px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }

        .footer-logo {
          width: 110px;
          height: auto;
          filter: brightness(0) invert(1);
          opacity: 0.8;
          margin-bottom: 16px;
        }

        .footer-desc {
          font-size: 14px;
          line-height: 1.7;
          color: rgba(255,255,255,0.45);
        }

        .footer-links h5,
        .footer-contact h5 {
          font-size: 14px;
          font-weight: 700;
          color: rgba(255,255,255,0.8);
          margin-bottom: 16px;
          letter-spacing: 0.5px;
        }

        .footer-links a {
          display: block;
          font-size: 14px;
          color: rgba(255,255,255,0.45);
          padding: 5px 0;
          transition: color 0.2s;
          text-decoration: none;
        }

        .footer-links a:hover {
          color: var(--color-primary);
        }

        .footer-contact p {
          font-size: 14px;
          color: rgba(255,255,255,0.45);
          margin-bottom: 4px;
        }

        .footer-contact .phone {
          font-size: 20px;
          font-weight: 800;
          color: var(--color-primary);
          margin-bottom: 4px;
        }

        .footer-sns {
          display: flex;
          gap: 10px;
          margin-top: 12px;
        }

        .footer-sns a {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.5);
          transition: all 0.25s ease;
        }

        .footer-sns a:hover {
          background: var(--color-primary);
          color: #fff;
        }

        .footer-bottom {
          padding: 24px 0;
        }

        .footer-bottom p {
          font-size: 12px;
          color: rgba(255,255,255,0.3);
          text-align: center;
        }

        @media (max-width: 768px) {
          .footer-top {
            grid-template-columns: 1fr;
            gap: 32px;
          }
        }
      `}</style>
    </footer>
  );
}

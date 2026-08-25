import React, { useState, useEffect, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Users, Clock, ShoppingBag, Award, FileText 
} from 'lucide-react';
import { getDashboardStats, mockSalesHistory } from '../data/mockData';

export default function AdminDashboard() {
  const { customers, inquiries } = useOutletContext();
  const [liveCustomers, setLiveCustomers] = useState(customers);
  const [liveInquiries, setLiveInquiries] = useState(inquiries);
  const [recentLogs, setRecentLogs] = useState([
    { id: 101, name: "박철우 사장님", type: "가입", detail: "신규 회원 가입 완료", time: "방금 전", highlight: true },
    { id: 102, name: "대박삼겹살", type: "문의", detail: "3D 도면 컨설팅 문의 접수", time: "3분 전", highlight: false },
    { id: 103, name: "오지현 고객님", type: "구매", detail: "4구 화구 렌지 세트 구매 (11,200,000원)", time: "12분 전", highlight: false },
    { id: 104, name: "김태리 고객님", type: "포인트", detail: "골드 등급 달성 및 보너스 포인트 지급", time: "32분 전", highlight: false },
    { id: 105, name: "춘천닭갈비 본점", type: "A/S", detail: "배기팬 모터 무상 점검 신청", time: "1시간 전", highlight: false }
  ]);

  // Sync state if parent changes
  useEffect(() => {
    setLiveCustomers(customers);
  }, [customers]);

  useEffect(() => {
    setLiveInquiries(inquiries);
  }, [inquiries]);

  // Dynamic real-time registration simulator
  useEffect(() => {
    const randomNames = ["정우성 사장님", "황정민 사장님", "이정재 고객님", "성공반점", "안성재 셰프", "최강피자", "하늘카페"];
    const randomActions = [
      { type: "가입", detail: "신규 회원 가입 완료" },
      { type: "문의", detail: "주방 기기 견적 요청 접수" },
      { type: "구매", detail: "다용도 스테인리스 작업대 외 3종 구매" },
      { type: "A/S", detail: "급수 씽크 연동 AS 요청 접수" }
    ];

    const interval = setInterval(() => {
      const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
      const randomAction = randomActions[Math.floor(Math.random() * randomActions.length)];
      
      const newLog = {
        id: Date.now(),
        name: randomName,
        type: randomAction.type,
        detail: randomAction.detail,
        time: "방금 전",
        highlight: true
      };

      setRecentLogs(prev => {
        const updated = [newLog, ...prev.map(log => {
          if (log.time === "방금 전") return { ...log, time: "1분 전", highlight: false };
          if (log.time.endsWith("분 전")) {
            const minutes = parseInt(log.time) + 1;
            return { ...log, time: `${minutes}분 전`, highlight: false };
          }
          return log;
        })];
        return updated.slice(0, 6);
      });
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const stats = useMemo(() => getDashboardStats(liveCustomers), [liveCustomers]);
  const maxSales = useMemo(() => Math.max(...mockSalesHistory.map(m => m.sales)), []);

  const formatWon = (value) => {
    return new Intl.NumberFormat('ko-KR').format(value || 0) + '원';
  };

  // Grade Distribution Calculation for SVG Donut Chart
  const chartData = useMemo(() => {
    const dist = stats.gradeDistribution || {};
    const vipBiz = dist['VIP 업자'] || 0;
    const biz = dist['일반 업자'] || 0;
    const vipConsumer = dist['VIP 소비자'] || 0;
    const consumer = dist['일반 소비자'] || 0;
    
    const totalGrades = (vipBiz + biz + vipConsumer + consumer) || 1;
    
    const pctVipBiz = Math.round((vipBiz / totalGrades) * 100);
    const pctBiz = Math.round((biz / totalGrades) * 100);
    const pctVipConsumer = Math.round((vipConsumer / totalGrades) * 100);
    const pctConsumer = Math.round((consumer / totalGrades) * 100);

    const r = 70;
    const c = 2 * Math.PI * r;
    
    const strokeVipBiz = (pctVipBiz / 100) * c;
    const strokeBiz = (pctBiz / 100) * c;
    const strokeVipConsumer = (pctVipConsumer / 100) * c;
    const strokeConsumer = (pctConsumer / 100) * c;

    const offsetVipBiz = 0;
    const offsetBiz = strokeVipBiz;
    const offsetVipConsumer = strokeVipBiz + strokeBiz;
    const offsetConsumer = strokeVipBiz + strokeBiz + strokeVipConsumer;

    return {
      vipBiz, biz, vipConsumer, consumer,
      pctVipBiz, pctBiz, pctVipConsumer, pctConsumer,
      r, c,
      strokeVipBiz, strokeBiz, strokeVipConsumer, strokeConsumer,
      offsetVipBiz, offsetBiz, offsetVipConsumer, offsetConsumer
    };
  }, [stats]);

  const {
    vipBiz, biz, vipConsumer, consumer,
    pctVipBiz, pctBiz, pctVipConsumer, pctConsumer,
    r, c,
    strokeVipBiz, strokeBiz, strokeVipConsumer, strokeConsumer,
    offsetVipBiz, offsetBiz, offsetVipConsumer, offsetConsumer
  } = chartData;

  const pendingInquiriesCount = liveInquiries.filter(i => i.status === '대기').length;

  return (
    <div className="dashboard-viewport animate-fade-in">
      <div className="dashboard-header-summary">
        <h3 className="dashboard-title">강주방 통합 운영 대시보드</h3>
        <p className="dashboard-subtitle">업소용 주방기기 거래 실적, 3D 도면 문의 및 B2B/B2C CRM 현황입니다.</p>
      </div>

      {/* Top KPI Metrics */}
      <div className="kpi-grid">
        <div className="kpi-card glass-card">
          <div className="kpi-icon-row">
            <div className="kpi-icon bg-navy-light">
              <Users size={20} className="text-navy" />
            </div>
            <span className="kpi-trend text-blue">+4.2%</span>
          </div>
          <span className="kpi-value">{stats.totalCustomers}명</span>
          <span className="kpi-label">전체 등록 고객 수 (B2B/B2C)</span>
        </div>

        <div className="kpi-card glass-card">
          <div className="kpi-icon-row">
            <div className="kpi-icon bg-blue-light">
              <ShoppingBag size={20} className="text-blue" />
            </div>
            <span className="kpi-trend text-blue">+12.8%</span>
          </div>
          <span className="kpi-value">{formatWon(stats.accumulatedSales)}</span>
          <span className="kpi-label">누적 주방기기 거래 금액</span>
        </div>

        <div className="kpi-card glass-card">
          <div className="kpi-icon-row">
            <div className="kpi-icon bg-teal-light">
              <FileText size={20} className="text-teal" />
            </div>
            <span className="kpi-trend text-orange">{pendingInquiriesCount}건 대기중</span>
          </div>
          <span className="kpi-value">{liveInquiries.length}건</span>
          <span className="kpi-label">3D 도면 & 견적 문의 접수</span>
        </div>

        <div className="kpi-card glass-card">
          <div className="kpi-icon-row">
            <div className="kpi-icon bg-gold-light">
              <Award size={20} className="text-gold" />
            </div>
            <span className="kpi-trend text-blue">+3.1%</span>
          </div>
          <span className="kpi-value">
            {formatWon(stats.totalTransactions ? Math.round(stats.accumulatedSales / stats.totalTransactions) : 0)}
          </span>
          <span className="kpi-label">평균 주방 설비 객단가</span>
        </div>
      </div>

      {/* Row 2: Sales Chart & Donut Chart */}
      <div className="dashboard-content-grid">
        {/* Sales Chart Card */}
        <div className="chart-card-wrapper glass-card">
          <div className="card-header">
            <div>
              <h4 className="chart-title">월별 주방 설비 매출 추이</h4>
              <p className="chart-subtitle">최근 12개월간의 월별 공급 매출 및 거래 건수</p>
            </div>
            <div className="card-header-badge color-info">실시간 집계</div>
          </div>

          <div className="bar-chart-container">
            <div className="bar-chart-bars">
              {mockSalesHistory.map((item, idx) => {
                const heightPct = Math.round((item.sales / maxSales) * 100);
                return (
                  <div key={idx} className="bar-col">
                    <div className="bar-wrapper">
                      <div 
                        className="bar-fill" 
                        style={{ height: `${heightPct}%` }}
                        title={`${item.month}: ${formatWon(item.sales)} (${item.count}건)`}
                      >
                        <span className="bar-tooltip">{formatWon(item.sales)}</span>
                      </div>
                    </div>
                    <span className="bar-label">{item.month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Donut Chart & Legend */}
        <div className="chart-card-wrapper glass-card">
          <div className="card-header">
            <div>
              <h4 className="chart-title">고객 유형별 분포 (B2B vs B2C)</h4>
              <p className="chart-subtitle">식당 사장님(업자) 및 일반 소비자 구성비</p>
            </div>
          </div>

          <div className="donut-chart-container">
            <div className="donut-svg-wrapper">
              <svg width="190" height="190" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r={r} fill="transparent" stroke="#E2E8F0" strokeWidth="22" />
                <circle 
                  cx="100" cy="100" r={r} fill="transparent" stroke="#0F2C59" strokeWidth="22" 
                  strokeDasharray={`${strokeVipBiz} ${c}`} strokeDashoffset={-offsetVipBiz}
                  transform="rotate(-90 100 100)"
                />
                <circle 
                  cx="100" cy="100" r={r} fill="transparent" stroke="#2563EB" strokeWidth="22" 
                  strokeDasharray={`${strokeBiz} ${c}`} strokeDashoffset={-offsetBiz}
                  transform="rotate(-90 100 100)"
                />
                <circle 
                  cx="100" cy="100" r={r} fill="transparent" stroke="#38BDF8" strokeWidth="22" 
                  strokeDasharray={`${strokeVipConsumer} ${c}`} strokeDashoffset={-offsetVipConsumer}
                  transform="rotate(-90 100 100)"
                />
                <circle 
                  cx="100" cy="100" r={r} fill="transparent" stroke="#94A3B8" strokeWidth="22" 
                  strokeDasharray={`${strokeConsumer} ${c}`} strokeDashoffset={-offsetConsumer}
                  transform="rotate(-90 100 100)"
                />
                <text x="100" y="95" textAnchor="middle" className="donut-center-num" fill="#0F172A">
                  {stats.totalCustomers}명
                </text>
                <text x="100" y="120" textAnchor="middle" className="donut-center-label" fill="#64748B">
                  총 고객수
                </text>
              </svg>
            </div>

            <div className="donut-legend">
              <div className="legend-item">
                <span className="legend-dot vip-biz"></span>
                <span className="legend-name">VIP 업자 ({vipBiz}명)</span>
                <span className="legend-value">{pctVipBiz}%</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot biz"></span>
                <span className="legend-name">일반 업자 ({biz}명)</span>
                <span className="legend-value">{pctBiz}%</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot vip-consumer"></span>
                <span className="legend-name">VIP 소비자 ({vipConsumer}명)</span>
                <span className="legend-value">{pctVipConsumer}%</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot consumer"></span>
                <span className="legend-name">일반 소비자 ({consumer}명)</span>
                <span className="legend-value">{pctConsumer}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Real-time CRM Logs & Recent Tables */}
      <div className="dashboard-content-grid">
        {/* Real-time CRM Logs */}
        <div className="logs-card-wrapper glass-card">
          <div className="card-header">
            <h4 className="flex items-center gap-2">
              <Clock size={18} className="text-navy" />
              <span>실시간 주방 주문 및 CS 라이브 피드</span>
            </h4>
            <span className="live-indicator">
              <span className="live-dot"></span> LIVE
            </span>
          </div>

          <div className="logs-list-viewport">
            {recentLogs.map(log => (
              <div key={log.id} className={`log-item-row ${log.highlight ? 'new-highlight' : ''}`}>
                <span className={`log-badge badge-${log.type}`}>{log.type}</span>
                <div className="log-body">
                  <div className="log-meta">
                    <span className="log-user">{log.name}</span>
                    <span className="log-time">{log.time}</span>
                  </div>
                  <p className="log-detail">{log.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Consultation Inquiries */}
        <div className="table-card-wrapper glass-card">
          <div className="card-header">
            <h4 className="flex items-center gap-2">
              <FileText size={18} className="text-navy" />
              <span>3D 도면 & 견적 문의 처리 현황</span>
            </h4>
            <span className="card-header-badge color-info">{pendingInquiriesCount}건 처리 대기</span>
          </div>
          <div className="table-responsive">
            <table className="admin-dashboard-table">
              <thead>
                <tr>
                  <th>업체/고객명</th>
                  <th>문의 분야</th>
                  <th>접수일</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                {liveInquiries.slice(0, 5).map(inq => (
                  <tr key={inq.id}>
                    <td><strong>{inq.name}</strong></td>
                    <td>{inq.type}</td>
                    <td>{inq.date}</td>
                    <td>
                      <span className={`status-pill ${inq.status === '완료' ? 'completed' : 'pending'}`}>
                        {inq.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Latest Clients Table */}
      <div className="table-card-wrapper glass-card">
        <div className="card-header">
          <h4 className="flex items-center gap-2">
            <Users size={18} className="text-navy" />
            <span>최근 신규 등록 식당 및 주방 고객</span>
          </h4>
          <span className="card-header-badge">최신 5건</span>
        </div>
        <div className="table-responsive">
          <table className="admin-dashboard-table">
            <thead>
              <tr>
                <th>이름</th>
                <th>등급</th>
                <th>연락처</th>
                <th>지역/주소</th>
                <th>등록일</th>
                <th>누적 거래금액</th>
              </tr>
            </thead>
            <tbody>
              {liveCustomers.slice(0, 5).map(cust => (
                <tr key={cust.id}>
                  <td><strong>{cust.name}</strong></td>
                  <td>
                    <span className={`badge badge-${cust.grade?.toLowerCase().replace(/\s+/g, '-')}`}>
                      {cust.grade}
                    </span>
                  </td>
                  <td>{cust.phone}</td>
                  <td>{cust.address}</td>
                  <td>{cust.regDate}</td>
                  <td><strong>{formatWon(cust.totalAmount)}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .dashboard-viewport {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }
        
        .dashboard-header-summary {
          text-align: left;
        }
        
        .dashboard-title {
          font-size: 24px;
          font-weight: 800;
          color: #0F2C59;
          letter-spacing: -0.5px;
        }
        
        .dashboard-subtitle {
          font-size: 14px;
          color: #475569;
          margin-top: 4px;
        }
        
        /* KPIs Cards */
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        
        .kpi-card {
          padding: 24px;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          box-shadow: 0 4px 14px rgba(15, 44, 89, 0.05);
        }
        
        .kpi-icon-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          margin-bottom: 16px;
        }
        
        .kpi-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .bg-navy-light { background-color: #EFF6FF; }
        .bg-blue-light { background-color: #E0F2FE; }
        .bg-teal-light { background-color: #ECFDF5; }
        .bg-gold-light { background-color: #FEF3C7; }
        
        .text-navy { color: #0F2C59; }
        .text-blue { color: #2563EB; }
        .text-teal { color: #059669; }
        .text-gold { color: #D97706; }
        
        .kpi-trend {
          font-size: 12px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 6px;
          background-color: #F1F5F9;
        }
        
        .kpi-trend.text-blue { color: #2563EB; background-color: #EFF6FF; }
        .kpi-trend.text-orange { color: #EA580C; background-color: #FFF7ED; }
        
        .kpi-value {
          font-size: 26px;
          font-weight: 900;
          color: #0F172A;
          line-height: 1.2;
          margin-bottom: 6px;
        }
        
        .kpi-label {
          font-size: 13px;
          color: #64748B;
          font-weight: 500;
        }
        
        /* Row 2 Content Grid */
        .dashboard-content-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 24px;
        }
        
        .chart-card-wrapper, .logs-card-wrapper, .table-card-wrapper {
          background: #ffffff;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 14px rgba(15, 44, 89, 0.04);
        }
        
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          border-bottom: 1px solid #F1F5F9;
          padding-bottom: 14px;
        }
        
        .card-header h4, .chart-title {
          font-size: 16px;
          font-weight: 800;
          color: #0F2C59;
          margin: 0;
        }

        .chart-subtitle {
          font-size: 12px;
          color: #64748B;
          margin-top: 2px;
        }
        
        .card-header-badge {
          font-size: 11px;
          font-weight: 700;
          background-color: #F1F5F9;
          color: #475569;
          padding: 3px 10px;
          border-radius: 50px;
        }
        
        .card-header-badge.color-info {
          background-color: #EFF6FF;
          color: #2563EB;
        }
        
        /* Bar Chart CSS */
        .bar-chart-container {
          height: 220px;
          display: flex;
          align-items: flex-end;
          padding-top: 20px;
        }

        .bar-chart-bars {
          display: flex;
          width: 100%;
          height: 100%;
          align-items: flex-end;
          gap: 8px;
        }

        .bar-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 100%;
        }

        .bar-wrapper {
          flex: 1;
          width: 100%;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          position: relative;
        }

        .bar-fill {
          width: 60%;
          max-width: 24px;
          background: linear-gradient(180deg, #2563EB 0%, #0F2C59 100%);
          border-radius: 4px 4px 0 0;
          transition: all 0.3s ease;
          position: relative;
          cursor: pointer;
        }

        .bar-fill:hover {
          background: linear-gradient(180deg, #38BDF8 0%, #2563EB 100%);
        }

        .bar-tooltip {
          position: absolute;
          top: -30px;
          left: 50%;
          transform: translateX(-50%);
          background: #0F172A;
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          padding: 3px 6px;
          border-radius: 4px;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s ease;
        }

        .bar-fill:hover .bar-tooltip {
          opacity: 1;
        }

        .bar-label {
          font-size: 11px;
          color: #64748B;
          margin-top: 8px;
          font-weight: 600;
        }

        /* Donut Chart SVG styles */
        .donut-chart-container {
          display: flex;
          align-items: center;
          justify-content: space-around;
          flex-wrap: wrap;
          gap: 20px;
          padding: 10px 0;
        }
        
        .donut-svg-wrapper {
          position: relative;
        }
        
        .donut-center-num {
          font-size: 20px;
          font-weight: 900;
        }
        
        .donut-center-label {
          font-size: 11px;
          font-weight: 700;
        }
        
        .donut-legend {
          display: flex;
          flex-direction: column;
          gap: 10px;
          text-align: left;
        }
        
        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
        }
        
        .legend-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        
        .legend-dot.vip-biz { background-color: #0F2C59; }
        .legend-dot.biz { background-color: #2563EB; }
        .legend-dot.vip-consumer { background-color: #38BDF8; }
        .legend-dot.consumer { background-color: #94A3B8; }
        
        .legend-name {
          width: 115px;
          color: #475569;
          font-weight: 500;
        }
        
        .legend-value {
          font-weight: 800;
          color: #0F172A;
        }
        
        /* Live feed logs */
        .live-indicator {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background-color: #FEF2F2;
          color: #EF4444;
          padding: 3px 8px;
          border-radius: 50px;
          font-size: 11px;
          font-weight: 700;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }
        
        .live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #EF4444;
          animation: pulse 1.5s infinite;
        }
        
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.3; }
          100% { opacity: 1; }
        }

        .logs-list-viewport {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-height: 250px;
          overflow-y: auto;
          padding-right: 4px;
        }
        
        .log-item-row {
          display: flex;
          gap: 12px;
          padding: 10px 14px;
          border-radius: 10px;
          background-color: #F8FAFC;
          border-left: 3px solid #CBD5E1;
          transition: all 0.3s ease;
          text-align: left;
        }
        
        .log-item-row.new-highlight {
          background-color: #EFF6FF;
          border-left-color: #2563EB;
        }
        
        .log-badge {
          font-size: 11px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 4px;
          height: fit-content;
          flex-shrink: 0;
        }
        
        .badge-가입 { background-color: #EFF6FF; color: #0F2C59; }
        .badge-문의 { background-color: #E0F2FE; color: #0284C7; }
        .badge-구매 { background-color: #ECFDF5; color: #059669; }
        .badge-포인트 { background-color: #FEF3C7; color: #D97706; }
        .badge-AS { background-color: #FEF2F2; color: #DC2626; }
        
        .log-body {
          flex-grow: 1;
        }
        
        .log-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          margin-bottom: 2px;
        }
        
        .log-user {
          font-weight: 700;
          color: #0F172A;
        }
        
        .log-time {
          font-size: 11px;
          color: #94A3B8;
        }
        
        .log-detail {
          font-size: 12px;
          color: #475569;
          line-height: 1.4;
        }
        
        /* Tables Grid */
        .table-responsive {
          width: 100%;
          overflow-x: auto;
        }
        
        .admin-dashboard-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        
        .admin-dashboard-table th {
          font-size: 12px;
          font-weight: 700;
          color: #475569;
          border-bottom: 2px solid #E2E8F0;
          padding: 10px 12px;
          background-color: #F8FAFC;
        }
        
        .admin-dashboard-table td {
          font-size: 13px;
          padding: 12px;
          border-bottom: 1px solid #F1F5F9;
          color: #1E293B;
        }
        
        .admin-dashboard-table tr:hover td {
          background-color: #F8FAFC;
        }
        
        .status-pill {
          display: inline-flex;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 50px;
        }
        
        .status-pill.completed {
          background-color: #ECFDF5;
          color: #059669;
        }
        
        .status-pill.pending {
          background-color: #FEF3C7;
          color: #D97706;
        }

        .badge-vip-업자 { background-color: #0F2C59; color: #fff; }
        .badge-일반-업자 { background-color: #EFF6FF; color: #2563EB; border: 1px solid #BFDBFE; }
        .badge-vip-소비자 { background-color: #E0F2FE; color: #0284C7; }
        .badge-일반-소비자 { background-color: #F1F5F9; color: #64748B; }
        
        @media (max-width: 991px) {
          .kpi-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .dashboard-content-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

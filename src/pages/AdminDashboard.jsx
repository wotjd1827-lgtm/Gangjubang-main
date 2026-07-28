import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Users, DollarSign, ShoppingCart, UserPlus, 
  TrendingUp, Star, Clock, ChevronRight 
} from 'lucide-react';
import { getDashboardStats } from '../data/mockData';

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
          // Age the existing logs slightly for effect
          if (log.time === "방금 전") return { ...log, time: "1분 전", highlight: false };
          if (log.time.endsWith("분 전")) {
            const minutes = parseInt(log.time) + 1;
            return { ...log, time: `${minutes}분 전`, highlight: false };
          }
          return log;
        })];
        return updated.slice(0, 6); // Keep top 6
      });
    }, 15000); // Trigger every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const stats = getDashboardStats(liveCustomers);

  // Format currency
  const formatWon = (value) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' })
      .format(value)
      .replace('₩', '₩ ') + '원';
  };

  // Grade distributions calculations for SVG Pie
  const { VIP, GOLD, SILVER, BRONZE } = stats.gradeDistribution;
  const totalGrades = VIP + GOLD + SILVER + BRONZE;
  
  // Percentages
  const pctVip = Math.round((VIP / totalGrades) * 100);
  const pctGold = Math.round((GOLD / totalGrades) * 100);
  const pctSilver = Math.round((SILVER / totalGrades) * 100);
  const pctBronze = Math.round((BRONZE / totalGrades) * 100);

  // Donut chart math (Radius: 70, Circumference: 439.8)
  const r = 70;
  const c = 2 * Math.PI * r; // ~439.82
  
  const strokeVip = (pctVip / 100) * c;
  const strokeGold = (pctGold / 100) * c;
  const strokeSilver = (pctSilver / 100) * c;
  const strokeBronze = (pctBronze / 100) * c;

  const offsetVip = 0;
  const offsetGold = strokeVip;
  const offsetSilver = strokeVip + strokeGold;
  const offsetBronze = strokeVip + strokeGold + strokeSilver;

  return (
    <div className="dashboard-viewport animate-fade-in">
      <div className="dashboard-header-summary">
        <h3 className="dashboard-title">대시보드 개요</h3>
        <p className="dashboard-subtitle">강주방 CRM 실시간 핵심 운영 지표입니다.</p>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        {/* Total Customers */}
        <div className="kpi-card glass-card">
          <div className="kpi-icon-row">
            <div className="kpi-icon bg-orange-light">
              <Users size={20} className="text-orange" />
            </div>
            <span className="kpi-trend text-green">+4.2%</span>
          </div>
          <span className="kpi-value">{stats.totalCustomers}명</span>
          <span className="kpi-label">전체 등록 고객 수</span>
        </div>

        {/* Accumulated Sales */}
        <div className="kpi-card glass-card">
          <div className="kpi-icon-row">
            <div className="kpi-icon bg-green-light">
              <DollarSign size={20} className="text-green-dark" />
            </div>
            <span className="kpi-trend text-green">+12.8%</span>
          </div>
          <span className="kpi-value-small">{formatWon(stats.accumulatedSales)}</span>
          <span className="kpi-label">누적 거래액</span>
        </div>

        {/* Total Transactions */}
        <div className="kpi-card glass-card">
          <div className="kpi-icon-row">
            <div className="kpi-icon bg-blue-light">
              <ShoppingCart size={20} className="text-blue" />
            </div>
            <span className="kpi-trend text-green">+8.5%</span>
          </div>
          <span className="kpi-value">{stats.totalTransactions}건</span>
          <span className="kpi-label">총 누적 거래 건수</span>
        </div>

        {/* Average Transaction Value */}
        <div className="kpi-card glass-card">
          <div className="kpi-icon-row">
            <div className="kpi-icon bg-purple-light">
              <TrendingUp size={20} className="text-purple" />
            </div>
            <span className="kpi-trend text-green">+1.2%</span>
          </div>
          <span className="kpi-value-small">{formatWon(Math.round(stats.accumulatedSales / stats.totalTransactions))}</span>
          <span className="kpi-label">거래 건당 평균 매출</span>
        </div>
      </div>

      {/* Row 2: Charts & Logs */}
      <div className="dashboard-content-grid">
        {/* Grade Distribution Chart (SVG) */}
        <div className="chart-card-wrapper glass-card">
          <div className="card-header">
            <h4>고객 등급별 분포</h4>
            <span className="card-header-badge">누적 기준</span>
          </div>
          
          <div className="donut-chart-container">
            <div className="donut-svg-wrapper">
              <svg width="200" height="200" viewBox="0 0 200 200" className="donut-chart">
                <circle cx="100" cy="100" r={r} fill="transparent" stroke="#EBE5DF" strokeWidth="22" />
                {/* VIP */}
                <circle 
                  cx="100" 
                  cy="100" 
                  r={r} 
                  fill="transparent" 
                  stroke="#721C24" 
                  strokeWidth="22" 
                  strokeDasharray={`${strokeVip} ${c}`}
                  strokeDashoffset={-offsetVip}
                  transform="rotate(-90 100 100)"
                />
                {/* GOLD */}
                <circle 
                  cx="100" 
                  cy="100" 
                  r={r} 
                  fill="transparent" 
                  stroke="#D9A05B" 
                  strokeWidth="22" 
                  strokeDasharray={`${strokeGold} ${c}`}
                  strokeDashoffset={-offsetGold}
                  transform="rotate(-90 100 100)"
                />
                {/* SILVER */}
                <circle 
                  cx="100" 
                  cy="100" 
                  r={r} 
                  fill="transparent" 
                  stroke="#5C544E" 
                  strokeWidth="22" 
                  strokeDasharray={`${strokeSilver} ${c}`}
                  strokeDashoffset={-offsetSilver}
                  transform="rotate(-90 100 100)"
                />
                {/* BRONZE */}
                <circle 
                  cx="100" 
                  cy="100" 
                  r={r} 
                  fill="transparent" 
                  stroke="#6E8E75" 
                  strokeWidth="22" 
                  strokeDasharray={`${strokeBronze} ${c}`}
                  strokeDashoffset={-offsetBronze}
                  transform="rotate(-90 100 100)"
                />
                
                {/* Central Labels */}
                <text x="100" y="95" textAnchor="middle" className="donut-center-num" fill="var(--color-charcoal)">
                  {stats.totalCustomers}명
                </text>
                <text x="100" y="120" textAnchor="middle" className="donut-center-label" fill="var(--color-gray-dark)">
                  총 회원수
                </text>
              </svg>
            </div>

            <div className="donut-legend">
              <div className="legend-item">
                <span className="legend-dot vip"></span>
                <span className="legend-name">VIP ({VIP}명)</span>
                <span className="legend-value">{pctVip}%</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot gold"></span>
                <span className="legend-name">GOLD ({GOLD}명)</span>
                <span className="legend-value">{pctGold}%</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot silver"></span>
                <span className="legend-name">SILVER ({SILVER}명)</span>
                <span className="legend-value">{pctSilver}%</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot bronze"></span>
                <span className="legend-name">BRONZE ({BRONZE}명)</span>
                <span className="legend-value">{pctBronze}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time CRM Logs */}
        <div className="logs-card-wrapper glass-card">
          <div className="card-header">
            <h4 className="flex items-center gap-2">
              <Clock size={16} className="text-orange" />
              <span>실시간 고객 활동 피드</span>
            </h4>
            <span className="live-indicator">
              <span className="live-dot animate-pulse"></span>
              LIVE
            </span>
          </div>

          <div className="logs-list-viewport">
            {recentLogs.map((log) => (
              <div className={`log-item-row ${log.highlight ? 'new-highlight' : ''}`} key={log.id}>
                <div className={`log-badge badge-${log.type}`}>
                  {log.type}
                </div>
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
      </div>

      {/* Row 3: New Customer List & Active inquiries */}
      <div className="dashboard-tables-grid">
        {/* Latest Clients */}
        <div className="table-card-wrapper glass-card">
          <div className="card-header">
            <h4>최근 등록 고객</h4>
            <span className="card-header-badge">신규 고객</span>
          </div>
          <div className="table-responsive">
            <table className="admin-dashboard-table">
              <thead>
                <tr>
                  <th>이름</th>
                  <th>등급</th>
                  <th>연락처</th>
                  <th>지역</th>
                  <th>가입일</th>
                </tr>
              </thead>
              <tbody>
                {liveCustomers.slice(0, 5).map(cust => (
                  <tr key={cust.id}>
                    <td><strong>{cust.name}</strong></td>
                    <td>
                      <span className={`badge badge-${cust.grade.toLowerCase()}`}>{cust.grade}</span>
                    </td>
                    <td>{cust.phone}</td>
                    <td>{cust.address}</td>
                    <td>{cust.regDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Active Consultation Inquiries */}
        <div className="table-card-wrapper glass-card">
          <div className="card-header">
            <h4>상담 및 문의 현황</h4>
            <span className="card-header-badge color-info">{liveInquiries.filter(i => i.status === '대기').length}건 대기중</span>
          </div>
          <div className="table-responsive">
            <table className="admin-dashboard-table">
              <thead>
                <tr>
                  <th>업체/고객명</th>
                  <th>문의 분류</th>
                  <th>접수일</th>
                  <th>처리 상태</th>
                </tr>
              </thead>
              <tbody>
                {liveInquiries.map(inq => (
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

      <style>{`
        .dashboard-viewport {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }
        
        .dashboard-header-summary {
          text-align: left;
        }
        
        .dashboard-title {
          font-size: 22px;
          font-weight: 700;
          color: var(--color-charcoal);
        }
        
        .dashboard-subtitle {
          font-size: 14px;
          color: var(--color-gray-dark);
        }
        
        /* KPIs Cards */
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        
        .kpi-card {
          padding: 24px;
          border: 1px solid var(--color-gray-light);
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }
        
        .kpi-icon-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          margin-bottom: 16px;
        }
        
        .kpi-icon {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .bg-orange-light { background-color: var(--color-primary-light); }
        .bg-green-light { background-color: rgba(110, 142, 117, 0.1); }
        .bg-blue-light { background-color: rgba(91, 141, 157, 0.1); }
        .bg-purple-light { background-color: rgba(154, 123, 86, 0.1); }
        
        .text-orange { color: var(--color-primary); }
        .text-green-dark { color: var(--color-success); }
        .text-blue { color: var(--color-info); }
        .text-purple { color: var(--color-secondary); }
        
        .kpi-trend {
          font-size: 12px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
        }
        
        .text-green {
          color: var(--color-success);
          background-color: rgba(110, 142, 117, 0.08);
        }
        
        .kpi-value {
          font-size: 28px;
          font-weight: 900;
          color: var(--color-charcoal);
          line-height: 1.2;
          margin-bottom: 4px;
        }
        
        .kpi-value-small {
          font-size: 20px;
          font-weight: 900;
          color: var(--color-charcoal);
          line-height: 1.2;
          margin-bottom: 8px;
          white-space: nowrap;
          word-break: break-all;
        }
        
        .kpi-label {
          font-size: 12px;
          color: var(--color-gray-dark);
          font-weight: 500;
        }
        
        /* Row 2 Styles */
        .dashboard-content-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        
        .chart-card-wrapper, .logs-card-wrapper, .table-card-wrapper {
          border: 1px solid var(--color-gray-light);
          padding: 24px;
          display: flex;
          flex-direction: column;
        }
        
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          border-bottom: 1px solid var(--color-gray-light);
          padding-bottom: 12px;
        }
        
        .card-header h4 {
          font-size: 16px;
          font-weight: 700;
          color: var(--color-charcoal);
        }
        
        .card-header-badge {
          font-size: 11px;
          font-weight: 700;
          background-color: var(--color-gray-ultra);
          color: var(--color-gray-dark);
          padding: 2px 8px;
          border-radius: 4px;
        }
        
        .card-header-badge.color-info {
          background-color: rgba(91, 141, 157, 0.1);
          color: var(--color-info);
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
          gap: 8px;
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
        
        .legend-dot.vip { background-color: #721C24; }
        .legend-dot.gold { background-color: #D9A05B; }
        .legend-dot.silver { background-color: #5C544E; }
        .legend-dot.bronze { background-color: #6E8E75; }
        
        .legend-name {
          width: 110px;
          color: var(--color-gray-dark);
        }
        
        .legend-value {
          font-weight: 700;
          color: var(--color-charcoal);
        }
        
        /* Live feed logs */
        .live-indicator {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background-color: #FDF2F0;
          color: var(--color-danger);
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 700;
          border: 1px solid rgba(201, 111, 83, 0.2);
        }
        
        .live-dot {
          width: 6px;
          height: 6px;
          background-color: var(--color-danger);
          border-radius: 50%;
        }
        
        .logs-list-viewport {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-height: 240px;
          overflow-y: auto;
          padding-right: 4px;
        }
        
        .log-item-row {
          display: flex;
          gap: 12px;
          padding: 10px 12px;
          border-radius: var(--radius-md);
          background-color: var(--color-gray-ultra);
          border-left: 3px solid var(--color-gray-medium);
          transition: all 0.5s ease;
          text-align: left;
        }
        
        .log-item-row.new-highlight {
          background-color: #FFF9F2;
          border-left-color: var(--color-primary);
        }
        
        .log-badge {
          font-size: 10px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
          height: fit-content;
          flex-shrink: 0;
        }
        
        .badge-가입 { background-color: var(--color-primary-light); color: var(--color-primary-dark); }
        .badge-문의 { background-color: rgba(91, 141, 157, 0.1); color: var(--color-info); }
        .badge-구매 { background-color: rgba(110, 142, 117, 0.1); color: var(--color-success); }
        .badge-포인트 { background-color: #FFF3CD; color: #856404; }
        .badge-AS { background-color: #F8D7DA; color: #721C24; }
        
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
          color: var(--color-charcoal);
        }
        
        .log-time {
          font-size: 11px;
          color: var(--color-gray-medium);
        }
        
        .log-detail {
          font-size: 12px;
          color: var(--color-gray-dark);
          line-height: 1.4;
        }
        
        /* Tables Grid */
        .dashboard-tables-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 24px;
        }
        
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
          color: var(--color-gray-dark);
          border-bottom: 2px solid var(--color-gray-light);
          padding: 10px 12px;
          background-color: var(--color-gray-ultra);
        }
        
        .admin-dashboard-table td {
          font-size: 13px;
          padding: 12px;
          border-bottom: 1px solid var(--color-gray-ultra);
          color: var(--color-charcoal);
        }
        
        .admin-dashboard-table tr:hover td {
          background-color: var(--color-gray-ultra);
        }
        
        .status-pill {
          display: inline-flex;
          font-size: 11px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 50px;
        }
        
        .status-pill.completed {
          background-color: rgba(110, 142, 117, 0.1);
          color: var(--color-success);
        }
        
        .status-pill.pending {
          background-color: #FFF3CD;
          color: #856404;
        }
        
        @media (max-width: 991px) {
          .kpi-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .dashboard-content-grid, .dashboard-tables-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

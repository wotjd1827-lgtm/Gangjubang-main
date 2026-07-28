import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { BarChart3, TrendingUp, Compass, Award, CreditCard } from 'lucide-react';
import { mockSalesHistory } from '../data/mockData';

export default function AdminReports() {
  const { customers } = useOutletContext();

  // 1. Calculate Grade Total Purchase Amounts
  const gradeTotals = customers.reduce((acc, c) => {
    acc[c.grade] = (acc[c.grade] || 0) + c.totalAmount;
    return acc;
  }, { VIP: 0, GOLD: 0, SILVER: 0, BRONZE: 0 });

  const totalRevenue = Object.values(gradeTotals).reduce((sum, v) => sum + v, 0);

  // Formatting helper
  const formatWon = (value) => {
    return new Intl.NumberFormat('ko-KR').format(value) + '원';
  };
  const formatWonMillion = (value) => {
    return (value / 100000000).toFixed(2) + '억원';
  };

  // 2. Bar Chart Math (Grade Revenues)
  const maxGradeRevenue = Math.max(...Object.values(gradeTotals));
  const gradeColors = {
    VIP: '#721C24',
    GOLD: '#D9A05B',
    SILVER: '#5C544E',
    BRONZE: '#6E8E75'
  };

  // 3. Line Chart Math (Monthly Revenue)
  const maxSales = Math.max(...mockSalesHistory.map(h => h.sales));
  const minSales = Math.min(...mockSalesHistory.map(h => h.sales));
  
  // Grid lines
  const gridLinesCount = 5;
  const gridInterval = maxSales / gridLinesCount;

  // Render SVG points (Width: 600, Height: 240)
  const chartW = 600;
  const chartH = 200;
  const paddingX = 40;
  const paddingY = 20;

  const points = mockSalesHistory.map((item, index) => {
    const x = paddingX + (index * (chartW - 2 * paddingX) / (mockSalesHistory.length - 1));
    // Invert Y because SVG 0,0 is top-left
    const y = chartH - paddingY - (item.sales / maxSales) * (chartH - 2 * paddingY);
    return { x, y, ...item };
  });

  const linePath = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${chartH - paddingY} L ${points[0].x} ${chartH - paddingY} Z`;

  // Sort top customers by amount spent
  const topSpentCustomers = [...customers]
    .sort((a, b) => b.totalAmount - a.totalAmount)
    .slice(0, 3);

  return (
    <div className="reports-viewport animate-fade-in">
      <div className="reports-header">
        <h3 className="reports-title">통계 / 리포트</h3>
        <p className="reports-subtitle">강주방 CRM 거래 통계와 등급별 매출 기여도 분석 리포트입니다.</p>
      </div>

      {/* KPI summaries */}
      <div className="reports-summary-cards">
        <div className="rep-kpi-card glass-card">
          <div className="rep-kpi-row">
            <TrendingUp size={24} className="text-orange" />
            <div>
              <span className="rep-label">올해 총 매출 목표 달성률</span>
              <h4>{formatWonMillion(totalRevenue)} 달성 <span>(목표 10억원 대비)</span></h4>
            </div>
          </div>
          <div className="rep-progress-bar">
            <div className="rep-progress" style={{ width: `${(totalRevenue / 1000000000) * 100}%` }}></div>
          </div>
          <span className="rep-bottom-info">누적 {((totalRevenue / 1000000000) * 100).toFixed(1)}% 달성 중</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="reports-charts-grid">
        {/* Monthly Revenue Trend Line Chart */}
        <div className="chart-card-wrapper glass-card line-chart-card">
          <div className="card-header">
            <h4>월별 매출액 추이</h4>
            <span className="card-header-badge color-success">최근 12개월</span>
          </div>

          <div className="svg-line-chart-container">
            <svg viewBox={`0 0 ${chartW} ${chartH}`} width="100%" height="100%" className="line-chart-svg">
              {/* Grids */}
              {Array.from({ length: gridLinesCount + 1 }).map((_, idx) => {
                const y = paddingY + (idx * (chartH - 2 * paddingY) / gridLinesCount);
                const value = Math.round(maxSales - (idx * gridInterval));
                return (
                  <g key={idx}>
                    <line x1={paddingX} y1={y} x2={chartW - paddingX} y2={y} stroke="var(--color-gray-light)" strokeWidth="1" strokeDasharray="4 4" />
                    <text x={paddingX - 10} y={y + 4} textAnchor="end" className="chart-grid-label" fill="var(--color-gray-medium)">
                      {Math.round(value / 10000000)}천만
                    </text>
                  </g>
                );
              })}

              {/* Area path */}
              <path d={areaPath} fill="rgba(192, 130, 97, 0.08)" />

              {/* Line path */}
              <path d={linePath} fill="transparent" stroke="var(--color-primary)" strokeWidth="3" />

              {/* Data points */}
              {points.map((p, idx) => (
                <g key={idx} className="chart-point-group">
                  <circle cx={p.x} cy={p.y} r="5" fill="#ffffff" stroke="var(--color-primary)" strokeWidth="2" />
                  <circle cx={p.x} cy={p.y} r="8" fill="var(--color-primary)" className="point-hover-effect" />
                  {/* Tooltip text (shown conditionally on hover in CSS) */}
                  <text x={p.x} y={p.y - 12} textAnchor="middle" className="chart-point-val">
                    {(p.sales / 10000000).toFixed(0)}천
                  </text>
                  {/* X Axis Labels */}
                  <text x={p.x} y={chartH - 4} textAnchor="middle" className="chart-axis-label" fill="var(--color-gray-dark)">
                    {p.month}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Grade Share Bar Chart */}
        <div className="chart-card-wrapper glass-card bar-chart-card">
          <div className="card-header">
            <h4>고객 등급별 매출 기여액</h4>
            <span className="card-header-badge color-info">총 {formatWonMillion(totalRevenue)}</span>
          </div>

          <div className="svg-bar-chart-container">
            {Object.entries(gradeTotals).map(([grade, val]) => {
              const percentage = ((val / totalRevenue) * 100).toFixed(1);
              const barHeightPct = (val / maxGradeRevenue) * 100;
              return (
                <div className="bar-chart-column" key={grade}>
                  <span className="bar-val-label">{formatWon(Math.round(val / 10000))}만</span>
                  <div className="bar-track">
                    <div 
                      className="bar-fill" 
                      style={{ 
                        height: `${barHeightPct}%`,
                        backgroundColor: gradeColors[grade]
                      }}
                    ></div>
                  </div>
                  <span className={`badge badge-${grade.toLowerCase()} bar-grade-badge`}>{grade}</span>
                  <span className="bar-pct-label">{percentage}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lower Row: TOP VIP list & Text analyses */}
      <div className="reports-tables-grid">
        {/* Top VIP Spenders */}
        <div className="table-card-wrapper glass-card">
          <div className="card-header">
            <h4 className="flex items-center gap-2">
              <Award size={16} className="text-orange" />
              <span>우수 구매 고객 TOP 3 (VIP)</span>
            </h4>
          </div>
          <div className="table-responsive">
            <table className="admin-dashboard-table">
              <thead>
                <tr>
                  <th>순위</th>
                  <th>고객명</th>
                  <th>등급</th>
                  <th>거래 횟수</th>
                  <th className="text-right">누적 구매 금액</th>
                  <th className="text-right">적립 포인트</th>
                </tr>
              </thead>
              <tbody>
                {topSpentCustomers.map((cust, idx) => (
                  <tr key={cust.id}>
                    <td><strong>{idx + 1}위</strong></td>
                    <td>{cust.name}</td>
                    <td><span className="badge badge-vip">{cust.grade}</span></td>
                    <td>{cust.frequency}회</td>
                    <td className="text-right font-bold text-orange">{formatWon(cust.totalAmount)}</td>
                    <td className="text-right color-primary">{formatWon(cust.points)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Business Advice/Notes */}
        <div className="table-card-wrapper glass-card notes-card">
          <div className="card-header">
            <h4>강주방 CRM 비즈니스 분석 제언</h4>
          </div>
          <div className="reports-notes-content">
            <div className="advice-block">
              <h5>1. VIP 고객 기여도 극대화</h5>
              <p>
                현재 전체 매출의 높은 비중을 <strong>VIP 등급</strong> 고객이 차지하고 있습니다. 
                매출 신장을 위해 VIP 등급 가맹점주를 위한 3D 컨설팅 무상 우선 매칭 및 A/S 긴급 출동 보장 서비스를 확대 제공해야 합니다.
              </p>
            </div>
            <div className="advice-block">
              <h5>2. 비수기(7-8월) 마케팅 전략</h5>
              <p>
                통상 7~8월 휴가철 창업 연기로 매출 정체가 확인되었습니다. 
                이 시기에 네이버 카페 <strong>'아프니까 사장이다'</strong> 특별 가입 프로모션(포인트 2배 적립 및 무료 설치)을 집중 배치하여 사전 예약 가맹을 유도하는 것이 효과적입니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .reports-viewport {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        
        .reports-header {
          text-align: left;
        }
        
        .reports-title {
          font-size: 22px;
          font-weight: 700;
        }
        
        .reports-subtitle {
          font-size: 14px;
          color: var(--color-gray-dark);
        }
        
        /* KPI summaries */
        .reports-summary-cards {
          width: 100%;
        }
        
        .rep-kpi-card {
          padding: 24px;
          border: 1px solid var(--color-gray-light);
          text-align: left;
        }
        
        .rep-kpi-row {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
        }
        
        .rep-kpi-row svg {
          padding: 10px;
          box-sizing: content-box;
          background-color: var(--color-primary-light);
          border-radius: 50%;
        }
        
        .rep-label {
          font-size: 12px;
          color: var(--color-gray-dark);
          font-weight: 500;
        }
        
        .rep-kpi-row h4 {
          font-size: 24px;
          font-weight: 900;
        }
        
        .rep-kpi-row h4 span {
          font-size: 13px;
          color: var(--color-gray-medium);
          font-weight: 500;
        }
        
        .rep-progress-bar {
          height: 8px;
          width: 100%;
          background-color: var(--color-gray-light);
          border-radius: 50px;
          overflow: hidden;
          margin-bottom: 8px;
        }
        
        .rep-progress {
          height: 100%;
          background-color: var(--color-primary);
          border-radius: 50px;
          transition: width 1s ease-out;
        }
        
        .rep-bottom-info {
          font-size: 12px;
          font-weight: 700;
          color: var(--color-primary);
        }
        
        /* Charts Grid */
        .reports-charts-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 24px;
        }
        
        .line-chart-card, .bar-chart-card {
          border: 1px solid var(--color-gray-light);
          padding: 24px;
          display: flex;
          flex-direction: column;
        }
        
        .svg-line-chart-container {
          height: 240px;
          padding-top: 10px;
        }
        
        .line-chart-svg {
          width: 100%;
          height: 100%;
          overflow: visible;
        }
        
        .chart-grid-label {
          font-size: 9px;
        }
        
        .chart-axis-label {
          font-size: 10px;
          font-weight: 500;
        }
        
        .chart-point-val {
          font-size: 9px;
          font-weight: 700;
          fill: var(--color-primary-dark);
          opacity: 0;
          transition: opacity var(--transition-fast);
        }
        
        .chart-point-group:hover .chart-point-val {
          opacity: 1;
        }
        
        .point-hover-effect {
          opacity: 0;
          cursor: pointer;
        }
        
        .chart-point-group:hover .point-hover-effect {
          opacity: 0.25;
        }
        
        /* Bar Chart columns styling */
        .svg-bar-chart-container {
          display: flex;
          height: 240px;
          justify-content: space-around;
          align-items: flex-end;
          padding-bottom: 20px;
          padding-top: 10px;
        }
        
        .bar-chart-column {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 60px;
          height: 100%;
        }
        
        .bar-val-label {
          font-size: 11px;
          font-weight: 700;
          color: var(--color-charcoal);
          margin-bottom: 6px;
        }
        
        .bar-track {
          width: 24px;
          background-color: var(--color-gray-light);
          border-radius: 50px;
          flex-grow: 1;
          display: flex;
          align-items: flex-end;
          overflow: hidden;
          margin-bottom: 10px;
        }
        
        .bar-fill {
          width: 100%;
          border-radius: 50px;
          transition: height 1s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .bar-grade-badge {
          margin-bottom: 4px;
        }
        
        .bar-pct-label {
          font-size: 11px;
          font-weight: 700;
          color: var(--color-gray-dark);
        }
        
        /* Lower rows */
        .reports-tables-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        
        .reports-notes-content {
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .advice-block h5 {
          font-size: 14px;
          font-weight: 700;
          color: var(--color-charcoal);
          margin-bottom: 6px;
        }
        
        .advice-block p {
          font-size: 13px;
          color: var(--color-gray-dark);
          line-height: 1.5;
        }
        
        @media (max-width: 991px) {
          .reports-charts-grid, .reports-tables-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

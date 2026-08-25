import React, { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { TrendingUp, Award, Target } from 'lucide-react';
import { mockSalesHistory } from '../data/mockData';

export default function AdminReports() {
  const { customers } = useOutletContext();

  // 1. Calculate Grade Total Purchase Amounts (B2B vs B2C Segments)
  const gradeTotals = useMemo(() => {
    return customers.reduce((acc, c) => {
      const g = c.grade || '일반 소비자';
      acc[g] = (acc[g] || 0) + (c.totalAmount || 0);
      return acc;
    }, { 'VIP 업자': 0, '일반 업자': 0, 'VIP 소비자': 0, '일반 소비자': 0 });
  }, [customers]);

  const totalRevenue = useMemo(() => {
    return Object.values(gradeTotals).reduce((sum, v) => sum + v, 0);
  }, [gradeTotals]);

  // Formatting helpers
  const formatWon = (value) => {
    return new Intl.NumberFormat('ko-KR').format(value || 0) + '원';
  };
  const formatWonMillion = (value) => {
    return ((value || 0) / 100000000).toFixed(2) + '억원';
  };

  // 2. Bar Chart Math (Grade Revenues)
  const maxGradeRevenue = useMemo(() => {
    const vals = Object.values(gradeTotals);
    return Math.max(...vals, 1);
  }, [gradeTotals]);

  const gradeColors = {
    'VIP 업자': '#0F2C59',
    '일반 업자': '#2563EB',
    'VIP 소비자': '#38BDF8',
    '일반 소비자': '#94A3B8'
  };

  // 3. Line Chart Math (Monthly Revenue)
  const maxSales = useMemo(() => Math.max(...mockSalesHistory.map(h => h.sales)), []);
  
  // Grid lines
  const gridLinesCount = 5;
  const gridInterval = maxSales / gridLinesCount;

  const chartW = 600;
  const chartH = 200;
  const paddingX = 40;
  const paddingY = 20;

  const points = useMemo(() => {
    return mockSalesHistory.map((item, index) => {
      const x = paddingX + (index * (chartW - 2 * paddingX) / (mockSalesHistory.length - 1));
      const y = chartH - paddingY - (item.sales / maxSales) * (chartH - 2 * paddingY);
      return { x, y, ...item };
    });
  }, [maxSales]);

  const linePath = useMemo(() => {
    return points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  }, [points]);

  const areaPath = useMemo(() => {
    if (!points.length) return '';
    return `${linePath} L ${points[points.length - 1].x} ${chartH - paddingY} L ${points[0].x} ${chartH - paddingY} Z`;
  }, [linePath, points]);

  // Sort top customers by amount spent
  const topSpentCustomers = useMemo(() => {
    return [...customers]
      .sort((a, b) => (b.totalAmount || 0) - (a.totalAmount || 0))
      .slice(0, 3);
  }, [customers]);

  const targetRevenue = 1000000000; // 10억
  const achievementRate = useMemo(() => {
    return ((totalRevenue / targetRevenue) * 100).toFixed(1);
  }, [totalRevenue]);

  return (
    <div className="reports-viewport animate-fade-in">
      <div className="reports-header">
        <h3 className="reports-title">강주방 통계 및 기여도 리포트</h3>
        <p className="reports-subtitle">주방기기 거래 매출 실적 추이와 B2B/B2C 등급별 기여도 정밀 분석입니다.</p>
      </div>

      {/* KPI summary */}
      <div className="reports-summary-cards">
        <div className="rep-kpi-card glass-card">
          <div className="rep-kpi-row">
            <div className="icon-wrapper">
              <TrendingUp size={24} className="text-navy" />
            </div>
            <div>
              <span className="rep-label">올해 주방기기 총 공급 매출 목표 달성률</span>
              <h4>{formatWonMillion(totalRevenue)} 달성 <span>(목표 10억원 대비)</span></h4>
            </div>
          </div>
          <div className="rep-progress-bar">
            <div className="rep-progress" style={{ width: `${Math.min(achievementRate, 100)}%` }}></div>
          </div>
          <span className="rep-bottom-info">누적 {achievementRate}% 달성 중</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="reports-charts-grid">
        {/* Monthly Revenue Trend Line Chart */}
        <div className="chart-card-wrapper glass-card line-chart-card">
          <div className="card-header">
            <h4>월별 주방기기 매출액 추이</h4>
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
                    <line x1={paddingX} y1={y} x2={chartW - paddingX} y2={y} stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4" />
                    <text x={paddingX - 10} y={y + 4} textAnchor="end" className="chart-grid-label" fill="#64748B">
                      {Math.round(value / 10000000)}천만
                    </text>
                  </g>
                );
              })}

              {/* Area path */}
              <path d={areaPath} fill="rgba(37, 99, 235, 0.08)" />

              {/* Line path */}
              <path d={linePath} fill="transparent" stroke="#2563EB" strokeWidth="3" />

              {/* Data points */}
              {points.map((p, idx) => (
                <g key={idx} className="chart-point-group">
                  <circle cx={p.x} cy={p.y} r="5" fill="#ffffff" stroke="#2563EB" strokeWidth="2" />
                  <circle cx={p.x} cy={p.y} r="8" fill="#2563EB" className="point-hover-effect" />
                  <text x={p.x} y={p.y - 12} textAnchor="middle" className="chart-point-val">
                    {(p.sales / 10000000).toFixed(0)}천
                  </text>
                  <text x={p.x} y={chartH - 4} textAnchor="middle" className="chart-axis-label" fill="#64748B">
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
              const percentage = totalRevenue > 0 ? ((val / totalRevenue) * 100).toFixed(1) : '0.0';
              const barHeightPct = (val / maxGradeRevenue) * 100;
              return (
                <div className="bar-chart-column" key={grade}>
                  <span className="bar-val-label">{formatWon(Math.round(val / 10000))}만</span>
                  <div className="bar-track">
                    <div 
                      className="bar-fill-seg" 
                      style={{ 
                        height: `${barHeightPct}%`,
                        backgroundColor: gradeColors[grade] || '#2563EB'
                      }}
                    ></div>
                  </div>
                  <span className="bar-grade-badge">{grade}</span>
                  <span className="bar-pct-label">{percentage}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lower Row: TOP VIP list & Business Advice */}
      <div className="reports-tables-grid">
        {/* Top VIP Spenders */}
        <div className="table-card-wrapper glass-card">
          <div className="card-header">
            <h4 className="flex items-center gap-2">
              <Award size={18} className="text-gold" />
              <span>우수 구매 고객 TOP 3 (VIP 점주)</span>
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
                    <td><strong>{cust.name}</strong></td>
                    <td>
                      <span className="status-pill completed">{cust.grade}</span>
                    </td>
                    <td>{cust.frequency}회</td>
                    <td className="text-right font-bold text-navy">{formatWon(cust.totalAmount)}</td>
                    <td className="text-right text-blue">{formatWon(cust.points)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Business Advice/Notes */}
        <div className="table-card-wrapper glass-card notes-card">
          <div className="card-header">
            <h4 className="flex items-center gap-2">
              <Target size={18} className="text-navy" />
              <span>강주방 CRM 비즈니스 운영 제언</span>
            </h4>
          </div>
          <div className="reports-notes-content">
            <div className="advice-block">
              <h5>1. VIP 가맹점주 기여도 극대화</h5>
              <p>
                전체 매출의 약 <strong>60% 이상</strong>을 B2B VIP 등급 가맹점주가 차지하고 있습니다. 
                3D 도면 무상 매칭 및 A/S 긴급 출동 보장 혜택을 지속적으로 지원하는 것이 핵심입니다.
              </p>
            </div>
            <div className="advice-block">
              <h5>2. 비수기(7-8월) 마케팅 전략</h5>
              <p>
                여름 휴가철 창업 연기로 발생할 수 있는 비수기 매출 정체를 방지하기 위해 
                네이버 카페 <strong>'아프니까 사장이다'</strong> 연계 프로모션을 집중 배치하는 것을 추천합니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .reports-viewport {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }
        
        .reports-header {
          text-align: left;
        }
        
        .reports-title {
          font-size: 24px;
          font-weight: 800;
          color: #0F2C59;
        }
        
        .reports-subtitle {
          font-size: 14px;
          color: #475569;
          margin-top: 4px;
        }
        
        .reports-summary-cards {
          width: 100%;
        }
        
        .rep-kpi-card {
          padding: 24px;
          background: #ffffff;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          text-align: left;
          box-shadow: 0 4px 14px rgba(15, 44, 89, 0.04);
        }
        
        .rep-kpi-row {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
        }
        
        .icon-wrapper {
          width: 48px;
          height: 48px;
          background-color: #EFF6FF;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .text-navy { color: #0F2C59; }
        .text-blue { color: #2563EB; }
        .text-gold { color: #D97706; }
        
        .rep-label {
          font-size: 13px;
          color: #64748B;
          font-weight: 500;
        }
        
        .rep-kpi-row h4 {
          font-size: 22px;
          font-weight: 800;
          color: #0F172A;
          margin-top: 2px;
        }
        
        .rep-kpi-row h4 span {
          font-size: 13px;
          color: #94A3B8;
          font-weight: 400;
        }
        
        .rep-progress-bar {
          height: 10px;
          width: 100%;
          background-color: #F1F5F9;
          border-radius: 50px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .rep-progress {
          height: 100%;
          background: linear-gradient(90deg, #0F2C59 0%, #2563EB 100%);
          border-radius: 50px;
          transition: width 0.5s ease;
        }

        .rep-bottom-info {
          font-size: 12px;
          color: #2563EB;
          font-weight: 700;
        }

        .reports-charts-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 24px;
        }

        .svg-line-chart-container {
          height: 230px;
          width: 100%;
          padding-top: 10px;
        }

        .svg-bar-chart-container {
          display: flex;
          height: 230px;
          align-items: flex-end;
          justify-content: space-around;
          padding-top: 20px;
        }

        .bar-chart-column {
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 100%;
          width: 60px;
        }

        .bar-val-label {
          font-size: 11px;
          font-weight: 700;
          color: #0F172A;
          margin-bottom: 6px;
        }

        .bar-track {
          flex: 1;
          width: 24px;
          background-color: #F1F5F9;
          border-radius: 6px 6px 0 0;
          display: flex;
          align-items: flex-end;
          overflow: hidden;
        }

        .bar-fill-seg {
          width: 100%;
          border-radius: 6px 6px 0 0;
          transition: height 0.4s ease;
        }

        .bar-grade-badge {
          font-size: 11px;
          font-weight: 700;
          margin-top: 8px;
          color: #475569;
          white-space: nowrap;
        }

        .bar-pct-label {
          font-size: 11px;
          color: #2563EB;
          font-weight: 800;
        }

        .reports-tables-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 24px;
        }

        .reports-notes-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
          text-align: left;
        }

        .advice-block {
          background-color: #F8FAFC;
          padding: 16px;
          border-radius: 12px;
          border-left: 4px solid #0F2C59;
        }

        .advice-block h5 {
          font-size: 14px;
          font-weight: 700;
          color: #0F2C59;
          margin-bottom: 6px;
        }

        .advice-block p {
          font-size: 13px;
          color: #475569;
          line-height: 1.6;
        }

        .font-bold { font-weight: 700; }
        .text-right { text-align: right; }

        @media (max-width: 991px) {
          .reports-charts-grid, .reports-tables-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

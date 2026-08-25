import { describe, it, expect } from 'vitest';
import { getDashboardStats, mockSalesHistory, mockInquiries } from './mockData';

describe('mockData dashboard calculations', () => {
  it('should calculate correct dashboard statistics from customer array', () => {
    const sampleList = [
      { id: 1, name: "테스트", customerType: "업자", grade: "VIP 업자", totalAmount: 1000000, frequency: 2 },
      { id: 2, name: "테스트2", customerType: "소비자", grade: "일반 소비자", totalAmount: 500000, frequency: 1 }
    ];
    const stats = getDashboardStats(sampleList);

    expect(stats.totalCustomers).toBe(sampleList.length);
    expect(stats.accumulatedSales).toBeGreaterThan(0);
    expect(stats.totalTransactions).toBeGreaterThan(0);
    expect(stats.gradeDistribution).toHaveProperty('VIP 업자');
    expect(stats.gradeDistribution).toHaveProperty('일반 업자');
    expect(stats.gradeDistribution).toHaveProperty('VIP 소비자');
    expect(stats.gradeDistribution).toHaveProperty('일반 소비자');
  });

  it('should handle empty customer list gracefully', () => {
    const stats = getDashboardStats([]);

    expect(stats.totalCustomers).toBe(0);
    expect(stats.accumulatedSales).toBe(0);
    expect(stats.totalTransactions).toBe(0);
    expect(stats.gradeDistribution['VIP 업자']).toBe(0);
  });

  it('should have non-empty mock arrays for fallback data', () => {
    expect(mockSalesHistory.length).toBe(12);
    expect(mockInquiries.length).toBeGreaterThan(0);
  });
});

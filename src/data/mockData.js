// Mock Data for Gangjubang CRM

export const initialCustomers = [];

export const mockSalesHistory = [
  { month: "1월", sales: 48000000, count: 22 },
  { month: "2월", sales: 52000000, count: 25 },
  { month: "3월", sales: 68000000, count: 31 },
  { month: "4월", sales: 59000000, count: 28 },
  { month: "5월", sales: 74000000, count: 35 },
  { month: "6월", sales: 89000000, count: 42 },
  { month: "7월", sales: 95000000, count: 48 },
  { month: "8월", sales: 81000000, count: 38 },
  { month: "9월", sales: 112000000, count: 52 },
  { month: "10월", sales: 105000000, count: 49 },
  { month: "11월", sales: 128000000, count: 60 },
  { month: "12월", sales: 145000000, count: 68 }
];

export const mockInquiries = [
  { id: 1, name: "이조갈비", type: "3D 도면 컨설팅", status: "대기", date: "2026-07-13" },
  { id: 2, name: "맛나치킨", type: "주방기기 견적", status: "완료", date: "2026-07-13" },
  { id: 3, name: "청년마라탕", type: "A/S 신청", status: "완료", date: "2026-07-12" },
  { id: 4, name: "하루스시", type: "3D 도면 컨설팅", status: "대기", date: "2026-07-12" },
  { id: 5, name: "본가국밥", type: "주방기기 견적", status: "완료", date: "2026-07-11" }
];

export const getDashboardStats = (customers) => {
  const totalCustomers = customers.length;
  const accumulatedSales = customers.reduce((sum, c) => sum + (c.totalAmount || 0), 0);
  const totalTransactions = customers.reduce((sum, c) => sum + (c.frequency || 0), 0);
  
  // Grade distribution mapping
  const gradeDistribution = customers.reduce((acc, c) => {
    const key = c.grade || '일반 소비자';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, { 'VIP 업자': 0, '일반 업자': 0, 'VIP 소비자': 0, '일반 소비자': 0 });

  return {
    totalCustomers,
    accumulatedSales,
    totalTransactions,
    gradeDistribution
  };
};

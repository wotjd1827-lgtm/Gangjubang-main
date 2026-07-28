import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Search, Filter, Plus, Edit2, Trash2, Check, X, ShieldCheck } from 'lucide-react';

export default function AdminCustomers() {
  const { customers, setCustomers } = useOutletContext();
  
  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGender, setFilterGender] = useState('ALL');
  const [filterAge, setFilterAge] = useState('ALL');
  const [filterGrade, setFilterGrade] = useState('ALL');
  const [filterFrequency, setFilterFrequency] = useState('ALL');
  const [filterAmount, setFilterAmount] = useState('ALL');
  
  // Sorting State
  const [sortField, setSortField] = useState('regDate');
  const [sortDirection, setSortDirection] = useState('desc');

  // Edit/Add Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [currentCustomerId, setCurrentCustomerId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    grade: 'BRONZE',
    age: 30,
    gender: '남',
    frequency: 1,
    totalAmount: 1000000,
    points: 10000,
    phone: '',
    email: '',
    address: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' || name === 'frequency' || name === 'totalAmount' || name === 'points'
        ? Number(value)
        : value
    }));
  };

  // Open modal for adding
  const openAddModal = () => {
    setModalMode('add');
    setFormData({
      name: '',
      grade: 'BRONZE',
      age: 30,
      gender: '남',
      frequency: 1,
      totalAmount: 1000000,
      points: 10000,
      phone: '',
      email: '',
      address: '서울시'
    });
    setIsModalOpen(true);
  };

  // Open modal for editing
  const openEditModal = (customer) => {
    setModalMode('edit');
    setCurrentCustomerId(customer.id);
    setFormData({
      name: customer.name,
      grade: customer.grade,
      age: customer.age,
      gender: customer.gender,
      frequency: customer.frequency,
      totalAmount: customer.totalAmount,
      points: customer.points,
      phone: customer.phone,
      email: customer.email,
      address: customer.address
    });
    setIsModalOpen(true);
  };

  // Delete customer
  const handleDeleteCustomer = (id, name) => {
    if (window.confirm(`[CRM 경고] 고객 "${name}"의 정보를 데이터베이스에서 영구 삭제하시겠습니까?`)) {
      setCustomers(prev => prev.filter(c => c.id !== id));
    }
  };

  // Handle Form Submit
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('고객명과 전화번호는 필수입니다.');
      return;
    }

    if (modalMode === 'add') {
      const newCustomer = {
        ...formData,
        id: Date.now(),
        regDate: new Date().toISOString().split('T')[0]
      };
      setCustomers(prev => [newCustomer, ...prev]);
    } else {
      setCustomers(prev => prev.map(c => c.id === currentCustomerId ? { ...c, ...formData } : c));
    }
    
    setIsModalOpen(false);
  };

  // Filter & Search Logic
  const filteredCustomers = customers.filter(c => {
    // 1. Search Query (Name, Phone, Address, Email)
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase());
      
    // 2. Gender Filter
    const matchesGender = filterGender === 'ALL' || c.gender === filterGender;
    
    // 3. Age Filter
    let matchesAge = true;
    if (filterAge !== 'ALL') {
      if (filterAge === '20') matchesAge = c.age >= 20 && c.age < 30;
      else if (filterAge === '30') matchesAge = c.age >= 30 && c.age < 40;
      else if (filterAge === '40') matchesAge = c.age >= 40 && c.age < 50;
      else if (filterAge === '50') matchesAge = c.age >= 50;
    }

    // 4. Grade Filter
    const matchesGrade = filterGrade === 'ALL' || c.grade === filterGrade;

    // 5. Frequency Filter
    let matchesFreq = true;
    if (filterFrequency !== 'ALL') {
      if (filterFrequency === 'LOW') matchesFreq = c.frequency <= 3;
      else if (filterFrequency === 'MID') matchesFreq = c.frequency >= 4 && c.frequency <= 9;
      else if (filterFrequency === 'HIGH') matchesFreq = c.frequency >= 10;
    }

    // 6. Purchase Amount Filter
    let matchesAmount = true;
    if (filterAmount !== 'ALL') {
      if (filterAmount === 'LOW') matchesAmount = c.totalAmount < 5000000;
      else if (filterAmount === 'MID') matchesAmount = c.totalAmount >= 5000000 && c.totalAmount < 15000000;
      else if (filterAmount === 'HIGH') matchesAmount = c.totalAmount >= 15000000;
    }

    return matchesSearch && matchesGender && matchesAge && matchesGrade && matchesFreq && matchesAmount;
  });

  // Sorting Logic
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
    
    if (typeof aVal === 'string') {
      return sortDirection === 'asc' 
        ? aVal.localeCompare(bVal) 
        : bVal.localeCompare(aVal);
    } else {
      return sortDirection === 'asc' 
        ? aVal - bVal 
        : bVal - aVal;
    }
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const formatWon = (value) => {
    return new Intl.NumberFormat('ko-KR').format(value) + '원';
  };

  return (
    <div className="crm-viewport animate-fade-in">
      <div className="crm-header">
        <div>
          <h3 className="crm-title">고객 관리 (CRM)</h3>
          <p className="crm-subtitle">고객 정보 조회, 다차원 필터링 및 등급 관리를 진행할 수 있습니다.</p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary">
          <Plus size={16} />
          <span>신규 고객 등록</span>
        </button>
      </div>

      {/* Filter Control Box */}
      <div className="filter-panel-card glass-card">
        <div className="filter-panel-title">
          <Filter size={16} className="text-orange" />
          <span>다차원 고객 검색 필터</span>
        </div>
        
        <div className="filter-options-grid">
          {/* Gender */}
          <div className="filter-select-group">
            <span className="filter-select-label">성별</span>
            <div className="filter-pills">
              {['ALL', '남', '여'].map(g => (
                <button 
                  key={g} 
                  className={`filter-pill ${filterGender === g ? 'active' : ''}`}
                  onClick={() => setFilterGender(g)}
                >
                  {g === 'ALL' ? '전체' : g}
                </button>
              ))}
            </div>
          </div>

          {/* Age Group */}
          <div className="filter-select-group">
            <span className="filter-select-label">연령대</span>
            <select className="form-control filter-select" value={filterAge} onChange={(e) => setFilterAge(e.target.value)}>
              <option value="ALL">전체 연령</option>
              <option value="20">20대 (20~29세)</option>
              <option value="30">30대 (30~39세)</option>
              <option value="40">40대 (40~49세)</option>
              <option value="50">50대 이상 (50세~)</option>
            </select>
          </div>

          {/* Customer Grade */}
          <div className="filter-select-group">
            <span className="filter-select-label">고객 등급</span>
            <select className="form-control filter-select" value={filterGrade} onChange={(e) => setFilterGrade(e.target.value)}>
              <option value="ALL">전체 등급</option>
              <option value="VIP">VIP</option>
              <option value="GOLD">GOLD</option>
              <option value="SILVER">SILVER</option>
              <option value="BRONZE">BRONZE</option>
            </select>
          </div>

          {/* Purchase Frequency */}
          <div className="filter-select-group">
            <span className="filter-select-label">구매 빈도</span>
            <select className="form-control filter-select" value={filterFrequency} onChange={(e) => setFilterFrequency(e.target.value)}>
              <option value="ALL">전체 빈도</option>
              <option value="LOW">1회 - 3회 (초기 고객)</option>
              <option value="MID">4회 - 9회 (성장 고객)</option>
              <option value="HIGH">10회 이상 (우수 고객)</option>
            </select>
          </div>

          {/* Purchase Amount */}
          <div className="filter-select-group">
            <span className="filter-select-label">구매 금액</span>
            <select className="form-control filter-select" value={filterAmount} onChange={(e) => setFilterAmount(e.target.value)}>
              <option value="ALL">전체 금액</option>
              <option value="LOW">500만원 미만</option>
              <option value="MID">500만원 ~ 1500만원 미만</option>
              <option value="HIGH">1500만원 이상</option>
            </select>
          </div>
        </div>

        {/* Text Search Box */}
        <div className="search-bar-row">
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              className="form-control search-input" 
              placeholder="고객명, 연락처, 이메일, 주소를 통합 검색합니다..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {searchQuery && (
            <button className="btn btn-secondary btn-clear-search" onClick={() => setSearchQuery('')}>
              검색 초기화
            </button>
          )}
        </div>
      </div>

      {/* Main CRM Table Card */}
      <div className="table-card-wrapper glass-card crm-table-card">
        <div className="card-header crm-table-header">
          <span className="count-info">검색 결과: <strong>{sortedCustomers.length}</strong> / 전체: <strong>{customers.length}명</strong></span>
          <div className="table-actions">
            <span className="sort-hint">열 헤더를 클릭하면 정렬할 수 있습니다.</span>
          </div>
        </div>

        <div className="table-responsive">
          <table className="admin-crm-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('name')} className="sortable">고객명</th>
                <th onClick={() => handleSort('grade')} className="sortable">등급</th>
                <th onClick={() => handleSort('age')} className="sortable">나이</th>
                <th>성별</th>
                <th onClick={() => handleSort('frequency')} className="sortable">구매 빈도</th>
                <th onClick={() => handleSort('totalAmount')} className="sortable text-right">총 구매금액</th>
                <th onClick={() => handleSort('points')} className="sortable text-right">지급 포인트</th>
                <th>연락처</th>
                <th onClick={() => handleSort('regDate')} className="sortable">등록일</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {sortedCustomers.length === 0 ? (
                <tr>
                  <td colSpan="10" className="no-data text-center">
                    필터링 조건과 일치하는 고객이 존재하지 않습니다.
                  </td>
                </tr>
              ) : (
                sortedCustomers.map(cust => (
                  <tr key={cust.id}>
                    <td>
                      <div className="cust-cell-name">
                        <strong>{cust.name}</strong>
                        <span className="cust-address">{cust.address}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${cust.grade.toLowerCase()}`}>{cust.grade}</span>
                    </td>
                    <td>{cust.age}세</td>
                    <td>{cust.gender}</td>
                    <td>{cust.frequency}회</td>
                    <td className="text-right font-bold">{formatWon(cust.totalAmount)}</td>
                    <td className="text-right color-primary font-bold">{formatWon(cust.points)}</td>
                    <td>
                      <div className="cust-cell-contact">
                        <span>{cust.phone}</span>
                        <span className="cust-email">{cust.email}</span>
                      </div>
                    </td>
                    <td>{cust.regDate}</td>
                    <td>
                      <div className="action-row-btns">
                        <button onClick={() => openEditModal(cust)} className="btn-table-action edit" title="정보 수정">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDeleteCustomer(cust.id, cust.name)} className="btn-table-action delete" title="고객 삭제">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Customer Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content glass-card animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
              <X size={20} />
            </button>

            <h3 className="modal-title">
              {modalMode === 'add' ? '신규 고객 등록' : '고객 정보 수정'}
            </h3>
            <p className="modal-subtitle">
              고객 등급 및 거래 실적, 인적 사항을 관리합니다.
            </p>

            <form onSubmit={handleFormSubmit} className="modal-form">
              <div className="modal-grid-fields">
                <div className="form-group">
                  <label className="form-label">고객명</label>
                  <input 
                    type="text" 
                    name="name" 
                    className="form-control" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">고객 등급</label>
                  <select name="grade" className="form-control form-select" value={formData.grade} onChange={handleInputChange}>
                    <option value="VIP">VIP</option>
                    <option value="GOLD">GOLD</option>
                    <option value="SILVER">SILVER</option>
                    <option value="BRONZE">BRONZE</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">나이</label>
                  <input 
                    type="number" 
                    name="age" 
                    className="form-control" 
                    value={formData.age} 
                    onChange={handleInputChange} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">성별</label>
                  <select name="gender" className="form-control form-select" value={formData.gender} onChange={handleInputChange}>
                    <option value="남">남성</option>
                    <option value="여">여성</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">구매 빈도 (회)</label>
                  <input 
                    type="number" 
                    name="frequency" 
                    className="form-control" 
                    value={formData.frequency} 
                    onChange={handleInputChange} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">총 구매금액 (원)</label>
                  <input 
                    type="number" 
                    name="totalAmount" 
                    className="form-control" 
                    value={formData.totalAmount} 
                    onChange={handleInputChange} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">적립 포인트 (원)</label>
                  <input 
                    type="number" 
                    name="points" 
                    className="form-control" 
                    value={formData.points} 
                    onChange={handleInputChange} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">전화번호</label>
                  <input 
                    type="text" 
                    name="phone" 
                    className="form-control" 
                    placeholder="010-1234-5678" 
                    value={formData.phone} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                <div className="form-group col-span-2">
                  <label className="form-label">이메일</label>
                  <input 
                    type="email" 
                    name="email" 
                    className="form-control" 
                    placeholder="example@gmail.com" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                  />
                </div>
                <div className="form-group col-span-2">
                  <label className="form-label">주소 / 영업점 주소</label>
                  <input 
                    type="text" 
                    name="address" 
                    className="form-control" 
                    placeholder="예: 경기도 김포시 걸포동" 
                    value={formData.address} 
                    onChange={handleInputChange} 
                  />
                </div>
              </div>

              <div className="modal-actions-row">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  취소
                </button>
                <button type="submit" className="btn btn-primary">
                  <ShieldCheck size={16} />
                  <span>{modalMode === 'add' ? '고객 등록' : '정보 저장'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .crm-viewport {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        
        .crm-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          text-align: left;
        }
        
        .crm-title {
          font-size: 22px;
          font-weight: 700;
        }
        
        .crm-subtitle {
          font-size: 14px;
          color: var(--color-gray-dark);
        }
        
        /* Filter panel */
        .filter-panel-card {
          padding: 24px;
          border: 1px solid var(--color-gray-light);
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .filter-panel-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 15px;
          font-weight: 700;
          border-bottom: 1px solid var(--color-gray-light);
          padding-bottom: 10px;
        }
        
        .filter-options-grid {
          display: grid;
          grid-template-columns: 1.2fr repeat(4, 1fr);
          gap: 16px;
        }
        
        .filter-select-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          text-align: left;
        }
        
        .filter-select-label {
          font-size: 12px;
          font-weight: 700;
          color: var(--color-gray-dark);
        }
        
        .filter-pills {
          display: flex;
          gap: 6px;
          height: 100%;
        }
        
        .filter-pill {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--color-gray-light);
          border-radius: var(--radius-md);
          font-size: 13px;
          background-color: white;
          color: var(--color-gray-dark);
          transition: all var(--transition-fast);
          padding: 8px 0;
        }
        
        .filter-pill:hover {
          background-color: var(--color-gray-ultra);
          border-color: var(--color-primary);
        }
        
        .filter-pill.active {
          background-color: var(--color-primary);
          color: white;
          border-color: var(--color-primary);
          font-weight: 700;
        }
        
        .filter-select {
          padding: 8px 12px;
          font-size: 13px;
        }
        
        .search-bar-row {
          display: flex;
          gap: 12px;
        }
        
        .search-input-wrapper {
          position: relative;
          flex-grow: 1;
        }
        
        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-gray-medium);
        }
        
        .search-input {
          padding-left: 44px;
        }
        
        .btn-clear-search {
          padding: 0 20px;
          font-size: 13px;
        }
        
        /* Table Styles */
        .crm-table-card {
          margin-bottom: 40px;
        }
        
        .crm-table-header {
          margin-bottom: 16px;
        }
        
        .count-info {
          font-size: 13px;
          color: var(--color-gray-dark);
        }
        
        .count-info strong {
          color: var(--color-charcoal);
        }
        
        .sort-hint {
          font-size: 12px;
          color: var(--color-gray-medium);
        }
        
        .admin-crm-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        
        .admin-crm-table th {
          font-size: 13px;
          font-weight: 700;
          color: var(--color-gray-dark);
          border-bottom: 2px solid var(--color-gray-light);
          padding: 12px;
          background-color: var(--color-gray-ultra);
          white-space: nowrap;
        }
        
        .admin-crm-table th.sortable {
          cursor: pointer;
          user-select: none;
        }
        
        .admin-crm-table th.sortable:hover {
          color: var(--color-primary);
          background-color: var(--color-primary-light);
        }
        
        .admin-crm-table td {
          font-size: 13px;
          padding: 14px 12px;
          border-bottom: 1px solid var(--color-gray-ultra);
          color: var(--color-charcoal);
          vertical-align: middle;
        }
        
        .admin-crm-table tr:hover td {
          background-color: var(--color-gray-ultra);
        }
        
        .cust-cell-name {
          display: flex;
          flex-direction: column;
        }
        
        .cust-address {
          font-size: 11px;
          color: var(--color-gray-dark);
          margin-top: 2px;
        }
        
        .cust-cell-contact {
          display: flex;
          flex-direction: column;
        }
        
        .cust-email {
          font-size: 11px;
          color: var(--color-gray-medium);
          margin-top: 2px;
        }
        
        .action-row-btns {
          display: flex;
          gap: 6px;
        }
        
        .btn-table-action {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--color-gray-light);
          background-color: white;
          color: var(--color-gray-dark);
        }
        
        .btn-table-action.edit:hover {
          background-color: var(--color-primary-light);
          color: var(--color-primary);
          border-color: var(--color-primary);
        }
        
        .btn-table-action.delete:hover {
          background-color: #FDF2F0;
          color: var(--color-danger);
          border-color: var(--color-danger);
        }
        
        .no-data {
          padding: 60px 0 !important;
          color: var(--color-gray-medium);
          font-size: 14px;
        }
        
        /* Modal additions */
        .modal-grid-fields {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 24px;
        }
        
        .col-span-2 {
          grid-column: span 2;
        }
        
        .modal-actions-row {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 30px;
          border-top: 1px solid var(--color-gray-light);
          padding-top: 20px;
        }
        
        @media (max-width: 991px) {
          .filter-options-grid {
            grid-template-columns: 1fr;
          }
          
          .modal-grid-fields {
            grid-template-columns: 1fr;
          }
          
          .col-span-2 {
            grid-column: span 1;
          }
        }
      `}</style>
    </div>
  );
}

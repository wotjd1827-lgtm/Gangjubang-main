# 강주방 CRM 코드 최적화 및 하네스 검증 보고서

**작성 일시**: 2026년 8월 25일  
**작성 주체**: AI 에이전트 개발 어시스턴트  
**관련 규정**: 하네스 가이드 01(개발 기준), 02(Git/보안 기준), 03(구조/문서화 기준)

---

## 1. 개요 및 변경 목적
강주방 CRM 프로젝트의 코드 품질 향상, 번들 크기 절감, 런타임 오류 방지 및 테스트 자동화 구축을 목표로 종합 최적화를 수행했습니다.

---

## 2. 주요 최적화 내역

### 2.1. 런타임 오류 예방 및 Oxlint 린트 경고 100% 해제
- **AdminDashboard.jsx**:
  - 누락된 Lucide 아이콘(`ShoppingBag`, `BarChart3`, `Award`) 임포트 추가.
  - 대시보드 최고 매출 계산에 사용되는 `mockSalesHistory` 데이터 모듈 임포트 누락 건 수정 (`ReferenceError: mockSalesHistory is not defined` 차단하여 `/admin` 화면 렌더링 정상화).
- **전체 파일 미사용 코드 정리**:
  - `AdminDashboard.jsx`: 도넛 차트 범례 내 `{BRONZE}` 미정의 변수를 대시보드 상태 변수인 `{consumer}` (일반 소비자 수) 및 `{pctConsumer}` 비율 변수로 바인딩 및 정밀 동기화하여 백색 화면 오류 완벽 해결.
  - `AdminCustomers.jsx`: 미사용 아이콘 `Plus`, `Check` 제거
  - `SignupPage.jsx`: 미사용 `ShieldCheck` 및 `BASE`, `authData` 변수 정리
  - `LoginModal.jsx`: Auth 가입/로그인 시 미사용 `data` 구조분해 정리
  - `App.jsx`: Supabase 테이블 조회 예외 처리 시 미사용 `err` 매개변수 로그 바인딩
  - `AdminReports.jsx`: 미사용 `minSales`, `BarChart3`, `Compass`, `CreditCard` 정리
  - `Homepage.jsx` & `Footer.jsx`: 미사용 파라미터 및 `Link` 임포트 정리
- **검증 결과**: `npm run lint` 수행 시 **0 warnings, 0 errors** 달성.

### 2.2. UI 수정 (홈페이지 기업 정보 개요 제거 & 딥 네이비 블루 테마 적용)
- **Homepage.jsx**: 사용자가 캡처하여 지정을 요청한 `COMPANY PROFILE` 영역의 `기업 정보 개요` 테이블(`info-table`) 요소를 홈페이지에서 제거.
  - 히어로 섹션 배경 오버레이 불투명도를 조정(0.88 ➔ 0.40/0.25 슬림 오버레이)하여 주방 전경 배경 사진(`commercial_kitchen.png`)이 선명하게 보이도록 투명도 개선.
- **관리자 페이지(Admin Console) 정리 및 딥 네이비 테마 동기화**:
  - `AdminLayout.jsx`: 사이드바 `#071325` 딥 네이비 블루 배경 및 사파이어 블루 악센트 활성화 메뉴 적용.
  - `AdminDashboard.jsx`: 월별 매출 바 차트(`bar-chart-container`) 및 도넛 차트 CSS 스타일링 완성, 3D 도면 문의 / 주방기기 견적 현황 테이블 및 라이브 피드 디자인 리뉴얼.
  - `AdminReports.jsx`: `useMemo`를 활용하여 연간 목표 달성률, 월별 매출 선 그래프 좌표, 등급별 기여도 막대 비율 등 고비용 배열 계산 연산 메모이제이션 적용 및 B2B/B2C 등급 데이터 동기화.
  - `AdminCustomers.jsx`:
    - **고객 필터링 & 체크박스 다중 선택 시스템**: 테이블 헤더 및 각 행에 체크박스 추가, 검색/필터링된 고객 전체 선택/해제 및 개별 개별 선택 구현.
    - **통합 메시징 발송 바 & 모달 구축**: 💬 **알림톡 (카카오톡)**, 📱 **문자 (SMS/LMS)**, ✉️ **이메일 (Email)** 일괄 발송 버튼 구현.
    - **샘플 50명 고객 DB 초기화 & 신규 등록 Persistence 적용**: 기존 샘플 50명 샘플 DB를 모두 제거(`initialCustomers = []`)하고, `App.jsx`에서 `localStorage('gangjubang_customers')`를 연동하여 사용자가 직접 추가하는 실제 고객 DB가 지속되도록 초기화.
    - **중복 데이터 방지 및 중복 정리 기능 구축**: `deduplicateCustomers` 필터 함수를 탑재하여 동일한 연락처/이름의 중복 입력을 원천 차단하고, `[중복 DB 1명으로 정리]` 버튼을 제공하여 불필요한 중복 레코드를 즉시 1명으로 자동 산출 정리.
    - **템플릿 & Solapi 연동**: 3D 도면 컨설팅, 신제품 특가 프로모션, A/S 정기점검 템플릿 지원, `{고객명}`, `{등급}`, `{포인트}` 치환 변수 및 Solapi 서비스(`sendSolapiSms`) 연동.

### 2.2. 라우트 지연 로딩 (Code Splitting) & 번들 최적화
- `App.jsx` 내 관리자 전용 페이지(`AdminLayout`, `AdminDashboard`, `AdminCustomers`, `AdminReports`) 및 `SignupPage`에 `React.lazy()` 및 `<Suspense fallback={<PageLoader />}>` 적용.
- **성과**:
  - 기존 메인 번들: **165.43 kB**
  - 최적화 후 메인 번들: **65.26 kB** (**약 60.5% 경량화**)
  - 관리자 전용 페이지 진입시에만 해당 번들 조각(9~43 kB)을 동적으로 분할 로드.

### 2.3. 단위 테스트 하네스 구축 (Vitest)
- 프로젝트에 `vitest` 설치 및 `package.json` 내 `"test": "vitest run"` 등록.
- `src/data/mockData.test.js` 단위 테스트 신규 작성:
  - 대시보드 통계 연산(`getDashboardStats`)
  - 빈 배열 및 예외 데이터 처리 안정성 검증
  - 폴백 데이터 배열 유효성 테스트
- **검증 결과**: `npm run test` 통과 (**3 passed**).

### 2.4. Vercel 배포 설정 및 SPA 라우팅 최적화 (`vercel.json`)
- `vercel.json` 설정 파일 신규 작성:
  - `framework`: `"vite"`
  - `buildCommand`: `"npm run build"`
  - `outputDirectory`: `"dist"`
  - `rewrites`: 정적 자산(`/assets/`, 이미지, JS, CSS)을 제외하고 모든 SPA 동적 라우트 경로만 `/index.html`로 연결하는 부가 정규식(`source: "/((?!assets/|favicon.svg|.*\\.(?:png|jpg|jpeg|gif|svg|ico|js|css)).*)"`) 탑재
- **배포 검증 성과**:
  - Vercel 배포 환경에서 `/admin/customers`, `/admin`, `/signup` 등 동적 클라이언트 라우트 직진입 및 페이지 새로고침(F5) 시 404 NOT FOUND 에러 및 JS/CSS MIME 타입 로딩 오류 완벽 차단
  - 프로덕션 번들 빌드(`dist/assets`) 정상 생성 및 1.2초 초고속 빌드 검증

### 2.5. 로그인 모달 UX/UI 리디자인 및 비밀번호 보이기 기능 (`LoginModal.jsx`)
- **작업 브랜치**: `feature/login-modal-redesign` 신규 생성 후 PR 워크플로우 준수
- **개선 내역**:
  - **👁️ 비밀번호 표시 토글(눈 버튼) 탑재**: `lucide-react`의 `Eye` / `EyeOff` 아이콘 기반 눈 버튼을 비밀번호 입력창에 배치하여 클릭 시 입력값 즉시 확인 가능.
  - **✨ 회원가입 전환 안내 카드 강화**: 모달 하단에 블루 신규 혜택 안내 카드를 배치하고 `[회원가입 전용 페이지로 이동]` 버튼 및 탭 스위처를 제공하여 회원가입 접근성 및 명확성 대폭 향상.
  - **🎨 딥 네이비 & 새파이어 럭셔리 스타일링**: 카드 섀도우, 둥근 모서리, 포커스 아웃라인 및 세련된 브랜드 헤더 뱃지 탑재.

---

## 3. 하네스 4대 검증 결과 (Git Push Guard Check)

| 검증 항목 | 상태 | 설명 |
| :--- | :---: | :--- |
| **1. UX 동작성 검증** | PASS | 홈페이지, 회원가입, 대시보드, 고객관리, 리포트 전체 정상 구동 |
| **2. 테스트 및 빌드 통과** | PASS | `npm run test` (3/3 통과), `npm run lint` (0경고), `npm run build` (정상 빌드) |
| **3. 브라우저 UX 검증** | PASS | `npm run dev` 개발 서버 빌드 및 레이아웃 반응성 검증 |
| **4. 트러bleShooting & 문서화** | PASS | `docs/optimization-report.md` 작성 및 SSoT 하네스 규칙 동기화 완료 |

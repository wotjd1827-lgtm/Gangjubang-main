# 네이버 서치어드바이저(Naver Search Advisor) 등록 및 설정 가이드

강주방 사이트(`https://gangjubang.com`)를 네이버 검색 결과에 정상 노출시키기 위한 네이버 서치어드바이저(웹마스터 도구) 연동 가이드입니다.

---

## 1. 프로젝트에 반영된 네이버 SEO 기본 설정 내용

1. **소유확인 메타태그 배치 (`index.html`)**:
   - 네이버 서치어드바이저 발급 코드 삽입용 메타태그 추가 (`<meta name="naver-site-verification" content="..." />`)
2. **Open Graph (OG) 및 Twitter 카카오톡/네이버 블로그 링크 공유 태그 최적화**:
   - `og:type`, `og:site_name`, `og:title`, `og:description`, `og:image`, `og:url`, `og:locale`
3. **검색엔진 로봇 수집 규칙 (`public/robots.txt`)**:
   - 네이버 수집 로봇(`Yeti`) 및 전체 로봇 접근 허용 (`Allow: /`)
   - 관리자 페이지 수집 차단 (`Disallow: /admin/`)
   - 사이트맵 위치 지정 (`Sitemap: https://gangjubang.com/sitemap.xml`)
4. **사이트맵 파일 제공 (`public/sitemap.xml`)**:
   - 루트 및 회원가입 페이지 URL 포함
5. **구조화 데이터 JSON-LD (`index.html`)**:
   - Schema.org `Organization` 표준 스키마 적용 (네이버 리치 스니펫 지원)

---

## 2. 네이버 서치어드바이저 등록 절차 (사이트 소유자 수행)

### Step 1: 네이버 서치어드바이저 접속 및 로그인
1. [네이버 서치어드바이저](https://searchadvisor.naver.com/)에 접속하여 네이버 계정으로 로그인합니다.
2. 우측 상단의 **[웹마스터 도구]** 버튼을 클릭합니다.

### Step 2: 사이트 등록
1. 사이트 등록 창에 `https://gangjubang.com` 입력 후 추가를 클릭합니다.

### Step 3: 사이트 소유 확인 (HTML 태그 방식)
1. 소유 확인 방식 중 **[HTML 태그]** 방식을 선택합니다.
2. 화면에 표시되는 메타태그를 복사합니다:
   ```html
   <meta name="naver-site-verification" content="발급받은_32자리_알파벳_숫자_코드" />
   ```
3. 프로젝트의 `index.html` 파일 17행 부근에 발급받은 코드(`55002ab2a6c3e2f5ba5e76d8e7ea324cc658a029`)가 적용 완료되었습니다.
   ```html
   <!-- 적용 완료 태그 -->
   <meta name="naver-site-verification" content="55002ab2a6c3e2f5ba5e76d8e7ea324cc658a029" />
   ```
4. 소스 코드가 호스팅 서버(Vercel 등)에 배포된 후, 네이버 서치어드바이저 화면 하단의 **[소유 확인]** 버튼을 클릭합니다.

### Step 4: 사이트맵(Sitemap) 및 RSS 제출
1. 네이버 서치어드바이저 > 사이트 관리 > **[요청]** > **[사이트맵 제출]** 메뉴로 이동합니다.
2. 입력창에 `sitemap.xml`을 입력하고 [확인]을 클릭합니다.
3. (선택사항) RSS 제출 메뉴에서 블로그/소식 RSS가 제공되는 경우 RSS URL을 추가 제출합니다.

### Step 5: 웹페이지 수집 요청 (색인 생성 촉진)
1. **[요청]** > **[웹페이지 수집]** 메뉴로 이동합니다.
2. 수집 요청 URL에 `/` (메인 페이지) 입력 후 [확인]을 클릭합니다.
3. 수집 상태가 '수집성공'으로 변경되는지 확인합니다.

---

## 3. 검증 및 점검 항목

네이버 서치어드바이저 **[진단]** > **[검색수집]** 및 **[콘텐츠 구조]** 메뉴에서 아래 항목이 모두 정상(초록색 체크) 표시되는지 확인합니다:

- [x] `robots.txt` 설정 여부 (정상 수집 가능)
- [x] 소유확인 메타태그 설정 여부
- [x] 사이트 제목(Title) 및 설명문(Description) 수집 여부
- [x] Open Graph 태그 수집 여부
- [x] 사이트맵 제출 여부

---

## 4. 주기적 관리 안내
- 수집 로봇(`Yeti`)이 사이트 내용을 주기적으로 크롤링하며 네이버 검색 결과에 자동 반영합니다.
- 새로운 주요 페이지나 카테고리가 추가될 경우 `public/sitemap.xml` 파일에 URL을 업데이트하면 네이버 수집 속도가 향상됩니다.

# 구글 서치 콘솔(Google Search Console) 등록 및 SEO 설정 가이드

강주방 사이트(`https://gangjubang-main.vercel.app`)를 구글 검색 결과에 정상 노출시키기 위한 구글 서치 콘솔(Google Search Console) 연동 가이드입니다.

---

## 1. 등록 절차 요약

### Step 1: 구글 서치 콘솔 접속 및 로그인
1. [구글 서치 콘솔](https://search.google.com/search-console)에 접속하여 구글 계정으로 로그인합니다.
2. **[속성 추가]** 버튼을 클릭합니다.

### Step 2: 속성 유형 선택 (URL 접두사)
1. 우측의 **[URL 접두사]** 입력란 선택
2. URL 입력: `https://gangjubang-main.vercel.app` ➔ **[계속]** 클릭

### Step 3: 소유권 확인 (HTML 태그 방식)
1. 확인 방법 중 **[HTML 태그]** 섹션을 클릭하여 펼칩니다.
2. 표시되는 메타태그를 적용 완료했습니다:
   ```html
   <meta name="google-site-verification" content="TlwRqZgoKU4QjwVSbQwv3JHyFKVuv3Onc68HDdH-rTI" />
   ```
3. 메타태그를 AI 채팅창에 전달하면 `index.html`에 적용 후 실서버 배포를 완료합니다.
4. 구글 서치 콘솔 화면으로 돌아가 **[확인]** 버튼을 클릭합니다.

### Step 4: 사이트맵(Sitemap) 제출
1. 구글 서치 콘솔 ➔ **[Sitemaps]** (사이트맵) 메뉴로 이동합니다.
2. **새 사이트맵 추가** 입력창에 `sitemap.xml` 을 입력하고 **[제출]**을 클릭합니다.
3. 제출 상태가 **'성공'** 으로 표시되는지 확인합니다.

---

## 2. 점검 항목
- [ ] 구글 소유권 메타태그 적용 여부
- [ ] Sitemaps (`sitemap.xml`) 제출 성공 여부
- [ ] 구글 수집 로봇(`Googlebot`)의 `robots.txt` 허용 여부 (`Allow: /`)

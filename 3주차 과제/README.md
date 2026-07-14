# TMDB 영화 검색 & 찜 목록

TMDB(The Movie Database) API를 이용한 영화 검색 및 찜(위시리스트) 웹 서비스입니다.

## 실행 방법

1. 의존성 설치
   ```bash
   npm install
   ```
2. `.env.example`을 복사해 `.env` 생성 후 본인의 TMDB API 키 입력
   ```bash
   cp .env.example .env
   ```
   ```
   VITE_TMDB_API_KEY=발급받은_키
   ```
3. 개발 서버 실행
   ```bash
   npm run dev
   ```
4. 브라우저에서 `http://localhost:5173` 접속

## 폴더 구조

```
3주차 과제/
├─ index.html
├─ vite.config.js
├─ .env.example        # 실제 키는 .env에 넣고 git에는 올리지 않음
└─ src/
   ├─ main.jsx          # 앱 진입점
   ├─ App.jsx           # 라우팅 정의
   ├─ styles.css
   ├─ api/
   │  └─ tmdb.js         # TMDB API 호출 모듈
   ├─ context/
   │  └─ WishlistContext.jsx  # 찜 목록 전역 상태 (localStorage 연동)
   ├─ components/
   │  ├─ Header.jsx
   │  ├─ SearchBar.jsx
   │  ├─ MovieCard.jsx
   │  └─ MovieGrid.jsx
   └─ pages/
      ├─ Home.jsx        # 검색 / 인기영화 화면
      └─ Wishlist.jsx    # 찜 목록 화면
```

## 기능

- 인기 영화 기본 노출, 키워드로 영화 검색
- 카드의 하트 버튼으로 찜 목록 추가/제거
- 찜 목록은 `localStorage`에 저장되어 새로고침해도 유지
- TMDB API 키는 `.env` 파일로 분리 관리 (레포지토리에 커밋되지 않음)

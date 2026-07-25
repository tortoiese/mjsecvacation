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
├─ index.html            # Vite 진입 HTML (#root에 앱 마운트)
├─ vite.config.js        # Vite + React 플러그인 설정
├─ .env.example          # 실제 키는 .env에 넣고 git에는 올리지 않음
└─ src/
   ├─ main.jsx            # 앱 진입점 (Router + WishlistProvider로 App 감싸기)
   ├─ App.jsx             # 라우팅 정의 (/ , /wishlist)
   ├─ styles.css          # 전역 스타일
   ├─ api.js              # TMDB API 호출 모듈 (검색/인기영화/포스터 URL)
   ├─ WishlistContext.jsx # 찜 목록 전역 상태 (localStorage 연동)
   ├─ components/
   │  ├─ Header.jsx        # 상단 네비게이션, 찜 개수 표시
   │  ├─ SearchBar.jsx     # 검색어 입력 폼
   │  └─ MovieGrid.jsx     # 영화 카드 그리드 (MovieCard 포함)
   └─ pages/
      ├─ Home.jsx          # 검색 / 인기영화 화면
      └─ Wishlist.jsx      # 찜 목록 화면
```

`dist/`(빌드 산출물)는 저장소에 포함하지 않으며 `npm run build`로 언제든 다시 생성합니다.

## 기능

- 인기 영화 기본 노출, 키워드로 영화 검색
- 카드의 하트 버튼으로 찜 목록 추가/제거
- 찜 목록은 `localStorage`에 저장되어 새로고침해도 유지
- TMDB API 키는 `.env` 파일로 분리 관리 (레포지토리에 커밋되지 않음)

## 데이터 흐름

1. `main.jsx`가 `WishlistProvider`(전역 상태)와 `BrowserRouter`(라우팅)로 `App`을 감싸며 앱을 부팅합니다.
2. `Home` 페이지가 `api.js`를 통해 TMDB에서 인기/검색 영화를 가져와 `MovieGrid`에 전달합니다.
3. `MovieGrid` 내부의 카드에서 하트를 누르면 `WishlistContext`의 상태가 바뀌고 `localStorage`에 저장됩니다.
4. `Wishlist` 페이지와 `Header`의 찜 개수는 같은 Context를 구독하므로 API 재호출 없이 즉시 갱신됩니다.

# mjsecvacation

## 3주차 과제 (TMDB 영화 검색 & 찜 목록) 실행 방법

이 저장소를 클론(또는 pull)한 뒤 아래 순서로 실행하세요.

1. `3주차 과제/.env.example`을 복사해 `3주차 과제/.env` 파일 생성 후, 본인이 발급받은 TMDB API 키를 입력합니다.
   ```bash
   cp "3주차 과제/.env.example" "3주차 과제/.env"
   ```
   ```
   VITE_TMDB_API_KEY=발급받은_키
   ```
   TMDB API 키는 https://www.themoviedb.org/settings/api 에서 무료로 발급받을 수 있습니다.
   (`.env`는 보안을 위해 저장소에 커밋되지 않으므로, 각자 본인 키로 직접 생성해야 합니다.)

2. 저장소 루트에서 바로 개발 서버를 실행합니다. (내부적으로 `3주차 과제` 폴더의 의존성 설치 및 `npm run dev`를 대신 실행합니다.)
   ```bash
   npm run dev
   ```
3. 브라우저에서 `http://localhost:5173` 접속.

세부 구조와 파일 설명은 [`3주차 과제/README.md`](./3주차%20과제/README.md)를 참고하세요.
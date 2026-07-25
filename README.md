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

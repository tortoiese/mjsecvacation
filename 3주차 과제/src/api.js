const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'

if (!API_KEY) {
  console.warn(
    '[tmdb] VITE_TMDB_API_KEY가 설정되지 않았습니다. 프로젝트 루트에 .env 파일을 만들고 키를 넣어주세요. (.env.example 참고)',
  )
}

async function request(path, params = {}) {
  const url = new URL(`${BASE_URL}${path}`)
  url.searchParams.set('api_key', API_KEY)
  url.searchParams.set('language', 'ko-KR')
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') url.searchParams.set(key, value)
  })

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`TMDB 요청 실패: ${response.status}`)
  }
  return response.json()
}

export function searchMovies(query, page = 1) {
  return request('/search/movie', { query, page })
}

export function getPopularMovies(page = 1) {
  return request('/movie/popular', { page })
}

export function getPosterUrl(posterPath) {
  return posterPath ? `${IMAGE_BASE_URL}${posterPath}` : null
}

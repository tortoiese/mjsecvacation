import { useEffect, useState } from 'react'
import SearchBar from '../components/SearchBar.jsx'
import MovieGrid from '../components/MovieGrid.jsx'
import { searchMovies, getPopularMovies } from '../api/tmdb.js'

export default function Home() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [hasSearched, setHasSearched] = useState(false)

  useEffect(() => {
    loadPopular()
  }, [])

  async function loadPopular() {
    setLoading(true)
    setError(null)
    try {
      const data = await getPopularMovies()
      setMovies(data.results ?? [])
      setHasSearched(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleSearch(query) {
    if (!query) {
      loadPopular()
      return
    }
    setLoading(true)
    setError(null)
    try {
      const data = await searchMovies(query)
      setMovies(data.results ?? [])
      setHasSearched(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <SearchBar onSearch={handleSearch} />
      {!hasSearched && <h2 className="section-title">인기 영화</h2>}
      {loading && <p className="status-message">불러오는 중...</p>}
      {error && <p className="status-message error">에러: {error}</p>}
      {!loading && !error && (
        <MovieGrid movies={movies} emptyMessage="검색 결과가 없습니다." />
      )}
    </section>
  )
}

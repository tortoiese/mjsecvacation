import { getPosterUrl } from '../api/tmdb.js'
import { useWishlist } from '../context/WishlistContext.jsx'

export default function MovieCard({ movie }) {
  const { isWished, toggleWishlist } = useWishlist()
  const wished = isWished(movie.id)
  const posterUrl = getPosterUrl(movie.poster_path)

  return (
    <div className="movie-card">
      <div className="poster-wrap">
        {posterUrl ? (
          <img src={posterUrl} alt={`${movie.title} 포스터`} loading="lazy" />
        ) : (
          <div className="poster-fallback">No Image</div>
        )}
        <button
          type="button"
          className={`wish-btn ${wished ? 'wished' : ''}`}
          onClick={() => toggleWishlist(movie)}
          aria-label={wished ? '찜 목록에서 제거' : '찜 목록에 추가'}
        >
          {wished ? '♥' : '♡'}
        </button>
      </div>
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <p className="release-date">{movie.release_date || '개봉일 미정'}</p>
        <p className="rating">⭐ {movie.vote_average?.toFixed(1) ?? '-'}</p>
      </div>
    </div>
  )
}

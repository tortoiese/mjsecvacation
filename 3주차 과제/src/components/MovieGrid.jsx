import MovieCard from './MovieCard.jsx'

export default function MovieGrid({ movies, emptyMessage }) {
  if (movies.length === 0) {
    return <p className="empty-message">{emptyMessage}</p>
  }

  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  )
}

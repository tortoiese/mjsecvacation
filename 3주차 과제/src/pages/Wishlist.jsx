import MovieGrid from '../components/MovieGrid.jsx'
import { useWishlist } from '../WishlistContext.jsx'

export default function Wishlist() {
  const { wishlist } = useWishlist()

  return (
    <section>
      <h2 className="section-title">내 찜 목록</h2>
      <MovieGrid
        movies={wishlist}
        emptyMessage="아직 찜한 영화가 없습니다. 검색 화면에서 하트를 눌러보세요."
      />
    </section>
  )
}

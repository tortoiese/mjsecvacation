import { NavLink } from 'react-router-dom'
import { useWishlist } from '../WishlistContext.jsx'

export default function Header() {
  const { wishlist } = useWishlist()

  return (
    <header className="header">
      <NavLink to="/" className="logo">
        🎬 MovieFinder
      </NavLink>
      <nav className="nav">
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
          검색
        </NavLink>
        <NavLink to="/wishlist" className={({ isActive }) => (isActive ? 'active' : '')}>
          찜 목록 ({wishlist.length})
        </NavLink>
      </nav>
    </header>
  )
}

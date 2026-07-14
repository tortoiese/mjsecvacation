import { createContext, useContext, useEffect, useState } from 'react'

const WishlistContext = createContext(null)
const STORAGE_KEY = 'tmdb-wishlist'

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist))
  }, [wishlist])

  function isWished(movieId) {
    return wishlist.some((movie) => movie.id === movieId)
  }

  function toggleWishlist(movie) {
    setWishlist((prev) =>
      prev.some((m) => m.id === movie.id)
        ? prev.filter((m) => m.id !== movie.id)
        : [...prev, movie],
    )
  }

  return (
    <WishlistContext.Provider value={{ wishlist, isWished, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist는 WishlistProvider 내부에서만 사용할 수 있습니다.')
  }
  return context
}

import { useState } from 'react'

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    onSearch(query.trim())
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="영화 제목을 입력하세요 (예: 인터스텔라)"
      />
      <button type="submit">검색</button>
    </form>
  )
}

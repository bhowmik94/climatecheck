import { useState } from 'react'

export default function SearchBar({ onSearch, loading }) {
  const [value, setValue] = useState('')

  const handleSubmit = () => {
    if (value.trim()) onSearch(value.trim())
  }

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Enter a city, town or village…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        disabled={loading}
      />
      <button onClick={handleSubmit} disabled={loading || !value.trim()}>
        {loading ? 'Searching…' : 'Analyse →'}
      </button>
    </div>
  )
}
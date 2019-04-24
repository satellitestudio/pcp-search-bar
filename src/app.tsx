import React, { useMemo, useCallback } from 'react'
import './app.css'
import Search from './components/search/search.container'
import qs from 'qs'
import { DataItem } from './types/data'

const App: React.FC = (): React.ReactElement => {
  const query = useMemo(() => {
    const query = qs.parse(window.location.search.replace('?', ''))
    return (query && query.search) || ''
  }, [])

  const handleChange = useCallback((selectedItems: DataItem[], inputValue) => {
    const url = window.location.origin + window.location.pathname + '?search=' + inputValue
    window.history.replaceState(window.history.state, '', url)
  }, [])

  return (
    <div className="app">
      <Search initialSearch={query} onChange={handleChange} />
    </div>
  )
}

export default App

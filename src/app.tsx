import React, { useMemo, useCallback } from 'react'
import './app.css'
import Search from './components/search/search.container'
import qs from 'qs'
import { DataItem } from './types/data'

const App: React.FC = (): React.ReactElement => {
  const selection = useMemo(() => {
    const query = qs.parse(window.location.search, { ignoreQueryPrefix: true })
    return query && query.search ? query.search : null
  }, [])

  const handleChange = useCallback((selectedItems: DataItem[]) => {
    const selectionQuery = qs.stringify({ search: selectedItems }, { addQueryPrefix: true })
    const url = window.location.origin + window.location.pathname + selectionQuery
    window.history.replaceState(window.history.state, '', url)
  }, [])

  return (
    <div className="app">
      <Search initialSelection={selection} onChange={handleChange} />
    </div>
  )
}

export default App

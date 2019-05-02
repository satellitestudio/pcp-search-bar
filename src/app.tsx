import React from 'react'
import Home from './pages/home/home'
import Search from './pages/search/search'
import HistorySroll from './pages/history-scroll/history-scroll'
import { Router } from '@reach/router'

const App: React.FC = (): React.ReactElement => {
  return (
    <Router>
      <Home path="/" default />
      <Search path="search" />
      <HistorySroll path="scrolling" />
    </Router>
  )
}

export default App

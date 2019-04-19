import React from 'react'
import './app.css'
import Search from './components/search/search.container'

const App: React.FC = (): React.ReactElement => (
  <div className="app">
    <Search />
  </div>
)

export default App

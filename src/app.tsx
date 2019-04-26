import React, { useMemo, useCallback, useState } from 'react'
import qs from 'qs'
import styles from './app.module.css'
import Search from './components/search/search.container'
import { DataItem } from './types/data'
import { groupSelectionsByType } from './components/search/search.utils'
import { SEARCH_TYPES } from './components/search/search.config'
import CountryFlag from '@globalfishingwatch/map-components/components/countryflag'
import data, { flags, rfmos, after, before } from './data/data'

const capitalizeFirst = (string: string): string => string.charAt(0).toUpperCase() + string.slice(1)

const App: React.FC = (): React.ReactElement => {
  const urlSelection = useMemo(() => {
    const query = qs.parse(window.location.search, { ignoreQueryPrefix: true })
    return query && query.search ? query.search : []
  }, [])

  const [selections, updateSelection] = useState<DataItem[]>(urlSelection)

  const handleChange = useCallback((selectedItems: DataItem[]) => {
    updateSelection(selectedItems)
    const selectionQuery = qs.stringify({ search: selectedItems }, { addQueryPrefix: true })
    const url = window.location.origin + window.location.pathname + selectionQuery
    window.history.replaceState(window.history.state, '', url)
  }, [])

  const addExternalSelection = () => {
    updateSelection([
      ...selections,
      rfmos[Math.floor(Math.random() * rfmos.length - 1) + 1],
      flags[Math.floor(Math.random() * flags.length - 1) + 1],
      flags[Math.floor(Math.random() * flags.length - 1) + 1],
      after[Math.floor(Math.random() * after.length - 1) + 1],
      after[Math.floor(Math.random() * after.length - 1) + 1],
      before[Math.floor(Math.random() * before.length - 1) + 1],
    ])
  }

  const removeExternalSelection = () => {
    updateSelection([])
  }

  const selectionsByType = useMemo(() => {
    return groupSelectionsByType(selections || [])
  }, [selections])

  return (
    <div className={styles.app}>
      <Search staticOptions={data} selectedItems={selections} onChange={handleChange} />
      <button onClick={addExternalSelection}>Add selection</button>
      <button onClick={removeExternalSelection}>Remove selection</button>
      <div className={styles.selectionContainer}>
        <h2>Current filter selection by</h2>
        {selectionsByType !== null ? (
          <ul className={styles.selectionList}>
            {Object.keys(SEARCH_TYPES).map((key) => (
              <li key={key}>
                <strong>{capitalizeFirst(key)}</strong>:{' '}
                {selectionsByType[key] !== undefined ? (
                  selectionsByType[key].values.map((value, index) => (
                    <span key={value.id}>
                      {key === SEARCH_TYPES.flag && <CountryFlag iso={value.id} />}
                      {value.label}({value.id})
                      {index === selectionsByType[key].values.length - 1 ? '' : ','}
                    </span>
                  ))
                ) : (
                  <span>no filter</span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <span>none</span>
        )}
      </div>
    </div>
  )
}

export default App

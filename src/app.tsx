import React, { useMemo, useCallback, useState } from 'react'
import qs from 'qs'
import styles from './app.module.css'
import Search from './components/search/search.container'
import MultiSelect from './components/multi-select/multi-select'
import { DataItem } from './types/data'
import { groupSelectionsByType } from './components/search/search.utils'
import { SEARCH_TYPES } from './components/search/search.config'
import CountryFlag from '@globalfishingwatch/map-components/components/countryflag'
import data, { flags, rfmos } from './data/data'

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

  const removeExternalSelection = () => {
    updateSelection([])
  }

  const selectionsByType = useMemo(() => {
    return groupSelectionsByType(selections || [])
  }, [selections])

  const handleSelectChange = (selectedItem: DataItem) => {
    updateSelection([...selections, selectedItem])
  }

  const handleRemoveItem = (item: DataItem) => {
    updateSelection(selections.filter((i) => i !== item))
  }

  const getSelectionByType = (type: string) => {
    const selection = selections.filter((s) => s.type === type)
    return selection
  }

  return (
    <div className={styles.app}>
      <Search staticOptions={data} selectedItems={selections} onChange={handleChange} />
      <div>
        <button onClick={removeExternalSelection}>Remove selection</button>
      </div>
      <div>
        <MultiSelect
          options={flags}
          selectedItems={getSelectionByType('flag')}
          onSelectedItem={handleSelectChange}
          onRemoveItem={handleRemoveItem}
        />
        <MultiSelect
          options={rfmos}
          selectedItems={getSelectionByType('rfmo')}
          onSelectedItem={handleSelectChange}
          onRemoveItem={handleRemoveItem}
        />
      </div>
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

import { useEffect, useReducer } from 'react'
import matchSorter from 'match-sorter'
import { DataItem } from '../../types/data'
import { replaceWithNormalSpaces } from './search.container'

const getItemsFiltered = (
  items: DataItem[],
  input: string,
  selectedItems: DataItem[],
  cursorPosition: number
): DataItem[] => {
  if (!input) return items
  let selectedItemIds = (selectedItems && selectedItems.map((i) => i.id)) || []
  const selectedItemTypes = (selectedItems && selectedItems.map((i) => i.type)) || []
  const selectedItemLabels = (selectedItems && selectedItems.map((i) => i.label)) || []
  const existingSearchTypes: { [type: string]: boolean } = {}

  const searchStrings = input
    .replace(/:/gi, ' ')
    .replace(/,/gi, ' ')
    .split(' ')
    // Space replacement needs to be done after splitting by regular spaces
    .map(replaceWithNormalSpaces)
    .filter((v: any) => {
      if (!v || v === '') return false
      if (selectedItemTypes.includes(v)) {
        // Needed when search by type with a current type filter added
        if (!existingSearchTypes[v]) {
          existingSearchTypes[v] = true
          return false
        } else {
          return true
        }
      }
      return !selectedItemLabels.includes(v)
    })
  const isLastSpace = input[cursorPosition] === ' '
  if (!isLastSpace) {
    let currentTypeEndIndex = 0
    let currentTypeStartIndex = 0
    for (let i = cursorPosition; i > 0; i--) {
      if (input[i] === ':') {
        currentTypeEndIndex = i
      } else if (input[i] === ' ') {
        currentTypeStartIndex = i + 1
        break
      }
    }
    const currentType = input.slice(currentTypeStartIndex, currentTypeEndIndex)
    searchStrings.push(currentType)
  }

  const itemsNotSelected =
    selectedItemIds.length > 0 ? items.filter((i) => !selectedItemIds.includes(i.id)) : items

  return searchStrings.reduce((acc, cleanValue) => {
    return matchSorter(acc, cleanValue, { keys: ['label', 'type'] })
  }, itemsNotSelected)
}

export const useResultsFiltered = (staticData: DataItem[], initialValue?: string): any => {
  const initialState = {
    loading: false,
    staticData,
    selectedItem: [],
    cursorPosition: 0,
    search: initialValue,
    results: staticData,
  }
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case 'inputChange':
        return { ...state, ...action.payload }
      case 'startSearch': {
        const { staticData, search, selectedItem, cursorPosition } = state
        return {
          ...state,
          results: getItemsFiltered(staticData, search, selectedItem, cursorPosition),
          loading: true,
        }
      }
      case 'endSearch': {
        return {
          ...state,
          results: [...state.results, ...action.payload],
          loading: false,
        }
      }
      default:
        return state
    }
  }, initialState)
  const { search, selectedItem } = state
  useEffect(() => {
    dispatch({ type: 'startSearch', payload: { search, selectedItem } })

    // TODO clean search input and get only vessels or search terms
    const searchQuery = search
    if (searchQuery) {
      const controller = new AbortController()
      const searchUrl = `https://vessels-dot-world-fishing-827.appspot.com/datasets/indonesia/vessels?query=${search}&offset=0`

      fetch(searchUrl, { signal: controller.signal })
        .then((response) =>
          response.status >= 200 && response.status < 300
            ? Promise.resolve(response)
            : Promise.reject(new Error(response.statusText))
        )
        .then((response) => response.json())
        .then((data) => {
          const apiResults = data.entries
            .filter((d: any) => d.name)
            .map((d: any) => ({ id: d.vesselId, label: d.name, type: 'vessel' }))
          dispatch({ type: 'endSearch', payload: apiResults })
        })
        .catch((err) => {
          if (err.name === 'AbortError') {
            console.log('Fetch aborted')
          } else {
            console.error('Oops!', err)
          }
          dispatch({ type: 'endSearch', payload: [] })
        })
      return () => controller.abort()
    } else {
      dispatch({ type: 'endSearch', payload: [] })
    }
  }, [search, selectedItem])
  return [state, dispatch]
}

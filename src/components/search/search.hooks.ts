import { useEffect, useReducer } from 'react'
import matchSorter from 'match-sorter'
import { DataItem } from 'types/data'
import { VesselAPIResult } from 'types/api'
import { replaceWithNormalSpaces, getInputFields } from './search.utils'
import { searchTypesList, asyncFields } from './search.config'
import uniqBy from 'lodash/uniqBy'

const parseSearchFieldsInput = (
  input: string,
  selectedItems: DataItem[],
  cursorPosition: number
) => {
  const selectedItemTypes = (selectedItems && selectedItems.map((i) => i.type)) || []
  const selectedItemLabels = (selectedItems && selectedItems.map((i) => i.label)) || []
  const existingSearchTypes: { [type: string]: boolean } = {}

  const searchFields = getInputFields(input)
    // Space replacement needs to be done after splitting by regular spaces
    .map(replaceWithNormalSpaces)
    .filter((v) => {
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

  let previousColonPosition = 0
  for (let i = cursorPosition; i > 0; i--) {
    if (input[i] === ':') {
      previousColonPosition = i
      break
    }
  }
  const isSearchingInType =
    input.slice(previousColonPosition, cursorPosition + 1).indexOf(' ') === -1

  if (isSearchingInType) {
    let currentTypeStartIndex = 0
    for (let i = previousColonPosition; i > 0; i--) {
      if (input[i] === ' ') {
        currentTypeStartIndex = i + 1
        break
      }
    }
    const currentType = input.slice(currentTypeStartIndex, previousColonPosition)
    if (currentType) {
      searchFields.push(currentType)
    }
  }

  return Array.from(new Set(searchFields))
}

const getItemsFiltered = (
  items: DataItem[],
  input: string,
  selectedItems: DataItem[],
  cursorPosition: number
): DataItem[] => {
  if (!input) return items
  let selectedItemIds = (selectedItems && selectedItems.map((i) => i.id)) || []

  const searchFields = parseSearchFieldsInput(input, selectedItems, cursorPosition)
  const itemsNotSelected =
    selectedItemIds.length > 0 ? items.filter((i) => !selectedItemIds.includes(i.id)) : items

  return searchFields.reduce((acc, cleanValue) => {
    return matchSorter(acc, cleanValue, { keys: ['label', 'type'] })
  }, itemsNotSelected)
}

interface ResultsAction {
  type: 'inputChange' | 'startSearch' | 'endSearch' | 'setCursorPosition'
  payload?: any
}

interface ResultsState {
  loading: boolean
  staticData: DataItem[]
  selectedItem: DataItem[]
  cursorPosition: number
  search: string
  results: DataItem[]
  cachedResults: DataItem[]
}

export const useResultsFiltered = (staticData: DataItem[], initialValue?: string): any => {
  const initialState: ResultsState = {
    loading: false,
    staticData,
    selectedItem: [],
    cursorPosition: 0,
    search: initialValue || '',
    results: staticData,
    cachedResults: staticData,
  }
  const resultsReducer = (state: ResultsState, action: ResultsAction): ResultsState => {
    switch (action.type) {
      case 'inputChange':
        return { ...state, ...action.payload }
      case 'setCursorPosition':
        return { ...state, cursorPosition: action.payload }
      case 'startSearch': {
        const { staticData, search, selectedItem, cursorPosition } = state
        return {
          ...state,
          results: getItemsFiltered(staticData, search, selectedItem, cursorPosition),
          loading: action.payload,
        }
      }
      case 'endSearch': {
        return {
          ...state,
          results: [...state.results, ...action.payload],
          cachedResults: uniqBy([...state.cachedResults, ...action.payload], 'id'),
          loading: false,
        }
      }
      default:
        return state
    }
  }
  const [state, dispatch] = useReducer(resultsReducer, initialState)
  const { search, selectedItem, cursorPosition } = state
  useEffect(() => {
    const searchFields = parseSearchFieldsInput(search, selectedItem, cursorPosition)
    const searchFieldsTypes = searchFields.filter((f) => searchTypesList.includes(f))
    const needsRequest =
      searchFieldsTypes.length === 0 || searchFieldsTypes.some((r) => asyncFields.includes(r))
    const selectedItemIds = selectedItem.map((i: DataItem) => i.id)
    const selectedItemLabels = selectedItem.map((i: DataItem) => i.label)
    const searchQuery = searchFields
      .filter((f) => !selectedItemLabels.includes(f) && !searchTypesList.includes(f))
      .join(',')
    const asyncNeeded = needsRequest && searchQuery !== ''
    dispatch({ type: 'startSearch', payload: asyncNeeded })
    if (asyncNeeded) {
      const controller = new AbortController()
      const searchUrl = `https://vessels-dot-world-fishing-827.appspot.com/datasets/indonesia/vessels?query=${searchQuery}&offset=0`

      fetch(searchUrl, { signal: controller.signal })
        .then((response) =>
          response.status >= 200 && response.status < 300
            ? Promise.resolve(response)
            : Promise.reject(new Error(response.statusText))
        )
        .then((response) => response.json())
        .then((data: VesselAPIResult) => {
          const apiResults = data.entries
            .filter((d) => d.name)
            .map((d) => ({ id: d.vesselId, label: d.name, type: 'vessel' }))
            .filter((d) => !selectedItemIds.includes(d.id))
          dispatch({ type: 'endSearch', payload: apiResults })
        })
        .catch((err) => {
          if (err.name !== 'AbortError') {
            console.error('Oops!', err)
          }
          dispatch({ type: 'endSearch', payload: [] })
        })
      return () => controller.abort()
    }
  }, [search, cursorPosition, selectedItem])
  return [state, dispatch]
}

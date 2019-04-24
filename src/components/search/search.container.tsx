import React, { useCallback, useMemo } from 'react'
import SearchComponent from './search'
import Downshift, { DownshiftState, StateChangeOptions } from 'downshift'
import { useResultsFiltered } from './search.hooks'

import { DataItem } from '../../types/data'
import { parseSelectionToInput, calculateCursorPosition, parseInputToFields } from './search.utils'
import uniqBy from 'lodash/uniqBy'

interface SearchContainerProps {
  initialSelection: DataItem[]
  staticOptions: DataItem[]
  onChange(selectedItems: DataItem[], inputValue: string): void
}

const SearchContainer: React.FC<SearchContainerProps> = (props) => {
  let cursorPosition = 0
  const { initialSelection, onChange, staticOptions } = props
  const [state, dispatch] = useResultsFiltered(staticOptions, '')
  const { results, loading, cachedResults } = state

  const handleStateChange = useCallback(
    (changes: StateChangeOptions<DataItem[]>, downshiftState: DownshiftState<DataItem[]>) => {
      if (changes.hasOwnProperty('inputValue')) {
        const { inputValue = '', selectedItem } = downshiftState
        const inputValueString = inputValue || ''
        if (selectedItem !== null) {
          onChange(selectedItem, inputValueString)
          if (inputValue) {
            dispatch({
              type: 'inputChange',
              payload: { search: inputValueString, selectedItem, cursorPosition },
            })
          }
        }
      }
    },
    []
  )

  const handleConfirmSelection = (
    state: DownshiftState<any>,
    changes: StateChangeOptions<any>,
    lastCharacter: string = ' '
  ): StateChangeOptions<any> => {
    const currentItems = state.selectedItem || []
    const alreadySelected = currentItems.find(
      (item: DataItem) => item.id === changes.selectedItem.id
    )
    const selectedItem = alreadySelected ? currentItems : [...currentItems, changes.selectedItem]

    // Adding a space at the end to start with a clean search when press enter
    const inputValue = parseSelectionToInput(selectedItem, lastCharacter)
    return { ...changes, selectedItem, inputValue }
  }

  const getSelectedItemsByInput = (input: string, currentSelection: DataItem[]): DataItem[] => {
    const inputValuesParsed = input ? parseInputToFields(input) : null
    return inputValuesParsed !== null
      ? currentSelection.filter(
          (i: DataItem) =>
            inputValuesParsed.find(
              (p) => p.type === i.type && p.labels !== undefined && p.labels.includes(i.label)
            ) !== undefined
        )
      : []
  }

  const handleChangeInput = (
    state: DownshiftState<DataItem[]>,
    changes: StateChangeOptions<DataItem[]>
  ): StateChangeOptions<DataItem[]> => {
    const inputValue = changes.inputValue || ''
    const selectedItems = state.selectedItem || []
    const selectedOptions = uniqBy([...selectedItems, ...cachedResults], 'id')
    const selectedItem = getSelectedItemsByInput(inputValue, selectedOptions)
    cursorPosition = calculateCursorPosition(changes.inputValue || '', state.inputValue || '')

    return {
      ...changes,
      selectedItem,
      isOpen: inputValue !== '' && inputValue[cursorPosition] !== ',',
    }
  }

  const stateReducer = useCallback(
    (
      state: DownshiftState<DataItem[]>,
      changes: StateChangeOptions<DataItem[]>
    ): StateChangeOptions<DataItem[]> => {
      switch (changes.type as any) {
        case Downshift.stateChangeTypes.keyDownEnter:
        case Downshift.stateChangeTypes.clickItem: {
          return handleConfirmSelection(state, changes)
        }
        case 'keyDownComa': {
          return handleConfirmSelection(state, changes, '')
        }
        case Downshift.stateChangeTypes.changeInput: {
          return handleChangeInput(state, changes)
        }
        default:
          // Avoids warning on uncontrolled input value
          return { ...changes, inputValue: changes.inputValue || state.inputValue || '' }
      }
    },
    [cachedResults]
  )

  const customKeyDownHandler = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>, downshift: any) => {
      const { highlightedIndex, inputValue, setState } = downshift
      const hasValue = inputValue !== '' && inputValue !== ' '
      const isSpace = event.key === ' '
      const isComma = event.key === ','
      const hasOneOptions = results.length === 1
      if (hasValue && ((isSpace || isComma) && hasOneOptions)) {
        ;(event as any).nativeEvent.preventDownshiftDefault = true
        if (highlightedIndex !== null && highlightedIndex >= 0) {
          const selectedItem = results[highlightedIndex]
          if (selectedItem) {
            setState({
              type: 'keyDownComa',
              selectedItem,
              inputValue,
            })
          }
        }
      }
    },
    [results]
  )

  const itemToString = useCallback((i: DataItem): string => {
    return i ? i.label : ''
  }, [])

  const initialInputValue = useMemo((): string => {
    return initialSelection !== null ? parseSelectionToInput(initialSelection) : ''
  }, [])

  return (
    <SearchComponent
      items={results}
      loading={loading}
      itemToString={itemToString}
      stateReducer={stateReducer}
      initialInputValue={initialInputValue}
      initialSelection={initialSelection}
      onKeyDown={customKeyDownHandler}
      onStateChange={handleStateChange}
    />
  )
}

export default SearchContainer

import React, { useCallback, useMemo, useRef, useEffect } from 'react'
import SearchComponent from './search'
import Downshift, { DownshiftState, StateChangeOptions } from 'downshift'
import { useResultsFiltered } from './search.hooks'

import { DataItem } from 'types/data'
import { parseSelectionToInput, calculateCursorPosition, parseInputToFields } from './search.utils'
import debounce from 'lodash/debounce'
import uniqBy from 'lodash/uniqBy'
import { singleSelectionFields } from './search.config'

interface SearchContainerProps {
  selectedItems: DataItem[]
  staticOptions: DataItem[]
  onChange(selectedItems: DataItem[]): void
}

const SearchContainer: React.FC<SearchContainerProps> = (props) => {
  const { selectedItems, onChange, staticOptions } = props
  const [state, dispatch] = useResultsFiltered(staticOptions, '')
  const { results, loading, cachedResults } = state

  const debouncedDispatchChange = useMemo(
    () =>
      debounce((payload) => {
        dispatch({ type: 'inputChange', payload })
      }, 100),
    [dispatch]
  )

  const handleStateChange = useCallback(
    (changes: StateChangeOptions<DataItem[]>, downshiftState: DownshiftState<DataItem[]>) => {
      if (changes.hasOwnProperty('inputValue')) {
        const { inputValue = '', selectedItem } = downshiftState
        const inputValueString = inputValue || ''
        debouncedDispatchChange({ search: inputValueString, selectedItem })
      }
    },
    [debouncedDispatchChange]
  )

  const handleConfirmSelection = (
    state: DownshiftState<any>,
    changes: StateChangeOptions<any>,
    lastCharacter: string = ' '
  ): StateChangeOptions<any> => {
    const currentItems = state.selectedItem || []
    const isAlreadySelectedType = currentItems.some(
      (item: DataItem) => item.type === changes.selectedItem.type
    )
    const isSingleSelectionField = singleSelectionFields.includes(changes.selectedItem.type)
    let selectedItem = [...currentItems]

    if ((isSingleSelectionField && !isAlreadySelectedType) || !isSingleSelectionField) {
      selectedItem.push(changes.selectedItem)
    } else {
      selectedItem = selectedItem.map((s) => {
        return s.type === changes.selectedItem.type ? changes.selectedItem : s
      })
    }

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

  const handleExternalChanges = useCallback(
    (
      state: DownshiftState<DataItem[]>,
      changes: StateChangeOptions<DataItem[]>
    ): StateChangeOptions<DataItem[]> => {
      const typesIncluded: { [string: string]: boolean } = {}
      if (!changes.selectedItem || !state.selectedItem) return changes
      // TODO: has a more accurate comparison
      if (state.selectedItem.length === changes.selectedItem.length) {
        return changes
      }
      const uniqueSelections = uniqBy(changes.selectedItem, 'id')
      const selectedItem = uniqueSelections.filter((item) => {
        if (!item) return false
        if (typesIncluded[item.type] !== undefined) {
          return !singleSelectionFields.includes(item.type)
        }
        typesIncluded[item.type] = true
        return true
      })
      const inputValue = parseSelectionToInput(selectedItem)
      return { ...changes, inputValue, selectedItem }
    },
    []
  )
  const handleChangeInput = useCallback(
    (
      state: DownshiftState<DataItem[]>,
      changes: StateChangeOptions<DataItem[]>
    ): StateChangeOptions<DataItem[]> => {
      const inputValue = changes.inputValue || ''
      const selectedItems = state.selectedItem || []
      const selectedOptions = uniqBy([...selectedItems, ...cachedResults], 'id')
      const selectedItem = getSelectedItemsByInput(inputValue, selectedOptions)
      const cursorPosition = calculateCursorPosition(
        changes.inputValue || '',
        state.inputValue || ''
      )
      dispatch({ type: 'setCursorPosition', payload: cursorPosition })

      return {
        ...changes,
        selectedItem,
        isOpen: inputValue !== '' && inputValue[cursorPosition] !== ',',
      }
    },
    [cachedResults, dispatch]
  )

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
        case 'externalChanges': {
          return handleExternalChanges(state, changes)
        }
        case Downshift.stateChangeTypes.changeInput: {
          return handleChangeInput(state, changes)
        }
        default:
          // Avoids warning on uncontrolled input value
          return {
            ...changes,
            inputValue: changes.inputValue || state.inputValue || '',
            selectedItem: changes.selectedItem || state.selectedItem || [],
          }
      }
    },
    [handleChangeInput, handleExternalChanges]
  )

  const customEventHandler = useCallback(
    (event: any, downshift: any) => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.type === 'click') {
        const cursorPosition = event.target.selectionStart
        dispatch({ type: 'setCursorPosition', payload: cursorPosition })
      }
      const { highlightedIndex, inputValue, setState } = downshift
      const hasValue = inputValue !== '' && inputValue !== ' '
      const isSpace = event.key === ' '
      const isComma = event.key === ','
      const hasOneOptions = results.length === 1
      if (hasValue && ((isSpace || isComma) && hasOneOptions)) {
        event.nativeEvent.preventDownshiftDefault = true
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
    [dispatch, results]
  )

  const itemToString = useCallback((i: DataItem): string => {
    return i ? i.label : ''
  }, [])

  const initialInputValue = useMemo((): string => {
    return selectedItems !== null ? parseSelectionToInput(selectedItems) : ''
  }, [selectedItems])

  const initialSelection = useMemo((): DataItem[] => {
    return selectedItems || []
  }, [selectedItems])

  const downshiftRef = useRef<any | null>(null)
  const setDownshiftRef = useCallback((downshift: any): void => {
    downshiftRef.current = downshift
  }, [])

  useEffect(() => {
    if (downshiftRef.current !== null) {
      const { setState } = downshiftRef.current
      setState({
        type: 'externalChanges',
        selectedItem: selectedItems,
      })
    }
  }, [selectedItems])

  return (
    <SearchComponent
      items={results}
      loading={loading}
      onChange={onChange}
      setDownshiftRef={setDownshiftRef}
      downshiftRefLoaded={downshiftRef.current !== null}
      itemToString={itemToString}
      stateReducer={stateReducer}
      selectedItems={selectedItems}
      initialSelection={initialSelection}
      initialInputValue={initialInputValue}
      customEventHandler={customEventHandler}
      onStateChange={handleStateChange}
    />
  )
}

export default SearchContainer

import React, { useCallback } from 'react'
import SearchComponent from './search'
import { DataValue, DataSelection, DataSelectionGrouped } from './search.types'
import Downshift, { DownshiftState, StateChangeOptions } from 'downshift'
import { useResultsFiltered, asyncFields } from './search.hooks'

import data from '../../data/data'
import { DataItem } from '../../types/data'

// Hack to look like spaces but be able to identify between input spaces and label spaces
const breakingSpaceCharacter = '\u00a0'
const breakingSpaceRegex = new RegExp(breakingSpaceCharacter, 'g')
export const replaceWithBreakingSpaces = (string: string) =>
  string.replace(/\s/gi, breakingSpaceCharacter)
export const replaceWithNormalSpaces = (string: string) => string.replace(breakingSpaceRegex, ' ')

const groupSelectionsByType = (selections: DataItem[]): DataSelectionGrouped => {
  return selections.reduce((acc: DataSelectionGrouped, selection: DataItem) => {
    const { type, id, label } = selection
    const existingType = acc[type]
    if (existingType) {
      acc[type].values.push({ id, label })
      return acc
    }
    return {
      ...acc,
      [type]: { type, values: [{ id, label }] },
    }
  }, {})
}

const parseSelectionToInput = (selections: DataSelectionGrouped) => {
  return Object.values(selections).reduce(
    (acc: string, item: DataSelection) =>
      `${acc !== '' ? `${acc} ` : ''}${item.type}:${item.values
        .map((v: DataValue) => replaceWithBreakingSpaces(v.label))
        .join(',')}`,
    ''
  )
}

const SearchContainer: React.FC = () => {
  let cursorPosition = 0
  const [state, dispatch] = useResultsFiltered(data, '')
  const { results, loading } = state

  const handleStateChange = useCallback(
    (changes: StateChangeOptions<any>, downshiftState: DownshiftState<any>) => {
      if (changes.hasOwnProperty('inputValue')) {
        const { inputValue, selectedItem } = downshiftState
        if (inputValue) {
          dispatch({
            type: 'inputChange',
            payload: { search: inputValue || '', selectedItem, cursorPosition },
          })
        }
      }
    },
    []
  )

  const handleConfirmSelection = (
    state: DownshiftState<any>,
    changes: StateChangeOptions<any>
  ): StateChangeOptions<any> => {
    const currentItems = state.selectedItem || []
    const alreadySelected = currentItems.find(
      (item: DataItem) => item.id === changes.selectedItem.id
    )
    const selectedItem = alreadySelected ? currentItems : [...currentItems, changes.selectedItem]
    const groupedSelections = groupSelectionsByType(selectedItem)
    // Adding a space at the end to start with a clean search when press enter
    const inputValue = parseSelectionToInput(groupedSelections)
    return {
      ...changes,
      selectedItem,
      inputValue,
    }
  }

  const parseInputToFields = (input: string): { type: string; labels: string[] }[] => {
    return input
      .split(' ')
      .filter((s) => s)
      .map((s) => {
        const [type, labels] = s.split(':')
        return {
          type,
          labels: labels
            ? labels
                .split(',')
                .map(replaceWithNormalSpaces)
                .filter((l) => l)
            : [],
        }
      })
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
    state: DownshiftState<any>,
    changes: StateChangeOptions<any>
  ): StateChangeOptions<any> => {
    cursorPosition = 0
    if (changes.inputValue && state.inputValue) {
      const length = Math.max(state.inputValue.length, changes.inputValue.length)
      for (let i = 0; i < length; i++) {
        if (changes.inputValue[i] === undefined) {
          cursorPosition -= 1
        } else if (state.inputValue[i] === changes.inputValue[i]) {
          cursorPosition += 1
        }
      }
    }
    const inputValue = changes.inputValue || ''
    let selectedItem = getSelectedItemsByInput(inputValue, state.selectedItem || [])
    if (inputValue) {
      // Remove from current when cursor is in last character to suggest
      let currentLabelEndIndex = cursorPosition + 1
      let currentLabelStartIndex = 0
      for (let i = cursorPosition; i > 0; i--) {
        if (inputValue[i] === ':' || inputValue[i] === ',') {
          currentLabelStartIndex = i + 1
          break
        }
      }
      const currentLabel = replaceWithNormalSpaces(
        inputValue.slice(currentLabelStartIndex, currentLabelEndIndex)
      )
      const currentSelection = selectedItem.find((i: DataItem) => i.label === currentLabel)
      // Removes the current selected when cursor is in last character to suggest properly
      // but don't do it when async as would need another fetch
      if (currentSelection && !asyncFields.includes(currentSelection.type)) {
        selectedItem = selectedItem.filter((item: DataItem) => item.id !== currentSelection.id)
      }
    }

    return { ...changes, selectedItem, isOpen: inputValue !== '' }
  }

  const stateReducer = useCallback(
    (state: DownshiftState<any>, changes: StateChangeOptions<any>): StateChangeOptions<any> => {
      switch (changes.type) {
        case Downshift.stateChangeTypes.keyDownEnter:
        case Downshift.stateChangeTypes.clickItem: {
          return handleConfirmSelection(state, changes)
        }
        case Downshift.stateChangeTypes.changeInput: {
          return handleChangeInput(state, changes)
        }
        default:
          // Avoids warning on uncontrolled input value
          return { ...changes, inputValue: changes.inputValue || state.inputValue || '' }
      }
    },
    []
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
              type: Downshift.stateChangeTypes.clickItem,
              selectedItem,
              inputValue,
            })
          }
        }
      }
    },
    [results]
  )

  const handleChange = useCallback((selectedItems: DataItem[]) => {
    console.log('SELECTED ITEMS CALLBACK')
    console.table(selectedItems)
  }, [])

  const itemToString = useCallback((i: DataItem): string => {
    return i ? i.label : ''
  }, [])

  return (
    <SearchComponent
      items={results}
      loading={loading}
      onChange={handleChange}
      onKeyDown={customKeyDownHandler}
      itemToString={itemToString}
      stateReducer={stateReducer}
      onStateChange={handleStateChange}
    />
  )
}

export default SearchContainer

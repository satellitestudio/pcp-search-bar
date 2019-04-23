import React, { useCallback } from 'react'
import SearchComponent from './search'
import { DataValue, DataSelection, DataSelectionGrouped } from './search.types'
import Downshift, { DownshiftState, StateChangeOptions } from 'downshift'
import { useResultsFiltered } from './search.hooks'

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
      `${acc}${item.type}:${item.values
        .map((v: DataValue) => replaceWithBreakingSpaces(v.label))
        .join(',')} `,
    ''
  )
}

const SearchContainer: React.FC = () => {
  let cursorPosition = 0
  const [{ results, loading }, dispatch] = useResultsFiltered(data, '')

  const handleStateChange = useCallback(
    (changes: StateChangeOptions<any>, downshiftState: DownshiftState<any>) => {
      if (changes.hasOwnProperty('inputValue')) {
        const { inputValue, selectedItem } = downshiftState
        if (inputValue !== null) {
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
    const inputValue = parseSelectionToInput(groupedSelections)
    return {
      ...changes,
      selectedItem,
      inputValue,
    }
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
    const inputValuesParsed = changes.inputValue
      ? changes.inputValue
          .split(' ')
          .filter((s) => s)
          .map((s) => {
            const [type, labels] = s.split(':')
            return { type, labels: labels && labels.split(',').map(replaceWithNormalSpaces) }
          })
      : null

    let selectedItem =
      inputValuesParsed !== null && results !== null
        ? results.filter(
            (i: DataItem) =>
              inputValuesParsed.find(
                (p) => p.type === i.type && p.labels !== undefined && p.labels.includes(i.label)
              ) !== undefined
          )
        : []

    if (changes.inputValue) {
      // Remove from current when cursor is in last character to suggest
      let currentLabelEndIndex = cursorPosition + 1
      let currentLabelStartIndex = 0
      for (let i = cursorPosition; i > 0; i--) {
        if (changes.inputValue[i] === ':' || changes.inputValue[i] === ',') {
          currentLabelStartIndex = i + 1
          break
        }
      }
      const currentLabel = replaceWithNormalSpaces(
        changes.inputValue.slice(currentLabelStartIndex, currentLabelEndIndex)
      )
      const currentSelection = selectedItem.find((i: DataItem) => i.label === currentLabel)
      if (currentSelection) {
        selectedItem = selectedItem.filter((item: DataItem) => item.id !== currentSelection.id)
      }
    }
    const isLastSpace =
      changes.inputValue && changes.inputValue[changes.inputValue.length - 1] === ' '

    return {
      ...changes,
      selectedItem,
      isOpen: !isLastSpace,
    }
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
        case Downshift.stateChangeTypes.mouseUp: {
          return {
            ...changes,
            inputValue: state.inputValue,
          }
        }
        default:
          return changes
      }
    },
    []
  )

  const handleChange = useCallback((selectedItems: DataItem[]) => {
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
      itemToString={itemToString}
      stateReducer={stateReducer}
      onStateChange={handleStateChange}
    />
  )
}

export default SearchContainer

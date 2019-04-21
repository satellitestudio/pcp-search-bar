import React, { useState } from 'react'
import matchSorter from 'match-sorter'
import SearchComponent from './search'
import Downshift, { DownshiftState, StateChangeOptions } from 'downshift'

import data from '../../data/data'
import { DataItem } from '../../types/data'

const SearchContainer: React.FC = () => {
  const items: DataItem[] = data
  const [itemsFiltered, setItemsFiltered] = useState<DataItem[]>([])

  const getItemsToShow = (value: string, selectedItem: DataItem): DataItem[] => {
    if (!value) return items

    const cleanValues = value
      .replace(/:/gi, ' ')
      .split(' ')
      .filter((v) => v && v !== '')

    const cleanItems = selectedItem ? items.filter((i) => i.id !== selectedItem.id) : items

    return cleanValues.reduce((acc, cleanValue) => {
      return matchSorter(acc, cleanValue, { keys: ['label', 'type'] })
    }, cleanItems)
  }

  const handleStateChange = (
    changes: StateChangeOptions<any>,
    downshiftState: DownshiftState<any>
  ) => {
    if (changes.hasOwnProperty('inputValue')) {
      const { inputValue, selectedItem } = downshiftState
      setItemsFiltered(getItemsToShow(inputValue || '', selectedItem))
    }
  }

  const stateReducer = (
    state: DownshiftState<any>,
    changes: StateChangeOptions<any>
  ): StateChangeOptions<any> => {
    switch (changes.type) {
      case Downshift.stateChangeTypes.keyDownEnter:
      case Downshift.stateChangeTypes.clickItem:
        return {
          ...changes,
          inputValue: `${changes.selectedItem.type}:${changes.selectedItem.label} `,
        }
      case Downshift.stateChangeTypes.changeInput: {
        const isRemoving =
          state.inputValue &&
          changes.inputValue &&
          state.inputValue.trim().length > changes.inputValue.trim().length
        let selectedItem = changes.inputValue ? state.selectedItem : null
        if (isRemoving) {
          selectedItem = null
        }
        return {
          ...changes,
          selectedItem,
        }
      }
      default:
        return changes
    }
  }

  const handleChange = (selectedItem: DataItem, downshiftState: DownshiftState<any>) => {
    console.log('TCL: handleChange -> downshiftState', selectedItem, downshiftState)
  }

  const itemToString = (i: DataItem): string => {
    return i ? i.label : ''
  }

  return (
    <SearchComponent
      items={itemsFiltered}
      onChange={handleChange}
      itemToString={itemToString}
      stateReducer={stateReducer}
      onStateChange={handleStateChange}
    />
  )
}

export default SearchContainer

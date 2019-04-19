import React, { Component } from 'react'
import matchSorter from 'match-sorter'
import SearchComponent from './search'
import Downshift, { DownshiftState, StateChangeOptions } from 'downshift'

import data from '../../data/data'
import { DataItem } from '../../types/data'

interface SearchState {
  itemsToShow: DataItem[]
}

class Search extends Component<any, SearchState> {
  items: DataItem[] = data
  state = { itemsToShow: [] }

  handleStateChange = (changes: StateChangeOptions<any>, downshiftState: DownshiftState<any>) => {
    if (changes.hasOwnProperty('inputValue')) {
      const { inputValue, selectedItem } = downshiftState
      this.setState({
        itemsToShow: this.getItemsToShow(inputValue || '', selectedItem),
      })
    }
  }

  stateReducer(
    state: DownshiftState<any>,
    changes: StateChangeOptions<any>
  ): StateChangeOptions<any> {
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

  handleChange = (selectedItem: DataItem, downshiftState: DownshiftState<any>) => {
    console.log('TCL: handleChange -> downshiftState', selectedItem, downshiftState)
  }

  getItemsToShow(value: string, selectedItem: DataItem): DataItem[] {
    if (!value) return this.items

    const cleanValues = value
      .replace(/:/gi, ' ')
      .split(' ')
      .filter((v) => v && v !== '')

    const cleanItems = selectedItem
      ? this.items.filter((i) => i.id !== selectedItem.id)
      : this.items

    return cleanValues.reduce((acc, cleanValue) => {
      return matchSorter(acc, cleanValue, { keys: ['label', 'type'] })
    }, cleanItems)
  }

  itemToString(i: DataItem): string {
    return i ? i.label : ''
  }

  render(): React.ReactNode {
    const { itemsToShow } = this.state
    return (
      <SearchComponent
        items={itemsToShow}
        onChange={this.handleChange}
        itemToString={this.itemToString}
        stateReducer={this.stateReducer}
        onStateChange={this.handleStateChange}
      />
    )
  }
}

export default Search

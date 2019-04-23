import React from 'react'
import styles from './search.module.css'
import Downshift, { DownshiftState, StateChangeOptions } from 'downshift'
import { DataItem } from '../../types/data'

interface SearchProps {
  items: DataItem[]
  loading?: boolean
  itemToString(obj: DataItem): string
  onChange(selectedItems: DataItem[], downshiftState: DownshiftState<any>): void
  stateReducer(
    state: DownshiftState<any>,
    changes: StateChangeOptions<any>
  ): StateChangeOptions<any>
  onStateChange(changes: StateChangeOptions<any>, downshiftState: DownshiftState<any>): void
}

const Search: React.FC<SearchProps> = (props) => {
  const { itemToString, onChange, stateReducer, items, onStateChange, loading } = props
  return (
    <Downshift
      onChange={onChange}
      stateReducer={stateReducer}
      itemToString={itemToString}
      onStateChange={onStateChange}
      defaultHighlightedIndex={0}
    >
      {(downshift) => {
        const {
          getInputProps,
          getMenuProps,
          getItemProps,
          isOpen,
          setState,
          inputValue,
          selectedItem,
          highlightedIndex,
        } = downshift
        return (
          <div className={styles.searchContainer}>
            <div>
              <input
                className={styles.searchInput}
                {...getInputProps({
                  placeholder: 'Start searching',
                  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => {
                    const hasValue = inputValue !== '' && inputValue !== ' '
                    const isLastSpace =
                      inputValue !== null && inputValue[inputValue.length - 1] === ' '
                    if (
                      isOpen &&
                      hasValue &&
                      !isLastSpace &&
                      (event.key === ' ' || event.key === ',')
                    ) {
                      ;(event as any).nativeEvent.preventDownshiftDefault = true
                      if (highlightedIndex !== null) {
                        const selectedItem = items[highlightedIndex]
                        if (selectedItem !== undefined) {
                          setState({
                            type: Downshift.stateChangeTypes.clickItem,
                            selectedItem,
                            inputValue,
                          })
                        }
                      }
                    }
                  },
                })}
              />
            </div>
            {!isOpen ? null : (
              <ul className={styles.optionList} {...getMenuProps()}>
                {items.map((item: DataItem, index: number) => (
                  <li
                    key={item.id}
                    {...getItemProps({
                      item,
                      index,
                    })}
                    style={{
                      backgroundColor: highlightedIndex === index ? '#ccc' : 'transparent',
                      color: selectedItem === item ? '#0f0f0f' : '#000',
                    }}
                  >
                    {item.type}: {itemToString(item)}
                  </li>
                ))}
                {loading === true && <li>loading...</li>}
              </ul>
            )}
          </div>
        )
      }}
    </Downshift>
  )
}

export default Search

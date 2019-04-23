import React from 'react'
import styles from './search.module.css'
import Downshift, { DownshiftState, StateChangeOptions } from 'downshift'
import { FixedSizeList } from 'react-window'
import { DataItem } from '../../types/data'

interface SearchProps {
  items: DataItem[]
  loading?: boolean
  initialInputValue: string
  itemToString(obj: DataItem): string
  onChange?(selectedItems: DataItem[], downshiftState: DownshiftState<any>): void
  onKeyDown?(event: React.KeyboardEvent<HTMLInputElement>, downshiftState: any): void
  stateReducer(
    state: DownshiftState<any>,
    changes: StateChangeOptions<any>
  ): StateChangeOptions<any>
  onStateChange(changes: StateChangeOptions<any>, downshiftState: DownshiftState<any>): void
}

const Search: React.FC<SearchProps> = (props) => {
  const {
    itemToString,
    initialInputValue,
    onChange,
    onKeyDown,
    stateReducer,
    items,
    onStateChange,
    loading,
  } = props
  return (
    <Downshift
      onChange={onChange}
      initialInputValue={initialInputValue}
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
                  onKeyDown:
                    onKeyDown !== undefined ? (event) => onKeyDown(event, downshift) : undefined,
                })}
              />
            </div>
            {!isOpen ? null : (
              <div className={styles.optionList}>
                <FixedSizeList
                  height={300}
                  itemSize={20}
                  itemCount={items.length}
                  outerElementType="ul"
                  {...getMenuProps()}
                >
                  {({ index, style }) => {
                    const item = items[index]
                    return (
                      <li
                        key={item.id}
                        {...getItemProps({
                          item,
                          index,
                        })}
                        style={{
                          ...style,
                          backgroundColor: highlightedIndex === index ? '#ccc' : 'transparent',
                          color: selectedItem === item ? '#0f0f0f' : '#000',
                        }}
                      >
                        {item.type}: {itemToString(item)}
                      </li>
                    )
                  }}
                </FixedSizeList>
                {loading === true && <span className={styles.loadingContainer}> loading...</span>}
              </div>
            )}
          </div>
        )
      }}
    </Downshift>
  )
}

export default Search

import React from 'react'
import styles from './search.module.css'
import Downshift, { DownshiftState, StateChangeOptions } from 'downshift'
import { DataItem } from '../../types/data'

function ArrowIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      preserveAspectRatio="none"
      width={16}
      fill="transparent"
      stroke="#979797"
      strokeWidth="1.1px"
      transform={isOpen ? 'rotate(180)' : ''}
    >
      <path d="M1,6 L10,15 L19,6" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      preserveAspectRatio="none"
      width={12}
      fill="transparent"
      stroke="#979797"
      strokeWidth="1.1px"
    >
      <path d="M1,1 L19,19" />
      <path d="M19,1 L1,19" />
    </svg>
  )
}

interface SearchProps {
  isOpen?: boolean
  itemToString(obj: DataItem): string
  onChange(selectedItem: DataItem, downshiftState: DownshiftState<any>): void
  items: DataItem[]
  stateReducer(
    state: DownshiftState<any>,
    changes: StateChangeOptions<any>
  ): StateChangeOptions<any>
  onStateChange(changes: StateChangeOptions<any>, downshiftState: DownshiftState<any>): void
}

const Search: React.FC<SearchProps> = (props) => {
  const { itemToString, onChange, stateReducer, items, onStateChange } = props
  return (
    <Downshift
      onChange={onChange}
      stateReducer={stateReducer}
      itemToString={itemToString}
      onStateChange={onStateChange}
    >
      {(downshift) => {
        const {
          getInputProps,
          getMenuProps,
          getToggleButtonProps,
          getItemProps,
          isOpen,
          clearSelection,
          selectedItem,
          inputValue,
          highlightedIndex,
        } = downshift
        return (
          <div className={styles.searchContainer}>
            <div>
              <input
                {...getInputProps({
                  placeholder: 'Start searching',
                })}
              />
              {selectedItem ? (
                <button onClick={() => clearSelection()} aria-label="clear selection">
                  <XIcon />
                </button>
              ) : (
                <button {...getToggleButtonProps()}>
                  <ArrowIcon isOpen={isOpen} />
                </button>
              )}
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
              </ul>
            )}
          </div>
        )
      }}
    </Downshift>
  )
}

export default Search

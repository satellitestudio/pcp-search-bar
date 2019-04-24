import React from 'react'
import styles from './search.module.css'
import Downshift, { DownshiftState, StateChangeOptions } from 'downshift'
import { FixedSizeList } from 'react-window'
import { DataItem } from '../../types/data'
import { getInputFields } from './search.utils'

// TODO: highlight search terms on results list
// const HighlightedField = ({ string, query }) => {
//   if (!string) return ''
//   const fragments = string.replace(new RegExp(query, 'gi'), `<mark>${query}</mark>`)
//   return <span dangerouslySetInnerHTML={{ __html: fragments }} /> // eslint-disable-line
// }

const getInputWithErrors = (input: string, selection: DataItem[]) => {
  if (!input) return ''
  const selectionStrings = Array.from(
    new Set([...selection.map((s) => s.label), ...selection.map((s) => s.type)])
  )
  const inputStrings = getInputFields(input)
  const incorrectInputStrings = inputStrings.filter(
    (i) => !selectionStrings.some((label) => label === i)
  )
  let inputWithErrors = input
  if (incorrectInputStrings.length) {
    incorrectInputStrings.forEach((incorrectInput) => {
      inputWithErrors = inputWithErrors.replace(
        new RegExp(`\\b${incorrectInput}\\b`, 'g'),
        `<span class=${styles.searchItemError}>${incorrectInput}</span>`
      )
    })
  }
  return <span dangerouslySetInnerHTML={{ __html: inputWithErrors }} /> // eslint-disable-line
}

interface SearchProps {
  items: DataItem[]
  loading?: boolean
  initialInputValue?: string
  initialSelection?: DataItem[]
  itemToString(obj: DataItem): string
  onChange?(selectedItems: DataItem[], downshiftState: any): void
  onKeyDown?(
    event: React.KeyboardEvent<HTMLInputElement>,
    downshiftState: DownshiftState<DataItem[]>
  ): void
  stateReducer(
    state: DownshiftState<DataItem[]>,
    changes: StateChangeOptions<DataItem[]>
  ): StateChangeOptions<DataItem[]>
  onStateChange(
    changes: StateChangeOptions<DataItem[]>,
    downshiftState: DownshiftState<DataItem[]>
  ): void
}

const Search: React.FC<SearchProps> = (props) => {
  const {
    itemToString,
    initialInputValue,
    initialSelection,
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
      initialSelectedItem={initialSelection}
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
          inputValue,
          selectedItem,
          highlightedIndex,
        } = downshift
        return (
          <div className={styles.searchContainer}>
            <div>
              {!isOpen && (
                <div className={styles.searchErrorsContainer}>
                  {getInputWithErrors(inputValue || '', selectedItem)}
                </div>
              )}
              <input
                className={styles.searchInput}
                {...getInputProps({
                  placeholder: 'Start searching',
                  onKeyDown:
                    onKeyDown !== undefined ? (event) => onKeyDown(event, downshift) : undefined,
                })}
                spellCheck={false}
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

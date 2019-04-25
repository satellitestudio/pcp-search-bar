import React from 'react'
import styles from './search.module.css'
import Downshift, { DownshiftState, StateChangeOptions } from 'downshift'
import CountryFlag from '@globalfishingwatch/map-components/components/countryflag'
import { FixedSizeList } from 'react-window'
import { DataItem } from 'types/data'
import { getInputFields, replaceWithBreakingSpaces, removeSpecialCharacters } from './search.utils'
import { SEARCH_TYPES } from './search.config'

// TODO: highlight search terms on results list
// const HighlightedField = ({ string, query }) => {
//   if (!string) return ''
//   const fragments = string.replace(new RegExp(query, 'gi'), `<mark>${query}</mark>`)
//   return <span dangerouslySetInnerHTML={{ __html: fragments }} /> // eslint-disable-line
// }

const getPlaceholderByType = (type: string): string => {
  const prefix = 'Press ⏎ to'
  switch (type) {
    case SEARCH_TYPES.flag:
      return `${prefix} see the activity of carriers from this flag state`
    case SEARCH_TYPES.rfmo:
      return `${prefix} see the activity that occurred in this RFMO area`
    case SEARCH_TYPES.after:
      return `${prefix} see the activity that occurred after this date`
    case SEARCH_TYPES.before:
      return `${prefix} see the activity that occurred before this date`
    case SEARCH_TYPES.vessel:
      return `${prefix} see the activity from this carrier`
    default:
      return `${prefix} select`
  }
}

const getInputWithErrors = (input: string, selection: DataItem[]) => {
  if (!input) return ''
  const selectionStrings =
    selection !== null
      ? Array.from(
          new Set([
            ...selection.map((s) => replaceWithBreakingSpaces(s.label)),
            ...selection.map((s) => s.type),
          ])
        )
      : []
  const inputStrings = getInputFields(input)
  const incorrectInputStrings = inputStrings.filter(
    (i) => !selectionStrings.some((label) => label === i)
  )
  let inputWithErrors = removeSpecialCharacters(input)
  if (incorrectInputStrings.length) {
    incorrectInputStrings.forEach((incorrectInput) => {
      inputWithErrors = inputWithErrors.replace(
        new RegExp(`\\b${removeSpecialCharacters(incorrectInput)}\\b`, 'g'),
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
  onKeyDown?(event: React.SyntheticEvent, downshiftState: DownshiftState<DataItem[]>): void
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
  const itemsWithLoading = loading
    ? [...items, { type: 'loading', id: 'loading', label: 'loading' }]
    : items
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
                  onClick:
                    onKeyDown !== undefined ? (event) => onKeyDown(event, downshift) : undefined,
                })}
                spellCheck={false}
              />
            </div>
            {!isOpen ? null : (
              <div className={styles.optionListContainer}>
                {itemsWithLoading.length > 0 ? (
                  <FixedSizeList
                    height={300}
                    itemSize={40}
                    itemCount={itemsWithLoading.length}
                    outerElementType="ul"
                    className={styles.optionList}
                    {...getMenuProps()}
                  >
                    {({ index, style }) => {
                      const item = itemsWithLoading[index]
                      if (item.type === 'loading') {
                        return (
                          <li
                            key={item.id}
                            className={styles.optionlistItemLoading}
                            style={{ ...style }}
                          >
                            <span className={styles.spinner} />
                          </li>
                        )
                      }
                      return (
                        <li
                          key={item.id}
                          className={styles.optionlistItem}
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
                          <div className={styles.optionListText}>
                            {item.type}:{' '}
                            {item.type === SEARCH_TYPES.flag && <CountryFlag iso={item.id} />}{' '}
                            {itemToString(item)}
                          </div>
                          {highlightedIndex === index && (
                            <span className={styles.optionlistItemPlaceholder}>
                              {getPlaceholderByType(item.type)}
                            </span>
                          )}
                        </li>
                      )
                    }}
                  </FixedSizeList>
                ) : (
                  <span className={styles.optionlistItem}>
                    There are no filters matching your query
                  </span>
                )}
              </div>
            )}
          </div>
        )
      }}
    </Downshift>
  )
}

export default Search

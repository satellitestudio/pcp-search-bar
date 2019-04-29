import React from 'react'
import Downshift, { DownshiftState, StateChangeOptions } from 'downshift'
import styles from './multi-select.module.css'
import matchSorter from 'match-sorter'
import { DataItem } from 'types/data'

interface MultiSelectProps {
  options: DataItem[]
  selectedItems: DataItem[]
  onSelectedItem(item: DataItem): void
  onRemoveItem(item: DataItem): void
}

class MultiSelect extends React.Component<MultiSelectProps> {
  input = React.createRef<any>()
  itemToString = (item: DataItem) => (item ? item.label : '')

  getItems(filter: string): DataItem[] {
    return filter
      ? matchSorter(this.props.options, filter, {
          keys: ['label'],
        })
      : this.props.options
  }

  stateReducer(
    state: DownshiftState<DataItem[]>,
    changes: StateChangeOptions<DataItem[]>
  ): StateChangeOptions<DataItem[]> {
    switch (changes.type) {
      case Downshift.stateChangeTypes.keyDownEnter:
      case Downshift.stateChangeTypes.clickItem:
        return {
          ...changes,
          highlightedIndex: state.highlightedIndex,
          isOpen: true,
          inputValue: '',
        }
      default:
        return changes
    }
  }

  handleChange = (selectedItem: DataItem) => {
    if (this.props.selectedItems.includes(selectedItem)) {
      this.props.onRemoveItem(selectedItem)
    } else {
      this.props.onSelectedItem(selectedItem)
    }
  }

  render() {
    const { selectedItems, onRemoveItem } = this.props
    return (
      <Downshift
        stateReducer={this.stateReducer}
        selectedItem={null}
        onChange={this.handleChange}
        itemToString={this.itemToString}
      >
        {(downshift: any) => {
          const {
            getInputProps,
            getToggleButtonProps,
            getMenuProps,
            isOpen,
            inputValue,
            getItemProps,
            highlightedIndex,
            toggleMenu,
          } = downshift
          return (
            <div className={styles.container}>
              <div
                onClick={() => {
                  toggleMenu()
                  !isOpen && this.input.current !== null && this.input.current.focus()
                }}
              >
                <div className={styles.selections}>
                  {selectedItems.length > 0
                    ? selectedItems.map((item: DataItem) => (
                        <div key={item.id} className={styles.selectionItem}>
                          <div>
                            <span>{item.label}</span>
                            <button
                              onClick={(e: any) => {
                                e.stopPropagation()
                                onRemoveItem(item)
                              }}
                              className={styles.selectionItemRemoveBtn}
                            >
                              𝘅
                            </button>
                          </div>
                        </div>
                      ))
                    : 'Select a value'}
                  <input
                    {...getInputProps({
                      ref: this.input,
                      onKeyUp(event: React.KeyboardEvent<HTMLInputElement>) {
                        if (event.key === 'Backspace' && !inputValue) {
                          onRemoveItem(selectedItems[selectedItems.length - 1])
                        }
                      },
                    })}
                    className={styles.inputText}
                  />
                </div>
                <button
                  {...getToggleButtonProps({
                    // prevents the menu from immediately toggling
                    // closed (due to our custom click handler above).
                    onClick(event: React.MouseEvent) {
                      event.stopPropagation()
                    },
                  })}
                  className={styles.toggleBtn}
                >
                  <svg
                    viewBox="0 0 20 20"
                    preserveAspectRatio="none"
                    width={16}
                    fill="transparent"
                    stroke="#979797"
                    strokeWidth="1.1px"
                    transform={isOpen ? 'rotate(180)' : undefined}
                  >
                    <path d="M1,6 L10,15 L19,6" />
                  </svg>
                </button>
              </div>
              <ul {...getMenuProps()} className={styles.listContainer}>
                {isOpen
                  ? this.getItems(inputValue).map((item, index) => (
                      <li
                        key={item.id}
                        {...getItemProps({ item, index })}
                        style={{
                          backgroundColor: highlightedIndex === index ? '#ccc' : 'transparent',
                          color: selectedItems.includes(item) ? '#0f0f0f' : '#000',
                        }}
                      >
                        {item.label}
                      </li>
                    ))
                  : null}
              </ul>
            </div>
          )
        }}
      </Downshift>
    )
  }
}

export default MultiSelect

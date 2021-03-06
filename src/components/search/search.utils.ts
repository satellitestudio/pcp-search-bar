import { DataSelectionGrouped, DataSelection, DataValue } from './search.types'
import { DataItem } from 'types/data'

// Hack to look like spaces but be able to identify between input spaces and label spaces
const breakingSpaceCharacter = '\u00a0'
const breakingSpaceRegex = new RegExp(breakingSpaceCharacter, 'g')
export const replaceWithBreakingSpaces = (string: string = '') =>
  string.replace(/\s/gi, breakingSpaceCharacter)
export const replaceWithNormalSpaces = (string: string = '') =>
  string.replace(breakingSpaceRegex, ' ')

export const removeSpecialCharacters = (string: string): string => {
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Escaping
  return string.replace(/[.*+?^${}/()|[\]\\]/g, '')
}

export const getInputFields = (input: string): string[] => {
  if (!input) return []
  return input
    .replace(/:/gi, ' ')
    .replace(/,/gi, ' ')
    .split(' ')
    .filter((i) => i)
}

export const parseSelectionGroupedToInput = (
  selections: DataSelectionGrouped,
  lastCharacter: string = ' '
) => {
  const selectionsLength = Object.values(selections).length - 1
  return Object.values(selections).reduce(
    (acc: string, item: DataSelection, index: number) =>
      `${acc !== '' ? `${acc} ` : ''}${item.type}:${item.values
        .map((v: DataValue) => replaceWithBreakingSpaces(v.label))
        .join(',')}${index === selectionsLength ? lastCharacter : ''}`,
    ''
  )
}

export const groupSelectionsByType = (selections: DataItem[]): DataSelectionGrouped => {
  if (selections === null) return {}
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

export const parseSelectionToInput = (
  selection: DataItem[],
  lastCharacter: string = ' '
): string => {
  const groupedSelections = groupSelectionsByType(selection)
  return parseSelectionGroupedToInput(groupedSelections, lastCharacter)
}

export const parseInputToFields = (input: string): { type: string; labels: string[] }[] => {
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

export const calculateCursorPosition = (newInput: string, oldInput: string): number => {
  if (!newInput || !oldInput) return 0
  const length = Math.max(oldInput.length, newInput.length)
  for (let i = 0; i < length; i++) {
    if (newInput[i] === undefined) {
      // is deleting characters
      return i - 1
    } else if (newInput[i] !== oldInput[i]) {
      return i
    }
  }
  return 0
}

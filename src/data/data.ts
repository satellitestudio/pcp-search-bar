import rfmosData from './rfmos'
import flagsData from './flags'
import { days, lastDate } from './dates'
import { SEARCH_TYPES } from 'components/search/search.config'
import { DataItem } from 'types/data'

const rfmos: DataItem[] = rfmosData.map((rfmo) => ({ ...rfmo, type: SEARCH_TYPES.rfmo }))
const flags: DataItem[] = flagsData.map((flag) => ({ ...flag, type: SEARCH_TYPES.flag }))
const ports: DataItem[] = Array.from(Array(500).keys()).map((i) => ({
  id: i.toString(),
  label: `Port ${i}`,
  type: SEARCH_TYPES.port,
}))
const after: DataItem[] = days.map((after) => ({ ...after, type: SEARCH_TYPES.after }))
const before: DataItem[] = days.map((before) => ({ ...before, type: SEARCH_TYPES.before }))
// Adds one more day to set the before limit
before.push({ ...lastDate, type: SEARCH_TYPES.before })

export default [...rfmos, ...flags, ...ports, ...after, ...before]

export { rfmos, flags, after, before }

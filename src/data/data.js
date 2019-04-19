import rfmos from './rfmos'
import flags from './flags'

export default [
  ...rfmos.map((r) => ({ ...r, type: 'rfmo' })),
  ...flags.map((r) => ({ ...r, type: 'flag' })),
]

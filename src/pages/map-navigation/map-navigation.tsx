import React, { useState, useEffect } from 'react'
import { RouteComponentProps } from '@reach/router'
import track from 'data/track'
import MapNavigation from 'components/map/map'

const useTimestampEvent = (track: any) => {
  const { times } = track.data.features[0].properties.coordinateProperties
  const [state, setState] = useState<{ step: number; percentage: number }>({
    step: 33,
    percentage: 0, // TODO move to 0 to 1
  })
  const { step, percentage } = state
  useEffect(() => {
    const { coordinates } = track.data.features[0].geometry
    const handleKeyDown = (event: KeyboardEvent) => {
      event.preventDefault()
      if (event.key === 'ArrowUp') {
        event.stopPropagation()
        if (percentage < 90) {
          setState({ step, percentage: percentage + 10 })
        } else {
          setState({ step: step + 1, percentage: 0 })
        }
      } else if (event.key === 'ArrowDown') {
        event.stopPropagation()
        if (percentage > 0) {
          setState({ step, percentage: percentage - 10 })
        } else {
          setState({ step: step - 1, percentage: 90 })
        }
      } else if (event.key === 'ArrowRight') {
        event.stopPropagation()
        if (step < coordinates.length - 1) {
          setState({ step: step + 1, percentage: 0 })
        }
      } else if (event.key === 'ArrowLeft') {
        event.stopPropagation()
        if (step > 0) {
          setState({ step: step - 1, percentage: 0 })
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown, true)
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true)
    }
  }, [percentage, step, track.data.features])
  return { timestamp: times[step], percentage }
}

const MapPage: React.FC<RouteComponentProps> = (): JSX.Element => {
  const { timestamp, percentage } = useTimestampEvent(track)
  return <MapNavigation timestamp={timestamp} percentage={percentage} />
}

export default MapPage

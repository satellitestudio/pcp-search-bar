import React, { useState, useEffect, useMemo } from 'react'
import { RouteComponentProps } from '@reach/router'
import MapModule from '@globalfishingwatch/map-components/components/map'
import bearing from '@turf/bearing'
import { point } from '@turf/helpers'
import { bearingToAzimuth } from '@turf/helpers'
import styles from './map-navigation.module.css'
import track from './track-data'

const tracks = [track]

const getCoordinatesFromTimestamp = (track: any, timestamp: number) => {
  const coordinates = track.data.features[0].geometry.coordinates[1]
  return [coordinates[1], coordinates[0]]
}

const getNextEventsCoordinates = (track: any, timestamp: number) => {
  const { coordinates } = track.data.features[0].geometry
  // Calculate next event to get bearing
  const nextStepCoordinates = 0 < coordinates.length - 1 ? coordinates[0 + 1] : coordinates[0]
  return [nextStepCoordinates[1], nextStepCoordinates[0]]
}

const getNextCenterPosition = (track: any, currentPosition: any, destination?: any) => {
  const index = destination === undefined ? 0 : 1
  const coordinates = track.data.features[0].geometry.coordinates[index]
  const center = [coordinates[1], coordinates[0]]
  return center
}

const useCenterByTimestamp = (track: any, timestamp: number) => {
  const { coordinates } = track.data.features[0].geometry
  const center = useMemo(() => getNextCenterPosition(track, coordinates[0]), [coordinates, track])
  // Calculate next event to get bearing
  const nextEvent = useMemo(() => getNextEventsCoordinates(track, timestamp), [timestamp, track])
  const [state, setState] = useState<{ center: number[]; bearingAngle: number }>({
    center,
    bearingAngle: bearingToAzimuth(bearing(point(center), point(nextEvent))),
  })

  useEffect(() => {
    const updateViewport = () => {
      const destination = getCoordinatesFromTimestamp(track, timestamp)
      if (state.center[0] !== destination[0] && state.center[1] !== destination[1]) {
        const center = getNextCenterPosition(track, state.center, destination)
        console.log('TCL: updateViewport -> center', center)
        const bearingAngle = bearingToAzimuth(bearing(point(center), point(nextEvent)))
        setState({ center, bearingAngle })
      } else {
        console.log('FINISHED')
      }
    }
    const requestAnimationFrame = window.requestAnimationFrame(updateViewport)
    return () => {
      window.cancelAnimationFrame(requestAnimationFrame)
    }
  }, [nextEvent, state.center, timestamp, track])
  return { ...state }
}

const viewport = { zoom: 11, center: [1.6, 105] }

const useTimestampEvent = (track: any, initialStep: number) => {
  const { times } = track.data.features[0].properties.coordinateProperties
  const [step, setStep] = useState<number>(initialStep)
  useEffect(() => {
    const { coordinates } = track.data.features[0].geometry
    const handleKeyDown = (event: KeyboardEvent) => {
      event.preventDefault()
      event.stopPropagation()
      if (event.key === 'ArrowUp') {
        if (step < coordinates.length - 1) {
          setStep(step + 1)
        }
      } else if (event.key === 'ArrowDown') {
        if (step > 0) {
          setStep(step - 1)
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown, true)
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true)
    }
  }, [step, track.data.features])
  return times[step]
}

const MapNavigation: React.FC<RouteComponentProps> = (): JSX.Element => {
  const timestamp = useTimestampEvent(track, 0)
  const { center, bearingAngle } = useCenterByTimestamp(track, timestamp)
  viewport.center = center
  const markers = useMemo(
    () => [
      {
        latitude: center[0],
        longitude: center[1],
        content: (
          <span
            className={styles.arrow}
            style={{ transform: `translate(-50%, -50%) rotate(${bearingAngle + 60}deg)` }}
          />
        ),
      },
    ],
    [bearingAngle, center]
  )
  return (
    <div className={styles.mapContainer}>
      <MapModule
        viewport={viewport}
        transitionsEnabled
        tracks={tracks}
        markers={markers}
        // onViewportChange={onViewportChange}
      />
    </div>
  )
}

export default MapNavigation

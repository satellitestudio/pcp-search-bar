import React, { useState, useEffect, useMemo } from 'react'
import { RouteComponentProps } from '@reach/router'
import MapModule from '@globalfishingwatch/map-components/components/map'
import turfBearing from '@turf/bearing'
import lineSlice from '@turf/line-slice'
import getGeometryLength from '@turf/length'
import along from '@turf/along'
import { point, bearingToAzimuth, Geometry, Position, FeatureCollection } from '@turf/helpers'
import styles from './map-navigation.module.css'
import track from './track-data'

interface CoordinateProperties {
  id: string
  type: string
  coordinateProperties: {
    times: number[]
  }
}

interface Track {
  id: string
  data: FeatureCollection<Geometry, CoordinateProperties>
  color: string
  type: string
  fitBoundsOnLoad: boolean
}

const MIN_STEP = 0.1 // distance in kilometers
const tracks = [track]

const getCoordinatesIndexByTimestamp = (track: any, timestamp: number): number => {
  const { coordinateProperties } = track.data.features[0].properties
  return coordinateProperties
    ? coordinateProperties.times.findIndex((t: number) => t === timestamp)
    : -1
}

const getEventCoordinates = (track: any, timestamp: number, offset: number = 0): any => {
  const { coordinates } = track.data.features[0].geometry
  const coordinateIndex = getCoordinatesIndexByTimestamp(track, timestamp)
  const eventCoordinates = coordinates[coordinateIndex + offset]
    ? coordinates[coordinateIndex + offset]
    : coordinates[coordinateIndex]
  return eventCoordinates
}

const getNextDestinationDistance = (track: any, timestamp: number, percentage: number): number => {
  const destinationCoordinateIndex = getCoordinatesIndexByTimestamp(track, timestamp)
  const { coordinates } = track.data.features[0].geometry
  const destinationCoordinates = coordinates[destinationCoordinateIndex]
  // TODO calculate this with a real event, not with next track step
  const followingDestinationCoordinates = coordinates[destinationCoordinateIndex + 1]
  const trackSliced = lineSlice(coordinates[0], destinationCoordinates, track.data.features[0])
  const trackLength = getGeometryLength(trackSliced)
  const followingTrackStep = lineSlice(
    destinationCoordinates,
    followingDestinationCoordinates,
    track.data.features[0]
  )
  const followingTrackStepLengh = getGeometryLength(followingTrackStep)
  return trackLength + (followingTrackStepLengh * percentage) / 100
}

const getNextPosition = (track: any, currentDistance: number, destinationDistance: number) => {
  const stepDistance = destinationDistance - currentDistance
  const stepDistanceInterpolated =
    Math.abs(stepDistance) > MIN_STEP ? stepDistance / 2 : stepDistance
  let nextStepDistance = 0
  if (stepDistance < 0) {
    nextStepDistance =
      currentDistance + stepDistance >= destinationDistance
        ? stepDistanceInterpolated
        : destinationDistance - currentDistance
  } else {
    nextStepDistance =
      currentDistance + stepDistance <= destinationDistance
        ? stepDistanceInterpolated
        : destinationDistance - currentDistance
  }
  let nextDistance = currentDistance + nextStepDistance
  const nextCenter = along(track.data.features[0], nextDistance)
  const coordinates: Position | null =
    (nextCenter && nextCenter.geometry && nextCenter.geometry.coordinates) || null
  return {
    center: coordinates !== null ? coordinates : null,
    nextDistance,
  }
}

const getBearing = (start: Position, end: Position, rounded: boolean = false): number => {
  const bearing = bearingToAzimuth(turfBearing(point(start), point(end)))
  return rounded ? Math.round(bearing) : bearing
}

const useCenterByTimestamp = (track: any, timestamp: number, percentage: number) => {
  const center = useMemo(() => getEventCoordinates(track, timestamp), [timestamp, track])
  const nextEvent = useMemo(() => getEventCoordinates(track, timestamp, 1), [timestamp, track])
  const destinationDistance = useMemo(
    () => getNextDestinationDistance(track, timestamp, percentage),
    [track, percentage, timestamp]
  )
  const bearing = getBearing(center, nextEvent)
  const [state, setState] = useState<{
    center: Position
    bearing: number
    currentDistance: number
  }>({ center, bearing, currentDistance: destinationDistance })

  useEffect(() => {
    const updateViewport = () => {
      const isGoingForward = state.currentDistance < destinationDistance
      if (state.currentDistance !== destinationDistance) {
        const { center, nextDistance } = getNextPosition(
          track,
          state.currentDistance,
          destinationDistance
        )
        if (center !== null) {
          setState((state) => {
            const bearing = getBearing(state.center, center, true)
            return {
              center,
              bearing: isGoingForward ? bearing : bearing + 180,
              currentDistance: nextDistance,
            }
          })
        }
      } else {
        setState((state) => {
          const bearing = getBearing(state.center, nextEvent)
          return {
            center: state.center,
            bearing,
            currentDistance: state.currentDistance,
          }
        })
      }
    }
    window.requestAnimationFrame(updateViewport)
  }, [destinationDistance, nextEvent, state.currentDistance, timestamp, track])
  return { ...state }
}

const viewport = { zoom: 8, center: [2, 105.5] }

const useTimestampEvent = (track: any) => {
  const { times } = track.data.features[0].properties.coordinateProperties
  const [state, setState] = useState<{ step: number; percentage: number }>({
    step: 33,
    percentage: 0,
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

const MapNavigation: React.FC<RouteComponentProps> = (): JSX.Element => {
  const { timestamp, percentage } = useTimestampEvent(track)
  const { center, bearing } = useCenterByTimestamp(track, timestamp, percentage)
  // const nextStep = useMemo(() => getEventCoordinates(track, timestamp), [timestamp])
  // viewport.center[0] = nextStep[1]
  // viewport.center[1] = nextStep[0]
  const markers = useMemo(
    () => [
      {
        latitude: center[1],
        longitude: center[0],
        content: (
          <span
            className={styles.arrow}
            style={{ transform: `translate(-50%, -50%) rotate(${bearing}deg)` }}
          />
        ),
      },
    ],
    [bearing, center]
  )
  return (
    <div className={styles.mapContainer}>
      <MapModule
        viewport={viewport}
        tracks={tracks}
        markers={markers}
        transitionsEnabled={false}
        // onViewportChange={onViewportChange}
      />
    </div>
  )
}

export default MapNavigation

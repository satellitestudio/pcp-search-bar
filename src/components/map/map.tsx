import React, { useState, useEffect, useMemo, useRef } from 'react'
import Ola from 'ola'
import MapModule from '@globalfishingwatch/map-components/components/map'
import turfBearing from '@turf/bearing'
import lineSlice from '@turf/line-slice'
import getGeometryLength from '@turf/length'
import along from '@turf/along'
import track from 'data/track'
import { point, bearingToAzimuth, Position } from '@turf/helpers'
import styles from './map.module.css'

const tracks = [track]
// Ola magic https://github.com/franciscop/ola
const positionInterpolator = Ola({ distance: 0 }, 1000)

const getCoordinatesIndexByTimestamp = (track: any, timestamp: number): number => {
  // TODO find track features
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

const getNextPosition = (track: any) => {
  const nextDistance = positionInterpolator.distance
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
  const originalDistance = useRef<number>(destinationDistance)
  const bearing = getBearing(center, nextEvent)
  const [state, setState] = useState<{
    center: Position
    bearing: number
    currentDistance: number
  }>({ center, bearing, currentDistance: destinationDistance })

  useEffect(() => {
    originalDistance.current = state.currentDistance
    positionInterpolator.set({ distance: destinationDistance })
    // We want to update the original distance only when the destination timestamp changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timestamp])

  useEffect(() => {
    const updateViewport = () => {
      const isGoingForward = state.currentDistance < destinationDistance
      if (state.currentDistance !== destinationDistance) {
        const { center, nextDistance } = getNextPosition(
          track,
          state.currentDistance,
          destinationDistance,
          originalDistance.current
        )
        if (center !== null) {
          setState((state) => {
            const bearing = getBearing(state.center, center, true)
            return {
              center,
              bearing: isGoingForward ? bearing : bearing - 180,
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

const viewport = { zoom: 8, center: [-3, 109] }

interface MapNavigationProps {
  timestamp: number
  percentage: number
}

const MapNavigation: React.FC<MapNavigationProps> = ({ timestamp, percentage }): JSX.Element => {
  const { center, bearing } = useCenterByTimestamp(track, timestamp, percentage)
  // const nextStep = useMemo(() => getEventCoordinates(track, timestamp), [timestamp])
  // viewport.center[0] = nextStep[1]
  // viewport.center[1] = nextStep[0]
  viewport.center[0] = center[1]
  viewport.center[1] = center[0]

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

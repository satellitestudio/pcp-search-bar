import React, { useState, useEffect } from 'react'
import { RouteComponentProps } from '@reach/router'
import MapModule from '@globalfishingwatch/map-components/components/map'
import bearing from '@turf/bearing'
import { bearingToAzimuth } from '@turf/helpers'
import { throttle } from 'lodash'
import styles from './map-navigation.module.css'
import track from './track-data'

const tracks = [track]

// var origin = track.data.features[0].geometry.coordinates[0]
// const iconLayer = {
//   title: 'Navigation icon layer',
//   type: 'mapboxgl',
//   id: 'navigation_icon',
//   visible: true,
//   opacity: 1,
//   gl: {
//     source: {
//       type: 'geojson',
//       data: {
//         type: 'FeatureCollection',
//         features: [
//           {
//             type: 'Feature',
//             properties: {
//               bearing: 0,
//             },
//             geometry: {
//               type: 'Point',
//               coordinates: origin,
//             },
//           },
//         ],
//       },
//     },
//     layers: [
//       {
//         id: 'navigation-icon-layer',
//         // source: 'navigation_icon',
//         type: 'symbol',
//         // paint: {
//         //   'circle-radius': 10,
//         //   'circle-color': '#007cbf',
//         // },
//         layout: {
//           'icon-image': 'port',
//           'icon-rotate': ['get', 'bearing'],
//           'icon-rotation-alignment': 'map',
//           'icon-allow-overlap': true,
//           'icon-ignore-placement': true,
//         },
//       },
//     ],
//   },
// }

const useViewportByStep = (initialViewport: object, track: any) => {
  const [step, setStep] = useState<number>(0)
  const [viewport, setViewport] = useState<any>(initialViewport)
  const { coordinates } = track.data.features[0].geometry

  useEffect(() => {
    const throttleUpdate = throttle((step) => setStep(step), 100)
    const handleKeyDown = (event: KeyboardEvent) => {
      event.preventDefault()
      event.stopPropagation()
      if (event.key === 'ArrowUp') {
        if (step < coordinates.length - 1) {
          throttleUpdate(step + 1)
        }
      } else if (event.key === 'ArrowDown') {
        if (step > 0) {
          throttleUpdate(step - 1)
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown, true)
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true)
    }
  }, [coordinates.length, step])

  useEffect(() => {
    const stepCoordinates = coordinates[step]
    const center = [stepCoordinates[1], stepCoordinates[0]]
    const newViewport = { ...viewport, center }
    setViewport(newViewport)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  const nextStepCoordinates =
    step < coordinates.length - 1 ? coordinates[step + 1] : coordinates[step]
  const nextStep = [nextStepCoordinates[1], nextStepCoordinates[0]]
  const bearingAngle = bearingToAzimuth(bearing(viewport.center, nextStep))
  return { viewport, bearing: bearingAngle }
}

const initialViewport = { zoom: 11, center: [1.6, 105] }

const SearchPage: React.FC<RouteComponentProps> = (): JSX.Element => {
  const { viewport, bearing } = useViewportByStep(initialViewport, track)

  const marker = {
    latitude: viewport.center[0],
    longitude: viewport.center[1],
    content: (
      <span
        className={styles.arrow}
        style={{ transform: `translate(-50%, -50%)  rotate(${bearing + 60}deg)` }}
      />
    ),
  }
  return (
    <div className={styles.mapContainer}>
      <MapModule
        viewport={viewport}
        transitionsEnabled
        tracks={tracks}
        markers={[marker]}
        // onViewportChange={onViewportChange}
      />
    </div>
  )
}

export default SearchPage

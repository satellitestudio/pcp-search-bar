import React from 'react'
import { RouteComponentProps } from '@reach/router'
import MapModule from '@globalfishingwatch/map-components/components/map'
import styles from './map-navigation.module.css'

const viewport = {
  zoom: 4,
  center: [-0.15591514, 51.51830379],
}

const SearchPage: React.FC<RouteComponentProps> = (): JSX.Element => {
  return (
    <div className={styles.mapContainer}>
      <MapModule viewport={viewport} />
    </div>
  )
}

export default SearchPage

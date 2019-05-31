import { Geometry, FeatureCollection } from '@turf/helpers'

export interface CoordinateProperties {
  id: string
  type: string
  coordinateProperties: {
    times: number[]
  }
}

export interface Track {
  id: string
  data: FeatureCollection<Geometry, CoordinateProperties>
  color: string
  type: string
  fitBoundsOnLoad: boolean
}

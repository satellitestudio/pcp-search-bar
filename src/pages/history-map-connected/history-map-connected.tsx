import React, { useCallback, useState } from 'react'
import { RouteComponentProps } from '@reach/router'
import Timeline from 'components/timeline/timeline'
import data from 'data/events-history'
import MapNavigation from 'components/map/map'
import track from 'data/track'

console.log('TCL: data', data)
interface DataType {
  event?: any
  rfmo?: any
}

const dataTyped: DataType = data

const getTimestampByStep = (track: any, step: number) => {
  const { times } = track.data.features[0].properties.coordinateProperties
  return times[step]
}

const HistoryScroll: React.FC<RouteComponentProps> = (): React.ReactElement => {
  const [timestamp, setTimestamp] = useState<number>(getTimestampByStep(track, 0))
  const handleTimelineChange = useCallback((timestamp) => {
    if (timestamp) {
      setTimestamp(timestamp)
    }
  }, [])

  return (
    <div className="page">
      <div className="top">top</div>
      <div className="map">
        <MapNavigation timestamp={timestamp} percentage={0} />
      </div>
      <div className="profile">
        <img
          alt="dummy"
          style={{ maxWidth: '100%' }}
          src={`http://placekitten.com/${Math.floor(100 + Math.random() * 200)}/${Math.floor(
            100 + Math.random() * 200
          )}`}
        />
        vessel profile
      </div>
      <Timeline
        events={dataTyped.event}
        rfmos={dataTyped.rfmo}
        onEventClick={handleTimelineChange}
        onChange={handleTimelineChange}
      />
    </div>
  )
}

export default HistoryScroll

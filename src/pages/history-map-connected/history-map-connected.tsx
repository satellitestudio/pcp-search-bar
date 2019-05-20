import React, { useCallback, useState, useMemo } from 'react'
import { RouteComponentProps } from '@reach/router'
import Timeline from 'components/timeline/timeline'
import data from 'data/events-history'
import MapNavigation from 'components/map/map'
import track from 'data/track'

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
  const [step, setStep] = useState<number>(0)
  const handleTimelineChange = useCallback((step) => {
    if (step) {
      setStep(step)
    }
  }, [])
  const timestamp = useMemo(() => getTimestampByStep(track, step), [step])
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
      <Timeline events={dataTyped.event} rfmos={dataTyped.rfmo} onChange={handleTimelineChange} />
    </div>
  )
}

export default HistoryScroll

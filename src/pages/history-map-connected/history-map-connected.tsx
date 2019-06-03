import React, { useCallback, useState, Fragment } from 'react'
import { RouteComponentProps } from '@reach/router'
import Sticky from 'react-stickynode'
import CountryFlag from '@globalfishingwatch/map-components/components/countryflag'
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
  const [timestamp, setTimestamp] = useState<number>(getTimestampByStep(track, 0))
  const handleTimelineChange = useCallback((timestamp) => {
    if (timestamp) {
      setTimestamp(timestamp)
    }
  }, [])

  return (
    <Fragment>
      <div className="top">top</div>
      <div className="page">
        <div className="map">
          <MapNavigation timestamp={timestamp} percentage={0} />
        </div>
        <div className="profile">
          <Sticky top={60} activeClass="profileSticky" innerZ={10}>
            <div className="profileHeader">
              <h2>
                <CountryFlag iso="IDN" />
                Vessel name
              </h2>
              <button>ⓘ</button>
            </div>
          </Sticky>
          <ul>
            <li>info: data</li>
            <li>info: data</li>
            <li>info: data</li>
            <li>info: data</li>
            <li>info: data</li>
            <li>info: data</li>
            <li>info: data</li>
            <li>info: data</li>
            <li>info: data</li>
            <li>info: data</li>
          </ul>
        </div>
        <Timeline
          events={dataTyped.event}
          rfmos={dataTyped.rfmo}
          onEventClick={handleTimelineChange}
          onChange={handleTimelineChange}
        />
      </div>
    </Fragment>
  )
}

export default HistoryScroll

import React from 'react'
import { RouteComponentProps } from '@reach/router'
import Timeline from 'components/timeline/timeline'
import data from 'data/events-history'

interface DataType {
  event?: any
  rfmo?: any
}

const dataTyped: DataType = data

const HistoryScroll: React.FC<RouteComponentProps> = (): React.ReactElement => {
  return <Timeline events={dataTyped.event} rfmos={dataTyped.rfmo} />
}

export default HistoryScroll

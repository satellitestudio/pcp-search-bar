import React, { Fragment, useState } from 'react'
import { RouteComponentProps } from '@reach/router'
import Timeline from 'components/timeline/timeline'
import data from './history-scroll.data'

interface DataType {
  event?: any
  rfmo?: any
}

const dataTyped: DataType = data

const HistoryScroll: React.FC<RouteComponentProps> = (): React.ReactElement => {
  const [visible, setVisible] = useState(true)
  return (
    <Fragment>
      {/* <button className="button" onClick={() => setVisible(visible => !visible)}>Set visible</button> */}
      {/* {visible && <Timeline />} */}
      <Timeline events={dataTyped.event} rfmos={dataTyped.rfmo} visible={visible} />
    </Fragment>
  )
}

export default HistoryScroll

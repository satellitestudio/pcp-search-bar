import React from 'react'
import { RouteComponentProps } from '@reach/router'
import styles from './history-scroll.module.css'

const HistoryScroll: React.FC<RouteComponentProps> = (): React.ReactElement => {
  return (
    <div className={styles.container}>
      <h2>@erik, feel free to modify names, folder structure and... enjoy hacking!</h2>
    </div>
  )
}

export default HistoryScroll

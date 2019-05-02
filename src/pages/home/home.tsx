import React, { Fragment } from 'react'
import { RouteComponentProps, Link } from '@reach/router'
import styles from './home.module.css'

const Home: React.FC<RouteComponentProps> = (): React.ReactElement => {
  return (
    <Fragment>
      <h1 className={styles.title}>Pew Carrier Portal prototypes</h1>
      <nav className={styles.nav}>
        <Link to={`${process.env.PUBLIC_URL}/search`}>Search</Link>
        <Link to={`${process.env.PUBLIC_URL}/scrolling`}>History scroll</Link>
      </nav>
    </Fragment>
  )
}

export default Home

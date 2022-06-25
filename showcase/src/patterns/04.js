import React from 'react'

import styles from './usage.css'
import { MediumClap, ClapIcon, ClapCount, CountTotal } from './03'

/** ====================================
    *        🔰USAGE
    Below's how a potential user
    may consume the component API
==================================== **/
const Usage = () => {
  return (
    <MediumClap className={styles.clap}>
      <ClapIcon className={styles.icon} />
      <ClapCount className={styles.count} />
      <CountTotal className={styles.total} />
    </MediumClap>
  )
}

export default Usage

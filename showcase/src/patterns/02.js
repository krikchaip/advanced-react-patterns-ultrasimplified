import React, { useState, useEffect } from 'react'
import mojs from 'mo-js'

import styles from './index.css'
import { initialState, ClapIcon, ClapCount, CountTotal } from './01'

export const useClapAnimation = () => {
  const [animationTimeline, setAnimationTimeLine] = useState(
    () => new mojs.Timeline()
  )
}

const Usage = () => {
  const [clapState, setClapState] = useState(initialState)
  const { count, countTotal, isClicked } = clapState

  const handleClapClick = () => {
    setClapState({
      count: Math.min(count + 1, MAXIMUM_USER_CLAP),
      countTotal: count < MAXIMUM_USER_CLAP ? countTotal + 1 : countTotal,
      isClicked: true
    })
  }

  return (
    <button id="clap" className={styles.clap} onClick={handleClapClick}>
      <ClapIcon isClicked={isClicked} />
      <ClapCount count={count} />
      <CountTotal countTotal={countTotal} />
    </button>
  )
}

export default Usage

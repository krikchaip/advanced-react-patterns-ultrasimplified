import React, { createContext, useState, useContext, useMemo } from 'react'

import styles from './index.css'
import {
  initialState,
  ClapIcon as BaseClapIcon,
  ClapCount as BaseClapCount,
  CountTotal as BaseCountTotal,
  MAXIMUM_USER_CLAP
} from './01'
import { useCallbackRef, useClapAnimation } from './02'

const ClapAnimationContext = createContext()

const MediumClap = ({ children }) => {
  const [clapState, setClapState] = useState(initialState)

  const parentRef = useCallbackRef(null)
  const countRef = useCallbackRef(null)
  const totalRef = useCallbackRef(null)

  const { animationTimeline } = useClapAnimation({
    parentRef: parentRef.current,
    countRef: countRef.current,
    totalRef: totalRef.current
  })

  const handleClapClick = () => {
    // 👉🏻 props from custom hook
    animationTimeline.replay()

    setClapState(prev => ({
      count: Math.min(prev.count + 1, MAXIMUM_USER_CLAP),
      countTotal:
        prev.count < MAXIMUM_USER_CLAP ? prev.countTotal + 1 : prev.countTotal,
      isClicked: true
    }))
  }

  const value = useMemo(
    () => ({
      clapState,
      countRef,
      totalRef
    }),
    [clapState, countRef, totalRef]
  )

  return (
    <ClapAnimationContext.Provider value={value}>
      <button ref={parentRef} className={styles.clap} onClick={handleClapClick}>
        {children}
      </button>
    </ClapAnimationContext.Provider>
  )
}

const ClapIcon = () => {
  const { clapState } = useContext(ClapAnimationContext)
  return <BaseClapIcon isClicked={clapState.isClicked} />
}
const ClapCount = () => {
  const { countRef, clapState } = useContext(ClapAnimationContext)
  return <BaseClapCount ref={countRef} count={clapState.count} />
}
const CountTotal = () => {
  const { totalRef, clapState } = useContext(ClapAnimationContext)
  return <BaseCountTotal ref={totalRef} countTotal={clapState.countTotal} />
}

/** ====================================
    *        🔰USAGE
    Below's how a potential user
    may consume the component API
==================================== **/
const Usage = () => {
  return (
    <MediumClap>
      <ClapIcon />
      <ClapCount />
      <CountTotal />
    </MediumClap>
  )
}

export default Usage

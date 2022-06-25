import React, { useState, useMemo } from 'react'

import styles from './index.css'
import { initialState, MAXIMUM_USER_CLAP } from './01'
import { useCallbackRef, useClapAnimation } from './02'
import { ClapAnimationContext, ClapCount, ClapIcon, CountTotal } from './03'

export const MediumClap = ({ children, values, onClap, style, className }) => {
  const [clapState, setClapState] = useState(initialState)

  const parentRef = useCallbackRef(null)
  const countRef = useCallbackRef(null)
  const totalRef = useCallbackRef(null)

  const { animationTimeline } = useClapAnimation({
    parentRef: parentRef.current,
    countRef: countRef.current,
    totalRef: totalRef.current
  })

  // 👉🏻 switch to controlled mode instead if true
  const isControlled = !!values && !!onClap

  const handleClapClick = () => {
    // 👉🏻 props from custom hook
    animationTimeline.replay()

    isControlled
      ? onClap(values)
      : setClapState(prev => ({
          count: Math.min(prev.count + 1, MAXIMUM_USER_CLAP),
          countTotal:
            prev.count < MAXIMUM_USER_CLAP
              ? prev.countTotal + 1
              : prev.countTotal,
          isClicked: true
        }))
  }

  const value = useMemo(
    () => ({
      clapState: isControlled ? values : clapState,
      countRef,
      totalRef
    }),
    [isControlled, values, clapState, countRef, totalRef]
  )

  return (
    <ClapAnimationContext.Provider value={value}>
      <button
        ref={parentRef}
        className={[styles.clap, className].join(' ')}
        onClick={handleClapClick}
        style={style}
      >
        {children}
      </button>
    </ClapAnimationContext.Provider>
  )
}

/** ====================================
    *        🔰USAGE
    Below's how a potential user
    may consume the component API
==================================== **/
const Usage = () => {
  const [clapState, setClapState] = useState(initialState)

  // 👉🏻 callback handler to control the <MediumClap>
  const handleClap = () =>
    setClapState(prev => ({
      count: Math.min(prev.count + 1, MAXIMUM_USER_CLAP),
      countTotal:
        prev.count < MAXIMUM_USER_CLAP ? prev.countTotal + 1 : prev.countTotal,
      isClicked: true
    }))

  return (
    <MediumClap values={clapState} onClap={handleClap}>
      <ClapIcon />
      <ClapCount />
      <CountTotal />
    </MediumClap>
  )
}

export default Usage

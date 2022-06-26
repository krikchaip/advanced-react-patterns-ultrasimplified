import React, { useCallback, useMemo, useState } from 'react'

import styles from './index.css'
import {
  initialState,
  ClapIcon,
  ClapCount,
  CountTotal,
  MAXIMUM_USER_CLAP
} from './01'
import { useCallbackRef, useClapAnimation } from './02'
import { useAfterMountEffect } from './03'

export const useClapState = () => {
  const [clapState, setClapState] = useState(initialState)
  const incrementCount = useCallback(
    () =>
      setClapState(prev => ({
        count: Math.min(prev.count + 1, MAXIMUM_USER_CLAP),
        countTotal:
          prev.count < MAXIMUM_USER_CLAP
            ? prev.countTotal + 1
            : prev.countTotal,
        isClicked: true
      })),
    [setClapState]
  )

  return useMemo(
    () => ({ clapState, incrementCount }),
    [clapState, incrementCount]
  )
}

/** ====================================
    *        🔰USAGE
    Below's how a potential user
    may consume the component API
==================================== **/
const Usage = () => {
  const parentRef = useCallbackRef(null)
  const countRef = useCallbackRef(null)
  const totalRef = useCallbackRef(null)

  const { animationTimeline } = useClapAnimation({
    parentRef: parentRef.current,
    countRef: countRef.current,
    totalRef: totalRef.current
  })

  const { clapState, incrementCount } = useClapState()

  useAfterMountEffect(() => {
    animationTimeline.replay()
  }, [clapState])

  return (
    <button ref={parentRef} className={styles.clap} onClick={incrementCount}>
      <ClapIcon isClicked={clapState.isClicked} />
      <ClapCount ref={countRef} count={clapState.count} />
      <CountTotal ref={totalRef} countTotal={clapState.countTotal} />
    </button>
  )
}

export default Usage

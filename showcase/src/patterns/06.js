import React, { useCallback, useMemo, useState } from 'react'

import styles from './index.css'
import {
  initialState as INITIAL_STATE,
  ClapIcon,
  ClapCount,
  CountTotal,
  MAXIMUM_USER_CLAP
} from './01'
import { useCallbackRef, useClapAnimation } from './02'
import { useAfterMountEffect } from './03'

export const useClapState = (initialState = INITIAL_STATE) => {
  const [clapState, _setClapState] = useState(initialState)
  const incrementCount = useCallback(
    () =>
      _setClapState(prev => ({
        count: Math.min(prev.count + 1, MAXIMUM_USER_CLAP),
        countTotal:
          prev.count < MAXIMUM_USER_CLAP
            ? prev.countTotal + 1
            : prev.countTotal,
        isClicked: true
      })),
    [_setClapState]
  )

  return useMemo(
    () => ({ clapState, incrementCount, _setClapState }),
    [clapState, incrementCount, _setClapState]
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

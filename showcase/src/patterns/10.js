import React, {
  useState,
  useCallback,
  useMemo,
  useReducer,
  useRef
} from 'react'

import styles from './index.css'
import userStyles from './usage.css'

import {
  ClapIcon,
  ClapCount,
  CountTotal,
  initialState as INITIAL_STATE,
  MAXIMUM_USER_CLAP
} from './01'
import { useCallbackRef, useClapAnimation } from './02'
import { useAfterMountEffect } from './03'
import { useUpload, initialState } from './09'

function clapStateReducer(state, action = {}) {
  switch (action.type) {
    case 'clap': {
      return {
        count: Math.min(state.count + 1, MAXIMUM_USER_CLAP),
        countTotal:
          state.count < MAXIMUM_USER_CLAP
            ? state.countTotal + 1
            : state.countTotal,
        isClicked: true
      }
    }
    case 'reset': {
      if (state === action.payload) return state
      return action.payload
    }
    default:
      return
  }
}

export const useClapState = (
  initialState = INITIAL_STATE,
  reducer = clapStateReducer
) => {
  const _initialState = useRef(initialState)
  const [clapState, dispatch] = useReducer(reducer, initialState)

  const incrementCount = useCallback(() => dispatch({ type: 'clap' }), [])
  const reset = useCallback(
    () => dispatch({ type: 'reset', payload: _initialState.current }),
    []
  )

  return useMemo(() => ({ clapState, incrementCount, reset }), [clapState])
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

  const [timesClapped, setTimesClapped] = useState(0)
  const overclapped = timesClapped >= 7

  const { clapState, incrementCount, reset } = useClapState(
    initialState,
    customReducer
  )
  const { isUploading, upload } = useUpload()

  useAfterMountEffect(() => {
    if (clapState.count === 0) return
    animationTimeline.replay()
  }, [clapState])

  function customReducer(state, action) {
    if (action.type === 'clap' && overclapped) {
      return state
    }

    return clapStateReducer(state, action)
  }

  function handleClap() {
    incrementCount()
    setTimesClapped(x => x + 1)
  }

  function handleReset() {
    upload(clapState)
    reset()
    setTimesClapped(0)
  }

  return (
    <div>
      <button ref={parentRef} className={styles.clap} onClick={handleClap}>
        <ClapIcon isClicked={clapState.isClicked} />
        <ClapCount ref={countRef} count={clapState.count} />
        <CountTotal ref={totalRef} countTotal={clapState.countTotal} />
      </button>
      <section>
        <button className={userStyles.resetBtn} onClick={handleReset}>
          reset
        </button>
        <pre className={userStyles.resetMsg}>{JSON.stringify(clapState)}</pre>
        {isUploading && (
          <pre className={userStyles.resetMsg}>uploading reset ...</pre>
        )}
        {overclapped && (
          <pre style={{ color: 'red' }}>
            You have clapped too much. Don't be so generous!
          </pre>
        )}
      </section>
    </div>
  )
}

export default Usage

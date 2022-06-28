import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import styles from './index.css'
import userStyles from './usage.css'

import { ClapIcon, ClapCount, CountTotal } from './01'
import { useCallbackRef, useClapAnimation } from './02'
import { useAfterMountEffect } from './03'
import { useClapState as _useClapState } from './06'

// 👉🏻 user-defined initial state for `useClapState`
const initialState = {
  count: 0,
  countTotal: 30,
  isClicked: true
}

export const useClapState = initialState => {
  const _initialState = useRef(initialState)
  const props = _useClapState(initialState)

  // 👉🏻 we actually don't want the `initialState` to change across renders.
  //   what we want is the same `initialState` that we called first time.
  const reset = useCallback(() => {
    if (props.clapState === _initialState.current) return
    props._setClapState(_initialState.current)
  }, [props._setClapState, props.clapState])

  return useMemo(() => ({ ...props, reset }), [props, reset])
}

export const usePrevious = currentValue => {
  const previousValue = useRef(currentValue)

  useEffect(() => {
    previousValue.current = currentValue
  })

  return previousValue.current
}

const useUpload = () => {
  const [isUploading, setIsUploading] = useState(false)
  const previousData = useRef()

  const upload = useCallback(
    data => {
      if (data === previousData.current) return
      previousData.current = data
      setIsUploading(true)
    },
    [setIsUploading, previousData.current]
  )

  useAfterMountEffect(() => {
    if (!isUploading) return

    const id = setTimeout(() => {
      setIsUploading(false)
    }, 1000)

    return () => clearTimeout(id)
  }, [isUploading, setIsUploading])

  return useMemo(() => ({ isUploading, upload }), [isUploading, upload])
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

  const { clapState, incrementCount, reset } = useClapState(initialState)
  const { isUploading, upload } = useUpload()

  useAfterMountEffect(() => {
    if (clapState.count === 0) return
    animationTimeline.replay()
  }, [clapState])

  function handleReset() {
    upload(clapState)
    reset()
  }

  return (
    <div>
      <button ref={parentRef} className={styles.clap} onClick={incrementCount}>
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
      </section>
    </div>
  )
}

export default Usage

import React, {
  createContext,
  useState,
  useContext,
  useMemo,
  useRef,
  useEffect
} from 'react'

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

export const MediumClap = ({ children, onClap, style, className }) => {
  const [clapState, setClapState] = useState(initialState)

  const parentRef = useCallbackRef(null)
  const countRef = useCallbackRef(null)
  const totalRef = useCallbackRef(null)

  const { animationTimeline } = useClapAnimation({
    parentRef: parentRef.current,
    countRef: countRef.current,
    totalRef: totalRef.current
  })

  // 👉🏻 notify subscribers of `clapState`
  useAfterMountEffect(() => {
    onClap && onClap(clapState)
  }, [clapState.count])

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

export const ClapIcon = ({ style, className }) => {
  const { clapState } = useContext(ClapAnimationContext)
  return (
    <BaseClapIcon
      isClicked={clapState.isClicked}
      className={className}
      style={style}
    />
  )
}
export const ClapCount = ({ style, className }) => {
  const { countRef, clapState } = useContext(ClapAnimationContext)
  return (
    <BaseClapCount
      ref={countRef}
      count={clapState.count}
      className={className}
      style={style}
    />
  )
}
export const CountTotal = ({ style, className }) => {
  const { totalRef, clapState } = useContext(ClapAnimationContext)
  return (
    <BaseCountTotal
      ref={totalRef}
      countTotal={clapState.countTotal}
      style={style}
      className={className}
    />
  )
}

export const useAfterMountEffect = (cb, deps) => {
  const mounted = useRef(true)
  return useEffect(() => {
    if (mounted.current) {
      return void (mounted.current = false)
    }

    return cb()
  }, deps)
}

/** ====================================
    *        🔰USAGE
    Below's how a potential user
    may consume the component API
==================================== **/
const Usage = () => {
  const [count, setCount] = useState(0)
  const handleClap = clapState => setCount(clapState.count)
  return (
    <div style={{ width: '100%' }}>
      <MediumClap onClap={handleClap}>
        <ClapIcon />
        <ClapCount />
        <CountTotal />
      </MediumClap>
      <div style={{ marginTop: '1rem' }}>You have clapped {count}.</div>
    </div>
  )
}

export default Usage

import React, { useState, useLayoutEffect, useMemo, useCallback } from 'react'
import mojs from 'mo-js'

import styles from './index.css'
import {
  initialState,
  ClapIcon,
  ClapCount,
  CountTotal,
  MAXIMUM_USER_CLAP
} from './01'

const TL_DURATION = 300

export const useClapAnimation = options => {
  const { parentRef, countRef, totalRef } = options || {}

  const [animationTimeline, setAnimationTimeLine] = useState(
    () => new mojs.Timeline()
  )

  useLayoutEffect(() => {
    if (![parentRef, countRef, totalRef].every(Boolean)) return

    const triangleBurst = new mojs.Burst({
      parent: parentRef,
      radius: { 50: 95 },
      count: 5,
      angle: 30,
      children: {
        shape: 'polygon',
        radius: { 6: 0 },
        scale: 1,
        stroke: 'rgba(211,84,0 ,0.5)',
        strokeWidth: 2,
        angle: 210,
        delay: 30,
        speed: 0.2,
        easing: mojs.easing.bezier(0.1, 1, 0.3, 1),
        duration: TL_DURATION
      }
    })

    const circleBurst = new mojs.Burst({
      parent: parentRef,
      radius: { 50: 75 },
      angle: 25,
      duration: TL_DURATION,
      children: {
        shape: 'circle',
        fill: 'rgba(149,165,166 ,0.5)',
        delay: 30,
        speed: 0.2,
        radius: { 3: 0 },
        easing: mojs.easing.bezier(0.1, 1, 0.3, 1)
      }
    })

    const countAnimation = new mojs.Html({
      el: countRef,
      isShowStart: false,
      isShowEnd: true,
      y: { 0: -30 },
      opacity: { 0: 1 },
      duration: TL_DURATION
    }).then({
      opacity: { 1: 0 },
      y: -80,
      delay: TL_DURATION / 2
    })

    const countTotalAnimation = new mojs.Html({
      el: totalRef,
      isShowStart: false,
      isShowEnd: true,
      opacity: { 0: 1 },
      delay: (3 * TL_DURATION) / 2,
      duration: TL_DURATION,
      y: { 0: -3 }
    })

    const scaleButton = new mojs.Html({
      el: parentRef,
      duration: TL_DURATION,
      scale: { 1.3: 1 },
      easing: mojs.easing.out
    })

    parentRef.style.transform = 'scale(1, 1)'

    const newAnimationTimeline = animationTimeline.add([
      countAnimation,
      countTotalAnimation,
      scaleButton,
      circleBurst,
      triangleBurst
    ])

    setAnimationTimeLine(newAnimationTimeline)
  }, [parentRef, countRef, totalRef])

  return useMemo(() => ({ animationTimeline }), [animationTimeline])
}

export function useCallbackRef(initialRef) {
  const [ref, setRef] = useState(initialRef)
  const callbackRef = useCallback(el => void setRef(el), [setRef])

  return useMemo(() => [ref, callbackRef], [ref, callbackRef])
}

const Usage = () => {
  const [clapState, setClapState] = useState(initialState)

  const [parentRef, parentCbRef] = useCallbackRef(null)
  const [countRef, countCbRef] = useCallbackRef(null)
  const [totalRef, totalCbRef] = useCallbackRef(null)

  const { animationTimeline } = useClapAnimation({
    parentRef,
    countRef,
    totalRef
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

  return (
    <button ref={parentCbRef} className={styles.clap} onClick={handleClapClick}>
      <ClapIcon isClicked={clapState.isClicked} />
      <ClapCount ref={countCbRef} count={clapState.count} />
      <CountTotal ref={totalCbRef} countTotal={clapState.countTotal} />
    </button>
  )
}

export default Usage

/**
 * @example https://chakra-ui.com/docs/hooks/use-checkbox
 *   `getCheckboxProps()`,
 *   `getInputProps()`,
 *   `getLabelProps()`,
 *   `htmlProps()`
 */

import React, { useMemo, useCallback } from 'react'

import styles from './index.css'
import { ClapIcon, ClapCount, CountTotal, MAXIMUM_USER_CLAP } from './01'
import { useCallbackRef, useClapAnimation } from './02'
import { useAfterMountEffect } from './03'
import { useClapState as _useClapState } from './06'

export const useClapState = () => {
  const props = _useClapState()

  // 👉🏻 props getter for any HTML element or custom component
  //   that supports `onClick` and other a11y attributes
  const getButtonProps = useCallback(
    ({ onClick, ...overrides }) => ({
      onClick: () => (props.incrementCount(), onClick()),
      'aria-pressed': props.clapState.isClicked,
      ...overrides
    }),
    [props.incrementCount, props.clapState]
  )

  // 👉🏻 props getter for any HTML element or custom component
  //   that supports `count` and other a11y attributes
  const getCounterProps = useCallback(
    ({ ...overrides }) => ({
      count: props.clapState.count,
      'aria-valuemax': MAXIMUM_USER_CLAP,
      'aria-valuemin': 0,
      'aria-valuenow': props.clapState.count,
      ...overrides
    }),
    [props.clapState]
  )

  return useMemo(
    () => ({ ...props, getButtonProps, getCounterProps }),
    [props, getButtonProps, getCounterProps]
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

  const { clapState, getButtonProps, getCounterProps } = useClapState()

  useAfterMountEffect(() => {
    animationTimeline.replay()
  }, [clapState])

  return (
    <button
      ref={parentRef}
      className={styles.clap}
      {...getButtonProps({
        onClick: () => {
          console.log('CLICKED')
        }
      })}
    >
      <ClapIcon isClicked={clapState.isClicked} />
      <ClapCount
        ref={countRef}
        {...getCounterProps({ 'data-testid': 'clap-count' })}
      />
      <CountTotal ref={totalRef} countTotal={clapState.countTotal} />
    </button>
  )
}

export default Usage

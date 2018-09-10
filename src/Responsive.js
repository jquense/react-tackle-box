import React from 'react'
import ReactDOM from 'react-dom'

const matchers = new window.Map()

const defaultBreakpointValues = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
}

export function createResponsive(breakpointValues) {
  const breakpoints = Object.keys(breakpointValues)

  const getMinQuery = breakpoint =>
    `(min-width: ${breakpointValues[breakpoint]}px)`

  const getMaxQuery = breakpoint => {
    const next = Math.min(
      breakpoints.indexOf(breakpoint) + 1,
      breakpoints.length - 1,
    )
    return `(max-width: ${breakpointValues[breakpoints[next]] - 0.2}px)`
  }

  class Responsive extends React.Component {
    static breakpoints = breakpointValues

    state = { query: '' }

    static getDerivedStateFromProps(props, prevState) {
      let query = ''

      for (const key of breakpoints) {
        if (props[`${key}Up`]) {
          query = getMinQuery(key)
        }
        if (props[`${key}Down`]) {
          query += (query ? ' and ' : '') + getMaxQuery(key)
        }
      }
      return { query, lastQuery: prevState.query }
    }

    componentWillUnmount() {
      this.unmounted = true
      if (this.unlisten) {
        this.unlisten()
        this.unlisten = null
      }
    }

    matches() {
      const { query, lastQuery } = this.state

      if (query !== lastQuery && this.unlisten) {
        this.unlisten()
        this.unlisten = null
      }

      let mql = matchers.get(query)
      if (!mql) {
        matchers.set(query, (mql = window.matchMedia(query)))
      }

      if (!this.unlisten) {
        mql.addListener(this.handleChange)
        this.unlisten = () => mql.removeListener(this.handleChange)
      }

      return mql.matches
    }

    handleChange = () => {
      if (this.unmounted) return
      ReactDOM.unstable_batchedUpdates(() => {
        if (this.unmounted) return
        this.forceUpdate()
      })
    }

    render() {
      const { children } = this.props
      const matches = this.matches()

      if (typeof children === 'function') return children(matches)
      return matches ? children : null
    }
  }

  return Responsive
}

export { defaultBreakpointValues as breakpoints }

export default createResponsive(defaultBreakpointValues)

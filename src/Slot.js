import React from 'react'
import ReactDOM from 'react-dom'
import invariant from 'invariant'

export default function createSlot() {
  let anchor = null
  let instance = null
  const set = el => {
    anchor = el
    instance && instance.forceUpdate()
  }

  class Outlet extends React.Component {
    shouldComponentUpdate() {
      return false
    }
    render() {
      return <div ref={set} {...this.props} />
    }
  }

  class Entry extends React.Component {
    componentDidMount() {
      invariant(
        !instance,
        'Only one Entry per slot can be rendered at a time.',
      )
      instance = this
    }
    componentWillUnmount() {
      instance = null
    }
    render() {
      const { children, waitForOutlet } = this.props
      const child =
        typeof children === 'function' ? children(!anchor) : children
      if (anchor) return ReactDOM.createPortal(child, anchor)
      return !waitForOutlet ? child : null
    }
  }

  Entry.propTypes = {
    waitForOutlet: () => {},
  }

  return { Entry, Outlet }
}

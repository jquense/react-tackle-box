import React from 'react'

/**
 * A Static Container for blocking updates to a React tree
 */
class StaticContainer extends React.Component {
  // eslint-disable-next-line react/prop-types
  shouldComponentUpdate({ shouldUpdate }) {
    return !!shouldUpdate
  }
  render() {
    const { children } = this.props
    return typeof children === 'function' ? children() : children
  }
}

export default StaticContainer

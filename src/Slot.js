import React from 'react'
import ReactDOM from 'react-dom'

let listener = null
const initialSlots = []
const slots = []

export class SlotProvider extends React.Component {
  constructor(...args) {
    super(...args)

    if (listener) console.warn('Oops more than one Slot Provider') //eslint-disable-line no-console

    if (initialSlots.length) initialSlots.map(slot => this.addSlot(slot))
    initialSlots.length = 0

    let timer
    listener = slot => {
      this.addSlot(slot)
      clearTimeout(timer)
      timer = setTimeout(() => this.forceUpdate())
    }
  }

  addSlot(Provider) {
    const idx = slots.length
    slots.push({
      Provider,
      context: {
        anchor: null,
        set: anchor => {
          let { Provider, context } = slots[idx]

          slots[idx] = {
            Provider,
            context: { anchor, set: context.set },
          }
          this.forceUpdate()
        },
      },
    })
  }

  render() {
    let { children } = this.props
    return slots.reduce(
      (child, { Provider, context }) => (
        <Provider value={context}>{child || children}</Provider>
      ),
      null,
    )
  }
}

export default function createSlot() {
  const { Provider, Consumer } = React.createContext({
    anchor: null,
    set: null,
  })

  class Outlet extends React.Component {
    shouldComponentUpdate() {
      return false
    }
    render() {
      return (
        <Consumer>
          {({ set }) => {
            return <div ref={set} {...this.props} />
          }}
        </Consumer>
      )
    }
  }

  const Entry = React.forwardRef(({ children, waitForOutlet }) => (
    <Consumer>
      {({ anchor }) => {
        const child =
          typeof children === 'function' ? children(!anchor) : children
        if (anchor) return ReactDOM.createPortal(child, anchor)
        return !waitForOutlet ? child : null
      }}
    </Consumer>
  ))

  listener ? listener(Provider) : slots.push(Provider)

  return { Entry, Outlet }
}

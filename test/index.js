import Enzyme from 'enzyme'
import matchMediaPolyfill from 'mq-polyfill'

import Adapter from '@monastic.panic/enzyme-adapter-react-16'

matchMediaPolyfill(window)

window.resizeTo = function resizeTo(width, height) {
  Object.assign(this, {
    innerWidth: width,
    innerHeight: height,
    outerWidth: width,
    outerHeight: height,
  }).dispatchEvent(new this.Event('resize'))
}

Enzyme.configure({ adapter: new Adapter() })

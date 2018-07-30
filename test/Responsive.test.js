import React from 'react'
import { mount } from 'enzyme'

import Responsive, { breakpoints } from '../src/Responsive'

describe('Responsive', () => {
  beforeEach(() => {
    window.resizeTo(1000, 1000)
  })
  it('exports a default implementation', async () => {
    const wrapper = mount(
      <Responsive mdUp>
        <div>hello</div>
      </Responsive>,
    )

    expect(wrapper.find('div')).toHaveLength(1)

    window.resizeTo(500, 500)

    expect(wrapper.update().find('div')).toHaveLength(0)
  })

  for (const [size, px] of Object.entries(breakpoints)) {
    it(`should match at a width >  ${px}px (${size})`, () => {
      window.resizeTo(px + 100)
      expect(
        mount(
          <Responsive {...{ [`${size}Up`]: true }}>
            <div>hello</div>
          </Responsive>,
        ).find('div'),
      ).toHaveLength(1)
    })

    px &&
      it(`should not match at a width < ${px}px (${size})`, () => {
        window.resizeTo(px - 100)
        expect(
          mount(
            <Responsive {...{ [`${size}Up`]: true }}>
              <div>hello</div>
            </Responsive>,
          ).find('div'),
        ).toHaveLength(0)
      })
  }
})

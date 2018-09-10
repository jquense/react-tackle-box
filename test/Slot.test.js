import React from 'react'
import { mount } from 'enzyme'

import createSlot from '../src/Slot'

describe('Slot', () => {
  it('should render to Outlet', async () => {
    const Slot = createSlot()

    const wrapper = mount(
      <div>
        <div className="container">
          inner
          <Slot.Entry>
            <button />
          </Slot.Entry>
        </div>
        outer
        <Slot.Outlet />
      </div>,
    )

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should throw when trying to render multiple Entries', async () => {
    const Slot = createSlot()
    jest.spyOn(console, 'error').mockImplementation(() => {})

    expect(() =>
      mount(
        <div>
          <Slot.Entry>
            <button />
          </Slot.Entry>
          <Slot.Entry>
            <button />
          </Slot.Entry>
        </div>,
      ),
    ).toThrowError()

    console.error.mockRestore()
  })
})

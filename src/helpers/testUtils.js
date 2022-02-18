// test-utils.js
import React from 'react'
import { render as rtlRender } from '@testing-library/react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

import { configureStore } from '../redux/store';


function render() {
  function Wrapper({ children }) {
    return <Provider store={configureStore}>{children}</Provider>
  }
  return rtlRender( Wrapper)
}

// re-export everything
export * from '@testing-library/react'
// override render method
export { render }
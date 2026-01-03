import React from 'react'
import ReactDOM from 'react-dom'

export const Menu = React.forwardRef(
  (
    { ...props },
    ref
  ) => (
    <div
      {...props}
      data-test-id="menu"
      ref={ref}
    />
  )
)

export const Portal = ({ children }) => {
  return typeof document === 'object'
    ? ReactDOM.createPortal(children, document.body)
    : null
}

export const Toolbar = React.forwardRef(
  (
    { ...props },
    ref
  ) => (
    <Menu
      {...props}
      ref={ref}
    />
  )
)
import React from 'react'
import { Outlet } from 'react-router-dom'
import Nav from '../Navigation/Nav/Nav'

const DashBoardLayout = () => {
  return (
    <div>
        <Nav />
        <Outlet />
    </div>
  )
}

export default DashBoardLayout
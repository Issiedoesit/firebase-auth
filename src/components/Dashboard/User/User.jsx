import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import Nav from '../../Navigation/Nav/Nav'
import Template from '../Template/Template'

const User = () => {
    const location = useLocation()
    const [currentUserName, setCurrentUserName] = useState(location.pathname.split('/')[1])
  return (
    <div>
        <Nav />
        <Template>
            You are viewing {currentUserName}'s page
        </Template>
    </div>
  )
}

export default User
import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../utils/firebase'

const GetUserDetails = () => {
    const {user, loading} = useAuthState(auth)
  return (
    <div>GetUserDetails</div>
  )
}

export default GetUserDetails
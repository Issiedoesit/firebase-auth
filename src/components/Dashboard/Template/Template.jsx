import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import {FaEdit} from 'react-icons/fa'
import { NavLink } from 'react-router-dom'
import { auth } from '../../../utils/firebase'

const Template = ({id, title, children, showPost}) => {
  const [loading] = useAuthState(auth)
  return (
    <div className='px-4 md:px-8 lg:px-10 py-5 min-h-screen' id={id}>
        {children}

        {
          loading
          &&
          showPost
          &&
          <div className='fixed bottom-6 right-4 '>
            <NavLink to={'/post/add'} className=''><div className='bg-white px-4 py-4 rounded-full drop-shadow-md'><FaEdit /></div></NavLink>
          </div>
        }
    </div>
  )
}

export default Template
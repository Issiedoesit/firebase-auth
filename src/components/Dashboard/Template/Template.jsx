import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../../utils/firebase'
import AddPostLink from '../../Elements/Links/AddPostLink'

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
          <AddPostLink />
        }
    </div>
  )
}

export default Template
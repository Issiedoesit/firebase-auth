import React from 'react'
import { NavLink } from 'react-router-dom'
import {FaEdit} from 'react-icons/fa'


const AddPostLink = () => {
  return (
    <div className='fixed bottom-6 right-4 '>
        <NavLink to={'/post/add'} className=''><div className='bg-white px-4 py-4 rounded-full drop-shadow-md'><FaEdit /></div></NavLink>
    </div>
  )
}

export default AddPostLink
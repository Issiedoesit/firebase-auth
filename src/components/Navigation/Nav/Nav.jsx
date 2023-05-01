import React, {useState, useLayoutEffect} from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { NavLink, useLocation } from 'react-router-dom'
import {FaUserCircle, FaUserEdit} from 'react-icons/fa'
import {FiSettings} from 'react-icons/fi'
import {BiLogOut, BiLogIn} from 'react-icons/bi'
import { auth } from '../../../utils/firebase'
import { SyncLoader } from 'react-spinners'

const Nav = () => {

    const [user, loading] = useAuthState(auth)
    const [profileDropDown, setProfileDropDown] = useState(false)
    const location = useLocation()

    useLayoutEffect(() => {
      
        setProfileDropDown(false)
      return () => {
        
      }
    }, [location])

    const logOut = () => {
        auth.signOut()
        if(location.pathname !== '' || location.pathname !== '/'){
            window.location.href = '/auth/login'
        }
    }
    

    console.log(user);
    return (
        <nav className='px-8 py-3 bg-slate-900 text-slate-200 flex justify-between items-center'>
            <ul className='flex gap-4 items-center'>
                <li>
                    <NavLink to={'/'} end className={({isActive})=>(isActive  ? 'border-b-2' : 'hover:border-b')} >Home</NavLink>
                </li>
                <li>
                    <NavLink to={'/dashboard/about'} className={({isActive})=>(isActive  ? 'border-b-2' : 'hover:border-b')} >About</NavLink>
                </li>
            </ul>
            {
                loading
                ?
                <SyncLoader color="#FFFFFF" />
                :
                <div>
                    {
                        user
                        ?
                        <div className=''>
                            {user && 
                            <div className='flex items-center gap-4'>
                                <div className='relative'>
                                    <button className='flex items-center' onMouseOver={()=>setProfileDropDown(true)} onClick={()=>setProfileDropDown(prevProfileDropDown => !prevProfileDropDown)}>
                                        {user.photoURL ? <img src={user.photoURL} alt={user.displayName} className="h-10 w-10 rounded-full object-cover" /> : <FaUserCircle size={'32'} />}
                                    </button>
                                    <div className={`${profileDropDown ? 'visible opacity-100 translate-y-0' : 'invisible opacity-0 translate-y-2'} transition-all z-50 ease-in-out duration-500 drop-shadow-md flex flex-col border-[1px] absolute top-[120%] right-0 bg-white rounded-lg px-2 pt-2 pb-4`}>
                                        <NavLink to={'/dashboard/settings/profile'} className={`text-slate-950 whitespace-nowrap border-b border-b-slate-950 py-2 text-sm xs:pr-0 pr-6 flex gap-4 items-center`} ><FaUserEdit /><span className='xs:hidden block'>Profile</span></NavLink>
                                        <NavLink to={'/dashboard/settings/profile'} className={`text-slate-950 whitespace-nowrap border-b border-b-slate-950 py-2 text-sm xs:pr-0 pr-6 flex gap-4 items-center`} ><FiSettings /> <span className='xs:hidden block'>Settings</span></NavLink>
                                    </div>
                                </div>
                                <button type='button'onClick={()=>logOut()} className={'bg-white rounded-lg px-2 md:px-4 py-2 text-slate-900 font-semibold flex items-center gap-2'}><span className='hidden md:block'>Logout</span> <BiLogOut size={''} /></button>
                            </div>
                            }
                        </div>
                        :
                        <NavLink to={'/auth/login'} className={'bg-white rounded-lg px-2 md:px-4 py-2 text-slate-900 font-semibold flex items-center gap-2'}><span className='hidden md:block'>Login</span><BiLogIn size={''} /></NavLink>
                    }
                </div>
            }
        </nav>
    )
}

export default Nav
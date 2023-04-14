import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { auth } from '../utils/firebase';
import Nav from '../components/Navigation/Nav/Nav'
import { CircleLoader } from 'react-spinners';


const PrivateRoute = () => {

    const [user, loading] = useAuthState(auth)
    const location = useLocation()

    if(loading) return <div className='h-screen w-full flex flex-col items-center justify-center'><CircleLoader className='text-slate-950' /><p className='text-slate-950 text-center py-4'>Hello, Lovely day isn't it ...</p></div>

    return (
      <div>
        <Nav />
        {user ? <Outlet /> : <Navigate to={'/auth/login'} state={{ from: location }}  />}
      </div>
    );
  }


export default PrivateRoute
  
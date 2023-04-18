import React from 'react'
import { MoonLoader, PuffLoader } from 'react-spinners'

const FallBackLoader = () => {
  return (
    <div className='min-h-screen flex flex-col gap-5 text-slate-950 items-center justify-center'>
        <PuffLoader className='text-slate-950' />
        Welcome ...
    </div>
  )
}

export default FallBackLoader
import React, { useState } from 'react'
import { useFormik } from 'formik'
import { NavLink } from 'react-router-dom'
import { FcGoogle } from 'react-icons/fc'
import { BsFacebook } from 'react-icons/bs'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import * as Yup from 'yup'
import YupPassword from 'yup-password'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import {auth} from '../../../utils/firebase'
YupPassword(Yup)



const Login = () => {

    const [passwordVisible, setPasswordVisible] = useState(false)


    const formik = useFormik({
        initialValues:{
            email:"",
            password:""
        },
        onSubmit: () => {
            console.log(formik.values)
        },
        validationSchema:Yup.object({
            email: Yup
                .string()
                .email('Invalid email address')
                .required('Email Required'),
            password: Yup
                .string()
                .required('Password Required')
                .min(8, 'Password must be up to eight (8) characters')
                .minLowercase(1, 'Password must contain at least 1 lower case letter')
                .minUppercase(1, 'Password must contain at least 1 upper case letter')
                .minNumbers(1, 'Password must contain at least 1 number')
                .minSymbols(1, 'Password must contain at least 1 special character')
                
        })
        
    })

    console.log(formik.values)
    console.log(formik.touched)

    const googleProvider = new GoogleAuthProvider()

    const GoogleLogin = async () => {
        try{
            const result = await signInWithPopup(auth, googleProvider)
            console.log(result.user)
        }catch{
            console.error(error)
        }
    }

  return (
    <div className='min-h-screen py-20 w-full relative flex flex-row items-center justify-center px-4 sm:px-8'>
        <div className="relative px-10 py-8 text-slate-800 rounded-3xl drop-shadow-lg max-w-lg w-full md:w-3/5 bg-white">
            <h1 className='text-2xl text-center py-2 font-bold'>Login</h1>

            <form action="" method='post' onSubmit={formik.handleSubmit} className={'flex flex-col w-full gap-4 pt-6'}>

                <button type='button' onClick={GoogleLogin} className='border border-slate-800 flex items-center gap-4 text-center rounded-md w-full px-4 py-2'>
                    <FcGoogle size={'24'} />
                    <p className='w-full h-full font-semibold text-lg'>Login with Google</p>
                </button>
                <button type='button' className='border border-slate-800 flex items-center gap-4 text-center rounded-md w-full px-4 py-2'>
                    <BsFacebook className='text-blue-800' size={'24'} />
                    <p className='w-full h-full font-semibold text-lg'>Login with Facebook</p>
                </button>

                <div className='text-sm flex gap-1 items-center py-4'>
                    <div className='w-full h-[1px] bg-slate-500'></div>
                    <p>or</p>
                    <div className='w-full h-[1px] bg-slate-500'></div>
                </div>

                <fieldset className='flex flex-col gap-2'>
                    <label htmlFor="email" className='font-semibold'>Email</label>
                    <input 
                        type="email" 
                        name='email' 
                        id='email'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        required 
                        value={formik.values.email}
                        placeholder='example@example.com' 
                        className='border border-slate-800 rounded-md w-full px-4 py-2' />
                        {formik.touched.email && formik.errors.email && <p className='text-xs py-0.5 text-red-500'>{formik.errors.email}</p>}
                </fieldset>

                <fieldset className='flex flex-col gap-2'>
                    <p className='font-semibold'>Password</p>
                    <label htmlFor="password" className='flex gap-4 w-full border px-4 py-2 focus-within:outline focus-within:outline-[1px] border-slate-800 rounded-md'>
                        <input 
                            type={passwordVisible ? 'text' : 'password'} 
                            name='password' 
                            id='password' 
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            required 
                            value={formik.values.password}
                            placeholder='example@example.com' 
                            className='focus:outline-none w-full' />
                        <button type='button' onClick={()=>setPasswordVisible(prevPasswordVisible => !prevPasswordVisible)}>{passwordVisible ? <FaEyeSlash /> : <FaEye />}</button>
                    </label>
                    {formik.touched.password && formik.errors.password && <p className='text-xs py-0.5 text-red-500'>{formik.errors.password}</p>}
                </fieldset>

                <div className='pt-2 pb-6 w-full flex justify-center'>
                    <button type='submit' className='font-sm rounded-lg bg-slate-800 text-white px-4 py-2 w-fit mx-auto'>Login</button>
                </div>
            </form>
            <div className='text-center'>
                <NavLink to={'/auth/signup'} className="text-sm">Don't have an account? <span className='underline underline-offset-2 text-blue-400'>Register with us</span></NavLink>
            </div>
        </div>
    </div>
  )
}

export default Login
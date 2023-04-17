import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import { Navigate, NavLink, redirect, useNavigate } from 'react-router-dom'
import { FcGoogle } from 'react-icons/fc'
import { BsFacebook } from 'react-icons/bs'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import * as Yup from 'yup'
import YupPassword from 'yup-password'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import {auth, db} from '../../../utils/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore'
YupPassword(Yup)

const SignUp = () => {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [cPasswordVisible, setCPasswordVisible] = useState(false)
  const [signingUp, setSigningUp] = useState(false)
  const [isUnique, setIsUnique] = useState(true)
    const [user, loading] = useAuthState(auth)
    const navigate = useNavigate()

    
    const formik = useFormik({
      initialValues:{
          email:"",
          password:"",
          confirmPassword:"",
          firstName:"",
          lastName:"",
          userName:"",
          bio:"",
          location:""
      },
      onSubmit: () => {
          console.log(formik.values)
      },
      validationSchema:Yup.object({
          firstName : Yup.string()
          .min(2, 'Firstname should be two or more characters')
          .required('Firstname required'),
          lastName : Yup.string()
          .min(2, 'LastName should be two or more characters')
          .required('LastName required'),
          userName : Yup.string()
          .min(2, 'Username should be two or more characters')
          .required('Username required'),
          bio : Yup.string()
          .min(2, 'Bio should be two or more characters')
          .required('Bio required'),
          location : Yup.string()
          .min(2, 'Location should be two or more characters')
          .required('Location required'),
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
              .minSymbols(1, 'Password must contain at least 1 special character'),
          confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match')
              
      })
      
  })


  // Check for username uniqueness whenever the username changes
  useEffect(() => {
    if (formik.values.userName) {
      // Check if a username is already in use
        async function isUsernameUnique(username) {
            const userRef =  query(collection(db, 'users'), where('username', '==', username) )
            const userSnapshot =  getDocs(userRef)
            console.log(userSnapshot);
            await userSnapshot
            userSnapshot.then((snap)=>{
                console.log(snap.empty);
                if(snap.empty){
                    setIsUnique(true)
                }else{
                    setIsUnique(false)
                }
            }).catch((err)=>{
                console.error("Username search", err)
            })
        }
        isUsernameUnique(formik.values.userName)
    }
  }, [formik.values.userName])

  const emailSignUp = () => {
    if(formik.errors.email || formik.errors.firstName || isUnique ==  false || formik.errors.lastName || formik.errors.bio || formik.errors.location || formik.errors.password || formik.errors.password || formik.values.password !== formik.values.confirmPassword){
      return
    }
    createUserWithEmailAndPassword(auth, formik.values.email, formik.values.password).then((result)=>{
        setSigningUp(true)
        toast.success("You signed up successfully! Updating details...", {
            position: toast.POSITION.TOP_RIGHT
        })
        if(result.user){
            updateProfile(result.user, {displayName: `${formik.values.firstName} ${formik.values.lastName}`})
            setDoc(doc(db, "users", result.user.uid), {
                username: formik.values.userName,
                bio: formik.values.bio,
                location: formik.values.location,
                photo:"",
                firstName:formik.values.firstName,
                lastName:formik.values.lastName,
                fullName:`${formik.values.firstName} ${formik.values.lastName}`,
                email:formik.values.email
              });
              toast.success('Details updated!',{
                position: toast.POSITION_TOP_RIGHT
              })
        }
        setSigningUp(false)
        console.log(result.user);
           setTimeout(() => {
            navigate('/')
        }, 3000);
    }).catch((err)=>{
        console.error(err);
        toast.error(err.message,{
            position: toast.POSITION_TOP_RIGHT
          })
    })
    console.log(formik.values);
  }


  return (
    <div className='min-h-screen py-20 w-full relative flex flex-row items-center justify-center px-4 sm:px-8'>
        <div className="relative px-10 py-8 text-slate-800 rounded-3xl drop-shadow-lg max-w-lg w-full md:w-3/5 bg-white">
            <h1 className='text-2xl text-center py-2 font-bold'>Sign up</h1>

            <form action="" method='post' onSubmit={formik.onSubmit} className={'flex flex-col w-full gap-4 pt-6'}>

                <button type='button' className='border border-slate-800 flex items-center gap-4 text-center rounded-md w-full px-4 py-2'>
                    <FcGoogle size={'24'} />
                    <p className='w-full h-full font-semibold text-lg'>Sign up with Google</p>
                </button>
                <button type='button' className='border border-slate-800 flex items-center gap-4 text-center rounded-md w-full px-4 py-2'>
                    <BsFacebook className='text-blue-800' size={'24'} />
                    <p className='w-full h-full font-semibold text-lg'>Sign up with Facebook</p>
                </button>

                <div className='text-sm flex gap-1 items-center py-4'>
                    <div className='w-full h-[1px] bg-slate-500'></div>
                    <p>or</p>
                    <div className='w-full h-[1px] bg-slate-500'></div>
                </div>

                <fieldset className='flex flex-col gap-2'>
                    <label htmlFor="firstName" className='font-semibold'>First Name</label>
                    <input 
                        type="text" 
                        name='firstName' 
                        id='firstName'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        required 
                        value={formik.values.firstName}
                        placeholder='Jane' 
                        className='border border-slate-800 rounded-md w-full px-4 py-2' />
                        {formik.touched.firstName && formik.errors.firstName && <p className='text-xs py-0.5 text-red-500'>{formik.errors.firstName}</p>}
                </fieldset>

                <fieldset className='flex flex-col gap-2'>
                    <label htmlFor="lastName" className='font-semibold'>Last Name</label>
                    <input 
                        type="text" 
                        name='lastName' 
                        id='lastName'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        required 
                        value={formik.values.lastName}
                        placeholder='Doe' 
                        className='border border-slate-800 rounded-md w-full px-4 py-2' />
                        {formik.touched.lastName && formik.errors.lastName && <p className='text-xs py-0.5 text-red-500'>{formik.errors.lastName}</p>}
                </fieldset>

                <fieldset className='flex flex-col gap-2'>
                    <label htmlFor="userName" className='font-semibold'>Unique username</label>
                    <input 
                        type="text" 
                        name='userName' 
                        id='userName'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        required 
                        value={formik.values.userName}
                        placeholder='Janeylu' 
                        className='border border-slate-800 rounded-md w-full px-4 py-2' />
                        {formik.touched.userName && formik.errors.userName && <p className='text-xs py-0.5 text-red-500'>{formik.errors.userName}</p>}
                        {!isUnique && <p className='text-xs py-0.5 text-red-500'>Username is already taken.</p>}
                </fieldset>

                <fieldset className='flex flex-col gap-2'>
                    <label htmlFor="location" className='font-semibold'>Location</label>
                    <input 
                        type="text" 
                        name='location' 
                        id='location'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        required 
                        value={formik.values.location}
                        placeholder='Lagos, Nigeria' 
                        className='border border-slate-800 rounded-md w-full px-4 py-2' />
                        {formik.touched.location && formik.errors.location && <p className='text-xs py-0.5 text-red-500'>{formik.errors.location}</p>}
                </fieldset>

                <fieldset className='flex flex-col gap-2'>
                    <label htmlFor="email" className='font-semibold'>Bio</label>
                    <textarea 
                        name='bio' 
                        id='bio'
                        rows={'4'}
                        maxLength={250}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        required 
                        value={formik.values.bio}
                        placeholder='Jane' 
                        className='border border-slate-800 rounded-md w-full px-4 py-2 resize-none' 
                    >
                    </textarea>
                        {formik.touched.bio && formik.errors.bio && <p className='text-xs py-0.5 text-red-500'>{formik.errors.bio}</p>}
                </fieldset>

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

                <fieldset className='flex flex-col gap-2'>
                    <p className='font-semibold'>Confirm Password</p>
                    <label htmlFor="confirmPassword" className='flex gap-4 w-full border px-4 py-2 focus-within:outline focus-within:outline-[1px] border-slate-800 rounded-md'>
                        <input 
                            type={cPasswordVisible ? 'text' : 'password'} 
                            name='confirmPassword' 
                            id='confirmPassword' 
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            required 
                            value={formik.values.confirmPassword}
                            placeholder='example@example.com' 
                            className='focus:outline-none w-full' />
                        <button type='button' onClick={()=>setCPasswordVisible(prevCPasswordVisible => !prevCPasswordVisible)}>{cPasswordVisible ? <FaEyeSlash /> : <FaEye />}</button>
                    </label>
                    {formik.touched.confirmPassword && formik.errors.confirmPassword && <p className='text-xs py-0.5 text-red-500'>{formik.errors.confirmPassword}</p>}
                </fieldset>

                <div className='pt-2 pb-6 w-full flex justify-center'>
                    <button type='button' onClick={emailSignUp} disabled={signingUp} className='font-sm rounded-lg bg-slate-800 text-white px-4 py-2 w-fit mx-auto'>Sign Up</button>
                </div>
            </form>
            <div className='text-center'>
                <NavLink to={'/auth/login'} className="text-sm">Have an account? <span className='underline underline-offset-2 text-blue-400'>Log in</span></NavLink>
            </div>
        </div>
        <ToastContainer autoClose={2000} />
    </div>
  )
}

export default SignUp
import React, { useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../../utils/firebase'
import Template from '../../Dashboard/Template/Template'
import {FaUserCircle} from 'react-icons/fa'
import {BiEdit} from 'react-icons/bi'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast, ToastContainer } from 'react-toastify'
import { updateProfile } from 'firebase/auth'
import { doc, setDoc } from "firebase/firestore"
import { db } from '../../../utils/firebase'


const Profile = () => {
  const [user, loading] = useAuthState(auth)
  const [editImage, setEditImage] = useState(false)

  const formik = useFormik({
    initialValues:{
      photo:"",
      username:"",
      bio:"",
      location:""
    },
    validationSchema : Yup.object({
      photo: Yup.string()
      .required('Url required')
      .url('Please enter valid url'),
      username: Yup.string().min(1, 'Please select a valid username')
    })
  })

  const handlePhotoChange = () => {
    updateProfile(auth.currentUser, {
      photoURL: formik.values.photo
    }).then(() => {
      toast.success('Image uploaded!',{
        position: toast.POSITION_TOP_RIGHT
      })
      setTimeout(() => {
        setEditImage(false)
      }, 2500);
    }).catch((error) => {
      toast.success(error.message,{
        position: toast.POSITION_TOP_RIGHT
      })
    });
  }

  const handleDetailsChange = async () => {
    try{
      await setDoc(doc(db, "users", user.uid), {
        username: formik.values.username,
        bio: formik.values.bio,
        location: formik.values.location
      });
      toast.success('Details updated!',{
        position: toast.POSITION_TOP_RIGHT
      })
    }catch{
      console.error(err);
      toast.error(err.message,{
        position: toast.POSITION_TOP_RIGHT
      })
    }
  }

  return (
    <Template>
      <div className='flex flex-col py-20'>
          <div className='relative h-fit w-fit mx-auto'>
              {user.photoURL ?
                  <img src={user.photoURL} alt={user.displayName} className={`rounded-full h-32 w-32 mx-auto object-cover`} />
                  :
                  <FaUserCircle className='h-32 w-32 mx-auto' />
              }
              <button type='button' onClick={()=>setEditImage(true)} className='absolute bottom-2 right-0 bg-white p-1 drop-shadow-md rounded-md'>
                <BiEdit size={'20'} />
              </button>
          </div>
          {editImage && <div className='max-w-lg w-full mx-auto'>
              <fieldset className='flex flex-col gap-2 pt-10 pb-5'>
              <label htmlFor="photo">Enter Url</label>
              <input type="text" name='photo' id='photo' value={formik.values.photo} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder='Enter image url' className='rounded-lg border-[1px] border-slate-950 px-4 py-2' />
              {formik.touched.photo && formik.errors.photo && <p className='text-xs py-0.5 text-red-500'>{formik.errors.photo}</p>}
            </fieldset>
            <div className='flex py-3 justify-end'>
              <button type='button' onClick={handlePhotoChange} className='font-sm rounded-lg bg-slate-950 text-white px-4 py-2 w-fit'>Save</button>
            </div>
          </div>
          }
          <div className='max-w-lg w-full mx-auto flex flex-col gap-4 pt-10'>
              <fieldset className='flex flex-col gap-2 pb-5'>
                <label htmlFor="username">Enter Username</label>
                <input type="text" name='username' id='username' value={formik.values.username} onChange={formik.handleChange} onBlur={formik.handleBlur}  placeholder='Enter your Username' className='rounded-lg border-[1px] border-slate-950 px-4 py-2' />
                {/* {formik.touched.photo && formik.errors.photo && <p className='text-xs py-0.5 text-red-500'>{formik.errors.photo}</p>} */}
              </fieldset>
              <fieldset className='flex flex-col gap-2 pb-5'>
                  <label htmlFor="bio">Enter Bio</label>
                  <textarea name='bio' id='bio' value={formik.values.bio} onChange={formik.handleChange} onBlur={formik.handleBlur} rows={'5'} maxLength={250} placeholder='Enter your bio' className='resize-none rounded-lg border-[1px] border-slate-950 px-4 py-2' ></textarea>
                  {/* {formik.touched.photo && formik.errors.photo && <p className='text-xs py-0.5 text-red-500'>{formik.errors.photo}</p>} */}
              </fieldset>
              <fieldset className='flex flex-col gap-2 pb-5'>
                <label htmlFor="location">Enter Location</label>
                <input type="text" name='location' id='location' value={formik.values.location} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder='Enter your location e.g California, USA' className='rounded-lg border-[1px] border-slate-950 px-4 py-2' />
                {/* {formik.touched.photo && formik.errors.photo && <p className='text-xs py-0.5 text-red-500'>{formik.errors.photo}</p>} */}
              </fieldset>
            <div className='flex py-3 justify-end'>
              <button type='button' onClick={handleDetailsChange} className='font-sm rounded-lg bg-slate-950 text-white px-4 py-2 w-fit'>Save</button>
            </div>
          </div>
      </div>

      <ToastContainer autoClose={1500} />
    </Template>
  )
}

export default Profile
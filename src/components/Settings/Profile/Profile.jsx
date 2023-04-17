import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../../utils/firebase'
import Template from '../../Dashboard/Template/Template'
import {FaUserCircle} from 'react-icons/fa'
import {BiEdit} from 'react-icons/bi'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast, ToastContainer } from 'react-toastify'
import { updateProfile } from 'firebase/auth'
import {  collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore"
import { db } from '../../../utils/firebase'


const Profile = () => {
  const [user, loading] = useAuthState(auth)
  const [isUnique, setIsUnique] = useState(true)
  const [editImage, setEditImage] = useState(false)
  const [userDetails, setUserDetails] = useState({

  })
  const [editDetails, setEditDetails] = useState(false)
  const [noBio, setNoBio] = useState(false)

  const formik = useFormik({
    initialValues:{
      photo:auth.currentUser.photoURL || null,
      username: "",
      bio:"",
      location:""
    },
    validationSchema : Yup.object({
      photo: Yup.string()
      .required('Url required')
      .url('Please enter valid url'),
      username:  Yup.string()
          .min(2, 'Username should be two or more characters')
          .required('Username required'),
      bio : Yup.string()
      .min(2, 'Bio should be two or more characters')
      .required('Bio required'),
      location : Yup.string()
      .min(2, 'Location should be two or more characters')
      .required('Location required'),
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
      updateDoc(doc(db, "users", user.uid), {
        photo:auth.currentUser.photoURL
      })
    }).catch((error) => {
      toast.success(error.message,{
        position: toast.POSITION_TOP_RIGHT
      })
    });
  }

  useEffect(() => {
    if (formik.values.username) {
      // Check if a username is already in use
        async function isUsernameUnique(username) {
            const userRef =  query(collection(db, 'users'), where('username', '==', username) )
            const userSnapshot =  getDocs(userRef)
            console.log(userSnapshot);
            await userSnapshot
            userSnapshot.then((snap)=>{
                console.log(snap.empty);
                !snap.empty && console.log("snap id",snap.docs[0].id);
                console.log('UID', auth.currentUser.uid);
                if(snap.empty){
                    setIsUnique(true)
                }else if(snap.empty == false && snap.docs[0].id != auth.currentUser.uid){
                    setIsUnique(false)
                }
            })
        }
        isUsernameUnique(formik.values.username)
    }
  }, [formik.values.username])

  const handleDetailsChange = async () => {

    if(isUnique == false || formik.errors.username || formik.errors.location || formik.errors.bio){
      return
    }

    try{
      await updateDoc(doc(db, "users", user.uid), {
        // ...formik.values,
        username: formik.values.username,
        bio: formik.values.bio,
        location: formik.values.location
      });
      console.log("Detail update data", "=>", formik.values);
      setEditDetails(false)
      toast.success('Details updated!',{
        position: toast.POSITION_TOP_RIGHT
      })
      getUserDetails()
    }catch (err){
      console.error(err);
      toast.error(err.message,{
        position: toast.POSITION_TOP_RIGHT
      })
    }
  }
  // console.log(userDetails);

  const getUserDetails = async () => {
    const detailRef = doc(db, "users", user.uid);
    const detailSnap = await getDoc(detailRef);

    if (detailSnap.exists()) {
      console.log("Document data:", detailSnap.data());
      formik.setValues({...formik.values, ...userDetails})
      setNoBio(false)
    } else {
      // detailSnap.data() will be undefined in this case
      console.log("No such document!");
      setNoBio(true)
    }

    try{
      setUserDetails({...detailSnap.data()})
      formik.setValues({...formik.values, ...userDetails})
    }catch (err){
      console.error(err);
    }
    
  }

  const handleEditButton = () => {
    setEditDetails(true)
    formik.setValues({...formik.values, ...userDetails})
    console.log(formik.values);
  }

  useEffect(() => {
    getUserDetails()
  
    return () => {
      
    }
  }, [])
  

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
          <div className='mx-auto max-w-lg w-full'>
            {editImage && <div className='w-full mx-auto'>
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
          </div>
          {(editDetails == true) && 
            <div className="flex flex-col gap-4 mx-auto max-w-lg w-full">
              <div className='w-full mx-auto flex flex-col gap-4 pt-10'>
                  <fieldset className='flex flex-col gap-2 pb-5'>
                    <label htmlFor="username">Enter Username</label>
                    <input type="text" name='username' id='username' value={formik.values.username} onChange={formik.handleChange} onBlur={formik.handleBlur}  placeholder='Enter your Username' className='rounded-lg border-[1px] border-slate-950 px-4 py-2' />
                    {formik.touched.username && formik.errors.username && <p className='text-xs py-0.5 text-red-500'>{formik.errors.username}</p>}
                    {!isUnique && <p className='text-xs py-0.5 text-red-500'>Username is already taken.</p>}
                  </fieldset>
                  <fieldset className='flex flex-col gap-2 pb-5'>
                      <label htmlFor="bio">Enter Bio</label>
                      <textarea name='bio' id='bio' value={formik.values.bio}  onChange={formik.handleChange} onBlur={formik.handleBlur} rows={'5'} maxLength={250} placeholder='Enter your bio' className='resize-none rounded-lg border-[1px] border-slate-950 px-4 py-2' ></textarea>
                      {formik.touched.bio && formik.errors.bio && <p className='text-xs py-0.5 text-red-500'>{formik.errors.bio}</p>}
                  </fieldset>
                  <fieldset className='flex flex-col gap-2 pb-5'>
                    <label htmlFor="location">Enter Location</label>
                    <input type="text" name='location' id='location' value={formik.values.location} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder='Enter your location e.g California, USA' className='rounded-lg border-[1px] border-slate-950 px-4 py-2' />
                    {formik.touched.location && formik.errors.location && <p className='text-xs py-0.5 text-red-500'>{formik.errors.location}</p>}
                  </fieldset>
                <div className='flex py-3 justify-end'>
                  <button type='button' onClick={handleDetailsChange} className='font-sm rounded-lg bg-slate-950 text-white px-4 py-2 w-fit'>Save</button>
                </div>
              </div>
            </div>
          }

          

          {(editDetails == false) &&
          <div className='flex flex-col gap-4 mx-auto py-4 text-center max-w-lg'>
            <h2 className='text-2xl font-bold text-slate-970'>@{userDetails.username}</h2>
            <h2 className='text-lg font-bold text-slate-970'>{user.displayName}</h2>
            <p className='text-base text-slate-700'>{userDetails.bio}</p>
            <p className='text-base text-slate-400'>{userDetails.location}</p>
            <div><div className='flex py-3 justify-end'>
                <button type='button' onClick={()=>handleEditButton()} className='font-sm rounded-lg bg-slate-950 text-white px-4 py-2 w-fit'>{noBio ? 'Add details' : 'Edit'}</button>
              </div></div>
          </div>
          }
      </div>

      <ToastContainer autoClose={1500} />
    </Template>
  )
}

export default Profile
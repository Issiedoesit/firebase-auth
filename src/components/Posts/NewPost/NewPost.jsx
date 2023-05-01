import { useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'
import {FcAddImage} from 'react-icons/fc'
import {FaPenFancy} from 'react-icons/fa'
import {ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { db, auth, storage } from '../../../utils/firebase'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css';
import { addDoc, collection, serverTimestamp, doc } from 'firebase/firestore'
import Template from '../../Dashboard/Template/Template'
import { Navigate, useNavigation } from 'react-router-dom'
import slugify from 'react-slugify';
import { SHA256 } from 'crypto-js'


const NewPost = () => {

   const [banner, setBanner] = useState('') 
   const [uploadProgress, setUploadProgress] = useState(null) 
   const [postLoading, setPostLoading] = useState(false) 
//    const navigate = useNavigation()
   const [data, setData] = useState({
        title:"",
        post:"",
   })

   

   const MAX_FILE_SIZE = 1024000; //1000KB

    const validFileExtensions = { image: ['jpg', 'gif', 'png', 'jpeg', 'svg', 'webp'] };

    function isValidFileType(fileName, fileType) {
    return fileName && validFileExtensions[fileType].indexOf(fileName.split('.').pop()) > -1;
    }

   const formik = useFormik({
       initialValues:{
            title:"",
            post:""
       },
       validationSchema: Yup.object({
           title: Yup.string()
           .required('Title is required')
           .min(4, 'Title must not be less than 4 characters'),
           post: Yup.string()
           .required('Post is required')
           .min(4, 'Post must not be less than 4 characters'),
       })
   })

   useEffect(() => {
     const uploadFile = () => {
        const uniqueName = new Date().getTime() + banner.name
        const storageRef = ref(storage, uniqueName)

        const uploadTask = uploadBytesResumable(storageRef, banner)

        uploadTask.on('state_changed',
        (snapshot) => {
            const progress = snapshot.bytesTransferred / snapshot.totalBytes * 100
            setUploadProgress(progress)
            switch (snapshot.state){
                case "running":
                    console.log('Upload is running');
                    break;
                case "paused":
                    console.log('Upload is paused');
                    break;
                case "success":
                    console.log('Upload is successful');
                    break;
                default:
                    break;
            }
        },
        (error)=>{console.error(error);},
        ()=>{
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
                toast.success('Upload done',{
                    position: toast.POSITION_TOP_RIGHT
                })
                console.log('File is available at:' + downloadURL);
                setData((prev)=> ({...prev, bannerImage:downloadURL}))
            })
        }
        )
     }

     banner && uploadFile()
   
     return () => {
       
     }
   }, [banner])
   

   console.log(data);

   function generateUniqueId() {
    const timestamp = new Date().getTime(); // Get the current timestamp in milliseconds
    const randomString = Math.random().toString(36).substring(2); // Generate a random string
    const input = import.meta.env.VITE_CRYPTO_SECRET + timestamp + randomString; // Concatenate the secret key, timestamp, and random string
    const hash = SHA256(input).toString(); // Generate the SHA-256 hash of the input
    return hash.substring(0, 8); // Return the first 8 characters of the hash
  }

   const createPost = async () => {
    try{
        if(!banner){
            toast.error('No Image', {
                position: toast.POSITION_TOP_RIGHT
            })
            return
        }
        if(!data.bannerImage){
            toast.error('No Image', {
                position: toast.POSITION_TOP_RIGHT
            })
            return
        }
        if(formik.errors.title){
            toast.error('No Title', {
                position: toast.POSITION_TOP_RIGHT
            })
            return
        }
        if(formik.errors.post){
            toast.error('No Post', {
                position: toast.POSITION_TOP_RIGHT
            })
            return
        }

            // console.log(data);
            if(formik.values.post && banner && formik.values.title){
                setPostLoading(true)
                const slug = `${slugify(formik.values.title)}-${generateUniqueId()}`;
                console.log(slug);
                setData({...data, title: formik.values.title, post:formik.values.post})
                await addDoc(collection(db, "posts"), {
                    ...data,
                    title: formik.values.title,
                    post: formik.values.post,
                    authorId:auth.currentUser.uid,
                    timeStamp: serverTimestamp(),
                    createdAt: new Date(),
                    isFeatured:false,
                    slug:slug
                });
                const userRef = doc(db, 'users', auth.currentUser.uid)
                console.log("UserRef", "=>" , userRef);
                console.log("New post Data", "=>", data);
                setPostLoading(false)
                setData({})
                setBanner('')
                formik.resetForm()
                toast.success('Post added successfully!',{
                    position: toast.POSITION_TOP_RIGHT
                })
                setTimeout(() => {
                    window.location.href = '/'
                }, 2500);
            }
    }catch (err) {
        console.error(err);
        toast.error(err.message,{
          position: toast.POSITION_TOP_RIGHT
        })
    }
   }

  return (
    <Template>
        <div className='flex flex-col min-h-screen mx-auto justify-center gap-4 max-w-lg py-20'>
            <div className='text-3xl pb-10 font-bold text-center'><h1>Add new blog</h1></div>
            <fieldset className='w-full'>
                <p className='text-left pb-2'>Add banner image</p>
                <label htmlFor="bannerImg" className={`flex py-4 rounded-lg border-[1px] border-slate-950 px-4 w-full ${((uploadProgress !== null && uploadProgress < 100) || postLoading) && 'pointer-events-none'}`}>
                    {
                        banner
                        ?
                        <img src={URL.createObjectURL(banner)} alt={formik.values.title} className={'rounded-lg w-full h-full aspect-video object-cover'} />
                        :
                        <FcAddImage size={'80'} className={'mx-auto'} />
                    }
                </label>
                <input readOnly={(uploadProgress !== null && uploadProgress < 100) || postLoading} type="file" name='bannerImg' id='bannerImg' onChange={(e)=>setBanner(e.target.files[0])} className='hidden' />
                <div className='py-2'>
                {uploadProgress > 0 && uploadProgress < 100 && <div className='w-full rounded-lg border-[1px] border-green-500 bg-white'><div className='py-0.5 rounded-lg bg-green-500 text-white text-xs text-right px-2' style={{width:`${uploadProgress}%`}}>{Math.round(uploadProgress)}%</div></div>}
                </div>
            </fieldset>
            <fieldset className='flex flex-col gap-2 pb-5'>
                <label htmlFor="title">Blog title</label>
                <input maxLength={150} type="text" name='title' id='title' value={formik.values.title} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder='Enter title...' className='rounded-lg border-[1px] border-slate-950 px-4 py-2' />
                {formik.touched.title && formik.errors.title && <p className='text-xs py-0.5 text-red-500'>{formik.errors.title}</p>}
            </fieldset>
            <fieldset className='flex flex-col gap-2 pb-5'>
                <label htmlFor="post">Blog Post</label>
                <textarea maxLength={1000} name='post' id='post' rows={10} value={formik.values.post} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder='Write new Post...' className='rounded-lg border-[1px] border-slate-950 px-4 py-2'></textarea>
                {formik.touched.post && formik.errors.post && <p className='text-xs py-0.5 text-red-500'>{formik.errors.post}</p>}
            </fieldset>

            <div className='pt-2 pb-6 w-full flex justify-end'>
                <button type='button'  disabled={(uploadProgress !== null && uploadProgress < 100) || postLoading} onClick={createPost} className='font-sm rounded-lg bg-slate-950 disabled:bg-slate-300 text-white px-4 py-2 w-fit flex gap-2 items-center'><span>Create post</span> <FaPenFancy /></button>
            </div>
        </div>
        <ToastContainer autoClose={1500} />
    </Template>
  )
}

export default NewPost
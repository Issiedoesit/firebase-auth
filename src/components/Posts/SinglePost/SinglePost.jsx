import { collection, getDoc, getDocs, query, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { BarLoader, PuffLoader, RiseLoader } from 'react-spinners'
import fetchAuthorData from '../../../utils/FetchAuthorData'
import { db } from '../../../utils/firebase'
import timeSince from '../../../utils/TimeSince';
import formatPostUrl from '../../../utils/formatPostUrl';
import useSWR from 'swr'

const SinglePost = () => {
  const location = useLocation()
  const postSlug = location.pathname.split('/')[2]
  const [currentPost, setCurrentPost] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchPost = async () => {
    setLoading(true)
    const postRef = query(collection(db, 'posts'), where('slug', '==', postSlug))
    const postSnap = await getDocs(postRef)
    let userData = {}
    let temp = []
    if(!postSnap.empty && postSnap.size == 1){
      postSnap.forEach((doc) =>{
        console.log(doc);
        fetchAuthorData(doc.data().authorId)
        .then((result)=>{
          userData = {...result[0]}
          temp.push({"id":doc.id, authorData: userData, ...doc.data() })
          setCurrentPost([{"id":doc.id, authorData: userData, ...doc.data() }])
          console.log("temp =>", temp);
        })
      })
    }
    setLoading(false)
    return temp
    // console.log(currentPost);
  } 

  const postData = useSWR(`/post/${postSlug}`, fetchPost,{loadingTimeout:3000})
  console.log("postData =>", postData.data);





  
  if(loading) return <div className='min-h-screen flex flex-col gap-5 text-slate-950 items-center justify-center'>
      <RiseLoader className='text-slate-950' />
      Post is loading love ...
    </div>

  return (
    <div>
      {postData.data && postData.data.map((post, idx)=>{
        return <div key={idx} className={`text-slate-950`}>
            <div><img src={post.bannerImage} alt="" className='skeleton h-[60vh] w-full object-cover' /></div>
            <div className={`w-[95%] max-w-lg rounded-xl bg-white drop-shadow-md px-8 py-10 -translate-y-[50%] mx-auto`}>
              <div className='flex flex-col sm:flex-row gap-5'>
                <img src={post.authorData.photo} alt="" className='w-[30%] skeleton aspect-square object-cover' />
                <div className='flex flex-col justify-between'>
                  <h1 className='text-2xl font-bold pb-2'>{post.title}</h1>
                  <div className='flex gap-10 justify-between items-end'>
                    <div>
                      <p className='text-gray-600 pb-1'>By {post.authorData.fullName} </p>
                      <NavLink to={`/${post.authorData.username}`} className='text-sm text-blue-400'>@ {post.authorData.username}</NavLink>
                    </div>

                    <div>
                      <p className='text-xs'>Posted {timeSince(post.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='pb-20 px-8 md:px-10 max-w-xl mx-auto'>
              {post.post.split(/\n\s*\n/).map((text, idx)=>{
                return <div className={`py-5`} key={idx}><div dangerouslySetInnerHTML={{ __html: formatPostUrl(text) }} /></div>
              })}
            </div>
        </div>
      })}
    </div>
  )
}

export default SinglePost

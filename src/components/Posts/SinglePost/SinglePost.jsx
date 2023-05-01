import { arrayRemove, arrayUnion, collection, getDoc, getDocs, query, where, updateDoc, doc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { BarLoader, PuffLoader, RiseLoader } from 'react-spinners'
import fetchAuthorData from '../../../utils/FetchAuthorData'
import { auth, db } from '../../../utils/firebase'
import timeSince from '../../../utils/TimeSince';
import formatPostUrl from '../../../utils/FormatPostUrl';
import useSWR from 'swr'
import {BsArrowThroughHeartFill, BsHeart} from 'react-icons/bs'
import {TfiComment} from 'react-icons/tfi'
import { useAuthState } from 'react-firebase-hooks/auth'

const SinglePost = () => {
  const location = useLocation()
  const postSlug = location.pathname.split('/')[2]
  const [currentPost, setCurrentPost] = useState([])
  const [loading, setLoading] = useState(false)
  const {user} = useAuthState(auth)

  const fetchPost = async () => {
    setLoading(true)
    const postRef = query(collection(db, 'posts'), where('slug', '==', postSlug))
    const postSnap = await getDocs(postRef)
    let temp = []
    if (!postSnap.empty && postSnap.size == 1) {
      const promises = []
      postSnap.forEach((doc) => {
        const promise = fetchAuthorData(doc.data().authorId)
          .then((result) => {
            const userData = result[0]
            temp.push({ "id": doc.id, authorData: userData, ...doc.data() })
          })
        promises.push(promise)
      })
      await Promise.all(promises)
      setCurrentPost(temp)
    }
    setLoading(false)
    return temp
  }

  const postData = useSWR(`/post/${postSlug}`, fetchPost, {loadingTimeout:3000})
  console.log("singlePostData =>", postData.data);
  
  const updateAfterLike = (postID) => {
    setCurrentPost(prevData => {
        return prevData.map(post => {
          if (post.id === postID) {
            let likes = [...post.likes];
            if (likes.includes(auth.currentUser.uid)) {
              likes = likes.filter(uid => uid !== auth.currentUser.uid);
            } else {
              likes.push(auth.currentUser.uid);
            }
            return {
              ...post,
              likes: likes
            }
          }
          return post;
        });
      });
  }
  
  const handleLike = (postID) => {
    updateDoc(doc(db, "posts", postID), {
      likes: arrayUnion(auth.currentUser.uid)
    }).then(() => {
      console.log('Like')
    }).catch((err) => {
      console.error('Like =>', err);
    })

    updateDoc(doc(db, "users", auth.currentUser.uid), {
      liked: arrayUnion(postID)
    }).then(() => {
      console.log('Liked')
    }).catch((err) => {
      console.error('Liked =>', err);
    })
    updateAfterLike(postID)
  }

  const handleUnlike = (postID) => {
    const postRef = doc(db, "posts", postID);
    updateDoc(postRef, {
      likes: arrayRemove(auth.currentUser.uid)
    }).then(() => {
      console.log('unLike');
    }).catch((err) => {
      console.error('unLike =>', err);
    })

    updateDoc(doc(db, "users", auth.currentUser.uid), {
      liked: arrayRemove(postID)
    }).then(() => {
      console.log('unLiked');
    }).catch((err) => {
      console.error('unLiked =>', err);
    })

    updateAfterLike(postID)
  };



  
  if(loading) return <div className='min-h-screen flex flex-col gap-5 text-slate-950 items-center justify-center'>
      <RiseLoader className='text-slate-950' />
      Post is loading love ...
    </div>

  return (
    <div>
      {currentPost && currentPost.length > 0 && currentPost.map((post, idx)=>{
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
                      <NavLink to={`/${post.authorData.slug}`} className='text-sm text-blue-400'>@ {post.authorData.username}</NavLink>
                    </div>
                    <div>
                      <p className='text-xs'>Posted {timeSince(post.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='pb-20 px-8 md:px-10 max-w-xl mx-auto -translate-y-16'>
              {post.post.split(/\n\s*\n/).map((text, idx)=>{
                return <div className={`py-5`} key={idx}><div dangerouslySetInnerHTML={{ __html: formatPostUrl(text) }} /></div>
              })}

              <div className='flex gap-10 py-5 items-center w-full'>
                <button type={'button'} onClick={()=> (post.likes && post.likes.includes(auth?.currentUser?.uid)) ? handleUnlike(post.id) :handleLike(post.id)} className='flex gap-3 items-center'>
                  <p className={'relative flex items-center'}>
                    <BsArrowThroughHeartFill className={`${(post.likes && post.likes.includes(auth?.currentUser?.uid)) ? 'opacity-100 visible w-auto' : 'opacity-0 invisible max-w-0 w-0'} text-brandLikeRed1x transition-all ease-in-out duration-300`} />
                    <BsHeart className={`${(post.likes && post.likes.includes(auth?.currentUser?.uid)) ? 'opacity-0 invisible max-w-0 w-0 p-0' : 'opacity-100 visible w-auto'} transition-all ease-in-out duration-300`} />
                    <span className={`${(post.likes && post.likes.includes(auth?.currentUser?.uid)) && 'bubble-span bubble-motion'}`}></span>
                  </p>
                  <p className={`text-sm transition-all ease-in-out duration-300 ${(post.likes && post.likes.includes(auth?.currentUser?.uid))  ? 'text-brandLikeRed1x' : 'text-slate-600'}`}>{post.likes ? post.likes.length : 0}</p>
                </button>
                <button type={'button'} className='flex gap-3 items-center'>
                  <TfiComment color='' className='text-slate-970' />
                  <p className='text-sm text-slate-600'>0</p>
                </button>
              </div>
            </div>
        </div>
      })}
    </div>
  )
}

export default SinglePost

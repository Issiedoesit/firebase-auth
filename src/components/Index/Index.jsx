import React, { useEffect, useState } from 'react'
import Template from '../Dashboard/Template/Template'
import Nav from '../Navigation/Nav/Nav'
import { doc, onSnapshot, collection, getDocs, getDoc, updateDoc, query, where, arrayUnion, arrayRemove } from "firebase/firestore";
import { auth, db } from '../../utils/firebase';
import { GridLoader, PuffLoader } from 'react-spinners';
import {FaUserCircle} from 'react-icons/fa'
import { BsHeart, BsArrowThroughHeartFill } from 'react-icons/bs'
import { TfiComment, TfiComments } from 'react-icons/tfi'
import { VscCommentUnresolved } from 'react-icons/vsc'
import { Navigate, NavLink } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import useSWR from 'swr';
import fetchAuthorData from '../../utils/FetchAuthorData';
import getDateFromTimestamp from '../../utils/GetDateFromTimestamp';
import { cache } from 'swr/_internal';


const Index = () => {
  const [data, setData] = useState([])
  const [user] = useAuthState(auth)
  const [liking, setLiking] = useState(false)
  


  const [loading, setLoading] = useState(false)
  const [empty, setEmpty] = useState(false)


  const fetchAllPosts = async () => {
    let temp = []
    try{
      setLoading(true)
      
      const querySnapshot = await getDocs(collection(db, "posts"));
      console.log("snap", "=>", querySnapshot.empty);
      console.log(querySnapshot.docs.length);
      if(querySnapshot.empty){setLoading(false); return}
      for (let i = 0; i < querySnapshot.docs.length; i++){
        const doc = querySnapshot.docs[i]
        fetchAuthorData(doc.data().authorId)
        .then((result)=>{
          let userData = {...result[0]}
          result[0] && temp.push({id:doc.id, authorData: userData,  ...doc.data()})
          result[0] && setData([...temp]);
    
        })
        setLoading(false)
    };
    }catch (err) {
      setLoading(false)
      console.error(err);
    }
    return data
    // Set all authorDp to the closest one with a non-empty value
  }

  


  const postData = useSWR('posts', fetchAllPosts, {refreshInterval: 300000})
  console.log("Post Data => ", postData.data);

  const updateAfterLike = (postID) => {
    setData(prevData => {
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
  
  

  return (
    <div>
        <Nav />
        <Template showPost={!loading}>
          {
            data.length == 0
            ?
            <div className='min-h-screen flex flex-col gap-5 text-slate-950 items-center justify-center'>
              <PuffLoader className='text-slate-950' />
              Think brighter thoughts
            </div>
            :
            <div>
              {(data && !empty && data.length != 0)
              ?
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-16 py-20'>
                {data && data.length != 0 && data.sort((a, b)=>b.createdAt - a.createdAt).map((post, idx)=>{
                  return <div key={idx}>
                    <div className='flex flex-col md:flex-row gap-8'>
                      <NavLink to={`post/${post.slug}`}>
                        <img src={post.bannerImage} alt="" className='skeleton w-full aspect-video lg:aspect-auto object-cover min-w-[160px] lg:h-40 lg:w-40 rounded-lg drop-shadow-md' />
                      </NavLink>
                      <div className='pr-4'>
                        <NavLink to={`post/${post.slug}`}>
                          <h2 className='text-2xl font-bold'>{post.title}</h2>
                          <div className='py-3'>
                            <p className="text-gray-600 four-lined-text">{post.post}</p>
                          </div>
                        </NavLink>
                        <div className='flex justify-between gap-10'>
                          {
                            post.authorData && <NavLink to={`/${post.authorData.slug}`} className='flex items-center gap-2'>
                              {post.authorData.photo && post.authorData.fullName ? <img src={post.authorData.photo} alt={post.authorData.fullName} className="h-10 w-10 rounded-full object-cover skeleton" /> : <FaUserCircle size={'32'} />}
                              <div>
                                <p>{post.authorData.fullName}</p>
                              </div>
                            </NavLink>
                          }
                          <div className='py-2'>
                            <span className='text-xs text-gray-400'>{getDateFromTimestamp(post.createdAt).interval}</span>
                          </div>
                        </div>
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
                  </div>
                })}
               </div>
              :
              (empty && <div className='min-h-screen flex flex-col gap-5 text-slate-950 items-center justify-center'>
              <h2 className='font-bold py-4 text-2xl text-center'>No Posts!</h2>
              <GridLoader className='text-slate-950' />
              Add first post
            </div>)
              }
            </div>
          }

        </Template>
    </div>
  )
}

export default Index
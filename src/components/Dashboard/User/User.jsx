import React, { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import Nav from '../../Navigation/Nav/Nav'
import Template from '../Template/Template'
import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { auth, db } from '../../../utils/firebase';
import {BsFillCalendarHeartFill} from 'react-icons/bs'
import {MdLocationCity} from 'react-icons/md'
import getDateFromTextString from '../../../utils/GetDateFromTextString';
import getDateFromTimestamp from '../../../utils/GetDateFromTimestamp';
import AddPostLink from '../../Elements/Links/AddPostLink';

const User = () => {
    const location = useLocation()
    const [currentSlug, setCurrentSlug] = useState(location.pathname.split('/')[1])
    const [currentUserData, setCurrentUserData] = useState([])
    const [currentUserPosts, setCurrentUserPosts] = useState([])
    const [tab, setTab] = useState('posts')

    const tabData = [
      {
        name:"Posts",
        id:"posts",
      },
      {
        name:"likes",
        id:"likes",
      },
    ]

    const fetchAuthorData = async () => {
      const userRef = query(collection(db, "users"), where('slug', '==', currentSlug));
      const userSnap = await getDocs(userRef);
      let tempPosts = []
      let id = ''
      let temp = []
      userSnap.forEach((doc)=>{
        console.log(doc);
        temp.push({id:doc.id, ...doc.data()})
        console.log(temp);
        id = doc.id
        setCurrentUserData(temp)
      })
      console.log(id);
      const postRef = query(collection(db, 'posts'), where('authorId', '==', id))
      const postSnap = await getDocs(postRef)

      postSnap.forEach((postDoc)=>{
        let temp = {id:postDoc.id, ...postDoc.data()}
        tempPosts.push(temp)
        console.log("postDoc => ", postDoc.data());
      })
      setCurrentUserPosts(tempPosts)
      console.log("tempPosts => ", tempPosts);
      console.log("currentUserData => ", currentUserData);

      return temp
  }

  useEffect(() => {
    fetchAuthorData()
  
    return () => {
      
    }
  }, [currentSlug])
  
  let joined = ''
  if(currentUserData && currentUserData.length > 0){
    if(currentUserData[0].createdAt){
      joined = getDateFromTextString(currentUserData[0].createdAt)
      console.log(joined);
    }
  }

  let isUser = false
  if(currentUserData && currentUserData.length > 0){
    isUser = auth.currentUser.uid == currentUserData[0].id
  }

  return (
    <div>
        <Nav />
        <Template>
        {currentUserData.map((data, idx)=>{
          return <div key={idx} className='flex flex-col gap-4 mx-auto py-20 text-center max-w-lg'>
            <div className='mx-auto'>
              <img src={data.photo} alt={data.username} className={`rounded-full h-32 w-32 mx-auto object-cover skeleton`} />
            </div>
          <h2 className='text-2xl font-bold text-slate-970'>@{data.username}</h2>
          <h2 className='text-lg font-bold text-slate-970'>{data.fullName}</h2>
          <p className='text-base text-slate-700'>{data.bio}</p>
          <p className='text-base text-slate-400 flex gap-2 items-center'><MdLocationCity className={`text-slate-400`} /><span>{data.location}</span></p>
          {joined && <p className='text-base text-slate-400 flex gap-2 items-center'><BsFillCalendarHeartFill className={`text-slate-400`} /><span>Joined {joined.monthText} {joined.year}</span></p>}
          {isUser 
            &&
              <div className='flex py-3 justify-end gap-5'>
              <NavLink to={'/dashboard/settings/profile'} className='font-sm rounded-lg disabled:bg-slate-300 disabled:cursor-not-allowed bg-slate-950 text-white px-4 py-2 w-fit'>Edit Profile</NavLink>
            </div>
          }
        </div>
        })}

        <div className='py-5 overflow-x-auto flex gap-2 border-b-[2px] border-b-slate-950'>
          {tabData.map((data, idx)=>{
            return <button type='button' key={idx} onClick={()=>setTab(data.id)} className={`px-4 py-1 capitalize font-bold rounded-3xl ${data.id == tab ? 'bg-slate-950 text-white' : 'text-slate-950 hover:bg-slate-200'} transition-all duration-500 ease-in-out`}>{data.name}</button>
          })}
        </div>

       {tab == 'posts' 
          &&
          <div>
            {
              currentUserPosts
              ?
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-16 py-10 px-8 md:px-12 lg:px-20'>
                    {currentUserPosts && currentUserPosts.length != 0 && currentUserPosts.sort((a, b)=>b.createdAt - a.createdAt).map((post, idx)=>{
                        return <NavLink to={`/post/${post.slug}`} key={idx}>
                          <div className='flex flex-col md:flex-row gap-8'>
                            <img src={post.bannerImage} alt="" className='skeleton w-full aspect-video lg:aspect-auto object-cover min-w-[160px] lg:h-40 lg:w-40 rounded-lg drop-shadow-md' />
                            <div className='pr-4'>
                              <h2 className='text-2xl font-bold'>{post.title}</h2>
                              <div className='py-3'>
                                <p className="text-gray-600 four-lined-text">{post.post}</p>
                              </div>
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
                          </div>
                        </NavLink>
                      })}
                </div>
              :
            <div className='py-20 text-center text-slate-950'>
                <p>{isUser ? 'You have no posts yet' : `${currentUserData[0].username} has no posts yet `}</p>
                <p className='pt-5 font-bold text-2xl'>{isUser && 'Add new post'}</p>
            </div>
            }
          </div>
        }

        {tab == 'likes'
        &&
        <div className='py-28 text-center text-slate-950'>
            <p className="pb-2 text-sm text-rose-500">*** Not implemented yet ***</p>
            <p>{isUser ? 'You have no likes yet' : `${currentUserData[0].username} has no likes yet `}</p>
            <p className='pt-5 font-bold text-2xl'>{isUser && 'Want to see posts to like?'}</p>
        </div>
        }
        <AddPostLink />
        </Template>
    </div>
  )
}

export default User
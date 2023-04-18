import React, { useEffect, useState } from 'react'
import Template from '../Dashboard/Template/Template'
import Nav from '../Navigation/Nav/Nav'
import { doc, onSnapshot, collection, getDocs, getDoc, updateDoc, query, where } from "firebase/firestore";
import { auth, db } from '../../utils/firebase';
import { GridLoader, PuffLoader } from 'react-spinners';
import {FaUserCircle} from 'react-icons/fa'
import { Navigate, NavLink } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import useSWR from 'swr';
import fetchAuthorData from '../../utils/FetchAuthorData';
import getDateFromTimestamp from '../../utils/GetDateFromTimestamp';

const Index = () => {
  const [data, setData] = useState([])
  const [user] = useAuthState(auth)
  

  // if(!user) {return window.location.href = '/auth/login'}

  const [loading, setLoading] = useState(false)
  const [empty, setEmpty] = useState(false)
  //  if(auth.currentUser){
  //     onSnapshot(doc(db, "users"), (doc) => {
  //       console.log("Current data: ", doc.data());
  //       (db, "posts").where('authorId', '==', '2nl6VquX8gQvprJD6WQdcGQrntg1')
  //       .get()
  //       .then((querySnapshot) => {
  //         querySnapshot.forEach((doc) => {
  //           doc.ref.update({ 
  //             authorDp
  //           });
  //         });
  //       });
  //   });
  //   console.log(user);
  //  }

  // const userDocRef = doc(db, 'users', 'alovelace')
  // userDocRef.on('change', (snapshot) => {
  //   const data = snapshot.data();
  //   console.log(data);
  //   // Update all documents in the postCollection that were authored by the current user
  //   // firebase.firestore().collection('post')
  //   //   .where('authorId', '==', userId)
  //   //   .get()
  //   //   .then((querySnapshot) => {
  //   //     querySnapshot.forEach((doc) => {
  //   //       doc.ref.update({ 
  //   //         authorName: data.name,
  //   //         authorFirstName: data.firstName
  //   //       });
  //   //     });
  //   //   });
  // });

  // const updateData = async (id, photo) => {
  //     let authorDpArray = [];
  //           const posts = query(collection(db, 'posts'), where('authorId', '==', '2nl6VquX8gQvprJD6WQdcGQrntg1'))
  //           const postSnapshot = await getDocs(posts)
  //           postSnapshot.forEach((doc) => {
  //             console.log(doc.id, "posts", ' => ', doc.data());
  //             console.log("lucille", "=>", doc.data().authorDp);
  //             if (doc.data().authorDp) {
  //               authorDpArray.push({ authorDp: doc.data().authorDp, date: doc.data().createdAt });
  //             }
  //             console.log('ada', "=>", authorDpArray);
  //           })
  //           authorDpArray.sort((a, b) => new Date(a.date) - new Date(b.date));
  //           let closestAuthorDp = authorDpArray[0]?.authorDp;
  //           updateDoc(doc(db, "posts", 'ePU6a5PbvqN3Y7b1Fclk'), { authorDp: closestAuthorDp }).then(() => {
  //             console.log('Changed dp', "=>", closestAuthorDp);
  //           }).catch((error) => {
  //             console.error("Error updating document: ", error);
  //           });
  // }

 

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

  


  const postData = useSWR('posts', fetchAllPosts, {refreshInterval: 300000, loadingTimeout: 1000})
  console.log("Post Data => ", postData.data);
  

  

  return (
    <div>
        <Nav />
        <Template showPost={!loading}>
          
          {
            loading
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
                  return <NavLink to={`post/${post.slug}`} key={idx}>
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
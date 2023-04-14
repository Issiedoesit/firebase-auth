import React, { useEffect, useState } from 'react'
import Template from '../Dashboard/Template/Template'
import Nav from '../Navigation/Nav/Nav'
import { doc, onSnapshot, collection, getDocs, getDoc, query } from "firebase/firestore";
import { auth, db } from '../../utils/firebase';
import { PuffLoader } from 'react-spinners';
import { orderBy } from 'lodash';

const Index = () => {
  const [data, setData] = useState([])
  const [user, setUser] = useState([])
  const [loading, setLoading] = useState(false)
    
  const fetchAllPosts = async () => {
    let temp = []
    let posts = []
    try{
      setLoading(true)
      const querySnapshot = await getDocs(collection(db, "posts"));
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        temp.push({id:doc.id, ...doc.data()})
        setData(temp)
        posts.push(doc.data())
        console.log(temp);
        // console.log(userSnap);
        setLoading(false)
      })
    }catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchAllPosts()
  
    return () => {
      
    }
  }, [])
  

  // const unsub = onSnapshot(doc(db, "posts", "SF"), (doc) => {
  //     console.log("Current data: ", doc.data());
  // });

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
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-16 py-20'>
              {data && data.length != 0 && data.sort((a, b)=>b.createdAt - a.createdAt).map((post, idx)=>{
                return <div key={idx}>
                  <div className='flex flex-col md:flex-row gap-8'>
                    <img src={post.bannerImage} alt="" className='skeleton w-full aspect-video lg:aspect-auto object-cover min-w-[160px] lg:h-40 lg:w-40 rounded-lg drop-shadow-md' />
                    <div className='pr-4'>
                      <h2 className='text-2xl font-bold'>{post.title}</h2>
                      <div className='py-3'>
                        <p className="text-gray-600 four-lined-text">{post.post}</p>
                      </div>
                    </div>
                  </div>
                </div>
              })}
            </div>
          }

        </Template>
    </div>
  )
}

export default Index
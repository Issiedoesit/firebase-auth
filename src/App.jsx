import React, { lazy, Suspense } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import {Routes, Route} from 'react-router-dom'
import './App.css'
import { auth } from './utils/firebase'
import PrivateRoute from './contexts/PrivateRoute'
import PostPrivateRoute from './contexts/PostPrivateRoute'
import FallBackLoader from './components/Elements/Loaders/FallBackLoader'
const User = lazy(()=>import('./components/Dashboard/User/User'))
const SinglePost = lazy(()=>import('./components/Posts/SinglePost/SinglePost'))
const NewPost = lazy(()=>import('./components/Posts/NewPost/NewPost'))
const Profile = lazy(()=>import('./components/Settings/Profile/Profile'))
const Login = lazy(()=>import('./components/Auth/Login/Login'))
const SignUp = lazy(()=>import('./components/Auth/SignUp/SignUp'))
const Home = lazy(()=>import('./components/Dashboard/Home/Home'))
const About = lazy(()=>import('./components/Dashboard/About/About'))
const Index = lazy(()=>import('./components/Index/Index'))
// import User from './components/Dashboard/User/User'
// import SinglePost from './components/Posts/SinglePost/SinglePost'
// import NewPost from './components/Posts/NewPost/NewPost'
// import Profile from './components/Settings/Profile/Profile'
// import Login from './components/Auth/Login/Login'
// import SignUp from './components/Auth/SignUp/SignUp'
// import Home from './components/Dashboard/Home/Home'
// import About from './components/Dashboard/About/About'
// import Index from './components/Index/Index'


function App() {
  const [user, loading] = useAuthState(auth)
  const imgs = document.querySelectorAll('img')
    if(imgs){
        imgs.forEach((img)=>{
            if(img.complete){
                img.classList.remove('skeleton')
            }
        })
    }

  return (
    <div className="App">
      <div>
        <Suspense fallback={<FallBackLoader />}>
          <Routes>
            <Route index path='/' element={<Index />} />
              <Route path=':slug' element={<User />} />
              <Route path="/dashboard" element={<PrivateRoute />} >
                <Route path='' element={<Home />} />
                <Route path='about' element={<About />} />
                <Route path='settings'>
                  <Route path='profile' element={<Profile />} />
                </Route>
              </Route>
                <Route path='post' element={<PostPrivateRoute />}>
                  <Route path='add' element={<NewPost />} />
                  <Route path=':slug' element={<SinglePost />} />
                </Route>
            <Route path='/auth'>
                <Route path='login'  element={<Login />} />
                <Route path='signup'  element={<SignUp />} />
            </Route>
          </Routes>
        </Suspense>
      </div>
    </div>
  )
}

export default App

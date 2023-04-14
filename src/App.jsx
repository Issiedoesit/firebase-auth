import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import {Routes, Route} from 'react-router-dom'
import './App.css'
import Login from './components/Auth/Login/Login'
import SignUp from './components/Auth/SignUp/SignUp'
import Home from './components/Dashboard/Home/Home'
import About from './components/Dashboard/About/About'
import Index from './components/Index/Index'
import { auth } from './utils/firebase'
import PrivateRoute from './contexts/PrivateRoute'
import Profile from './components/Settings/Profile/Profile'
import NewPost from './components/Dashboard/NewPost/NewPost'
import PostPrivateRoute from './contexts/PostPrivateRoute'

function App() {
  const [user, loading] = useAuthState(auth)

  return (
    <div className="App">
      <div>
        <Routes>
          <Route index path='/' element={<Index />} />
            <Route path="/dashboard" element={<PrivateRoute />} >
              <Route path='' element={<Home />} />
              <Route path='about' element={<About />} />
              <Route path='settings'>
                <Route path='profile' element={<Profile />} />
              </Route>
            </Route>
              <Route path='post' element={<PostPrivateRoute />}>
                <Route path='add' element={<NewPost />} />
              </Route>
          <Route path='/auth'>
              <Route path='login'  element={<Login />} />
              <Route path='signup'  element={<SignUp />} />
          </Route>
        </Routes>
      </div>
    </div>
  )
}

export default App

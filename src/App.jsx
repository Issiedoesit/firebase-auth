import React from 'react'
import {Routes, Route, Navigate} from 'react-router-dom'
import './App.css'
import Login from './components/Auth/Login/Login'
import SignUp from './components/Auth/SignUp/SignUp'

function App() {

  return (
    <div className="App">
      

      <div>
        <Routes>
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

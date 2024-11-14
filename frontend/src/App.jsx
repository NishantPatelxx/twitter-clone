import React from 'react'
import HomePage from './pages/home/HomePage'
import SignupPage from './pages/auth/signup/SignupPage'
import LoginPage from './pages/auth/login/LoginPage'
import { Route , Routes } from 'react-router-dom'

function App() {
  return (
    <div className= "flex max-w-6xl mx-auto">
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/signup' element={<SignupPage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
      </Routes>
      
    </div>
  )
}

export default App

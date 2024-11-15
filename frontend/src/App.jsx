import React from 'react'
import HomePage from './pages/home/HomePage'
import SignupPage from './pages/auth/signup/SignupPage'
import LoginPage from './pages/auth/login/LoginPage'
import { Route , Routes } from 'react-router-dom'
import SideBar from "./components/common/Sidebar"
import RightPanel from "./components/common/RightPanel"
import NotificationPage from "./pages/notification/NotificationPage"
import ProfilePage from "./pages/profile/ProfilePage"
import { Toaster } from "react-hot-toast"
function App() {
  return (
    <div className= "flex max-w-6xl mx-auto">
      <SideBar />
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/signup' element={<SignupPage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/notification' element= {<NotificationPage/>}/>
        <Route path='/profile/:username' element={<ProfilePage/>}/>
      </Routes>
      <RightPanel/>
      <Toaster/>
      
    </div>
  )
}

export default App

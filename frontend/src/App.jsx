import React from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import SignUpPage from './pages/SignUpPage'
import SignInPage from './pages/SignInPage'
import HomePage from './pages/HomePage'
const App = () => {
  return (
    <div className='mainBody'>
      <Routes>
        <Route path="/" element={<SignUpPage/>}/>
        <Route path="/signInPage" element={<SignInPage/>}/>
        <Route path='/HomePage' element={<HomePage/>}/>
      </Routes>
    </div>
  )
}

export default App

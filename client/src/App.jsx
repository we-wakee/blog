import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import IndexPage from './pages/IndexPage'
import PostPage from './pages/PostPage'
import { UserContext } from './UserContext'
import {Route, Routes} from "react-router-dom";
import Layout from './Layout'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import CreatePost from './pages/CreatePost'
import { UserContextProvider } from "./UserContext";


function App() {

  
  return (
    <>
      <UserContextProvider>
         <Routes >
            <Route path='/' element={<Layout/>}>
            <Route index element={<IndexPage/>}/>
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path='/post/:id' element={<PostPage/>}/>
            </Route>
         
         </Routes>
      </UserContextProvider>
    </>
  )
}

export default App

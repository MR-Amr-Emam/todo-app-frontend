'use client'
import {useState, useEffect} from "react";
import {BrowserRouter, Routes, Route, useNavigate} from "react-router-dom";
import "cropperjs/src/css/cropper.css";
import HomePage from "../home_page/homepage";
import MonthPage from "../month_page/monthpage";
import LandPage from "../land_page/landpage";
import { store } from './store'
import { Provider } from 'react-redux'
import { SignInPage } from "@/signin_signup_page/signInPage";
import { SignUpPage } from "@/signin_signup_page/signUpPage";


export default function Home() {

  const [isClient, setIsClient] = useState(false);
  useEffect(()=>{
    setIsClient(true);
  },[])
  if(!isClient)return(null)
  return (
    <>
    <Provider store={store}>
    <BrowserRouter>
      <Routing />
      <Routes>
        <Route path="/home" element={<HomePage/>} />
        <Route path="/" element={<LandPage />} />
        <Route path="/monthgoals" element={<MonthPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </BrowserRouter>
    </Provider>
    </>
  )
}

function Routing(){
  const url = new URL(window.location.toString())
  const urlParams = url.searchParams
  if(!urlParams.size){
    return <></>
  }
  const navigate = useNavigate()
  useEffect(()=>{
    navigate("/"+urlParams.get("page"))
  },[])
  return <></>
}
"use client"

import { Link } from "react-router-dom";

//import Image from "next/image";

import style from "./home_page.module.css";
import { SearchBar } from "./searchbar";

import { ProfileForm } from "./profile_form"

import { useSelector, useDispatch } from "react-redux";
import {RootState} from "../app/store";
import {setSidemenu, setSearchbar} from "../app/reducers/menusSlice";
import { useEffect, useRef } from "react";
import { Fetch, setProfileForm } from "@/app/reducers/globalSlice";
import { setUser } from "@/app/reducers/userSlice";


export function Navbar(){
  const user = useSelector((state:RootState)=>state.user);
  const menus = useSelector((state:RootState)=>state.menus);
  const profileImageRef = useRef<HTMLImageElement>(null);
  const dispatch = useDispatch();

  useEffect(()=>{
    var load = async () =>{
      if(!user.username || user.username == "anonymous"){
        var response = await Fetch("/authentication/perform_user", "GET", {}, {})
        if(!response?.ok){return 0}
        var data = await response.json()
        dispatch(setUser({username:data.username, timezone:data.timezone, profileImage: data.profile_image}))
      }
    }
    load()
  }, [])
    
    return(
      <>
        <div className={`${style.navbar} bg-secondary text-emphasis-dark`}>
          <div className={`${style["navbar-left"]}`}>
        <div className={`landscape fw-bold text-light position-relative`}>
          <p className={`myfs-4 position-relative m-0 top-50 translate-middle-y`}>Todo</p>
        </div>
        <div className={`${style.burgerbutton} portrait`} onClick={()=>{dispatch(setSidemenu());}}>
          <div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
        <div className=""><div><Link to="/home">day tasks</Link></div></div>
        <div className=""><div><Link to="/monthgoals">month goals</Link></div></div>
      </div>
      <div className={`landscape ${style["navbar-right"]}`}>
        <div className={`w-100`}>
          <div className={`${menus.searchbar?"d-none":"d-block"}`} onClick={()=>{dispatch(setSearchbar())}}>
            <i className="bi bi-search"></i>
          </div>
          <div className={`${menus.searchbar?"d-none":"d-block"} ${style.profileimage}`}>
              <img src={user.profileImage} alt="profile-image" ref={profileImageRef} className="pointer" onClick={()=>{dispatch(setProfileForm(true))}} />
          </div>
          <div>
            <SearchBar />
          </div>
        </div>
      </div>
      
    </div>
    <ProfileForm profileImageNav={profileImageRef.current} />
    </>
    )
}

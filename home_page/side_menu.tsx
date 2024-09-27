import { useState, useEffect, useRef } from "react";

import style from "./home_page.module.css"

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../app/store";
import { setSearchbar, setSidemenu, setSubmenu } from "../app/reducers/menusSlice";
import { setProfileForm } from "@/app/reducers/globalSlice";

import { SidemenuSearchBar } from "./sidemenu-search-bar";


export function SideMenu(){
    const menus = useSelector((state:RootState)=>state.menus);
    const user = useSelector((state:RootState)=>state.user);
    const profileForm = useSelector((state:RootState)=>state.global.profileForm)
    const newRef = useRef<HTMLElement>(null);
    const dispatch = useDispatch();
    useEffect(()=>{
        const closeDisplay = (e:Event):void=>{
            var sidemenu = newRef.current as HTMLElement;
            var target = e.target as HTMLElement;
            if(sidemenu && menus.sidemenu && !sidemenu.contains(target)){
                dispatch(setSidemenu())
            }
        }
        if(menus.sidemenu && !profileForm && !menus.searchbar){
            document.addEventListener("click", closeDisplay)
        }
        return(()=>{
            document.removeEventListener("click", closeDisplay)
        })
    })
    return(
    <>
    <div className={`${menus.sidemenu&&menus.searchbar?"d-block":"d-none"} position-fixed left-0 top-0 w-100 h-100 z-3 bg-white opacity-75`}></div>
    <div className={`${menus.sidemenu&&menus.searchbar?"d-block":"d-none"} position-fixed left-0 top-0 w-100 h-100 z-3`}>
        <SidemenuSearchBar />
    </div>
    <div className={`${style.sidemenu} ${menus.sidemenu?"d-block":"d-none"}`}
    ref={newRef as React.RefObject<HTMLDivElement>}>
        <div className={`${style.userinfo}`}>
            <div className={`${style.profileimage} pointer`} onClick={()=>{dispatch(setProfileForm(true))}}>
                <img src={user.profileImage} alt="profile_image" />
            </div>
            <div className={`${style.username}`}>
                <div>
                    {user.username}
                </div>
            </div>
        </div>
        <div className="myfs mx-2 border-bottom border-black">{user.timezone}</div>
        <div className="d-flex align-items-center myfs-6 pointer" onClick={()=>{dispatch(setSearchbar())}}>
            <div><i className="bi bi-search"></i></div><div className="mx-2">search</div>
        </div>
        {document.location.pathname=="/home"?
        <div className={`container`}>
            <div className={`row flex-column justify-content-center myfs-6 ${style.submenu}`}>
                <div className={`col my-1 ${menus.submenu=="all"?style.active:""}`}
                onClick={()=>{dispatch(setSubmenu("all"))}}><div>all tasks</div></div>

                <div className={`col my-1 ${menus.submenu=="done"?style.active:""}`}
                onClick={()=>{dispatch(setSubmenu("done"))}}><div>done tasks</div></div>

                <div className={`col my-1 ${menus.submenu=="notdone"?style.active:""}`}
                onClick={()=>{dispatch(setSubmenu("notdone"))}}><div>not done tasks</div></div>

                <div className={`col my-1 ${menus.submenu=="reminders"?style.active:""}`}
                onClick={()=>{dispatch(setSubmenu("reminders"))}}><div>reminders</div></div>
            </div>
        </div>
        :""}
    </div>
    </>
    )
}
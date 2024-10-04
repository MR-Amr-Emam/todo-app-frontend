import style from "./home_page.module.css"

import { useEffect, useRef, useState } from "react"
import Cropper from 'cropperjs'
import { RootState } from "@/app/store"
import { useDispatch, useSelector } from "react-redux"
import { setUser } from "@/app/reducers/userSlice"

import { Fetch, FetchFree, setLoading, setProfileForm } from "@/app/reducers/globalSlice"
import { useNavigate } from "react-router-dom"
import { setCurrentMonth } from "@/app/reducers/currentDataSlice"

export function ProfileForm({profileImageNav}:{profileImageNav:HTMLImageElement|null}){
    const user = useSelector((state:RootState)=>state.user)
    const profileForm = useSelector((state:RootState)=>state.global.profileForm)
    const [usernameInput, setUsernameInput] = useState(false)
    const [timezoneMenu, setTimezoneMenu] = useState(false)
    const [editImage, setEditImage] = useState(false)
    const [editImageUrl, setEditImageUrl] = useState("")
    const navigate = useNavigate()
    const editImageRef = useRef<HTMLImageElement>(null)
    const profileFormRef = useRef<HTMLDivElement>(null)
    const profileImageRef = useRef<HTMLImageElement>(null)
    const usernameRef = useRef<HTMLInputElement>(null)
    const timezoneMenuRef = useRef<HTMLDivElement>(null)
    const editImageContainerRef = useRef<HTMLDivElement>(null)
    const cropper = useRef<Cropper>()
    const dispatch = useDispatch()

    function displayCrop(inputImage:HTMLInputElement){
        var images = inputImage?.files
        if(!images){return 0}
        var image = images[0] as File
        var url = URL.createObjectURL(image)
        inputImage.value = ""
        setEditImageUrl(url)
        setEditImage(true)
    }

    function setImage(){
        if(!cropper.current){setEditImage(false); return 0}
        setLoading(true)
        cropper.current.getCroppedCanvas().toBlob(async(image)=>{
            if(!image || !cropper.current){return 0;}
            var formData = new FormData()
            formData.append("profile_image", image as File)
            var response = await FetchFree("/authentication/perform_profile_image", "POST", {}, formData)
            if(!response?.ok){return 0}
            var data = await response.json()
            cropper.current?.destroy()
            dispatch(setUser({username:user.username, timezone:user.timezone, profileImage:user.profileImage+" "}))
            setEditImage(false)
            setLoading(false)
        }, "image/jpeg")
    }
    
    async function setUsername(usernameInputEle:HTMLInputElement){
        var username = usernameInputEle.value
        if(!username){return 0}
        dispatch(setLoading(true))
        var response = await Fetch("/authentication/perform_user", "PUT", {}, {username:username})
        if(!response?.ok){return 0}
        dispatch(setUser({username:username, timezone:user.timezone, profileImage:user.profileImage}))
        dispatch(setLoading(false))
    }

    async function setTimezone(timezone:string){
        dispatch(setLoading(true))
        var response = await Fetch("/authentication/perform_user", "PUT", {}, {timezone:timezone})
        if(!response?.ok){return 0}
        dispatch(setUser({username:user.username, timezone:timezone, profileImage:user.profileImage}))
        dispatch(setLoading(false))
    }

    useEffect(()=>{
        var imageEle = editImageRef.current
        if(editImage && imageEle){
            cropper.current = new Cropper(imageEle, {
                aspectRatio: 1,
            });
        }

        function close(e:Event){
            var target = e.target as HTMLDivElement;
            if(profileFormRef.current && !profileFormRef.current.contains(target)){
                dispatch(setProfileForm(false))
            }
        }
        function closeEditImage(e:Event){
            var target = e.target as HTMLElement;
            if(target && editImageContainerRef.current && !editImageContainerRef.current.contains(target) && cropper.current){
                cropper.current?.destroy()
                setEditImage(false);
            }
        }
        if(profileFormRef.current && profileForm && !editImage){
            document.addEventListener("click", close)
        }
        if(editImage){
            document.addEventListener("click", closeEditImage)
        }
        return ()=>{document.removeEventListener("click", close)}
    })

    useEffect(()=>{
        function closeUsernameInput(e:Event){
            var target = e.target as HTMLElement;
            if(usernameRef.current && !usernameRef.current.contains(target)){
                setUsernameInput(false);
            }
        }
        function closeTimezoneMenu(e:Event){
            var target = e.target as HTMLElement;
            if(timezoneMenuRef.current && !timezoneMenuRef.current.contains(target)){
                setTimezoneMenu(false);
            }
        }

        if(usernameInput){
            usernameRef.current?.focus()
            document.addEventListener("click", closeUsernameInput)
        }
        if(timezoneMenu){
            document.addEventListener("click", closeTimezoneMenu)
        }
        return ()=>{document.removeEventListener("click", closeUsernameInput);
            document.removeEventListener("click", closeTimezoneMenu);
        }
    })
    var count = 0;
    return (
        <>
        <div className={`${profileForm?"d-block":"d-none"} position-fixed w-100 h-100 bg-body opacity-25 z-2`}></div>
        <div ref={editImageContainerRef} className={`${style["edit-image"]} ${editImage?"d-block":"d-none"} position-fixed start-50 top-50 translate-middle`}>
            {editImage?<img ref={editImageRef} src={editImageUrl} className="w-100" />:""}
            <div className="w-100 my-2 bg-theme-one-emphasis myfs pointer myp-1 rounded text-center text-white" onClick={()=>{setImage()}}>change image</div>
        </div>
        <div ref={profileFormRef} className={`${profileForm?"d-block":"d-none"} ${style["profile-form"]} position-fixed start-50 top-50 translate-middle bg-white p-3 rounded shadow-color-gray z-3`}>
            <div className="d-flex justify-content-between">
                <div>
                    <img ref={profileImageRef} src={user.profileImage} alt="profile-image" />
                    <label htmlFor="profile-image-input"><span className="myfs text-center">change profile image</span></label>
                    <input id="profile-image-input" type="file" className="d-none" onChange={(e)=>{displayCrop(e.target as HTMLInputElement)}} />
                </div>
                <div>
                    <div>
                        <div className="myfs text-theme-one-emphasis">username <i className=
                        "bi bi-pencil-fill text-secondary myfs-mini pointer" onClick={()=>{setUsernameInput(true);}}/>
                        </div>
                        {!usernameInput?<p>{user.username}</p>:<input defaultValue={user.username} ref={usernameRef} type="text" onBlur={(e)=>{setUsername(e.target as HTMLInputElement)}} required />}
                    </div>
                    <div>
                        <div className="myfs text-theme-one-emphasis">timezone</div>
                        <div className={style["timezone-menu"]}>
                            <div className={`${timezoneMenu?"border rounded":"text-start"} pointer`} onClick={()=>{setTimezoneMenu(true)}}>{user.timezone}</div>
                            <div ref={timezoneMenuRef} className={timezoneMenu?"d-block":"d-none"}>
                                {Intl.supportedValuesOf('timeZone').map((value)=>{count++; return<div key={count} onClick={()=>{setTimezone(value)}}> {value}</div>})}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="myfs text-end mx-3 text-decoration-underline pointer" onClick={async()=>{
                var response = await Fetch("/authentication/logout", "GET", {}, {})
                document.location.replace("/signin")
            }}>logout</div>
        </div>
        </>
    )
}
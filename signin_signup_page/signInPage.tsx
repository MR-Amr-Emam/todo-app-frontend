import style from "./sign.module.css";

import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { useState } from "react";
import { setUser } from "@/app/reducers/userSlice";
import { Fetch } from "@/app/reducers/globalSlice";
import { setLoading } from "@/app/reducers/globalSlice";
import { Loading } from "@/home_page/loading";


import { CustomInput } from "./customInput";

export function SignInPage(){
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(false)
    const user = useSelector((state:RootState)=>state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    async function signIn(){
        dispatch(setLoading(true))
        var response = await Fetch("/authentication/token", "POST", {}, {username:username, password:password})
        if(!response?.ok){
            setError(true);
            dispatch(setLoading(false))
            return 0;
        }
        var data = await response.json()
        dispatch(setUser({username:data.username, timezone:data.timezone, profileImage: data.profile_image}))
        navigate("/home")
        dispatch(setLoading(false))
    }

    if(user.username != "anonymous"){
    var load = async () => {
        var response = await Fetch("/authentication/perform_user", "GET", {}, {});
        if(response?.ok){
            var data = await response.json()
            dispatch(setUser({username:data.username, timezone:data.timezone, profileImage:data.profile_image}))
            navigate("/home")
        }else{
            dispatch(setUser({username:"anonymous", timezone:"", profileImage:""}))
        }
    }
    load()
    }

    return (
        <>
        <Loading />
        <div className={`${style.main} position-relative`}>
            <div className="position-absolute start-50 translate-middle-x bg-theme-one p-3 rounded
            shadow-color-gray">
                <div className="text-center myfs-6 text-theme-one-emphasis fw-semibold">sign in</div>
                <div className="my-3">
                    <CustomInput setData={setUsername} name="username" hide={false}/>
                    <div className="my-4"></div>
                    <CustomInput setData={setPassword} name="password" hide={true}/>
                </div>
                <div>
                    <div className="text-center my-2"><span className="bg-success p-1 text-light rounded pointer myfs" onClick={()=>{signIn()
                    }}>sign in</span></div>
                    <p className={error?"d-block text-danger myfs-mini":"d-none"}>wrong username or password</p>
                    <p>don't have account? <Link to="/signup" className="text-decoration-underline text-primary pointer">signup</Link></p>
                    <p className="text-decoration-underline text-primary pointer"><Link to="/">
                    <i className="bi bi-chevron-double-left ms-2 pointer"></i>return back</Link></p>
                </div>
            </div>
        </div>
        </>
    )
}

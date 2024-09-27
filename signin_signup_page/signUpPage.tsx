import style from "./sign.module.css"

import { useDispatch} from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Fetch } from "@/app/reducers/globalSlice"
import { setLoading } from "@/app/reducers/globalSlice";
import { Loading } from "@/home_page/loading";
import { setUser } from "@/app/reducers/userSlice";

import { CustomInput } from "./customInput";
import { useState } from "react";

export function SignUpPage(){
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPass, setConfirmPass] = useState("")
    const [error, setError] = useState(false)
    const [theError, setTheError] = useState("")
    const navigate = useNavigate()
    const dispatch = useDispatch()

    async function signUp(){
        dispatch(setLoading(true))
        if(password != confirmPass){setError(true); setTheError("passwords do not match"); dispatch(setLoading(false)); return 0}
        var response = await Fetch("/authentication/create", "POST", {}, {username:username, password:password,
            timezone:Intl.DateTimeFormat().resolvedOptions().timeZone})
        if(!response?.ok){setError(true); setTheError("username already used"); dispatch(setLoading(false)); return 0}
        var data = await response.json()
        dispatch(setUser({username:data.username, profileImage:data.profile_image, timezone:data.timezone}))
        navigate("/home")
        dispatch(setLoading(false))
    }

    return(
        <>
        <Loading />
        <div className={`${style.main} position-relative`}>
            <div className="position-absolute start-50 translate-middle-x bg-theme-one p-3 rounded
            shadow-color-gray">
                <div className="text-center myfs-6 text-theme-one-emphasis fw-semibold">sign up</div>
                <div className="my-3">
                    <CustomInput name="username" setData={setUsername} hide={false}/>
                    <div className="my-4"></div>
                    <CustomInput name="password" setData={setPassword} hide={true}/>
                    <div className="my-4"></div>
                    <CustomInput name="confirm password" setData={setConfirmPass} hide={true}/>
                    <p className={`${error?"d-block":"d-none"} text-danger myfs-mini`}>{theError}</p>
                </div>
                <div>
                    <div className="text-center my-2"><span className="bg-success p-1 text-light rounded pointer myfs" onClick={()=>{signUp()}}>sign up</span></div>
                    <Link to="/"><p className="text-decoration-underline text-primary pointer"><i className="bi bi-chevron-double-left ms-2 pointer"></i>return back</p></Link>
                </div>
            </div>
        </div>
        </>
    )
}
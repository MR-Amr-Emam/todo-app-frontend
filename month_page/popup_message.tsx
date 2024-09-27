import { useEffect, useRef } from "react"
import style from "./month_page.module.css"

import { useDispatch, useSelector } from "react-redux";
import { setMonthGoalPopup } from "@/app/reducers/menusSlice"
import { RootState } from "@/app/store";


export function PopupMessage(){
    const monthGoalPopup = useSelector((state:RootState)=>state.menus.monthGoalPopup)
    const popupRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();
    useEffect(()=>{
        var popup = popupRef.current;
        var close = (e:Event)=>{
            var target = e.target as HTMLDivElement;
            if(popup && !popup.contains(target)){
                dispatch(setMonthGoalPopup(""));
            }
        }
        if(monthGoalPopup){
            document.addEventListener("click", close)
        }

        return(()=>{
            document.removeEventListener("click", close)
        })
    })
    return (
        <div ref={popupRef} className={`${monthGoalPopup?"d-block":"d-none"} ${style["popup-message"]}
        position-fixed z-1 bg-body border rounded-3 shadow-color-gray`}>
            <div className="myp-2 myfs-mini text-success">
                <p>congratulation you have finished month goal <span className="fw-semibold text-black">{monthGoalPopup}</span> <i className="bi bi-check-circle-fill fw-bold text-success"></i></p>
            </div>
        </div>
    )
}
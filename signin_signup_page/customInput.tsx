import style from "./sign.module.css";

import { useState, useRef, useEffect} from "react";

export function CustomInput(props:{name:string, hide:boolean, setData:(data:string)=>void}){
    const [input1Focus, setInput1Focus] = useState(false);
    const [hide, setHide] = useState(props.hide);
    const input1Ref = useRef<HTMLDivElement>(null);
    useEffect(()=>{
        var input1Ele:HTMLDivElement | null = input1Ref.current;
        var input1Unfocus = (e:Event)=>{
            var target:EventTarget | null = e.target;
            if(input1Ele &&!input1Ele.contains(target as HTMLElement)){
                if(input1Ele){
                    setInput1Focus(false);
                }
            }
        }
        if(input1Focus){document.addEventListener("click", input1Unfocus);}
        return(()=>{
            document.removeEventListener("click", input1Unfocus);
        })
    })
    return(
        <div ref={input1Ref} className={`${style["custom-input"]} ${(input1Focus || (input1Ref.current?.children[1] as HTMLInputElement)?.value)
            &&style.focus} bg-white`} onClick={()=>{
            setInput1Focus(true); (input1Ref.current?.children[1] as HTMLInputElement)?.focus()}}>
            <div>{props.name}</div>
            <input className="myfs-mini w-100" type={hide?"password": "text"} onChange={(e)=>{props.setData(e.target.value)}}></input>
            {props.hide&&<div className={`position-absolute end-0 top-50 translate-middle-y mx-2 myfs
            pointer text-secondary`} onClick={()=>{setHide(!hide)}}>{hide?<i className="bi bi-eye-fill"></i>:<i className="bi bi-eye-slash-fill"></i>}</div>}
        </div>
    )
}
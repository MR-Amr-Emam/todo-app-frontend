import { useRef } from "react";

import style from "./month_page.module.css";

interface Props{
    minigoals:Array<string>,
    setMinigoals:(tasks:Array<string>)=>void,
}

export function AddMinigoals(props:Props){
    const taskinputRef = useRef<HTMLInputElement>(null);
    return(
        <div className={`d-flex align-items-center ${style["task-form"]} mb-4`}>
            <div className="d-flex justify-content-between">
                <input ref={taskinputRef} type="text" placeholder="add task"
                className={`border-bottom rounded-start myfs-mini text-dark`}></input>
                <span className="pointer" onClick={()=>{
                    if(!taskinputRef.current){return 0}
                    props.setMinigoals([...props.minigoals, taskinputRef.current.value]);
                    taskinputRef.current.value = "";
                }}>+</span>
            </div>
        </div>
    )
}

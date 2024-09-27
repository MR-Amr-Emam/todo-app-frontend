import {useState, useEffect, useRef, RefObject} from "react";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { checkNote, deleteNote, editNote } from "@/app/reducers/noteSlice";

import { Fetch, setLoading } from "@/app/reducers/globalSlice";
import style from "./home_page.module.css";
import { setNumNotes } from "@/app/reducers/currentDataSlice";

interface Props{
    id: number,
    state: boolean,
    done: boolean,
    theme: 1 | 2 | 3 | 4,
    title: string,
    content: string,
}

export function Note(props:Props){
    const menuEleRef = useRef<HTMLElement>(null);
    const currentIndex = useSelector((state:RootState)=>state.currentData.index);
    const numNotes = useSelector((state:RootState)=>state.currentData.numNotes)
    const [isActive, setIsActive] = useState(false);
    const id = props.id;
    const dispatch = useDispatch();
    const titleInRef = useRef<HTMLInputElement>(null);
    const contentInRef = useRef<HTMLInputElement>(null);
    const [isEdit, setIsEdit] = useState(false);
    useEffect(()=>{
        var closeDisplay = (event:Event):void=>{
            var target = event.target as Node;
            var menuEle = menuEleRef.current as HTMLElement;
            if(target && !menuEle.contains(target)){
                setIsActive(false)
            }
        }
        document.addEventListener("click", closeDisplay)
        return(()=>{document.removeEventListener("click", closeDisplay)})
    })

    async function setDone(){
        dispatch(setLoading(true))
        var data = await Fetch(`/notes/perform_note/${props.id}`, "PUT", {}, {
            done: true,
            title: props.title,
            content: props.content,
        })
        if(!data){return 0}
        dispatch(checkNote({index:currentIndex,id:id}))
        dispatch(setNumNotes([numNotes[0], numNotes[1]+1]))
        dispatch(setLoading(false))
    }
    async function setUpdate(){
        dispatch(setLoading(true))
        var data = await Fetch(`/notes/perform_note/${props.id}`, "PUT", {}, {
            done: props.done,
            title: titleInRef.current?.value,
            content: contentInRef.current?.value,
        })
        if(!data){return 0}
        dispatch(editNote({index:currentIndex, id:id, title:titleInRef.current?.value||props.title, content:contentInRef.current?.value||props.content}));
        setIsEdit(false);
        dispatch(setLoading(false))
    }
    async function setDelete(){
        dispatch(setLoading(true))
        var response = await Fetch(`/notes/perform_note/${props.id}`, "DELETE", {}, {})
        if(!response?.ok){return 0}
        dispatch(deleteNote({index:currentIndex,id:id}))
        dispatch(setLoading(false))
    }

    var themeBg;
    var themeText;    
    if(props.theme==1){
        themeBg = "bg-theme-one";
        themeText = "text-theme-one-emphasis"
    }else if(props.theme==2){
        themeBg = "bg-theme-two";
        themeText = "text-theme-two-emphasis";
    }else if(props.theme==3){
        themeBg = "bg-theme-three";
        themeText = "text-theme-three-emphasis";
    }else if(props.theme==4){
        themeBg = "bg-theme-four";
        themeText = "text-theme-four-emphasis";
    }
    var themeRef = useRef([themeBg, themeText]);
    

    return(
        <div className={`${style.note} ${themeRef.current[0]}`}>
            <div className={`container`}>
                <div className={`${style.title} row flex-nowrap`}>
                    <div className={`col-10 ${themeRef.current[1]}`}>
                        <p className={`${isEdit?"d-none":"d-block"}`}>{props.title}</p>
                        <input ref={titleInRef} className={`${isEdit?"d-block":"d-none"} ${themeRef.current[0]} ${themeRef.current[1]} w-100 border-0 m-2 border-bottom border-secondary fw-semibold`}></input>
                    </div>
                    <div className={`col-2 position-relative`}>
                        <div className={`${style.menuButton}`} onClick={()=>{setIsActive(true)}}>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                        <div className={`${style.menu} shadow rounded ${isActive?"d-block":"d-none"}`}
                        ref={menuEleRef as RefObject<HTMLDivElement>}>
                            <div className={`py-2 px-3 rounded
                             ${props.state?"d-none":"d-block"}`}
                             onClick={()=>{
                                setIsEdit(true);
                                if(titleInRef.current && contentInRef.current){
                                    titleInRef.current.value = props.title;
                                    contentInRef.current.value = props.content;
                                }
                             }}>edit</div>
                            <div className={`py-2 px-3 rounded`}
                            onClick={()=>{setDelete()}}>delete</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`${style.content} row flex-nowrap`}>
                <div className={`${props.state?"d-none":"col-1"}`}>
                    <input type="checkbox" className="myfs form-check-input pointer" onClick={()=>{setDone()}} />
                </div>
                <div className={`col myfs`}>
                    <p className={`${isEdit?"d-none":"d-block"}`}>{props.content}</p>
                    <input ref={contentInRef} className={`${isEdit?"d-block":"d-none"} ${themeRef.current[0]} w-100 border-0 m-2 border-bottom border-secondary`}></input>
                </div>
            </div>
            <div className={`${style.detail} row align-items-center justify-content-start flex-nowrap`}>
                <div className={isEdit?"d-none":"d-block"}>
                    <span className={`${props.state&&props.done&&"bg-success"} ${props.state&&!props.done&&"bg-danger"} text-light myfs-mini myp-1 rounded-pill`}>
                        {props.state&&props.done&&"done"}{props.state&&!props.done&&"not done"}
                    </span>
                </div>
                <div className={`${isEdit?"d-block":"d-none"} d-flex justify-content-end`}>
                    <span className="pointer myfs-mini text-decoration-underline mx-2"
                    onClick={()=>{setIsEdit(false)}}>cancel</span>
                    <span className="pointer myfs-mini text-decoration-underline mx-2"
                    onClick={()=>{setUpdate()}}>edit</span>
                </div>
            </div>
        </div>
    )
}


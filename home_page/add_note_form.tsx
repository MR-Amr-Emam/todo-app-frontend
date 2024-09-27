import { useState, useEffect, useRef } from "react";

import { RootState } from "@/app/store";
import { useSelector, useDispatch } from 'react-redux';
import { setLoading } from "@/app/reducers/globalSlice";
import { setAddForm } from '@/app/reducers/menusSlice';
import { Fetch } from "@/app/reducers/globalSlice";
import style from "./home_page.module.css";
import { addNote } from "@/app/reducers/noteSlice";
import { setNumNotes } from "@/app/reducers/currentDataSlice";


export function AddForm(props:{allNotes:any}){
  const currentDate = useSelector((state:RootState)=>state.currentData.date);
  const currentIndex = useSelector((state:RootState)=>state.currentData.index)
  const [selectOpt, setSelectOpt] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const selectEleRef = useRef<HTMLSelectElement>(null);
  const [selectValue, setSelectValue] = useState<"self_development" | "social_life" | "life_style">("self_development");
  const titleInputRef = useRef<HTMLInputElement>(null);
  const contentInputRef = useRef<HTMLTextAreaElement>(null);
  const numNotes = useSelector((state:RootState)=>state.currentData.numNotes)
  const dispatch = useDispatch();
  const formState = useSelector((state:RootState)=>state.menus.addForm)

  async function CreateNote(){
    dispatch(setLoading(true))
    var date = new Date(currentDate)
    var rand = Math.ceil(Math.random()*4)
    var category = selectValue as "self_development"|"social_life"|"life_style"
    var categoryObj = {"self_development":"SD", "social_life":"SL", "life_style":"LS"}
    var note = {
      title:titleInputRef.current?.value as string,
      content:contentInputRef.current?.value as string, 
      theme:rand as 1|2|3|4,
    }
    var response = await Fetch(
      "/notes/create_note",
      "POST",
      {},
      { ...note,
        category:categoryObj[category],
        date_planned:`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`,
      }
    )
    var data = await response?.json()
    dispatch(addNote({index:currentIndex, id:data.id, category:category, ...note}))
    dispatch(setNumNotes([numNotes[0]+1, numNotes[1]]))
    dispatch(setAddForm());
    dispatch(setLoading(false))
  }

  useEffect(()=>{
    titleInputRef.current?.focus()
    const closeSelectOpt = (e:Event):void=>{
        var selectEle = selectRef.current;
        var target = e.target as HTMLElement;
        if(selectEle && !selectEle.contains(target)){
            if(selectOpt){setSelectOpt(false)}
        }
    }
    const closeForm = (e:Event):void=>{
      var formEle = formRef.current;
      var target = e.target as HTMLElement;
      if(formEle && !formEle.contains(target)){
        if(formState){dispatch(setAddForm())}
      }
    }

    document.addEventListener("click", closeSelectOpt)
    document.addEventListener("click", closeForm)
    return(()=>{
        document.removeEventListener("click", closeSelectOpt)
        document.removeEventListener("click", closeForm)
    })
  }, [selectOpt, formState])

  return(
    <div className={`shadow-color-gray rounded myfs ${style["add-section-form"]}`} ref={formRef}>
      <div>
        <div className="fw-medium text-center border-bottom mx-4 mb-3">add note</div>
        <div className="row">
          <div className="col">
            <select className={`d-none`} ref={selectEleRef}>
              <option value="self_development"></option><option value="social_life"></option><option value="life_style"></option>
            </select>
            <div className={`${style.selectEle} h-100`} ref={selectRef}>
              <div onClick={()=>{setSelectOpt(!selectOpt)}} className="d-flex h-100 myfs-mini justify-content-around align-items-center">
                <span>{selectValue.replace("_", " ")}</span><i className="bi bi-caret-down-fill"></i>
              </div>
              <div className={`${style.selectOptions} ${selectOpt?"d-block":"d-none"} myfs-mini`}>
                <div className={`${selectEleRef.current?.value=="self_development"?style.selected:""}`}
                onClick={()=>{if(selectEleRef.current){selectEleRef.current.value="self_development";setSelectValue("self_development");setSelectOpt(!selectOpt)}}}>self development</div>
                <div className={`${selectEleRef.current?.value=="social_life"?style.selected:""}`}
                onClick={()=>{if(selectEleRef.current){selectEleRef.current.value="social_life";setSelectValue("social_life");setSelectOpt(!selectOpt)}}}>social life</div>
                <div className={`${selectEleRef.current?.value=="life_style"?style.selected:""}`}
                onClick={()=>{if(selectEleRef.current){selectEleRef.current.value="life_style";setSelectValue("life_style");setSelectOpt(!selectOpt)}}}>life style</div>
              </div>
            </div>
          </div>
          <div className="col d-flex justify-content-end align-items-start">
            <div className={`bg-theme-one-emphasis myfs-mini text-light myp-1 rounded pointer`}
            onClick={()=>{CreateNote(); if(titleInputRef.current && contentInputRef.current){titleInputRef.current.value="";contentInputRef.current.value=""}}}>+ add</div>
          </div>
        </div>
      </div>
      <div className={`${style.addnote} border-bottom mb-2`}><input ref={titleInputRef} placeholder="title" id="title" className={`rounded text-dark`} type="text"></input></div>
      <div className={`${style.addnote}`}><textarea ref={contentInputRef} placeholder="content" id="content" className={`rounded text-dark`}
      onChange={(e)=>{
        e.target.style.height = "auto";
        e.target.style.height = `${e.target.scrollHeight}px`;
        }}></textarea></div>
    </div>
  )
}

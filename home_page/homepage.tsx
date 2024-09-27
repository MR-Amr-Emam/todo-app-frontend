"use client"

import style from "./home_page.module.css"

import { Navbar } from "./navbar";
import { SideMenu } from "./side_menu";
import { Calendar } from "./calendar";
import { Note } from "./note";
import { Reminder } from "./reminder";
import { AddForm } from "./add_note_form";

import { useSelector, useDispatch } from 'react-redux';
import { setSubmenu, setNotesCategory, setCalendar, setAddForm } from '@/app/reducers/menusSlice';
import { changeIndex } from "@/app/reducers/noteSlice";
import { RootState } from "@/app/store";


import { Note as NoteType } from "@/app/reducers/noteSlice";
import { MenusState as MenusType } from "@/app/reducers/menusSlice";
import { AddReminder } from "./add_reminder_form";
import { useEffect, useState } from "react";
import { Loading } from "./loading";

export default function HomePage(){
  const allNotes = useSelector((state:RootState)=>state.notes);
  const allReminders = useSelector((state:RootState)=>state.reminders);
  const allGoals = useSelector((state:RootState)=>state.monthGoals);
  const currentIndex = useSelector((state:RootState)=>state.currentData.index);
  const currentNotes = allNotes[currentIndex]?.objs;
  const currentReminders = allReminders[currentIndex]?.objs;
  const menus = useSelector((state: RootState) => state.menus);
  const currentDate = useSelector((state: RootState)=>state.currentData.date);
  const [initialLoad, setInitialLoad] = useState(false)
  const dispatch = useDispatch();
  const notesSelfDev: NoteType[] = [];
  const notesSocialLife: NoteType[] = [];
  const notesLifeStyle: NoteType[] = [];
  currentNotes?.forEach((note)=>{
    if(note.category=="self_development"){
      notesSelfDev.push(note);
    }else if(note.category=="social_life"){
      notesSocialLife.push(note);
    }else if(note.category=="life_style"){
      notesLifeStyle.push(note);
    }
  });
  if(!initialLoad){
    var date = new Date(currentDate);
    changeIndex(date, allNotes, allGoals, dispatch, true);
    setInitialLoad(true);
  }
  const submenuClassActive:string = "border-bottom border-2 border-theme-one-subtle text-theme-one-emphasis"
    return(
    <div>
    <Loading />
    <Navbar />
    <SideMenu />
    <div className={`container-lg ${style.mainbody}`}>
        <div className={`row flex-mowrap ${style.rowdetail}`}>
          <div className={`col`}>
            <span className={`pointer fw-normal`}>
              <span className={`${style["hover"]}mx-4`} onClick={()=>{dispatch(setCalendar());}}><i className="bi bi-calendar-day myfs-6"></i></span>
              <Calendar allNotes={allNotes} allReminders={allReminders} allGoals={allGoals} />
            </span>
            <span className={`fw-semibold myfs-mini`}>
              <span className={style["hover"]} onClick={()=>{
                var date = new Date(currentDate);
                date.setDate(date.getDate()-1);
                changeIndex(date, allNotes, allGoals, dispatch);
              }}><i className="bi bi-chevron-double-left mx-2 pointer"></i></span>
              <span>{currentDate}</span>
              <span className={style["hover"]} onClick={()=>{
                var date = new Date(currentDate);
                date.setDate(date.getDate()+1);
                changeIndex(date, allNotes, allGoals, dispatch);
              }}><i className="bi bi-chevron-double-right mx-2 pointer"></i></span>
            </span>
          </div>
        </div>
        
        <div className={`row justify-content-center landscape flex-nowrap ${style.submenu}`}>
          <div className={`col ${menus.submenu=="all"?submenuClassActive:""}`}><div onClick={()=>{dispatch(setSubmenu("all"))}}>all</div></div>
          <div className={`col ${menus.submenu=="done"?submenuClassActive:""}`}><div onClick={()=>{dispatch(setSubmenu("done"))}}>done</div></div>
          <div className={`col ${menus.submenu=="notdone"?submenuClassActive:""}`}><div onClick={()=>{dispatch(setSubmenu("notdone"))}}>not done</div></div>
          <div className={`col ${menus.submenu=="reminders"?submenuClassActive:""}`}><div onClick={()=>{dispatch(setSubmenu("reminders"))}}>reminders</div></div>
        </div>
        <div className={`${style["add-section"]}`}>
          <div className={`col`}>
            <span className={`${(new Date(new Date().toDateString()) > new Date(currentDate)?"d-none":"d-inline")} bg-theme-one-emphasis text-light myp-1 rounded pointer myfs-mini ${!menus.addForm?"d-block":"d-none"}`}
            onClick={()=>{dispatch(setAddForm())}}>+ add</span>
            <div className={`${menus.addForm?"d-block":"d-none"}`}>
              {menus.submenu!="reminders"?<AddForm allNotes={allNotes}/>:<AddReminder allReminders={allReminders}/>}
            </div>
          </div>
        </div>
        <div className={`${menus.submenu!="reminders"?"d-block":"d-none"}`}>
        <div className={`row flex-nowrap ${style.rowheader} landscape`}>
          <div className={`col ${style.listheader}`}><div><span className=
          "border border-theme-one-subtle bg-theme-one">self develepment</span></div></div>
          <div className={`col ${style.listheader}`}><div><span className=
          "border border-theme-one-subtle bg-theme-one">social life</span></div></div>
          <div className={`col ${style.listheader}`}><div><span className=
          "border border-theme-one-subtle bg-theme-one">life style</span></div></div>
        </div>

        <div className={`row flex-nowrap ${style.rowheader} portrait`}>
          <div className={`col ${style.listheader}`}><div><span  className=
          {`border border-theme-one-subtle pointer myfs text-theme-one-emphasis
           ${menus.notesCategory=="self"?"bg-theme-one":""}`}
          onClick={()=>{dispatch(setNotesCategory("self"))}}>self develepment</span></div></div>

          <div className={`col ${style.listheader}`}><div><span className=
          {`border border-theme-one-subtle pointer myfs text-theme-one-emphasis
           ${menus.notesCategory=="social"?"bg-theme-one":""}`}
           onClick={()=>{dispatch(setNotesCategory("social"))}}>social life</span></div></div>

          <div className={`col ${style.listheader}`}><div><span className=
          {`border border-theme-one-subtle pointer myfs text-theme-one-emphasis
           ${menus.notesCategory=="life"?"bg-theme-one":""}`}
          onClick={()=>{dispatch(setNotesCategory("life"))}}>life style</span></div></div>
        </div>
        <div className="landscape">
        <div className="row flex-nowrap">
          <div className={`col ${style.notecol} d-block`}>
            { notesSelfDev.map((note)=>pushNote(note, menus)) }
          </div>
          <div className={`col ${style.notecol}`}>
            { notesSocialLife.map((note)=>pushNote(note, menus)) }
          </div>
          <div className={`col ${style.notecol}`}>
            { notesLifeStyle.map((note)=>pushNote(note, menus)) }
          </div>
        </div>
        </div>
        <div className="portrait">
            {menus.notesCategory=="self"?notesSelfDev.map((note)=>pushNote(note, menus)):""}
            {menus.notesCategory=="social"?notesSocialLife.map((note)=>pushNote(note, menus)):""}
            {menus.notesCategory=="life"?notesLifeStyle.map((note)=>pushNote(note, menus)):""}
        </div>
      </div>
      <div className={`${menus.submenu=="reminders"?"d-block":"d-none"} container`}>
        {currentReminders?.map((reminder)=>{
          return(
            <div key={reminder.id} className={`row mb-4`}>
              <Reminder id={reminder.id} content={reminder.content} deadLine={reminder.dead_line} state={reminder.state} />
            </div>
          )
        })}
      </div>
      </div>
      </div>
    )
}


function pushNote(note:NoteType, menus:MenusType){
  if(menus.submenu=="all"){
    return(<Note key={note.id} state={note.state}done={note.done} theme={note.theme} title={note.title} content={note.content} id={note.id} />)
  }else if(menus.submenu=="done" && note.done){
    return(<Note key={note.id} state={note.state}done={note.done} theme={note.theme} title={note.title} content={note.content} id={note.id} />)
  }else if(menus.submenu=="notdone" && !note.done){
    return(<Note key={note.id} state={note.state}done={note.done} theme={note.theme} title={note.title} content={note.content} id={note.id} />)
  }
}

import {useState, useRef, useEffect} from "react";

import style from "./home_page.module.css";

import { useDispatch, useSelector } from "react-redux";
import {RootState} from "@/app/store";
//import { changeIndex } from "@/app/noteSlice";
import { addGoals, MonthGoal } from "@/app/reducers/monthGoalSlice";
import { addNotes, changeIndex, Note } from "@/app/reducers/noteSlice";
import { getIndex } from "@/app/reducers/noteSlice";
import { addReminders } from "@/app/reducers/reminderSlice";
import { setCalendar } from "@/app/reducers/menusSlice";
import { setCurrent } from "@/app/reducers/currentDataSlice";


export function Calendar(props:{allNotes:any, allReminders:any, allGoals:any}){
    const dateNow = new Date();
    const currentDate = useSelector((state:RootState)=>state.currentData.date);
    const newRef = useRef<HTMLElement>(null);
    const menus = useSelector((state:RootState)=>state.menus)
    const [calendarDate, setCalendarDate] = useState<string>(currentDate);
    const [isNow, setIsNow] = useState<boolean>(true);
    const [isCurrent, setIsCurrent] = useState<boolean>(true);
    const dispatch = useDispatch();
    useEffect(()=>{
        setCalendarDate(currentDate);
    },[currentDate]);
    useEffect(()=>{
        setIsNow(()=>{
            var date1 = new Date(calendarDate);
            date1.setDate(1);
            var date2 = dateNow;
            date2.setDate(1);
            return date1.toDateString()==date2.toDateString();
        })
        setIsCurrent(()=>{
            var date1 = new Date(calendarDate);
            date1.setDate(1);
            var date2 = new Date(currentDate);
            date2.setDate(1);
            return date1.toDateString()==date2.toDateString();
        })
    }, [calendarDate])
    useEffect(()=>{
        const closeDisplay = (e:Event):void=>{
            var reff = newRef.current as HTMLElement;
            var target = e.target as HTMLElement;
            if(reff && !reff.contains(target)){
                if(menus.calendar){dispatch(setCalendar())}
            }
        }
        if(menus.calendar){document.addEventListener("click", closeDisplay)}
        return(()=>{
            document.removeEventListener("click", closeDisplay)
        })
    })

    var current = new Date(calendarDate);
    current.setDate(1);
    var firstDay = current.getDay();
    current.setMonth(current.getMonth()+1);
    current.setDate(0);
    var daysNum = current.getDate();
    var offset = [];
    var days:number[] = [];
    var weekDays:string[] = ["sat", "sun", "mon", "tue", "wed", "thrus", "fri"];

    for(let i=1; i<=daysNum; i++){days.push(i);}
    for(let i=0; i<=firstDay; i++){offset.push(i);}

    return(
        <div className={`${style.calendar} ${menus.calendar?"d-block":"d-none"} bg-light shadow-color-gray`}
        ref={newRef as React.RefObject<HTMLDivElement>}>
        <div className="d-flex justify-content-center">
            <span className={style["hover"]} onClick={()=>{
            setCalendarDate(()=>{let date = new Date(calendarDate);
            date.setMonth(date.getMonth()-1); date.setDate(1);return date.toDateString();});
            }}><i className="bi bi-chevron-double-left mx-2 pointer"></i></span>
            <span className="text-center">{calendarDate.split(" ")[1]} {calendarDate.split(" ")[3]}</span>
            <span className={style["hover"]} onClick={()=>{
            setCalendarDate(()=>{let date = new Date(calendarDate);
            date.setMonth(date.getMonth()+1); date.setDate(1);return date.toDateString();});
            }}><i className="bi bi-chevron-double-right mx-2 pointer"></i></span>
        </div>
        <div className={`d-flex flex-wrap`}>
            {weekDays.map((day:string)=>{
                return(<div key={day}><div>{day}</div></div>);
            })}
            {offset.map((value)=><div key={value}><div></div></div>)}
            {days.map((day:number)=>{
                return(<div key={day} className={`${style.day} ${isCurrent&&(new Date(currentDate).getDate())==day?style["marked"]:""}`} onClick={()=>{
                    var date = new Date(calendarDate);
                    date.setDate(day);
                    changeIndex(date, props.allNotes, props.allGoals, dispatch);
                    }}><div>{day}</div>{
                    isNow&&day==dateNow.getDate()?
                    <div className={`position-absolute top-100 myfs-toomini text-center z-1`}>today</div>
                    :""
                }</div>);
            })}
        </div>
        </div>
    )
}

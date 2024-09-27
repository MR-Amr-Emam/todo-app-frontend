import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import style from "./home_page.module.css";
import { setReminder } from "@/app/reducers/reminderSlice";
import { setLoading } from "@/app/reducers/globalSlice";
import { RootState } from "@/app/store";



import { Fetch } from "@/app/reducers/globalSlice"

interface Props {
    id: number
    content: string,
    deadLine: string,
    state: boolean,
}

export function Reminder(props: Props){
    const currentDate = useSelector((state:RootState)=>state.currentData.date)
    const currentIndex = useSelector((state:RootState)=>state.currentData.index)
    const dispatch = useDispatch()
    var hours = Number(props.deadLine.split(":")[0])
    var minutes = Number(props.deadLine.split(":")[1])
    var midDay = "am"
    var timeDifference = "";
    var dateNow = new Date();
    var dateCurrent = new Date(currentDate)
    if(dateCurrent.toDateString()==dateNow.toDateString() && !props.state){
        dateCurrent.setHours(hours)
        dateCurrent.setMinutes(minutes)
        if(dateCurrent > dateNow){
            var remTime = (dateCurrent.getTime()-dateNow.getTime()) / 60000
            var remMins = Math.floor(remTime % 60)
            var remHours = Math.floor(remTime/60)
            timeDifference = `(${remHours}:${remMins<10?"0":""}${remMins} remaining)`
        }
    }
    if(hours>12){hours -= 12; midDay = "pm";}
    var deadLine = `${hours}:${minutes<10?"0":""}${minutes} ${midDay}`;

    async function setDone(){
        dispatch(setLoading(true))
        var data = await Fetch(`/notes/perform_reminder/${props.id}`, "PUT", {}, {state:true});
        if(!data){return 0}
        dispatch(setReminder({index: currentIndex, id:props.id}))
        dispatch(setLoading(false))
    }
    return(
        <div className={`${style.reminder} bg-theme-one shadow-color-gray w-50 myp-2 myfs rounded row`}>
            <div className="col-10">{props.content}</div>
            <div className="col-2">{props.state?<i className="bi bi-check-lg text-success myfs"></i>
            :<input type="checkbox" className={`myfs form-check-input pointer`} onClick={()=>{setDone();}} />}</div>
            
            <div className="myfs-toomini mt-2">{deadLine} {timeDifference}</div>
        </div>
    )
}
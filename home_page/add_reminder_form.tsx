import { addReminder } from "@/app/reducers/reminderSlice"
import { useDispatch, useSelector } from "react-redux"
import { useRef, useEffect, useState } from "react"
import { RootState } from "@/app/store";
import { setAddForm } from "@/app/reducers/menusSlice";
import { setLoading } from "@/app/reducers/globalSlice";
import style from "./home_page.module.css"
import { Fetch } from "@/app/reducers/globalSlice";


export function AddReminder(props:{allReminders:any}){
    const currentIndex = useSelector((state:RootState)=>state.currentData.index);
    const currentDate = useSelector((state:RootState)=>state.currentData.date);
    const contentRef = useRef<HTMLTextAreaElement>(null);
    const dispatch = useDispatch();
    const [deadLine, setDeadLine] = useState([0,0,"am"]);
    const formRef = useRef<HTMLDivElement>(null);
    const formState = useSelector((state:RootState)=>state.menus.addForm);
    const [dropMenu, setDropMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(()=>{
        contentRef.current?.focus()
        const closeForm = (e:Event):void=>{
          var formEle = formRef.current;
          var target = e.target as HTMLElement;
          if(formEle && !formEle.contains(target)){
            if(formState){dispatch(setAddForm())}
          }
        }
        function closeMenu(e:Event){
            var menu = menuRef.current
            var target = e.target as HTMLElement
            if(menu && !menu.contains(target)){
                setDropMenu(false)
            }
        }
        if(dropMenu){
            document.addEventListener("click", closeMenu)
        }
        document.addEventListener("click", closeForm)
        return(()=>{
            document.removeEventListener("click", closeForm)
            document.removeEventListener("click", closeMenu)
        })
    }, [formState, dropMenu])

    async function CreateReminder(){
        dispatch(setLoading(true))
        var date = new Date(currentDate)
        var dead_line = `${deadLine[2]=="am"?deadLine[0]:Number(deadLine[0])+12}:${deadLine[1]}`
        var response = await Fetch("/notes/create_reminder", "POST", {}, {
            dead_line: dead_line,
            content: contentRef.current?.value,
            date_planned:`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`,
        })
        var data = await response?.json()
        if(data==undefined){
            return 0
        }
        dispatch(addReminder({index:currentIndex, id:data.id, dead_line:dead_line, content:contentRef.current?.value||"content"}));
        dispatch(setAddForm());
        if(contentRef.current){contentRef.current.value = "";}
        dispatch(setLoading(false))
    }

    return(
        <div ref={formRef} className={`shadow-color-gray rounded myfs ${style["add-section-form"]}`}>
            <div>
                <p className="text-center fw-medium mx-4 border-bottom">add reminder</p>
                <div className={`${style["time-input"]} myp-1 bg-secondary rounded`}>
                    <div>
                        <input type="number" max="12" min="0" onChange={(e)=>{setDeadLine([e.target.value, deadLine[1], deadLine[2]])}}></input>
                        <span className="text-white fw-bold">:</span>
                        <input type="number" max="59" min="0" onChange={(e)=>{setDeadLine([deadLine[0], e.target.value, deadLine[2]])}}></input>
                        <span className="text-white fw-bold">:</span>
                        <div className="pointer">
                            <div onClick={()=>{setDropMenu(true)}}>{deadLine[2]}</div>
                            <div ref={menuRef} className={`${dropMenu?"d-block":"d-none"} shadow-color-gray`}>
                                <div onClick={(e)=>{setDeadLine([deadLine[0], deadLine[1], "am"]); setDropMenu(false)}}>am</div>
                                <div onClick={(e)=>{setDeadLine([deadLine[0], deadLine[1], "pm"]); setDropMenu(false)}}>pm</div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <i className="bi bi-clock text-white text-end"></i>
                    </div>
                </div>
            </div>
            <div>
                <div>
                    <textarea ref={contentRef} className={`${style["reminder-input"]} border border-white rounded text-dark`}
                    placeholder="reminder"></textarea>
                </div>
            </div>
            <div className={"d-flex justify-content-center"}>
                <div className={`bg-theme-one-emphasis myfs-mini text-light myp-1 rounded pointer text-center`}
                onClick={()=>{CreateReminder()}}>+ add</div>
            </div>
        </div>
    )
}
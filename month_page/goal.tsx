import {useState, useEffect, useRef} from "react"
import { useDispatch, useSelector } from "react-redux";

import style from "./month_page.module.css"
import { AddMinigoal, CheckMinigoal } from "@/app/reducers/monthGoalSlice";
import { setMonthGoalPopup } from "@/app/reducers/menusSlice";
import { RootState } from "@/app/store";
import { setLoading } from "@/app/reducers/globalSlice";

import { Fetch } from "@/app/reducers/globalSlice"

interface Props {
    id: number,
    state: boolean,
    theme: 1 | 2 | 3 | 4,
    title: string,
    miniGoals: string[],
    miniGoalsState: number,
}

export function Goal(props: Props){
    var monthIndex = useSelector((state:RootState)=>state.currentData.monthIndex);
    var [isaddMinigoals, setIsaddMinigoals] = useState(false);
    var miniGoals = props.miniGoals;
    var themes = [
        ["bg-theme-one", "text-theme-one-emphasis"],
        ["bg-theme-two", "text-theme-two-emphasis"],
        ["bg-theme-three", "text-theme-three-emphasis"],
        ["bg-theme-four", "text-theme-four-emphasis"],
    ]
    var theme = themes[props.theme-1];
    var themeRef = useRef(theme);
    var [addMinigoals, setAddMinigoals] = useState<boolean>(false);
    var addMinigoalsRef = useRef<HTMLDivElement>(null);
    var inputRef = useRef<HTMLInputElement>(null);
    var [error, setError] = useState(false);
    var dispatch = useDispatch();
    var miniGoalCount = 0;
    useEffect(()=>{
        var addMinigoalsEle:HTMLDivElement | null = addMinigoalsRef.current;
        var closeForm = (e:Event)=>{
            var target:EventTarget | null = e.target;
            if(addMinigoalsEle &&!addMinigoalsEle.contains(target as HTMLElement)){
                if(addMinigoals){
                    setError(false)
                    setAddMinigoals(false);
                }
                if(inputRef.current && inputRef.current.value){inputRef.current.value="";console.log("clicked")}
            }
        }
        document.addEventListener("click", closeForm);
        return(()=>{
            document.removeEventListener("click", closeForm);
        })
    })
    async function SetMiniGoal(miniGoalId:number){
        console.log(miniGoalId)
        var response = await Fetch(`/notes/perform_goal/${props.id}`, "PUT", {}, {set_miniGoal:miniGoalId})
        if(!response?.ok){return(0)}
        dispatch(CheckMinigoal({index:monthIndex, id:props.id, minigoal:Number(miniGoalId)}));
        if((2**(props.miniGoals.length)-1)==(props.miniGoalsState | 1<<miniGoalId-1)){
            dispatch(setMonthGoalPopup(props.title));
        }
    }
    async function CreateMiniGoal(){
        dispatch(setLoading(true))
        if(!inputRef.current){setError(true); dispatch(setLoading(false)); return 0}
        var response = await Fetch(`/notes/perform_goal/${props.id}`, "PUT", {}, {miniGoal:inputRef.current.value})
        if(!response?.ok){setError(true); dispatch(setLoading(false)); return 0}
        dispatch(AddMinigoal({index:monthIndex, id: props.id, minigoal:inputRef.current.value}));
        setAddMinigoals(false);
        setError(false)
        inputRef.current.value="";
        dispatch(setLoading(false))
    }
    return(
        <div className={`${style.goal} ${themeRef.current[0]} mb-4 p-2 rounded`}>
            <div className={`${themeRef.current[1]} myfs-6 fw-semibold`}>
                <div>{props.title}</div>
                <div className={`pointer ${isaddMinigoals?style.clicked:""}`} onClick={()=>{setIsaddMinigoals(!isaddMinigoals); setAddMinigoals(false)}}><i className={`bi bi-caret-right-fill`}></i></div>
            </div>
            <div className={`${isaddMinigoals?"d-block":"d-none"}`}>
                <div>
                {miniGoals.map((miniGoal)=>{
                    let done = props.miniGoalsState & 1<<miniGoalCount;
                    miniGoalCount++;
                    return (
                    <div key={miniGoalCount} className={style.content}>
                        <div>{miniGoal}</div>
                        {done?<i className="bi bi-check myfs text-success fw-bold"></i>:
                        <div><input id={`${miniGoalCount}`} type="checkbox" className="form-check-input myfs"
                        onClick={(e)=>{
                            var miniGoalId = (e.target as HTMLElement)?.getAttribute("id")
                            if(miniGoalId){SetMiniGoal(Number(miniGoalId))}}} /></div>}
                    </div>
                )})}
                </div>
                <div className={`${(!addMinigoals && !props.state)?"d-flex":"d-none"} flex-row-reverse mt-2`}>
                    <div className={`pointer`} onClick={()=>{
                        setAddMinigoals(true);
                    }}>add task</div>
                </div>
                <div ref={addMinigoalsRef} className={`${addMinigoals?"d-block":"d-none"}`}>
                    <div className={`${style["form-container"]}`}>
                        <div className={`${style["task-form"]} myfs-mini`}>
                            <div className="position-relative w-75">
                                <input ref={inputRef} type="text" placeholder="add task" className={`rounded myfs-mini text-dark w-100`}></input>
                                <span className={`myfs-6 pointer position-absolute end-0 mx-2`} onClick={()=>{
                                    CreateMiniGoal()
                                }}>+
                                </span>
                            </div>
                            <p className={`${error?"d-block":"d-none"} text-danger myfs-mini`}>add minigoal</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
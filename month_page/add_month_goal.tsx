import { useDispatch, useSelector } from "react-redux"
import { useRef, useEffect, useState } from "react"

import { RootState } from "@/app/store";
import { setMonthGoalForm } from "@/app/reducers/menusSlice";
import { createMonthGoal } from "@/app/reducers/monthGoalSlice";
import { setLoading } from "@/app/reducers/globalSlice";

import { AddMinigoals } from "./add_minigoals";
import style from "./month_page.module.css"
import { Goal } from "./goal";
import { Fetch } from "@/app/reducers/globalSlice";


export function AddMonthGoal(){
    const currentDate = useSelector((state:RootState)=>state.currentData.date)
    const GoalTitleRef = useRef<HTMLInputElement>(null);
    const dispatch = useDispatch();
    const monthGoalForm = useSelector((state:RootState)=>state.menus.monthGoalForm);
    const monthIndex = useSelector((state:RootState)=>state.currentData.monthIndex);
    const formRef = useRef<HTMLDivElement>(null);
    const [minigoals, setMinigoals] = useState<Array<string>>([]);
    const [error, setError] = useState(false);
    var count = 0;

    useEffect(()=>{
        GoalTitleRef.current?.focus()
        const closeForm = (e:Event):void=>{
          var formEle = formRef.current;
          var target = e.target as HTMLElement;
          if(formEle && !formEle.contains(target)){
            if(monthGoalForm){dispatch(setMonthGoalForm()); setError(false);}
          }
        }
    
        document.addEventListener("click", closeForm)
        return(()=>{
            document.removeEventListener("click", closeForm)
        })
    }, [monthGoalForm])
    async function CreateGoal(){
        dispatch(setLoading(true))
        if(!GoalTitleRef.current?.value){return 0}
        var date = new Date(currentDate)
        var rand = Math.ceil(Math.random()*4)
        date.setDate(1);
        var response = await Fetch("/notes/create_goal", "POST", {}, {
            title: GoalTitleRef.current.value,
            miniGoals: minigoals,
            theme: rand,
            date_planned: `${date.getFullYear()}-${date.getMonth()+1}-1`,
        })
        if(!response?.ok){setError(true); dispatch(setLoading(false)); return 0}
        dispatch(createMonthGoal({index:monthIndex, goalTitle:GoalTitleRef.current.value, minigoals:minigoals, theme:rand as 1|2|3|4}));
        dispatch(setMonthGoalForm());
        GoalTitleRef.current.value = "";
        setMinigoals([]);
        setError(false)
        dispatch(setLoading(false))
    }

    return(
        <div ref={formRef} className={`shadow-color-gray rounded myfs myp-2 ${style["form-container"]}`}>
            
            <p className="text-center fw-medium border-bottom mx-4">new Goal</p>
            <div>
                <input ref={GoalTitleRef} placeholder="goal title" className={`myfs text-dark myp-1 border-bottom mb-2`} type="text"></input>
            </div>
            <div>
                <div>
                    <ul className="mx-3 myfs-mini">
                        {minigoals.map((task)=>{count++; return <li key={count}>{task}</li>;})}
                    </ul>
                </div>
                <AddMinigoals minigoals={minigoals} setMinigoals={setMinigoals} />
            </div>
            <p className={`${error?"d-block":"d-none"} myfs-mini text-danger`}>fill all fields</p>
            <div className="text-center">
                <span className={`bg-theme-one-emphasis myfs-mini text-light myp-1 rounded pointer`}
                onClick={()=>{CreateGoal()}}>+ add</span>
            </div>
        </div>
    )
}
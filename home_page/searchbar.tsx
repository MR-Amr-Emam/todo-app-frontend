import { useNavigate } from "react-router-dom";
import {useRef, useEffect} from "react";

import style from "./home_page.module.css";

import { changeIndex, Note } from "@/app/reducers/noteSlice";
import { Reminder } from "@/app/reducers/reminderSlice";
import { MonthGoal } from "@/app/reducers/monthGoalSlice";

import { useState } from "react";

import { useSelector, useDispatch } from 'react-redux';
import { setSearchbar, setSubmenu } from '../app/reducers/menusSlice';
import { RootState } from "../app/store";
import { Fetch } from "@/app/reducers/globalSlice";


export function SearchBar(){
    var searchRef = useRef<HTMLDivElement>(null);
    const menus = useSelector((state:RootState)=>state.menus);
    const allNotes = useSelector((state:RootState)=>state.notes);
    const allGoals = useSelector((state:RootState)=>state.monthGoals);
    const [searchResult, setSearchResult] = useState<SearchObj[]>();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(()=>{
        (document.querySelector("#search-bar-input") as HTMLInputElement)?.focus()
        function closeDisplay(event:Event){
            var target = event.target as Node;
            if(searchRef.current && !searchRef.current.contains(target)){
                dispatch(setSearchbar()); setSearchResult([]);
                (document.querySelector("#search-bar-input") as HTMLInputElement).value = "";
                
            }
        }
        if(menus.searchbar && !menus.sidemenu){
            document.addEventListener("click", closeDisplay);
        }
        return(()=>{document.removeEventListener("click", closeDisplay)})
    })

    return(
        <div className={`${menus.searchbar?style.active:""} ${style.searchbar} position-relative top-50 translate-middle-y rounded-pill myfs-mini`}
        ref={searchRef}>
            <div>
                <i className="bi bi-search"></i>
            </div>
            <div className={`${menus.searchbar?style["search-active"]:""}`}>
                <input id="search-bar-input" type="text" placeholder="search..." onChange={async (e)=>{
                    var ele=e.target as HTMLInputElement;
                    var searchResult = await getSearch(ele.value);
                    setSearchResult(searchResult)}}></input>
            </div>
            <div className={`${style["search-results"]}`}>
                { searchResult&&searchResult.map((searchResult)=>{
                    var count = Math.random();
                    var date = searchResult.date;
                    var type = searchResult.type;
                    var content = searchResult.content;
                    var dateObj = new Date(date);
                    return  <div key={count} className="p-2 rounded pointer" onClick={()=>{
                        changeIndex(dateObj, allNotes, allGoals, dispatch);
                        var to;
                        if(type=="note"){to="home"; dispatch(setSubmenu("all"));}
                        else if(type=="reminder"){to="home"; dispatch(setSubmenu("reminders"));}
                        else if(type=="goal"){to="monthgoals";}
                        navigate(`/${to}`);
                    }}>
                    <p className="myfs-mini">{content}</p>
                    <div className="myfs-toomini text-end mx-2">{date} {type}</div>
                    </div>  
                })}
            </div>
        </div>
    )
}

async function getSearch(search:string){
    if(!search){return []};
    var response = await Fetch(`/notes/search/${search}`, "GET", {}, {})
    var data:SearchObj[] = await response?.json()
    return data
}

interface SearchObj{
    date:string;
    type:string;
    content:string;
}
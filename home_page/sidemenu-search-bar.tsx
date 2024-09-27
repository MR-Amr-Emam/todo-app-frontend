import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {useRef, useEffect, useState} from "react"

import { RootState } from "@/app/store"
import { Fetch } from "@/app/reducers/globalSlice"
import { changeIndex } from "@/app/reducers/noteSlice";
import { setSearchbar, setSidemenu } from "@/app/reducers/menusSlice";
import { setSubmenu } from "@/app/reducers/menusSlice";

import style from "./home_page.module.css"

export function SidemenuSearchBar(){
    const allNotes = useSelector((state:RootState)=>state.notes)
    const allGoals = useSelector((state:RootState)=>state.monthGoals)
    const menus = useSelector((state:RootState)=>state.menus)
    const searchBarRef = useRef<HTMLDivElement>(null);
    const [searchResult, setSearchResult] = useState<SearchObj[]>();
    const navigate = useNavigate()
    const dispatch = useDispatch()
    useEffect(()=>{
        function close(e:Event){
            var searchbar = searchBarRef.current
            var target = e.target as HTMLElement
            if(searchbar && !searchbar.contains(target)){
                dispatch(setSearchbar())
            }
        }
        if(menus.searchbar && menus.sidemenu){
            document.addEventListener("click", close)
        }
        return()=>{document.removeEventListener("click", close)}
    })
    return(
        <div className={style["sidemenu-search-bar"]} ref={searchBarRef}>
            <div>
                <div><i className="bi bi-search"></i><input placeholder="search..." type="text" onChange={async (e)=>{
                    var ele=e.target as HTMLInputElement;
                    var searchResult = await getSearch(ele.value);
                    setSearchResult(searchResult)}} /></div>
            </div>
            <div>
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
                        dispatch(setSearchbar())
                        dispatch(setSidemenu())
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
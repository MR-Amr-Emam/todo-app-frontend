"use client"
import style from "./month_page.module.css"

import Chart from "chart.js/auto";
import Cropper from "cropperjs"

import { Navbar } from "../home_page/navbar";
import { Goal } from "./goal";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store";
import { setMonthGoalForm } from "@/app/reducers/menusSlice";
import { setBio, setMonthPhoto } from "@/app/reducers/currentDataSlice"
import { Loading } from "@/home_page/loading"
import { MonthGoal as MonthGoalType } from "@/app/reducers/monthGoalSlice";
import { changeIndex } from "@/app/reducers/noteSlice";
import { FetchFree, setLoading, Fetch } from "@/app/reducers/globalSlice"
import { PopupMessage } from "./popup_message";
import { AddMonthGoal } from "./add_month_goal";
import { useEffect, useRef, useState } from "react";
import { SideMenu } from "@/home_page/side_menu";


export default function MonthPage(){
    const monthIndex = useSelector((state:RootState)=>state.currentData.monthIndex);
    const currentDate = useSelector((state:RootState)=>state.currentData.date);
    const allMonthGoals = useSelector((state:RootState) => state.monthGoals );
    const allNotes = useSelector((state:RootState) => state.notes );
    const monthGoalForm = useSelector((state:RootState)=>state.menus.monthGoalForm);
    const numNotes = useSelector((state:RootState)=>state.currentData.numNotes)
    const monthPhoto = useSelector((state:RootState) => state.currentData.monthPhoto );
    const daysProgress = useSelector((state:RootState)=>state.currentData.daysProgress);
    const bio = useSelector((state:RootState)=>state.currentData.bio)
    const [initialLoad, setInitialLoad] = useState(false);
    const [editBio, setEditBio] = useState(false);
    const [portraitGoalsDone, setPortraitGoalsDone] = useState(false);
    const [editImage, setEditImage] = useState(false);
    const [editImageUrl, setEditImageUrl] = useState("");
    const editImageRef = useRef<HTMLImageElement>(null);
    const chartRef = useRef<HTMLCanvasElement>(null);
    const monthPhotoRefLandscape = useRef<HTMLImageElement>(null);
    const monthPhotoRefPortrait = useRef<HTMLImageElement>(null);
    const bioInputRef = useRef<HTMLInputElement>(null);
    const bioInputPortraitRef = useRef<HTMLInputElement>(null);
    const cropperRef = useRef<Cropper>()
    const notDoneMonthGoals: MonthGoalType[] = [];
    const doneMonthGoals: MonthGoalType[] = [];
    const dispatch = useDispatch();
    if(!initialLoad){
        var date = new Date(currentDate)
        changeIndex(date, allNotes, allMonthGoals, dispatch, true)
        setInitialLoad(true)
    }
    var func = ()=>{let arr=[]; for(let i=1; i<=30; i++){arr.push(i);} return arr}
    useEffect(()=>{
        var canvas = chartRef.current;
        if(canvas){
            var chart = new Chart(
                canvas,{
                    type:"line",
                    data:{
                        labels: func(),
                        datasets:[{label:"statistics",data:daysProgress, borderColor:"#ff4566", backgroundColor:"#ff4566",
                        pointRadius: 0,
                        }],
                    },
                    options:{
                        plugins:{legend:{display:false}},
                        scales:{
                            x:{grid:{display:false}, min:0, max:100},
                            y:{ticks:{callback:(value)=>`${value}%`}, min:0, max:100},
                        }
                    }
                }
            )
        }
        return(()=>{
            chart?.destroy();
        })
    }, [currentDate, daysProgress])

    useEffect(()=>{
        var bioEle = bioInputRef.current as HTMLInputElement;
        var bioElePortrait = bioInputPortraitRef.current as HTMLInputElement;
        function close(e:Event){
            if(e.target && !bioEle.contains(e.target as HTMLElement) && !bioElePortrait.contains(e.target as HTMLElement)){
                setEditBio(false);
            }
        }
        if(bioEle && editBio){
            document.addEventListener("click", close);
        }
        if(editImage && editImageRef.current){
            cropperRef.current= new Cropper(editImageRef.current, {
                aspectRatio:1,
            })
        }
        return(()=>{document.removeEventListener("click", close)})

    })

    async function sendBio(){
        dispatch(setLoading(true))
        var bioToSend = ""
        if(bioInputRef.current?.value != bio){
            bioToSend = bioInputRef.current?.value as string
        }else if(bioInputPortraitRef.current?.value != bio){
            bioToSend = bioInputPortraitRef.current?.value as string
        }
        if(!bio){return 0}
        var date = new Date(currentDate)
        var response = await Fetch(`/notes/perform_month/${date.getFullYear()}-${date.getMonth()+1}`,
        "PUT", {}, {bio:bioToSend})
        dispatch(setBio(bioToSend));
        setEditBio(false)
        dispatch(setLoading(false))
    }

    function displayCrop(inputEle:HTMLInputElement){
        var images = inputEle?.files
        if(!images){return 0}
        var image = images[0] as File
        inputEle.value=""
        setEditImageUrl(URL.createObjectURL(image))
        setEditImage(true)
    }

    function sendMonthPhoto(){
        if(!cropperRef.current){setEditImage(false); return 0;}
        dispatch(setLoading(true))
        cropperRef.current?.getCroppedCanvas().toBlob(async (image)=>{
            var date = new Date(currentDate)
            var response = await FetchFree(`/notes/perform_month_photo/${date.getFullYear()}-${date.getMonth()+1}`,
                "POST", {"Content-Type":"image/jpg"}, image as File)
            if(!response?.ok){return 0}
            if(!monthPhotoRefLandscape.current){return 0;}
            monthPhotoRefLandscape.current.src = monthPhoto
            if(!monthPhotoRefPortrait.current){return 0;}
            monthPhotoRefPortrait.current.src = monthPhoto
            cropperRef.current?.destroy()
            setEditImage(false);
            dispatch(setLoading(false))
        }, "image/jpeg")
    }
    
    
    function leftMonth(){
        var date = new Date(currentDate);
        date.setDate(1);
        date.setMonth(date.getMonth()-1);
        changeIndex(date, allNotes, allMonthGoals, dispatch);
    }

    function rightMonth(){
        var date = new Date(currentDate);
        date.setDate(1);
        date.setMonth(date.getMonth()+1);
        changeIndex(date, allNotes, allMonthGoals, dispatch);
    }

    useEffect(()=>{bioInputRef.current?.focus()}, [editBio])

    allMonthGoals[monthIndex]?.objs.forEach((monthGoal)=>{
        if(!monthGoal.state ||(monthGoal.state && !monthGoal.done)){
            notDoneMonthGoals.push(monthGoal);
        }else if(monthGoal.state && monthGoal.done){
            doneMonthGoals.push(monthGoal);
        }
    })
    return(
    <div>
    <Loading />
    <Navbar />
    <SideMenu />
    <PopupMessage />
    <div className={`${editImage?"d-block":"d-none"} position-fixed z-3 start-0 top-0 w-100 h-100 bg-white opacity-25`} onClick={()=>{setEditImage(false); cropperRef.current?.destroy();}}></div>
    <div className={`${editImage?"d-block":"d-none"} position-fixed start-50 top-50 translate-middle`} style={{width:"calc(35 * var(--size-unit))", zIndex:4}}>
        {editImage?<img ref={editImageRef} src={editImageUrl} className="w-100" />:""}
        <div className="w-100 my-2 rounded bg-theme-one-emphasis text-center text-white myp-1 myfs pointer" onClick={()=>{sendMonthPhoto()}}>change image</div>
    </div>
    <div className={style.mainbody}>
        <div className={`${style.header} container`}>
            <div className="landscape myfs-5">
                <span onClick={()=>{leftMonth()}}><i className="bi bi-chevron-double-left pointer"></i></span>
                <span className="fw-semi-bold mx-5">{currentDate.split(" ")[1]} {currentDate.split(" ")[3]}</span>
                <span onClick={()=>{rightMonth()}}><i className="bi bi-chevron-double-right pointer"></i></span>
            </div>

            <div className="portrait text-center myfs-5">
                <span onClick={()=>{leftMonth()}}><i className="bi bi-chevron-double-left pointer"></i></span>
                <span className="fw-semi-bold mx-5">{currentDate.split(" ")[1]} {currentDate.split(" ")[3]}</span>
                <span onClick={()=>{rightMonth()}}><i className="bi bi-chevron-double-right pointer"></i></span>
            </div>

            <div className="landscape">
            <div className={`${style["row-container"]} d-flex justify-content-between`}>
                <div className="myfs-6 rounded myp-1 w-100">
                    <div className="text-success">{Math.floor(numNotes[1]/numNotes[0] * 100||0)}%</div>
                    <div className={`${style["month-progress"]} text-success fw-semibold myfs-5`}>month progress</div>
                    <p><i className="bi bi-file-earmark-ppt-fill text-theme-one-emphasis"></i> all your notes are {numNotes[0]}</p>
                    <p><i className="bi bi-bookmark-check-fill text-theme-one-emphasis"></i> completed notes are {numNotes[1]}</p>
                    <div>
                        <div className="text-theme-one-emphasis fw-semibold">month bio <i className="bi bi-pencil-fill text-secondary myfs-mini pointer" onClick={()=>{setEditBio(true);}}></i></div>
                        {!editBio?<p>{bio}</p>:<><input ref={bioInputRef} type="text" defaultValue={bio} className="border-bottom" />
                        <span className="text-secondary pointer myfs-mini" onClick={()=>{sendBio()}}>edit</span></>}
                    </div>
                </div>
                <div className="myfs">
                    <div className="position-relative">
                        <img src={monthPhoto} ref={monthPhotoRefLandscape} className="rounded" alt="month-image"/>
                        <div className={`position-absolute w-100 h-100 bg-black rounded top-0`}>
                            <p className="position-absolute text-white text-center w-100 start-0 top-50 translate-middle-y myfs-5">change image</p>
                            <label htmlFor="month-image-input" className="position-absolute w-100 h-100 pointer" />
                            <input id="month-image-input" className="d-none" type="file" onChange={(e)=>{displayCrop(e.target)}} />
                        </div>
                    </div>
                    <p className="text-center fw-semibold text-theme-one-emphasis">photo of the month</p>
                </div>
            </div>
            </div>



            <div className="portrait">
            <div className={`${style["row-container"]} d-flex flex-column-reverse`}>
                <div className="myfs-6 rounded myp-1 text-center">
                    <div>
                    <div className="text-success">{Math.floor(numNotes[1]/numNotes[0] * 100||0)}%</div>
                    <div className={`${style["month-progress"]} text-success fw-semibold myfs-5`}>month progress</div>
                    </div>

                    <div>
                    <p><i className="bi bi-file-earmark-ppt-fill text-theme-one-emphasis"></i> all your notes are {numNotes[0]}</p>
                    <p><i className="bi bi-bookmark-check-fill text-theme-one-emphasis"></i> completed notes are {numNotes[1]}</p>
                    <div>
                        <div className="text-theme-one-emphasis fw-semibold">month bio <i className="bi bi-pencil-fill text-secondary myfs-mini pointer visible" onClick={()=>{setEditBio(true);}}></i></div>
                        {!editBio?<p>{bio}</p>:<><input ref={bioInputPortraitRef} type="text" defaultValue={bio} className="border-bottom text-center" />
                        <span className="text-secondary pointer myfs-mini" onClick={()=>{sendBio()}}>edit</span></>}
                    </div>
                    </div>
                </div>
                <div className={`myfs position-relative start-50 translate-middle-x`}>
                    <div className="position-relative">
                        <img src={monthPhoto} ref={monthPhotoRefPortrait} className="rounded" alt="month-image"/>
                        <div className={`position-absolute w-100 h-100 bg-black rounded top-0`}>
                            <p className="position-absolute text-white text-center w-100 start-0 top-50 translate-middle-y myfs-5">change image</p>
                            <label htmlFor="month-image-input" className="position-absolute w-100 h-100 pointer" />
                            <input id="month-image-input" className="d-none" type="file" onChange={(e)=>{displayCrop(e.target)}} />
                        </div>
                    </div>
                    <p className="text-center fw-semibold text-theme-one-emphasis">photo of the month</p>
                </div>
            </div>
            </div>
            <div>
                <canvas ref={chartRef} id="statistics" className={style["statistics"]}></canvas>
            </div>
        </div>
        <div className={`container`}>
            <div className={`my-3`}>
                <span className={`${!monthGoalForm?"d-inline":"d-none"} bg-theme-one-emphasis text-light myfs rounded pointer myp-1`} onClick={()=>{
                    dispatch(setMonthGoalForm());
                }}>add month goal</span>
                <div className={`${monthGoalForm?"d-block":"d-none"}`}><AddMonthGoal /></div>
            </div>
            <div className={`row mt-4 mb-3 landscape`}>
                <div className="col">
                    <span className="border rounded border-theme-one-subtle bg-theme-one p-1">not done</span>
                </div>
                <div className="col">
                    <span className="border rounded border-theme-one-subtle bg-theme-one p-1">done</span>
                </div>
            </div>
            <div className={`portrait row mt-4 mb-3 myfs-6`}>
                <div className="col">
                    <span className={`border rounded border-theme-one-subtle text-theme-one-emphasis ${portraitGoalsDone?"":
                    "bg-theme-one"} myp-1 pointer`} onClick={()=>{setPortraitGoalsDone(false)}}>not done</span>
                </div>
                <div className="col">
                    <span className={`border rounded border-theme-one-subtle text-theme-one-emphasis ${portraitGoalsDone?"bg-theme-one":
                    ""} myp-1 pointer`} onClick={()=>{setPortraitGoalsDone(true)}}>done</span>
                </div>
            </div>

            <div className={`landscape row mb-3`}>
                <div className={`col`}>
                    {notDoneMonthGoals.map((monthGoal)=><Goal key={monthGoal.id} id={monthGoal.id} state={monthGoal.state} theme={monthGoal.theme} title={monthGoal.title} miniGoals={monthGoal.miniGoals} miniGoalsState={monthGoal.miniGoalsState} />)}
                </div>
                <div className={`col`}>
                    {doneMonthGoals.map((monthGoal)=><Goal key={monthGoal.id} id={monthGoal.id} state={monthGoal.state} theme={monthGoal.theme} title={monthGoal.title} miniGoals={monthGoal.miniGoals} miniGoalsState={monthGoal.miniGoalsState} />)}
                </div>
            </div>

            <div className={`portrait row mb-3`}>
                <div className={`${portraitGoalsDone?"d-none":"d-block"} col`}>
                    {notDoneMonthGoals.map((monthGoal)=><Goal key={monthGoal.id} id={monthGoal.id} state={monthGoal.state} theme={monthGoal.theme} title={monthGoal.title} miniGoals={monthGoal.miniGoals} miniGoalsState={monthGoal.miniGoalsState} />)}
                </div>
                <div className={`${portraitGoalsDone?"d-block":"d-none"} col`}>
                    {doneMonthGoals.map((monthGoal)=><Goal key={monthGoal.id} id={monthGoal.id} state={monthGoal.state} theme={monthGoal.theme} title={monthGoal.title} miniGoals={monthGoal.miniGoals} miniGoalsState={monthGoal.miniGoalsState} />)}
                </div>
            </div>
        </div>
    </div>
    </div>
    )
}
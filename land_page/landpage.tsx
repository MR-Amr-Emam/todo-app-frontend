import {useState, useEffect, useRef} from "react";


import { Link } from "react-router-dom";

import style from "./land_page.module.css";

export default function LandPage(){
    var [dynamicText, setDynamicText] = useState<string>("");

    useEffect(()=>{
        var texts = ["enjoy outstanding experience", "put daily tasks", "make your time organised"];
        var current = [0,0];
        var text = ""
        var erase = false;
        var time=400;
        var interval = time;
        var run=true

        const dynamicTextInterval = () =>{
            setTimeout(()=>{
                if(!current[1] && erase){erase = false; current[0]++; if(current[0]==3){current[0]=0};}
                else if(erase){current[1]--; text = text.slice(0, -1); setDynamicText(text); interval=((time*Math.random()*0.5+0.5))/2;}
                else{
                    text += texts[current[0]][current[1]]
                    setDynamicText(text)
                    current[1] += 1;
                    interval=time*Math.random()*0.5+0.5;
                    if(current[1]==texts[current[0]].length){
                        erase = true;
                        interval = 1500;
                    }
                }
                if(run){dynamicTextInterval()}
            }, interval);
        }
        dynamicTextInterval()
        return (()=>{run=false})
    }, [])

    return(
        <div>
            <div>
                <div className={` container-fluid ${style["main-section"]} `}>
                    <div className={`${style["main-bar"]}`}>
                        <Link to="/signin"><div className={`text-light border border-2 p-1 rounded myfs pointer`}>sign in</div></Link>
                        <Link to="/signup"><div className={`bg-success border border-2 border-success text-light p-1 rounded myfs pointer`}>get started</div></Link>
                    </div>
                    <div className={`landscape row`}>
                        <div className="col-6 d-flex justify-content-center">
                            <div>
                                <p className={style["main-font"]}>get ready and change your life</p>
                                <p className="myfs-4 text-center text-body fw-semibold">start now and enjoy the journey</p>
                            </div>
                        </div>
                        <div className="col-6">
                            <img src="/main-section-image.png" alt="main-section-image" />
                        </div>
                    </div>
                    <div className="portrait">
                        <div>
                            <div>
                                <img src="/main-section-image.png" alt="main-section-image" />
                            </div>
                            <div>
                                <p className={style["main-font"]}>get ready and change your life</p>
                                <p className="myfs-4 text-center text-body fw-semibold">start now and enjoy the journey</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`${style["second-section"]}`}>
                <div>
                    <img src="/2nd-section-1.jpg" />
                    <p className="myfs-5 fw-semibold text-theme-one-emphasis">keep going with your dreams</p>
                    <p className="myfs-mini">organise your work to make your dreams real</p>
                </div>
                <div>
                    <img src="/2nd-section-2.jpg" />
                    <p className="myfs-5 fw-semibold text-theme-one-emphasis">have healthy life balance</p>
                    <p className="myfs-mini">save your mental health, we will help you to make balance between social life and your work</p>
                </div>
                <div>
                    <img src="/2nd-section-3.jpg" />
                    <p className="myfs-5 fw-semibold text-theme-one-emphasis">be relaxed</p>
                    <p className="myfs-mini">having well-organised plan will get rid of all your concerns</p>
                </div>
            </div>
            <div className={style["third-section"]}>
                <div className="position-absolute bg-black w-100 h-100 opacity-75"></div>
                <p className="text-white text-center position-absolute top-50 start-50 translate-middle myfs-1 fw-bold">
                    <span>{dynamicText}</span>
                    <span className="fw-light">|</span>
                </p>
            </div>
            <div className={style["fourth-section"]}>
                <div className="landscape">
                    <div className="row mx-2">
                        <div className="col-5 text-center">
                            <div className="myfs-2 text-theme-one-emphasis fw-semibold">use our application</div>
                            <div className="myfs-4">easy and friendly to use, you can enjoy with all our features</div>
                        </div>
                        <div className="text-theme-one-emphasis col-7"><img src="/4th-section-1.jpg" /></div>
                    </div>
                    <div className="row mx-2">
                        <div className="text-theme-one-emphasis col-7"><img src="/4th-section-2.jpg" /></div>
                        <div className="col-5 text-center">
                            <div className="myfs-2 text-theme-one-emphasis fw-semibold">well organised todo application</div>
                            <div className="myfs-4">the application is organised to daily tasks and month goals, with reminder feature</div>
                        </div>
                    </div>
                </div>
                <div className="portrait">
                    <div className="d-flex justify-content-center flex-wrap">
                        <div><img src="/4th-section-1.jpg" /></div>
                        <div className="w-75">
                            <div className="myfs-5 text-center text-theme-one-emphasis fw-semibold">use our application</div>
                            <div className="myfs text-center">easy and friendly to use, you can enjoy with all our features</div>      
                        </div>
                        <div><img src="/4th-section-2.jpg" /></div>
                        <div className="w-75">
                            <div className="myfs-5 text-center text-theme-one-emphasis fw-semibold">well organised todo application</div>
                            <div className="myfs text-center">the application is organised to daily tasks and month goals, with reminder feature</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`container-fluid ${style["fifth-section"]}`}>
                <div>
                    <div>
                        <div><i className="bi bi-fast-forward"></i></div>
                        <div className={`text-center myfs-6`}>fast</div>
                    </div>
                    <div>
                        <div><i className="bi bi-file-lock2-fill"></i></div>
                        <div className={`text-center myfs-6`}>reliable</div>
                    </div>
                    <div>
                        <div><i className="bi bi-bell-fill"></i></div>
                        <div className={`text-center myfs-6`}>secure</div>
                    </div>
                    <div>
                        <div><i className="bi bi-brightness-high-fill"></i></div>
                        <div className={`text-center myfs-6`}>perfect</div>
                    </div>
                </div>
            </div>
            <div className={`container-fluid ${style["sixth-section"]}`}>
                <div>
                    <div>
                        <p className={`myfs-3 text-center text-theme-one-emphasis fw-semibold`}>month goals and daily tasks</p>
                        <p className={`myfs-6 text-center text-light-emphasis`}>there is month goals and daily tasks</p>
                    </div>
                    <div>
                        <p className={`myfs-3 text-center text-theme-one-emphasis fw-semibold`}>month goals and daily tasks</p>
                        <p className={`myfs-6 text-center text-light-emphasis`}>there is month goals and daily tasks</p>
                    </div>
                </div>
                <div className={`myfs text-light-emphasis`}>
                    <div>month goals</div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div><i className="bi bi-clipboard2-check myfs-6"></i> daily task</div>
                    <div><i className="bi bi-clipboard2-check myfs-6"></i> daily task</div>
                    <div>reminder feature <span>reminder +</span></div>
                </div>
            </div>
            <div className={`${style["contact-section"]} text-white-50 bg-dark myfs`}>
                <div>
                    <p>powered by</p>
                    <p>django & react</p>
                </div>
                <div>
                    <p>email</p>
                    <p>amradar757@gmail.com</p>
                </div>
                <div>
                    <p>phone number</p>
                    <p>01152182723</p>
                </div>
                <div>
                    <p>hosted by</p>
                    <p>Vercel</p>
                </div>
            </div>
        </div>
    )
}
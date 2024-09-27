import { useSelector } from "react-redux"
import { RootState } from "@/app/store"

export function Loading(){
    const loading = useSelector((state:RootState)=>state.global.loading)
    return(
        <>
        <div className={`${loading?"d-block":"d-none"} position-fixed z-3 loader w-100`}></div>
        <div className={`${loading?"d-block":"d-none"} position-fixed z-3 opacity-25 w-100 h-100 bg-body`}></div>
        </>
    )
}
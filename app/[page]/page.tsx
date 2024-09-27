

import { redirect } from "next/navigation"

export function generateStaticParams(){
    return [{page:"home"}, {page:"monthgoals"}, {page:"signin"}, {page:"signup"}]
}

export default function HandlinRouting({params:{page}, searchParams}:{params:{page:string}, searchParams:{}}){
    const urlParams = new URLSearchParams()
    urlParams.append("page", page)
    redirect("/?"+urlParams.toString())
    
}
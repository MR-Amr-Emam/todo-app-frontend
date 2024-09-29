import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "universal-cookie"

const initialState = {serverDomain:"https://mramremam.pythonanywhere.com", loading:false, profileForm:false}

const LastIdSlice = createSlice({
    name:"global",
    initialState: initialState,
    reducers:{
        setGlobal:(state, action:PayloadAction<string>)=>{
            state.serverDomain = action.payload
        },
        setLoading:(state, action:PayloadAction<boolean>)=>{
          state.loading = action.payload
        },
        setProfileForm:(state, action:PayloadAction<boolean>)=>{
          state.profileForm = action.payload
        }
    }
})

export const {setGlobal, setLoading, setProfileForm} = LastIdSlice.actions;
export default LastIdSlice.reducer;


export async function Fetch(path:string, method:string, headers:{}, body:{}){
  var cookies = new Cookies()
  var csrftoken = cookies.get("csrftoken")
  var endpoint = initialState.serverDomain + path
  var options:RequestInit = {
    credentials:"include",
    method: method,
    headers:{
      ...headers,
      "X-CSRFToken":csrftoken||"",
      "Content-Type":"application/json",
      "Accept":"application/json",
    },
  };
  var jsonBody = JSON.stringify(body)
  if(jsonBody != "{}"){
    options.body = jsonBody
  }

  async function run(){
    var response = await fetch(endpoint, options)
    if(response.ok){
      return response
    }else if(response.status==401){
      await fetch(initialState.serverDomain+"/authentication/token/refresh",
        {credentials:"include", method:"POST", headers:{"X-CSRFToken":csrftoken||""}})
      return null
    }
  }
  var data;
  for(let i=0; i<3; i++){
      data = await run()
      if(data == null){continue;}
      break;
  }
  return data
}



export async function FetchFree(path:string, method:string, headers:{}, body:any){
  var cookies = new Cookies()
  var csrftoken = cookies.get("csrftoken")
  var endpoint = initialState.serverDomain + path
  var options:RequestInit = {
    credentials:"include",
    method: method,
    headers:{
      "X-CSRFToken":csrftoken||"",
      ...headers,
    },
    body: body,
  };

  async function run(){
    var response = await fetch(endpoint, options)
    if(response.ok){
      return response
    }else if(response.status==401){
      await fetch(initialState.serverDomain+"/authentication/token/refresh",
        {credentials:"include", method:"POST", headers:{"X-CSRFToken":csrftoken||""}})
      return null
    }
  }
  var data;
  for(let i=0; i<3; i++){
      data = await run()
      if(data == null){continue;}
      break;
  }
  return data
}
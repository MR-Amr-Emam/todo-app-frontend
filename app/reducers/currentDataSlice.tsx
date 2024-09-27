import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface currentData {
    date: string,
    index: number,
    monthIndex: number,
    numNotes: number[],
    daysProgress: number[],
    bio: string,
    monthPhoto: string,
}

const date = new Date();

const initialState:currentData = {
    date: date.toDateString(),
    index: 0,
    monthIndex: 0,
    numNotes: [0, 0],
    daysProgress: [],
    bio: "",
    monthPhoto: "http://localhost:3000/month-image.png",
}

export const currentDataSlice = createSlice({
    name: "currentdata",
    initialState: initialState,
    reducers:{
        setCurrent:(state, action:PayloadAction<{date:string, index:number, monthIndex:number}>)=>{
            state.date = action.payload.date;
            state.index = action.payload.index;
            state.monthIndex = action.payload.monthIndex;
        },setCurrentMonth:(state, action:PayloadAction<{numNotes:number[], daysProgress:number[], bio:string, monthPhoto:string}>)=>{
            state.numNotes = action.payload.numNotes
            state.daysProgress = action.payload.daysProgress
            state.bio = action.payload.bio
            state.monthPhoto = action.payload.monthPhoto
        },
        setNumNotes:(state, action:PayloadAction<number[]>)=>{
            state.numNotes = action.payload
        },
        setBio:(state, action:PayloadAction<string>)=>{
            state.bio = action.payload
        },
        setMonthPhoto:(state, action:PayloadAction<string>)=>{
            state.monthPhoto = action.payload
        },
    },
})

export const { setCurrent, setCurrentMonth, setNumNotes, setBio, setMonthPhoto } = currentDataSlice.actions;

export default currentDataSlice.reducer;
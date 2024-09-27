import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import { Fetch } from "@/app/reducers/globalSlice"
import { setCurrent, setCurrentMonth } from './currentDataSlice';
import { addReminders } from './reminderSlice';
import { setLoading } from './globalSlice';
import { MonthGoal, addGoals } from './monthGoalSlice';

export interface Note {
    id: number,
    category: "self_development" | "social_life" | "life_style",
    state: boolean,
    done: boolean,
    theme: 1 | 2 | 3 | 4,
    title: string,
    content: string,
}

const initialState:{date:string, objs:Note[]}[] = []


export const noteSlice = createSlice({
    name: "notes",
    initialState,
    reducers: {
        addNote:(state, action:PayloadAction<{
            index:number,
            id: number,
            category:"self_development"|"social_life"|"life_style",
            theme: 1|2|3|4,
            title: string,
            content: string,
        }>)=>{
            state[action.payload.index].objs.push({
                id: action.payload.id,
                category: action.payload.category,
                state: false,
                done: false,
                theme: action.payload.theme,
                title: action.payload.title,
                content: action.payload.content,
            })
        },
        checkNote:(state, action:PayloadAction<{index:number, id:number}>)=>{
            var note = state[action.payload.index].objs.find((note)=>note.id==action.payload.id);
            if(note){
                note.state = true;
                note.done = true;
            }
        },
        deleteNote:(state, action:PayloadAction<{index:number, id:number}>)=>{
            var noteIndex = state[action.payload.index].objs.findIndex((note)=>note.id==action.payload.id)
            state[action.payload.index].objs.splice(noteIndex, 1);
        },
        editNote:(state, action:PayloadAction<{index:number, id:number,title:string,content:string}>)=>{
            var note = state[action.payload.index].objs.find((note)=>note.id==action.payload.id);
            if(note){
                note.title = action.payload.title;
                note.content = action.payload.content;
            }
        },addNotes:(state, action:PayloadAction<{index:number, date:string, objs:[]}>)=>{
            if(action.payload.index==state.length){
                state.push({date:action.payload.date, objs:action.payload.objs});
            }else{
                state.splice(action.payload.index+1,0,{date:action.payload.date, objs:action.payload.objs});
            }
        },removeNotes:(state, action:PayloadAction<number>)=>{
            state.splice(action.payload, 1)
        }
    },
});

export const { addNote, checkNote, deleteNote, editNote, addNotes, removeNotes } = noteSlice.actions;
export default noteSlice.reducer;




export function getIndex(date:string, data:{date:string}[]){
    let left = 0;
    let right = data.length-1;
    let middle;
    let dateObj = new Date(date);
    while(right>=left){
        middle = Math.floor((left+right)/2);
        let dataDate = new Date(data[middle].date);
        if(dataDate.toDateString() == dateObj.toDateString()){
            return middle;
        }else if(dataDate>dateObj){
            right = middle-1;
        }else if(dataDate<dateObj){
            left = middle+1;
        }
    }
    return right;
}

export async function changeIndex(date:Date, allNotes:{date:string, objs:Note[]}[],
    allGoals:{date:string, objs:MonthGoal[]}[], dispatch:(func:any)=>void, isInitial=false){
    if(!isInitial){dispatch(setLoading(true))}
    var index = getIndex(date.toDateString(), allNotes);
    if(index==-1 || date.toDateString()!=allNotes[index].date){
        var data = await FetchNotes(date)
        dispatch(addNotes({index:index, date:date.toDateString(), objs:data[0]}));
        dispatch(addReminders({index:index, date:date.toDateString(), objs:data[1]}));
        index++;
    }
    var dateMonth = new Date(date);
    dateMonth.setDate(1);
    var monthIndex = getIndex(dateMonth.toDateString(), allGoals);
    if(monthIndex==-1 || dateMonth.toDateString()!=allGoals[monthIndex].date){
        var monthData = await FetchGoals(dateMonth)
        dispatch(addGoals({index:monthIndex, date:dateMonth.toDateString(), objs:monthData}));
        monthIndex++;
    }
    var monthResponse = await Fetch(`/notes/perform_month/${dateMonth.getFullYear()}-${dateMonth.getMonth()+1}`, "GET", {}, {})
    if(monthResponse?.ok){
        var monthData = await monthResponse.json()
        dispatch(setCurrentMonth({numNotes:[monthData.num_notes, monthData.num_notes_completed],
            daysProgress:monthData.days_progress, bio:monthData.bio, monthPhoto: monthData.month_photo}))
    }else{
        dispatch(setCurrentMonth({numNotes:[0, 0], daysProgress:[], bio:"", monthPhoto:"http://localhost:3000/month-image.png"}))
    }
    dispatch(setCurrent({date:date.toDateString(), index:index, monthIndex:monthIndex}));
    if(!isInitial){dispatch(setLoading(false))}
}


async function FetchNotes(date:Date){
    var response = await Fetch(`/notes/view_notes/${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`,
    "GET", {}, {})
    var data = await response?.json()
    var notes = data
    var response = await Fetch(`/notes/view_reminders/${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`,
    "GET", {}, {})
    var data = await response?.json()
    var reminders = data
    return [notes, reminders]
}

async function FetchGoals(date:Date){
    var response = await Fetch(`/notes/view_goals/${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`,
        "GET", {}, {})
    var data = await response?.json()
    return data
}
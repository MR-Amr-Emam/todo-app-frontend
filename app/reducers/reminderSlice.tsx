import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Reminder {
    id: number,
    content: string,
    dead_line: string,
    state: boolean,
}

const initialState: {date:string, objs:Reminder[]}[] = []

export const ReminderSlice = createSlice({
    name: "reminder",
    initialState,
    reducers: {
        addReminder(state, action:PayloadAction<{index:number, id:number, dead_line:string, content:string}>){
            state[action.payload.index].objs.push({
                id: action.payload.id,
                content: action.payload.content,
                dead_line: action.payload.dead_line,
                state: false,
            })
        },setReminder:(state, action:PayloadAction<{index:number, id:number}>)=>{
            var reminder=state[action.payload.index].objs.find((reminder:Reminder)=>reminder.id==action.payload.id)
            if(reminder){reminder.state=true}
        }
        ,addReminders:(state, action:PayloadAction<{index:number, date:string, objs:[]}>)=>{
            if(action.payload.index==state.length){
                state.push({date:action.payload.date, objs:action.payload.objs})
            }else{
                state.splice(action.payload.index+1,0,{date:action.payload.date, objs:action.payload.objs})
            }
        },removeReminders:(state, action:PayloadAction<number>)=>{
            state.splice(action.payload, 1)
        }
    },
})


export const { addReminder, setReminder, addReminders, removeReminders } = ReminderSlice.actions;
export default ReminderSlice.reducer;
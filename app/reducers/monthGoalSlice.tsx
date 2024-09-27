import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MonthGoal {
    id: number
    state: boolean,
    done: boolean,
    theme: 1 | 2 | 3 | 4,
    title: string,
    miniGoals: string[],
    miniGoalsState: number,
}

const initialState: {date:string, objs:MonthGoal[]}[] = []


export const MonthGoalSlice = createSlice({
    name: "month_goal",
    initialState,
    reducers: {
        createMonthGoal: (state, action:PayloadAction<{index:number, goalTitle:string, minigoals:Array<string>, theme:1|2|3|4}>)=>{
            var theme: 1 | 2 | 3 | 4;
            state[action.payload.index].objs.push({
                id: state[action.payload.index].objs[state[action.payload.index].objs.length-1]?.id+1|0,
                state: false,
                done: false,
                theme: action.payload.theme,
                title: action.payload.goalTitle,
                miniGoals: action.payload.minigoals,
                miniGoalsState: 0,
            })
        },
        AddMinigoal:(state, action:PayloadAction<{index:number, id:number, minigoal:string}>)=>{
            var minigoal = state[action.payload.index].objs.find((minigoal)=>{
                return minigoal.id==action.payload.id;
            })
            if(minigoal && !minigoal.state){minigoal?.miniGoals.push(action.payload.minigoal)};
        },
        CheckMinigoal:(state, action:PayloadAction<{index:number, id:number, minigoal:number}>)=>{
            var goal = state[action.payload.index].objs.find((goal)=>{
                return goal.id==action.payload.id;
            })
            if(goal){
                goal.miniGoalsState = goal.miniGoalsState | 1<<(action.payload.minigoal-1);
                if((2**goal.miniGoals.length)-1 == goal.miniGoalsState){
                    goal.state = true;
                    goal.done = true;
                }
            }
            
        },
        addGoals:(state, action:PayloadAction<{index:number, date:string, objs:MonthGoal[]}>)=>{
            if(action.payload.index==state.length){
                state.push({date:action.payload.date, objs:action.payload.objs});
            }else{
                state.splice(action.payload.index+1,0,{date:action.payload.date, objs:action.payload.objs});
            }
        },
        removeGoals:(state, action:PayloadAction<number>)=>{
            state.splice(action.payload, 1);
        },
    },
})

export const { createMonthGoal, AddMinigoal, CheckMinigoal, addGoals } = MonthGoalSlice.actions;

export default MonthGoalSlice.reducer;
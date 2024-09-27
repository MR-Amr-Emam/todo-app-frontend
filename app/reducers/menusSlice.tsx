import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface MenusState {
  submenu: "all"| "done"| "notdone"| "reminders",
  sidemenu: boolean,
  notesCategory: "self"| "social"| "life",
  searchbar: boolean,
  calendar: boolean,
  addForm: boolean,
  monthGoalForm: boolean,
  monthGoalPopup: string;
}

const initialState: MenusState = {
  submenu: "all",
  sidemenu: false,
  notesCategory: "self",
  searchbar: false,
  calendar: false,
  addForm: false,
  monthGoalForm: false,
  monthGoalPopup: "",
}

export const menusSlice = createSlice({
  name: 'menus',
  initialState,
  reducers: {
    setSubmenu: (state, action: PayloadAction<"all"| "done"| "notdone"| "reminders">) => {
      state.submenu = action.payload;
    },
    setSidemenu: (state) =>{
      state.sidemenu = !state.sidemenu;
    },
    setNotesCategory: (state, action: PayloadAction<"self"| "social"| "life">) =>{
      state.notesCategory = action.payload;
    },
    setSearchbar: (state)=>{
      state.searchbar = !state.searchbar;
    },
    setCalendar: (state)=>{
      state.calendar = !state.calendar;
    },
    setAddForm: (state)=>{
      state.addForm = !state.addForm;
    },
    setMonthGoalForm: (state)=>{
      state.monthGoalForm = !state.monthGoalForm;
    },
    setMonthGoalPopup: (state, action:PayloadAction<string>)=>{
      state.monthGoalPopup = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { setSubmenu, setSidemenu, setNotesCategory, setSearchbar, setCalendar, setAddForm,
  setMonthGoalForm, setMonthGoalPopup } = menusSlice.actions;

export default menusSlice.reducer;
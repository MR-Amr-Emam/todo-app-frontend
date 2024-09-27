import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
    username: string,
    timezone: string,
    profileImage: string,
}

const initialState: User = {
    username: "",
    timezone: "",
    profileImage: "",
}

export const UserSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action:PayloadAction<{username:string, timezone:string, profileImage:string}>)=>{
            state.username = action.payload.username
            state.timezone = action.payload.timezone
            state.profileImage = action.payload.profileImage
        }
    },
})

export const {setUser} = UserSlice.actions

export default UserSlice.reducer;
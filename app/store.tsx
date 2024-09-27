import { configureStore } from '@reduxjs/toolkit';
import menusSlice from "./reducers/menusSlice";
import noteSlice from "./reducers/noteSlice";
import reminderSlice from "./reducers/reminderSlice";
import monthGoalSlice from "./reducers/monthGoalSlice";
import userSlice from "./reducers/userSlice";
import GlobalSlice from "./reducers/globalSlice"
import currentDataSlice from './reducers/currentDataSlice';

export const store = configureStore({
  reducer: {
    currentData: currentDataSlice,
    menus: menusSlice,
    notes: noteSlice,
    global: GlobalSlice,
    reminders: reminderSlice,
    monthGoals: monthGoalSlice,
    user: userSlice,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
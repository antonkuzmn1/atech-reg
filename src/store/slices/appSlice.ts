import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface AppState {
    loading: boolean,
    message: string,
    loggedIn: boolean,
}

const initialState: AppState = {
    loading: false,
    message: "",
    loggedIn: false,
}

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setAppLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setAppMessage: (state, action: PayloadAction<string>) => {
            state.message = action.payload;
        },
        setAppLoggedIn: (state, action: PayloadAction<boolean>) => {
            state.loggedIn = action.payload;
        }
    },
});

export const {
    setAppLoading,
    setAppMessage,
    setAppLoggedIn,
} = appSlice.actions;
export default appSlice.reducer;

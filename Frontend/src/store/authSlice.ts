import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    username: string | null;
    token: string | null;
    isLoggedIn: boolean;
}

// Initial state for the user
const initialState: UserState = {
    username: null,
    token: null,
    isLoggedIn: false,
};
const authSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<{ username: string; token: string }>) => {
            state.username = action.payload.username;
            state.token = action.payload.token;
            state.isLoggedIn = true;
        },
        logout: (state) => {
            state.username = null;
            state.token = null;
            state.isLoggedIn = false;
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
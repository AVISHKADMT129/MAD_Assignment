import { createSlice } from '@reduxjs/toolkit';
import { logout } from './authSlice'; // Import the logout action

const counterSlice = createSlice({
    name: 'counter',
    initialState: { count: 0 },
    reducers: {
        incrementClickCount: (state) => {
            state.count += 1;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(logout, (state) => {
            state.count = 0; // Reset the count to 0 on logout
        });
    },
});

export const { incrementClickCount } = counterSlice.actions;
export default counterSlice.reducer;

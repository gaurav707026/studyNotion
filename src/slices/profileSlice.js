import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
    additionalDetails: localStorage.getItem("additionalDetails")? JSON.parse(localStorage.getItem("additionalDetails")) : null,
    loading: false,
};
const profileSlice = createSlice({
    name: 'profile',
    initialState: initialState,
    reducers: {
        setUser: (state, value) => {
            state.user = value.payload;
            // localStorage.setItem('token', JSON.stringify(action.payload));
        },
        setLoading: (state, value) => {
            state.loading = value.payload;
        },
        setAdditionalDetails: (state, value) => {
            state.additionalDetails = value.payload;
        }
    },
});

export const { setUser, setLoading, setAdditionalDetails } = profileSlice.actions;

export default profileSlice.reducer;
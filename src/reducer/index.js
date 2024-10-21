import { combineReducers } from "@reduxjs/toolkit"
import authReducer from "../slices/authSlice";
import profileReducer from "../slices/profileSlice";
import cartReducer from "../slices/cartSlice";

// Combine all reducers into a single root reducer. This makes it easier to manage and test the state of your application.
const rootReducer = combineReducers({
    auth: authReducer,
    profile: profileReducer,
    cart: cartReducer,
})

export default rootReducer
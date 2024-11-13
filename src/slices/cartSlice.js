import { createSlice } from "@reduxjs/toolkit";
import { toast} from "react-hot-toast";

const initialState = {
    cart: localStorage.getItem('cart') 
    ? JSON.parse(localStorage.getItem('cart')):[],
    total: localStorage.getItem('total')
    ? JSON.parse(localStorage.getItem('total')): 0,
    totalItems: localStorage.getItem('totalItems')? JSON.parse(localStorage.getItem('totalItems') ): 0,
};
const cartSlice = createSlice({
    name: "cart",
    initialState: initialState,
    reducers: {
        addToCart: (state, action) => {
            const course = action.payload
            const index = state.cart.findIndex((item) => item._id === course._id)
            if(index >= 0) {
                // if course is already in the cart
                toast.error("Course already in your cart");
                return;
            }
            // if course is not in the cart
            state.cart.push(course);
            state.total += course.price;
            state.totalItems++;
            localStorage.setItem('cart', JSON.stringify(state.cart));
            localStorage.setItem('total', JSON.stringify(state.total));
            localStorage.setItem('totalItems', JSON.stringify(state.totalItems));

        },
        setTotalItems: (state, action) => {
            state.totalItems = action.payload;
        },
    },
});

export const { cart, total, totalItems, addToCart, setTotalItems } = cartSlice.actions;

export default cartSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";

const initialState = {value:{}};

export const idsSlice = createSlice(
    {
        name:'ids',
        initialState,
        reducers:{
            addCustomerIds : (state, action)=>{
                state.value.customers = action.payload;
            },
            addProductsIds : (state, action)=>{
                state.value.products = action.payload;
            },
            emptyReducer : (state)=>{
                state.value = {}
            }
        }
    }
)

export const {addCustomerIds, emptyReducer, addProductsIds} = idsSlice.actions;
export default idsSlice.reducer;

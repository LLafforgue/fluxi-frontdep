import {createSlice} from '@reduxjs/toolkit'

const initialState = {value:{}};

export const userSlice = createSlice(
    {
        name:'user',
        initialState,
        reducers:{
            loginUser : (state, action)=>{
                state.value = action.payload;
            },
            logoutReducer : (state)=>{
                state.value = {}
            }
        }
    }
)

export const {loginUser, logoutReducer} = userSlice.actions;
export default userSlice.reducer;

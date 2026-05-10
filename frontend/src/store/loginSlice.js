import { createSlice } from "@reduxjs/toolkit";

const initialState={
    login:false
}


const loginSlice=createSlice({
    name:"login",
    initialState,
    reducers:{
        setLogin:(state, action)=>{
            state.login=state.login===false?true:false
        }
    }
})

export default loginSlice.reducer
export const{setLogin}=loginSlice.actions;
        
    

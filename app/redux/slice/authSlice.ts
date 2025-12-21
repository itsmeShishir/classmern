import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/app/types';
// check localStorage 

interface AuthState {
    userInfo: User | null;
}


const getUserFromStorage = (): User | null=>{
    if(typeof window !== 'undefined'){
        const userInfo = localStorage.getItem('userInfo');
        return userInfo ? JSON.parse(userInfo) : null;
    }
    return null;
}

const initialState : AuthState = {
    userInfo: getUserFromStorage()
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // user object -> payload Action
        setCrediantials: (state, action: PayloadAction<User>) => {
            state.userInfo = action.payload;
            localStorage.setItem('userInfo', JSON.stringify(action.payload));
        },
        logout: (state) => {
            state.userInfo = null;
            localStorage.removeItem('userInfo');
        },

    },
});

export const { setCrediantials, logout } = authSlice.actions;
export default authSlice.reducer;
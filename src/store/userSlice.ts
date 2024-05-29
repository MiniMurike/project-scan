import { createSlice } from '@reduxjs/toolkit'

const userInitState = {
    token: {
        value: "",
        expire: "",
    },
    username: "",
    avatar: "",
};

export const userSlice = createSlice({
    name: 'user',
    initialState: userInitState,
    reducers: {
        updateProfile: (state, action) => {
            if (action.payload === null) {
                return userInitState;
            } else {
                return action.payload
            }
        },
        setUsesCompany: (state, action) => {
            return {
                ...state,
                usedCompanyCount: action.payload.usedCompanyCount,
                companyLimit: action.payload.companyLimit
            }
        }
    },
})

export const {
    updateProfile,
    setUsesCompany
} = userSlice.actions

export default userSlice.reducer


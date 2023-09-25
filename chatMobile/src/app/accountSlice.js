import { createSlice } from '@reduxjs/toolkit'

export const accountSlice = createSlice({
    name: 'account',
    initialState: { account: {} },
    reducers: {
        login: (state, data) => { state.account = data.payload.account },
        logout: (state) => { state.account = {} }
    }
})

export const { login, logout } = accountSlice.actions

export default accountSlice.reducer
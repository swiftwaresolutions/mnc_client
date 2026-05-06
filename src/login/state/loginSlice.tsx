import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { StorageService } from '../../api/storage/storageService'

interface Login {
    authorized: boolean,
    id: number,
    name: string,
    accessToken: string,
    isDoctor: number,
    doctorId : number,
    doctorName: string,
    departmentId : number,
    departmentName : string,
    isAdmin: number
}

const initialState: Login = {
    authorized: false,
    id: 0,
    name: "",
    accessToken: "",
    isDoctor: 0,
    doctorId : 0,
    doctorName: "",
    departmentId : 0,
    departmentName : "",
    isAdmin: 0
}
let storageService: StorageService = new StorageService();

export const loginSlice = createSlice({
    name: 'Login',
    initialState,
    reducers: {
        saveLoginDataAction: (state, { payload }: PayloadAction<Login>) => {
            // const { accessToken, ...payloadWithoutToken } = payload;
            // storageService.setLoginData(payloadWithoutToken);
            return { ...state, ...payload, authorized: true }
        },
        authLogout: (state) => {
            storageService.clearAll();
            return { ...state, ...initialState }
        }
    }
})

export const { saveLoginDataAction, authLogout } = loginSlice.actions

export default loginSlice.reducer;
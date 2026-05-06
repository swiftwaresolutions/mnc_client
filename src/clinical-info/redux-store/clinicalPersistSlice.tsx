import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ClinicalInit {
    clinicalCurrentOpPatient: any,
    clinicalCurrentIpPatient: any,
    isIp: number,
    vstId:any
}

const initialState: ClinicalInit = {
    isIp: 0,
    clinicalCurrentOpPatient: {},
    clinicalCurrentIpPatient: {},
    vstId:""
}

export const clinicalPersistSlice = createSlice({
    name: 'clinicalPersist',
    initialState,
    reducers: {
        storeClinicalCurrentOpPatient: (state, { payload }: PayloadAction<{}>) => {
            state.clinicalCurrentOpPatient = { ...payload }
        },
        storeClinicalCurrentIpPatient: (state, { payload }: PayloadAction<{}>) => {
            state.clinicalCurrentIpPatient = { ...payload }
        },
        storeClinicalIsIp: (state, { payload }: PayloadAction<number>) => {
            state.isIp = payload
        },
        storePreviousVisit: (state, { payload }: PayloadAction<{}>) => {
            console.log(payload);
            
            state.vstId = payload 
        },
    }
})

export const { storeClinicalCurrentOpPatient, storeClinicalCurrentIpPatient,storeClinicalIsIp ,storePreviousVisit} = clinicalPersistSlice.actions

export default clinicalPersistSlice.reducer;
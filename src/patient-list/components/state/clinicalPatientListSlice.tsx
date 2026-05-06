import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface clinicalPatientList {
    clinicalOpPatientList: any[],
    clinicalIpPatientList: any[],
}

const initialState: clinicalPatientList = {
    clinicalOpPatientList: [],
    clinicalIpPatientList: [],
}

export const clinicalPatientListSlice = createSlice({
    name: 'clinicalPatientList',
    initialState,
    reducers: {
        storeClinicalOpPatientList: (state, { payload }: PayloadAction<any[]>) => {
            state.clinicalOpPatientList = [...payload]
        },
        storeClinicalIpPatientList: (state, { payload }: PayloadAction<any[]>) => {
            state.clinicalIpPatientList = [...payload]
        }
    }
})

export const { storeClinicalOpPatientList, storeClinicalIpPatientList } = clinicalPatientListSlice.actions

export default clinicalPatientListSlice.reducer;
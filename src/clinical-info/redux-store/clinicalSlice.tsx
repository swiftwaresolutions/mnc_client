import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { generalCaseSheetInit } from '../components/casesheet/general-case-sheet/Model/GeneralCaseSheetInit'

interface ClinicalInit {
    generalCaseSheet: any
}

const initialState: ClinicalInit = {
    generalCaseSheet: generalCaseSheetInit
}

export const clinicalSlice = createSlice({
    name: 'clinicalSlice',
    initialState,
    reducers: {
        storeGeneralCaseSheet: (state, { payload }: PayloadAction<{}>) => {
            state.generalCaseSheet = { ...payload }
        }
    }
})

export const { storeGeneralCaseSheet } = clinicalSlice.actions

export default clinicalSlice.reducer;
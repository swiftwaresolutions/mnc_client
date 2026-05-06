import { createSlice } from "@reduxjs/toolkit";

interface OrganizationModel {
  name: string;
  code: string;
  port : number;
  salesStoreId:string;
}
interface ClinicalModuleDetailsModel {
  group: string;
  menuName: string;
  dispName: string;
  menuCode: string;
}
interface AppSliceInitialStateModel {
  organization: OrganizationModel;
  clinicalModuleDetails: ClinicalModuleDetailsModel[];
}
const initialState: AppSliceInitialStateModel = {
  organization: { name: "", code: "", port : 0,salesStoreId:"" },
  clinicalModuleDetails: [],
};

export const appSlice = createSlice({
  name: "appReducer",
  initialState,
  reducers: {
    setOrganizationDetails: (state, { payload }) => {
      state.organization = { name: payload.name, code: payload.code, port : payload.port , salesStoreId: payload.salesStoreId};
    },
    setClinicalModuleDetails: (state, { payload }) => {
      state.clinicalModuleDetails = payload;
    }
  },
});

export const { setOrganizationDetails,setClinicalModuleDetails } = appSlice.actions;

export default appSlice.reducer;

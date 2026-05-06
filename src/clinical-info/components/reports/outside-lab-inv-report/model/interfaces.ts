
export interface ScreenDetails {
    isLoading : boolean,
    message : string,
    color : string,

}

export interface OutsideLabInterface {
    labId : number,
    labName : string,
    suggestDoc : string,
    selDate : string,
    specName : string,
    testName : string,
    value : string,
    unit : string,
    fieldName : string,
    fieldId : number
}

export interface OutsideInvInterface {
    invNo : number,
    labName : string,
    suggestDoc : string,
    invDate : string,
    invName : string,
    findings : string
}

export interface visitDetailInterface {
    date: string,
        doctorName: string,
        departmentName: string,
        visitId: number;
        outsideLab: OutsideLabInterface[];
        outsideInv : OutsideInvInterface[];
}

export interface OutsideLabInterface {
    labId : number,
    labName : string,
    suggestDoc : string,
    selDate : string,
    specName : string,
    testName : string,
    value : string,
    unit : string,
    fieldName : string,
    fieldId : number
}

export interface PatientInvImageInterface {
    id : number,
    patId : number,
    vstId : number,
    imgName : string,
    path : string,
    dtm : string,
    entUid : number,
    blockDate : string,
    isBlocked : boolean,
    blockedUid : number,
    imgExist : boolean, 
    invId : number,
    groupId : number,
    invName : string,
    invDate : string,
    otherInv : string,
}

export interface patientDetailsInterface {
    outsideLab : OutsideLabInterface[],
    outsideInv : OutsideInvInterface[],
    outsideImg : PatientInvImageInterface[]
}
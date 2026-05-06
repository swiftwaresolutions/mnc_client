
export interface PatientInvImageUploadInterface {
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
    otherInv : string
}
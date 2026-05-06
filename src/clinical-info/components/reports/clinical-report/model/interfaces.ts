export interface ScreenDetails {
    isLoading: boolean,
    message: string,
    color: string,
    currentImgIdx: number,
    visitTabOpenAllAccordian: boolean,
    visitTabActiveAccordian: string[]
}



export interface prescriptionDeatilsInterface {
    displayNo: number
    genId: number
    genName: string
    id: number
    medName: string
    formType: number
    unit: number
    unitId: number
    medStrength: number
    medQuantity: number
    stock: number
    timing: string
    timingId: number
    quantity: number
    duration: number
    period: number
    periodId: number
    no: number
    timingUnit: string
    mrpPrice: number
    own: number
    date: string
    isFromSummary: number
    isBilled: number
    route: number
    routeId: number
    instruction: number
    instructionId: number
    notes: string
}
export interface laboratoryDetailsInterface {
    date: string,
    specName: string,
    testName: string,
    value: string,
    unit: string,
    fieldName: string,
    normalPatId: number,
    deptAutoId: number,
    fieldId: number
}
export interface generalCaseSheetDetailsInterface {
    id: number,
    patId: number,
    vstId: number,
    ipId: number,
    presentIllness: string,
    pastHistory: string,
    treatmentHistory: string,
    personalHistory: string,
    investigationHistory: string,
    menstrualHistory: string,
    temperature: string,
    pulse: string,
    rr: string,
    bp: string,
    spo2: string,
    height: string,
    weight: string,
    bmi: string,
    oralCavity: string,
    cvs: string,
    res: string,
    abdominal: string,
    cns: string,
    perVaginal: string,
    oralRectal: string,
    skin: string,
    musculoskeletal: string,
    additionalFindings: string,
    allergy: string,
    differentialDiagnosis: string,
    confirmedDiagnosis: string,
    medications: string,
    recomendations: string,
    proceduresPlanned: string,
    followUpPlan: string,
    examination: string,
    diagnosis: string,
    discussion: string,
    generalPhysical:string,
    others:string,
    
    appointMentDate:string,
    pastHistorySurgical: string,
    pastHistoryMedical: string,
    familyHistory: string,
    generalExamination: string,
    systemicExamination: string,
    presentingComplaints: string,
    pallor: string,
    icterus: string,
    edema: string,
    appointmentPlan : string,
    foot : string,
    wound: string,

    complaintDataList: any[],
    diagnosisDetailsData: any[]
}

export interface ancDetailsDataInterface {
    id : number,
    anc_id : number,
    pat_id : number,
    visit_id : number,
    g : string,
    p : string,
    l : string,
    a : string,
    d : string,
    ga : string,
    sedd : string,
    varBp : string,
    varWeight : string,
    pallor : number,
    icterus : number,
    edema : number,
    utreusSize : string,
    symphosisFundal : string,
    featolHeartRate : string,
    presentationAb : string,
    engaged : string,
    cervix : string,
    dilatation : number,
    effacement : string,
    presentationPv : string,
    station : String,
    membrane : string,
    pelvis : number,
    chiefComplaints : string,
    hisPreIll : string,
    cdate : string,
    ctime : string,
    cvs : string,
    lmp : string,
    edd : string,
    height : string,
    bmi : string,
    spo2 : string,
    rr : string,
    bp : string,
    weight : string,
    rs : string,
    temperature : string,
    pulse : string,
    subSysOther: string,
    subPaOther: string,
    subPvOther: string,
    subOthersPlan: string,
    createdAt: string,
    subsequentAppointmentDate : string,
    subsequentAppointmentPlan : string
}

export interface ancChildDetailsDataInterface {
    id : number,
    anc_id : number,
    status : number,
    type : number,
    birthdate : string,
    mode : string,
    place : string,
    others : string,
    isValid : number,
    sex : number,
    riskFacOfThisPre : string,
}
export interface antenatalCaseSheetInterface {
    id : number,
    patId : number,
    vstId : number,
    g : string,
    p : string,
    l : string,
    a : string,
    d : string,
    lmp : string,
    edd : string,
    sedd : string,
    ga : string,
    durationofmarriage : string,
    consanguinity : string,
    conception : string,
    menstrualHis : string,
    surgicalHistory : string,
    chiefhistory : string,
    allergichistory : string,
    historyPreIll : string,
    familyHistory : string,
    othersHis : string,
    pallor : string,
    icterus : string,
    edema : string,
    cvs : string,
    rs : string,
    presentationAb : string,
    engaged : string,
    cervix : string,
    dilatation : string,
    effacement : string,
    presentationPV : string,
    station : string,
    membrane : string,
    pelvis : string,
    diabetes : number,
    hypertension : number,
    asthma : number,
    seiure : number,
    cardiacDisease : number,
    medicalHistory : number,
    others : number,
    tb : number,
    thyroidDisorder : number,
    stDose1 : number,
    stDoseIn : string,
    ndDose2 : number,
    ndDoseIn : string,
    riskFactor : string,
    isDelivered : number,
    cdate : string,
    ctime : string,
    menstrualOthers : string,
    symphosisFundal : string,
    featolHeartRate : string,
    utreusSize : string,
    initialAppointmentDate : string,
    initialAppointmentPlan : string,
    diabetesNotes : string,
    hypertensionNotes : string,
    asthmaNotes : string,
    seiureNotes : string,
    cardiacNotes : string,
    tbNotes : string,
    thyroidDisorderNotes : string,
    othersNotes : string,
    iniSysOther: string,
    iniPaOther: string,
    iniPvOther: string,
    createdAt: string,
    othersPlan : string,
    personalInfo : string,
    // ancDetialsDataList : ancDetailsDataInterface[],
    ancChildDetialsDataList : ancChildDetailsDataInterface[]
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

export interface VitalsInterface {
    id: number,
    patId: number,
    vstId: number,
    temperature: string,
    pulse: string,
    rr: string,
    bp: string,
    spo2: string,
    height: string,
    weight: string,
    bmi: string,
    datetime: string,
    grbs : string
}

export interface PatientImageResponse {
    id: number,
    patientId: number,
    visitId: number,
    imagePath: string,
    date: string,
    imageExist: boolean,
    image: any
}
export interface CaseSheetModel {
    complaints: any[],
    history: any,
    vitals: any,
    examination: any,
    allergy: any,
    diagnosis: any,
    diagnosisDetails: any[],
    followUp: any,
    localExamination: any,
    isEmptyCaseSheet: boolean
}
export interface visitDetailInterface {
    date: string,
    doctorName: string,
    departmentName: string,
    visitId: number;
    ancStatus : number,
    prescription: prescriptionDeatilsInterface[];
    laboratory: laboratoryDetailsInterface[];
    //outsideLab: OutsideLabInterface[];
    //outsideInv : OutsideInvInterface[];
    generalCaseSheet: generalCaseSheetDetailsInterface | any;
    caseSheet: CaseSheetModel,
    vitals : VitalsInterface | any,
    patientDetails : any
}
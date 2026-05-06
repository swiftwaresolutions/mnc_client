export interface visitDetails {
    date: string,
    doctorName: string
    departmentName: string,
    visitId: Number,
    generalCaseSheetResult: any, // {}
    prescriptionResult: any[],
    laboratoryResult: any[],
    dentalCaseSheetResult: any, // {}

}
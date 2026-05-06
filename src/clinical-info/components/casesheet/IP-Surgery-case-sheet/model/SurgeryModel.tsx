interface SurgeryModel{
   id: Number,
   patId: Number,
   visitId: Number,
   ipId: Number,
   entDate: string,
   entTime: string,
   surgeryDate: string,
   surgeryTime: string,
   durSurgery: string,
   preOtDiagnosis: string,
   postOtDiagnosis: string,
   detSurgery: string,
   procedureNotes: string,
   progressNotes: string
   anestDoc: string,
}
const surgicalModelSaveFormat={
    id: 0,
    patId: 0,
    visitId: 0,
    ipId: 0,
    entDate: '0000-00-00',
    entTime: '00:00:00',
    surgeryDate: '0000-00-00',
    surgeryTime: '00:00:00',
    durSurgery: '',
    preOtDiagnosis: '',
    postOtDiagnosis: '',
    detSurgery: '',
    procedureNotes: '',
    progressNotes: '',
    anestDoc: ''
}
const createSurigicalSurgonSaveFormat= {
      id: 0,
      surId: 0,
      surgonId: 0,
      isAssSurgon: 0,
      isValid:1
    }
  
  
    const createSurigicalNurseFormat={
      id: 0,
      surId: 0,
      nurse: '',
      isAssNurse: 0,
      isValid:1
    }
    const createSurigicalAssNurseFormat={
      id: 0,
      surId: 0,
      nurse: '',
      isAssNurse: 1,
      isValid:1
    }
    const SurgeryNamesaveFormat=
    {
      id: 0,
      surId: 0,
      surgeryName: '',
      isValid: 1
      }
      const consultantSavaFormat={
        id: 0,
        surId: 0,
        surgonId: 0,
        isAssSurgon: 0,
        isValid:1,
        selectedConsultant:[{ id: 0, name: "" }]
      } 
      const AssConsultantSavaFormat={
        id: 0,
        surId: 0,
        surgonId: 0,
        isAssSurgon: 1,
        isValid:1,
        selectedConsultant:[{ id: 0, name: "" }]
      } 
  
    export {type SurgeryModel,SurgeryNamesaveFormat,consultantSavaFormat,AssConsultantSavaFormat,createSurigicalSurgonSaveFormat,createSurigicalAssNurseFormat,createSurigicalNurseFormat,surgicalModelSaveFormat}
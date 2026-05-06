import { CaseSheetModel, generalCaseSheetDetailsInterface } from "../model/interfaces";

export const generalCaseSheetValidate = (casesheet: CaseSheetModel, generalCaseSheet: generalCaseSheetDetailsInterface): CaseSheetModel => {
    if (Object.values(generalCaseSheet).length > 0) {
        casesheet.isEmptyCaseSheet = false;
        casesheet.complaints = [...generalCaseSheet?.complaintDataList]
        casesheet.diagnosisDetails = [...generalCaseSheet.diagnosisDetailsData]
        casesheet.history = {
            ...casesheet.history,
            presentIllness: generalCaseSheet.presentIllness,
            past: generalCaseSheet.pastHistory,
            treatmentHistory: generalCaseSheet.treatmentHistory,
            investigationHistory: generalCaseSheet.investigationHistory,
            menstrualHistory: generalCaseSheet.menstrualHistory,
            personalHistory: generalCaseSheet.personalHistory,
            pastHistorySurgical: generalCaseSheet.pastHistorySurgical,
            pastHistoryMedical: generalCaseSheet.pastHistoryMedical,
            familyHistory: generalCaseSheet.familyHistory,
            presentingComplaints: generalCaseSheet.presentingComplaints,

        }
        casesheet.vitals = {
            temp: generalCaseSheet.temperature,
            pulse: generalCaseSheet.pulse,
            rr: generalCaseSheet.rr,
            bp: generalCaseSheet.bp,
            spo2: generalCaseSheet.spo2,
            height: generalCaseSheet.height,
            weight: generalCaseSheet.weight,
            bmi: generalCaseSheet.bmi,
            // grbs : generalCaseSheet.grbs
        }
        casesheet.examination = {
            oralCavity: generalCaseSheet.oralCavity,
            generalPhysical: generalCaseSheet.generalPhysical,
            cvs: generalCaseSheet.cvs,
            res: generalCaseSheet.res,
            abdominal: generalCaseSheet.abdominal,
            cns: generalCaseSheet.cns,
            perVaginal: generalCaseSheet.perVaginal,
            oralRectal: generalCaseSheet.oralRectal,
            others: generalCaseSheet.others,
            skin: generalCaseSheet.skin,
            musculoskeletal: generalCaseSheet.musculoskeletal,
            additionalFindings: generalCaseSheet.additionalFindings,
            generalExamination: generalCaseSheet.generalExamination,
            systemicExamination: generalCaseSheet.systemicExamination,
            pallor: generalCaseSheet.pallor,
            icterus: generalCaseSheet.icterus,
            edema: generalCaseSheet.edema,

        }
        casesheet.allergy = {
            allergy: generalCaseSheet.allergy
        }
        casesheet.diagnosis = {
            differentialDiagnosis: generalCaseSheet.differentialDiagnosis,
            confirmedDiagnosis: generalCaseSheet.confirmedDiagnosis,
            diagnosis: generalCaseSheet.diagnosis,
        }
        casesheet.followUp = {
            recomendations: generalCaseSheet.recomendations,
            proceduresPlanned: generalCaseSheet.proceduresPlanned,
            followUpPlan: generalCaseSheet.followUpPlan,
        }

         casesheet.localExamination = {
            foot: generalCaseSheet.foot,
            wound: generalCaseSheet.wound
        }
    }
    return { ...casesheet }

}
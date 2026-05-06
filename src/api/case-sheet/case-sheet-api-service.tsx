import HttpClientWrapper from "../http-client-wrapper";

class CaseSheetApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    public getComplaintDetails = async (query: string) => {
        try {
            let url = '/v1/fetchComplaintDetails';
            url = url + "/" + query
            const response: any = await this.httpClientWrapper.get(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }

    public getDiagnosisDetails = async (diagnosisName: string) => {
        try {
            let url = '/v1/fetchDiagnosisDetails';
            url = url + "/" + diagnosisName
            const response: any = await this.httpClientWrapper.get(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }

    public getCaseSheetTemplate = async (casesheetType: any, templateFieldId: any, docId?: number) => {
        try {
            const params = new URLSearchParams();
            if (docId !== undefined) {
                params.append("docId", docId.toString());
            }
            let data: any = await this.httpClientWrapper.get(`/v1/fetchCaseSheetTemplates/${casesheetType}/${templateFieldId}?${params.toString()}`);
            return data;
        } catch (error) {
            throw error;
        }
    }

    public createCaseSheetTemplate = async (payload: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('/v1/saveCaseSheetTemplate', payload);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    public fetchGeneralCaseSheetByVstId = async (visitId: string) => {
        try {
            let url = `/v1/fetchGeneralCaseSheetByVstId/${visitId}`
            const response: any = await this.httpClientWrapper.get(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }

    public saveGeneralCaseSheet = async (formData: Object) => {
        try {
            let data: any = await this.httpClientWrapper.post('/v1/saveGeneralCaseSheet', formData);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    public updateGeneralCaseSheet = async (id: string, caseSheetType: number, formData: Object) => {
        try {
            let url = 'v1/updateGeneralCaseSheet';
            url = url + "/" + id + "/" + caseSheetType
            let data: any = await this.httpClientWrapper.put(url, formData);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    public fetchPediatricCaseSheetByVstId = async (visitId: string) => {
        try {
            let url = '/v1/fetchPediatricCaseSheetByVstId';
            url = url + "/" + visitId
            const response: any = await this.httpClientWrapper.get(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }

    public savePediatricCaseSheet = async (formData: Object) => {
        try {
            let data: any = await this.httpClientWrapper.post('/v1/savePediatricCaseSheet', formData);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    public updatePediatricCaseSheet = async (id: string, caseSheetType: string, formData: Object) => {
        try {
            let url = 'v1/updatePediatricCaseSheet';
            url = url + "/" + id + "/" + caseSheetType
            let data: any = await this.httpClientWrapper.put(url, formData);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    // public fetchAnthropometrySheetByVstId = async (visitId: string) => {
    //     try {
    //         let url = '/v1/fetchAnthropometrySheetByVstId';
    //         url = url + "/" + visitId
    //         const response: any = await this.httpClientWrapper.get(url);
    //         return response;
    //     } catch (error: any) {
    //         throw error
    //     }
    // }

    public saveAnthropometry = async (dataDetails: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('/v1/saveAnthropometry', dataDetails);
            return (data);
        } catch (error) {
            throw error;
        }
    }
    public saveNeonate = async (dataDetails: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('/v1/saveNeonateCaseSheet', dataDetails);
            return (data);
        } catch (error) {
            throw error;
        }
    }
    public saveOpVitals = async (dataDetails: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('/v1/saveOpVitals', dataDetails);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    public fetchOpVitalsByVstId = async (visitId: string) => {
        try {
            let url = '/v1/fetchOpVitalsByVstId';
            url = url + "/" + visitId
            const response: any = await this.httpClientWrapper.get(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }

    public updateAnthropometry = async (caseSheetId: string, formData: Object) => {
        try {
            let url = 'v1/updateAnthropometry';
            url = url + "/" + caseSheetId
            let data: any = await this.httpClientWrapper.put(url, formData);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    public updateOPVitals = async (vitalsId: string, dataDetails: Object) => {
        try {
            let url = 'v1/updateOPVitals';
            url = url + "/" + vitalsId
            let data: any = await this.httpClientWrapper.put(url, dataDetails);
            return (data);
        } catch (error) {
            throw error;
        }
    }
    public saveNeonateCaseSheet = async (dataDetails: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('/v1/saveNeonateCaseSheet', dataDetails);
            return (data);
        } catch (error) {
            throw error;
        }
    }
    public fetchNeonateCaseSheetByVstId = async (visitId: string) => {
        try {
            let url = '/v1/fetchNeonateCaseSheetByVstId';
            url = url + "/" + visitId
            const response: any = await this.httpClientWrapper.get(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }
    public updateNeonateCaseSheet = async (id: string, caseSheetType: string, formData: Object) => {
        try {
            let url = 'v1/updateNeonateCaseSheet';
            url = url + "/" + id + "/" + caseSheetType
            let data: any = await this.httpClientWrapper.put(url, formData);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    //Dental Start//
    public fetchDentalCaseSheetByVstId = async (visitId: string) => {
        try {
            let url = '/v1/fetchDentalCaseSheetByVstId';
            url = url + "/" + visitId
            const response: any = await this.httpClientWrapper.get(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }

    public saveDentalCaseSheet = async (dentalDetails: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('/v1/saveDentalCaseSheet', dentalDetails);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    public updateDentalCaseSheet = async (caseSheetId: string, formData: Object) => {
        try {
            let url = 'v1/updateDentalCaseSheet';
            url = url + "/" + caseSheetId
            let data: any = await this.httpClientWrapper.put(url, formData);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    //Dental End//
    public saveAntenatalCaseSheet = async (dataDetails: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('/v1/saveAntenatalCaseSheet', dataDetails);
            return (data);
        } catch (error) {
            throw error;
        }
    }
    public updateAntenatalCaseSheet = async (vitalsId: string, dataDetails: Object) => {
        try {
            let url = 'v1/updateAntenatalCaseSheet';
            url = url + "/" + vitalsId
            let data: any = await this.httpClientWrapper.put(url, dataDetails);
            return (data);
        } catch (error) {
            throw error;
        }
    }
    public fetchAntenatalCaseSheetByVstId = async (visitId: string) => {
        try {
            let url = '/v1/fetchAntenatalCaseSheetByVstId';
            url = url + "/" + visitId
            const response: any = await this.httpClientWrapper.get(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }
    public getSummaryTemplate = async (fieldId: string) => {
        try {
            let url = '/v1/fetchSummaryTemplate';
            url = url + "/" + fieldId
            const response: any = await this.httpClientWrapper.get(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }
    public saveDischargeSummary = async (dataDetails: any) => {

        try {
            let data: any = await this.httpClientWrapper.post('/v1/saveDischargeSummary', dataDetails);
            return (data);
        } catch (error) {
            throw error;
        }
    }
    public saveSummaryTemplates = async (dataDetails: any) => {

        try {
            let data: any = await this.httpClientWrapper.post('/v1/saveSummaryTemplates', dataDetails);
            return (data);
        } catch (error) {
            throw error;
        }
    }
    public fetchDischargeSummaryByVstId = async (visitId: string) => {
        try {
            let url = '/v1/fetchDischargeSummaryByVstId';
            url = url + "/" + visitId
            const response: any = await this.httpClientWrapper.get(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }
    public updateDischargeSummary = async (caseSheetId: string, formData: Object) => {
        try {
            let url = 'v1/updateDischargeSummary';
            url = url + "/" + caseSheetId
            let data: any = await this.httpClientWrapper.put(url, formData);
            return (data);
        } catch (error) {
            throw error;
        }
    }
    public saveSurgeryCaseSheet = async (dataDetails: any) => {
        console.log(dataDetails);

        try {
            let data: any = await this.httpClientWrapper.post('/v1/saveSurgeryCaseSheet', dataDetails);
            return (data);
        } catch (error) {
            throw error;
        }
    }
    public fetchSurgeryCaseSheetByVstId = async (visitId: string) => {
        try {
            let url = '/v1/fetchSurgeryCaseSheetByVstId';
            url = url + "/" + visitId
            const response: any = await this.httpClientWrapper.get(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }
    public updateSurgeryCaseSheet = async (id: string, dataDetails: Object) => {
        try {
            let url = 'v1/updateSurgeryCaseSheet';
            url = url + "/" + id
            let data: any = await this.httpClientWrapper.put(url, dataDetails);
            return (data);
        } catch (error) {
            throw error;
        }
    }
    public saveNursingIo = async (dataDetails: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('/v1/saveNursingIo', dataDetails);
            return (data);
        } catch (error) {
            throw error;
        }
    }
    public fetchNursingIoByVstId = async (visitId: string) => {
        console.log(visitId);

        try {
            let url = '/v1/fetchNursingIOByVstId';
            url = url + "/" + visitId
            const response: any = await this.httpClientWrapper.get(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }
    public saveIpProcedureCaseSheet = async (formData: Object) => {
        try {
            let data: any = await this.httpClientWrapper.post('/v1/saveIpProcedureCaseSheet', formData);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    public fetchIpProcedureCaseSheetByVstId = async (visitId: string) => {
        try {
            let url = '/v1/fetchIpProcedureCaseSheetByVstId';
            url = url + "/" + visitId
            const response: any = await this.httpClientWrapper.get(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }

    public updateIpProcedureCaseSheet = async (visitId: string, dataDetails: object) => {
        try {
            let url = 'v1/updateIpProcedureCaseSheet';
            url = url + "/" + visitId
            let data: any = await this.httpClientWrapper.put(url, dataDetails);
            return (data);
        } catch (error) {
            throw error;
        }
    }
    public saveDermatologyCaseSheet = async (formData: Object) => {
        try {
            let data: any = await this.httpClientWrapper.post('/v1/saveDermatologyCaseSheet', formData);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    public fetchDermatologyCaseSheetByVstId = async (visitId: string) => {
        try {
            let url = '/v1/fetchDermatologyCaseSheetByVstId';
            url = url + "/" + visitId
            const response: any = await this.httpClientWrapper.get(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }

    public updateDermatologyCaseSheet = async (id: string, caseSheetType: string, formData: Object) => {
        try {
            let url = 'v1/updateDermatologyCaseSheet';
            url = url + "/" + id + "/" + caseSheetType
            let data: any = await this.httpClientWrapper.put(url, formData);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    public saveOpthamologyCaseSheet = async (formData: Object) => {
        try {
            let data: any = await this.httpClientWrapper.post('/v1/saveOpthamologyCaseSheet', formData);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    public fetchOpthamologyCaseSheetByVstId = async (visitId: string) => {
        try {
            let url = '/v1/fetchOpthamologyCaseSheetByVstId';
            url = url + "/" + visitId
            const response: any = await this.httpClientWrapper.get(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }

    public updateOpthamologyCaseSheet = async (id: string, caseSheetType: string, formData: Object) => {
        try {
            let url = 'v1/updateOpthamologyCaseSheet';
            url = url + "/" + id + "/" + caseSheetType
            let data: any = await this.httpClientWrapper.put(url, formData);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    public saveENTCaseSheet = async (formData: Object) => {
        try {
            let data: any = await this.httpClientWrapper.post('/v1/saveENTCaseSheet', formData);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    public fetchENTCaseSheetByVstId = async (visitId: string) => {
        try {
            let url = '/v1/fetchENTCaseSheetByVstId';
            url = url + "/" + visitId
            const response: any = await this.httpClientWrapper.get(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }

    public updateENTCaseSheet = async (id: string, caseSheetType: string, formData: Object) => {
        try {
            let url = 'v1/updateENTCaseSheet';
            url = url + "/" + id + "/" + caseSheetType
            let data: any = await this.httpClientWrapper.put(url, formData);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    public updateNursingIo = async (Id: Number, dataDetails: Object) => {


        try {
            let url = 'v1/updateNursingIO';
            url = url + "/" + Id
            let data: any = await this.httpClientWrapper.put(url, dataDetails);
            return (data);
        } catch (error) {
            throw error;
        }
    }
    public saveSurgeryCheckList = async (dataDetails: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('/v1/saveSurgeryChecklist', dataDetails);
            return (data);
        } catch (error) {
            throw error;
        }
    }
    public fetchSurgeryCheckListByVstId = async (visitId: string) => {
        console.log(visitId);

        try {
            let url = '/v1/fetchSurgeryChecklistByVatId';
            url = url + "/" + visitId
            const response: any = await this.httpClientWrapper.get(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }
    public updateSurgeryCheckList = async (Id: Number, dataDetails: Object) => {


        try {
            let url = 'v1/updateSurgeryChecklist';
            url = url + "/" + Id
            let data: any = await this.httpClientWrapper.put(url, dataDetails);
            return (data);
        } catch (error) {
            throw error;
        }
    }
    public saveAldreteScoreChart = async (dataDetails: any) => {
        try {
            let data: any = await this.httpClientWrapper.post('/v1/saveAldreteScoreChart', dataDetails);
            return (data);
        } catch (error) {
            throw error;
        }
    }
    public fetchAldreteScoreChartByVstId = async (visitId: string) => {
        console.log(visitId);

        try {
            let url = '/v1/fetchAldreteScoreChartByVatId';
            url = url + "/" + visitId
            const response: any = await this.httpClientWrapper.get(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }
    public updateAldreteScoreChart = async (Id: Number, dataDetails: Object) => {


        try {
            let url = 'v1/updateAldreteScoreChart';
            url = url + "/" + Id
            let data: any = await this.httpClientWrapper.put(url, dataDetails);
            return (data);
        } catch (error) {
            throw error;
        }
    }
    public saveAncCaseSheet = async (formData: Object) => {
        try {
            let data: any = await this.httpClientWrapper.post('/v1/saveAncCaseSheet', formData);
            return (data);
        } catch (error) {
            throw error;
        }
    }
    public fetchAncByPatId = async (patId: string) => {
        try {
            let url = '/v1/fetchAncCaseSheetByPatId';
            url = url + "/" + patId
            const response: any = await this.httpClientWrapper.get(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }

    public fetchAncByVstId = async (visitId: string) => {
        try {
            let url = '/v1/fetchAncCaseSheetByVstId';
            url = url + "/" + visitId
            const response: any = await this.httpClientWrapper.get(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }

    public updateAncCaseSheet = async (Id: string, dataDetails: object) => {
        try {
            let url = 'v1/updateAncCaseSheet';
            url = url + "/" + Id
            let data: any = await this.httpClientWrapper.put(url, dataDetails);
            return (data);
        } catch (error) {
            throw error;
        }
    }
    public saveDeliverySheet = async (formData: Object) => {
        try {
            let data: any = await this.httpClientWrapper.post('/v1/saveDeliveryDetails', formData);
            return (data);
        } catch (error) {
            throw error;
        }
    }
    public fetchDeliveryByVstId = async (visitId: string) => {
        try {
            let url = '/v1/fetchAncDeliveryDetials';
            url = url + "/" + visitId
            const response: any = await this.httpClientWrapper.get(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }
    public updateDeliverSheet = async (Id: string, dataDetails: object) => {
        try {
            let url = 'v1/updateDeliveryDetails';
            url = url + "/" + Id
            let data: any = await this.httpClientWrapper.put(url, dataDetails);
            return (data);
        } catch (error) {
            throw error;
        }
    }
    public saveAncDetailsCaseSheet = async (formData: Object) => {
        try {
            let data: any = await this.httpClientWrapper.post('/v1/saveAncDetailsCaseSheet', formData);
            return (data);
        } catch (error) {
            throw error;
        }
    }
    public fetchAncDetialsByVstId = async (visitId: string) => {
        try {
            let url = '/v1/fetchAncDetialsByVstId';
            url = url + "/" + visitId
            const response: any = await this.httpClientWrapper.get(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }

    public updateAncDetailsCaseSheet = async (Id: string, dataDetails: object) => {
        try {
            let url = 'v1/updateAncDetailsCaseSheet';
            url = url + "/" + Id
            let data: any = await this.httpClientWrapper.put(url, dataDetails);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    public fetchPrevAncDetailsByAncId = async (ancId: string) => {
        try {
            let url = '/v1/fetchPrevAncDetialsByAncId';
            url = url + "/" + ancId
            const response: any = await this.httpClientWrapper.get(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }

    public savePatientAppointmentRegister = async (formData: Object) => {
        try {
            let data: any = await this.httpClientWrapper.post('/v1/savePatientAppointmentRegister', formData);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    public fetchPatientAppointmentByVstId = async (visitId: string, type : number) => {
        try {
            let url = '/v1/fetchPatientAppointmentByVstId';
            url = url + "/" + visitId+ "/" +type
            const response: any = await this.httpClientWrapper.get(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }

    public updatePatientAppointmentRegister = async (id: string, formData: Object) => {
        try {
            let url = 'v1/updatePatientAppointmentRegister';
            url = url + "/" + id
            let data: any = await this.httpClientWrapper.put(url, formData);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    public fetchPatientHeight = async (patId: string) => {
        try {
            let url = '/v1/fetchOpVitalsHeightByPatId';
            url = url + "/" + patId
            const response: any = await this.httpClientWrapper.get(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }

    public deleteCaseSheetTemplateById = async (id : number) => {
        try {
            let url = 'v1/deleteCaseSheetTemplate';
            url = url + "/" + id ;
            let result: any = await this.httpClientWrapper.put(url);
            return (result);
        } catch (error) {
            throw error ;
        }
    }

    public updateRiskFactor = async (id: number, riskFactor: string, personalInfo : string) => {
        try {
            // let url = 'v1/updateRiskFactors';
            // url = url + "/" + id
            // let data: any = await this.httpClientWrapper.put(url, riskFactor);
            let url = `v1/updateRiskFactors/${id}?riskFactors=${encodeURIComponent(riskFactor)}` + `&personalInfo=${encodeURIComponent(personalInfo)}`;
            let data = await this.httpClientWrapper.put(url, {});
            return (data);
        } catch (error) {
            throw error;
        }
    }

    public updatePatientDeliveryStatus = async (id : number) => {
        try {
            let url = 'v1/updatePatientDelivery';
            url = url + "/" + id ;
            let result: any = await this.httpClientWrapper.put(url);
            return (result);
        } catch (error) {
            throw error ;
        }
    }

    public updateCaseSheetTemplateById = async (id : number,data : object) => {
        try {
            let url = 'v1/updateCaseSheetTemplate';
            url = url + "/" + id ;
            let result: any = await this.httpClientWrapper.put(url,data);
            return (result);
        } catch (error) {
            throw error ;
        }
    }

    public receiveDoctorTransfer = async (id : number) => {
        try {
            let url = 'v1/receiveDoctorTransfer';
            url = url + "/" + id ;
            let result: any = await this.httpClientWrapper.put(url);
            return (result);
        } catch (error) {
            throw error ;
        }
    }

    public reOpenDoctorTransfer = async (id : number) => {
        try {
            let url = 'v1/reOpenDoctorTransfer';
            url = url + "/" + id ;
            let result: any = await this.httpClientWrapper.put(url);
            return (result);
        } catch (error) {
            throw error ;
        }
    }
}
export default CaseSheetApiService;
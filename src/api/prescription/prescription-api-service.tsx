import HttpClientWrapper from "../http-client-wrapper"

export class PrescriptionApiService {

    private httpWrapper: HttpClientWrapper;

    constructor() {
        this.httpWrapper = new HttpClientWrapper();
    }

    public getPrescriptionUnitDetails = async () => {
        try {
            let url = 'v1/fetchUnitDetails';
            const response: any = await this.httpWrapper.get(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }
    public getPrescriptionTimingDetails = async () => {
        try {
            let url = 'v1/fetchTimingDetails';
            const response: any = await this.httpWrapper.get(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }
    public getPrescriptionDurationDetails = async () => {
        try {
            let url = 'v1/fetchDurationDetails';
            const response: any = await this.httpWrapper.get(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }
    public getPhInstructionDetails = async () => {
        try {
            let url = 'v1/fetchPrescriptionInstruction';
            const response: any = await this.httpWrapper.get(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }
    public getPhRoutesDetails = async () => {
        try {
            let url = 'v1/fetchPrescriptionRoutes';
            const response: any = await this.httpWrapper.get(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }
    public getGenericDetails = async (genName: string) => {
        try {
            let url = 'v1/fetchGenericDetails';
            url = url + "/" + genName
            const response: any = await this.httpWrapper.get(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }
    public getEqualentDrugs = async (genId: string) => {
        try {
            let url = 'v1/fetchEqualentDrugsByGenericId';
            url = url + "/" + genId
            const response: any = await this.httpWrapper.get(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }
    public getMedicineNameList = async (query: string, storeId: string) => {
        try {
            let url = 'v1/fetchMedicineNames';
            url = url + "/" + query + "/" + storeId
            const response: any = await this.httpWrapper.get(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }
    public getStoreWiseAvailableStock = async (query: string) => {
        try {
            let url = 'v1/fetchStoreWiseAvailableStock';
            url = url + "/" + query
            const response: any = await this.httpWrapper.get(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }
    public getPrecriptionTemplateNameList = async (prescriptionTemplateId: number) => {
        try {
            let url = 'v1/fetchPrescriptionTemplates';
            url = url + "/" + prescriptionTemplateId
            const response: any = await this.httpWrapper.get(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }
    public getPrescriptionTemplateDetailsById = async (id: string, storeId: number) => {
        try {
            let url = 'v1/fetchPrescriptionTemplateDetailsById';
            url = url + "/" + id + "/" + storeId
            const response: any = await this.httpWrapper.get(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }
    public getPrescriptionDetailsbyPatId = async (patId: string, hospitalDisponsoryStoreId: number) => {
        try {
            let url = 'v1/fetchPrevPrescriptionDetails';
            url = url + "/" + patId + "/" + hospitalDisponsoryStoreId
            const response: any = await this.httpWrapper.get(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }
    public fetchPrevPrescriptionDetailsByVstId = async (patId: string, hospitalDisponsoryStoreId: number) => {
        try {
            let url = 'v1/fetchPrevPrescriptionDetailsByVstId';
            url = url + "/" + patId + "/" + hospitalDisponsoryStoreId
            const response: any = await this.httpWrapper.get(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }
    public fetchPrescriptionDetailsByVstId = async (visitId: string, isSummary: number) => {
        try {
            let url = 'v1/fetchPrescriptionDetailsByVstId';
            url = url + "/" + visitId + "/" + isSummary
            const response: any = await this.httpWrapper.get(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }
    public fetchPatientLastPrescriptionDetails = async (patId: string, hospitalDisponsoryStoreId: number) => {
        try {
            let url = 'v1/fetchPatientLastPrescriptionDetails';
            url = url + "/" + patId + "/" + hospitalDisponsoryStoreId
            const response: any = await this.httpWrapper.get(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }
    public savePrescription = async (payLoad: Object) => {
        try {
            let url = 'v1/savePrescription';
            let data: any = await this.httpWrapper.post(url, payLoad);
            return (data);
        } catch (error) {
            throw error;
        }
    }
    public savePrescriptionTemplate = async (payLoad: Object) => {
        try {
            let url = 'v1/savePrescriptionTemplate';
            let data: any = await this.httpWrapper.post(url, payLoad);
            return (data);
        } catch (error) {
            throw error;
        }
    }
    public updatePrescription = async (prescriptionId: string, payLoad: Object) => {
        try {
            let url = 'v1/updatePrescription';
            url = url + "/" + prescriptionId
            let data: any = await this.httpWrapper.put(url, payLoad);
            return (data);
        } catch (error) {
            throw error;
        }
    }
    public updatePrescriptionDetailsNotes = async (id: string, notes: string) => {
        try {
            let url = 'v1/updatePrescriptionDetailsNotes';
            url = url + "/" + id
            let data: any = await this.httpWrapper.put(url, { notes: notes });
            return (data);
        } catch (error) {
            throw error;
        }
    }

    public editPrescriptionTemplate = async (payLoad: Object) => {
        try {
            let url = 'v1/editPrescriptionTemplate';
            let result: any = await this.httpWrapper.put(url,payLoad);
            return (result);
        } catch (error) {
            throw error ;
        }
    }

    public getGeneralInstructionByPresId = async (presId: number) => {
        try {
            let url = 'v1/fetchGeneralInstructionByPrescId';
            url = url + "/" + presId 
            const response: any = await this.httpWrapper.get(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }
}


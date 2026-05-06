import HttpClientWrapper from "../http-client-wrapper";

export class InvestigationApiService {
    private httpWrapper: HttpClientWrapper;

    constructor() {
        this.httpWrapper = new HttpClientWrapper();
    }

    public getInvestigationDepartment = async () => {
        try {
            let url = '/v1/fetchInvestigationDepartment';
            const response: any = await this.httpWrapper.get(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }
    public getInvestigationNamesByDepartment = async (query: string) => {
        try {
            let url = '/v1/fetchInvestigationNamesByGroupId';
            url = url + "/" + query
            const response: any = await this.httpWrapper.get(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }
    public getInvestigationNamesByPatId = async (patId: string) => {
        try {
            let url = '/v1/fetchInvestigationOrderedDetails';
            url = url + "/" + patId
            const response: any = await this.httpWrapper.get(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }
    public SaveInvestigationOrder = async (payload: any) => {
        try {
            let url = '/v1/saveInvestigationOrder';
            const response: any = await this.httpWrapper.post(url, payload);
            return response;
        } catch (error: any) {
            throw error
        }
    }

    public deleteInvestigationOrderByProcId = async (orderId: string) => {
        try {
            let url = '/v1/deleteInvestigationOrderById';
            url = url + "/" + orderId
            const response: any = await this.httpWrapper.delete(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }
    public deleteInvestigationOrderByPatientId = async (patId: string) => {
        try {
            let url = '/v1/deleteInvestigationOrderByPatientId';
            url = url + "/" + patId
            const response: any = await this.httpWrapper.delete(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }
    public saveLabInvOrderTemplate = async (payload: any) => {
        try {
            let url = '/v1/saveLabInvOrderTemplate';
            const response: any = await this.httpWrapper.post(url, payload);
            return response;
        } catch (error: any) {
            throw error
        }
    }
    public fetchLabAndProcedureTemplateNameList = async (type: number) => {
        try {
            let url = '/v1/fetchOrderTemplates';
            url = url + "/" + type;
            const response: any = await this.httpWrapper.get(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }
    public fetchInvOrderTemplatesById = async (tempId: string) => {
        try {
            let url = '/v1/fetchInvOrderTemplatesById';
            url = url + "/" + tempId
            const response: any = await this.httpWrapper.get(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }

    public uploadImage = async (formData: any) => {
        try {
            let url = '/v1/invImg/uploadImage';
            const response: any = await this.httpWrapper.postFormData(url, formData);
            return response;
        } catch (error: any) {
            throw error
        }
    }

    public fetchAllOutsideInvDetailsByPatId = async (patId: string) => {
        try {
            let url = 'v1/fetchAllInvDetailsByPatId';
            url = url + "/" + patId
            const response: any = await this.httpWrapper.get(url);
            return response
        } catch (error: any) {
            throw error
        }
    }

    public updateSelectedImage = async (imgId: number,blockedUid : number, payload: any) => {
        try {
            let url = '/v1/updateSelectedImage';
            url = url + "/" + imgId + "/" + blockedUid
            const response: any = await this.httpWrapper.put(url, payload);
            return response;
        } catch (error: any) {
            throw error
        }
    }

    public fetchUploadedPdf = async (patientId: string) => {
        let url = `/v1/uploadedPdf/${patientId}`;
        const response: any = await this.httpWrapper.get(url);
        return response;
    }

    public deleteInvestigationOrderByorderId = async (orderId: string) => {
        try {
            let url = '/v1/blockInvestigationByOrderId';
            url = url + "/" + orderId
            const response: any = await this.httpWrapper.put(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }
}
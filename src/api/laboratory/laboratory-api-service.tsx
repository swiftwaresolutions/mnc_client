import HttpClientWrapper from "../http-client-wrapper";

export class LaboratoryApiService {
    private httpWrapper: HttpClientWrapper;

    constructor() {
        this.httpWrapper = new HttpClientWrapper();
    }
    public getLabDepartment = async () => {
        try {
            let url = '/v1/fetchLabDepartment';
            const response: any = await this.httpWrapper.get(url);
            return response;
        } catch (error: any) {
           throw error
        }
    }
    public getLabTestNamesByDepartment = async (query: string) => {
        try {
            let url = '/v1/fetchLabTestNameByGroupId';
            url = url + "/" + query
            const response: any = await this.httpWrapper.get(url);
            return response;
        } catch (error: any) {
           throw error

        }
    }
    public SaveLaboratoryOrder = async (payload: any) => {
        try {
            let url = '/v1/saveLabOrder';
            const response: any = await this.httpWrapper.post(url, payload);
            return response;
        } catch (error: any) {
           throw error
        }
    }
    public getLabTestNamesByPatId = async (query: string) => {
        try {
            let url = '/v1/fetchLabOrderedDetails';
            url = url + "/" + query
            const response: any = await this.httpWrapper.get(url);
            return response;
        } catch (error: any) {
           throw error
        }
    }
    public fetchLabResultsByVisitId = async (visitId: string) => {
        try {
            let url = '/v1/fetchLabResultsByVisitId';
            url = url + "/" + visitId
            const response: any = await this.httpWrapper.get(url);
            return response;
        } catch (error: any) {
           throw error
        }
    }
    public deleteLabOrderByLabId = async (labId: string) => {
        try {
            let url = '/v1/deleteLabOrderByLabId';
            url = url + "/" + labId
            const response: any = await this.httpWrapper.delete(url);
            return response;
        } catch (error: any) {
           throw error
        }
    }
    public deleteLabOrderByPatientId = async (patId: string) => {
        try {
            let url = '/v1/deleteLabOrderByPatientId';
            url = url + "/" + patId
            const response: any = await this.httpWrapper.delete(url);
            return response;
        } catch (error: any) {
           throw error
        }
    }
    public saveLabAndInvOrderTemplate = async (labId: string) => {
        try {
            let url = '/v1/saveLabInvOrderTemplate';
            url = url + "/" + labId
            const response: any = await this.httpWrapper.delete(url);
            return response;
        } catch (error: any) {
           throw error
        }
    }
    public fetchLabOrderTemplatesById = async (tempId: string) => {
        try {
            let url = '/v1/fetchLabOrderTemplatesById';
            url = url + "/" + tempId
            const response: any = await this.httpWrapper.get(url);
            return response;
        } catch (error: any) {
           throw error
        }
    }
    public fetchLabTestFields = async (tstId : number) => {
        try {
            let url = '/v1/fetchLabTestFields';
            url = url + "/"+tstId
            const response : any = await this.httpWrapper.get(url);
            return response
        } catch (error : any) {
            throw error
        }
    }

    public saveOutsideLabResult = async (payload : object) => {
        try {
            let url = 'v1/saveOutsideLabResult'
            let data : any = await this.httpWrapper.post(url,payload);
            return (data)
        } catch (error) {
            throw error
        }
    }

    public fetchOutsideLabResultDetailsByVistiId = async (visitId: string) => {
        try {
            let url = '/v1/fetchOutsideLabResultDetailsByVistiId';
            url = url + "/" + visitId
            const response: any = await this.httpWrapper.get(url);
            return response;
        } catch (error: any) {
           throw error
        }
    }

    public fetchPrevOutsideLabByVstId = async (vstId: String) => {
        try {
            let url = 'v1/fetchOutsideLabPrevResultByVisitId';
            url = url + "/" + vstId
            const response: any = await this.httpWrapper.get(url);
            return response;
        } catch (error : any) {
            throw error
        }
    }

    public fetchPrevOutsideLabResultDetailsId = async (display: number) => {
        try {
            let url = 'v1/fetchOutsideLabPrevResultDetails';
            url = url + "/" + display
            const response: any = await this.httpWrapper.get(url);
            return response;
        } catch (error : any) {
            throw error
        }
    }
    public updatePrevOutsideLabResult = async (display: number, formData: Object) => {
        try {
            let url = 'v1/updateOutsideLabResult';
            url = url + "/" + display
            let data: any = await this.httpWrapper.put(url, formData);
            return (data);
        } catch (error) {
            throw error;
        }
    }
    public saveOutsideInvResult = async (payload : object) => {
        try {
            let url = 'v1/saveOutsideInvDetails'
            let data : any = await this.httpWrapper.post(url,payload);
            return (data)
        } catch (error) {
            throw error
        }
    }

    public fetchPrevOutsideInvByVstId = async (vstId: String) => {
        try {
            let url = 'v1/fetchOutsideInvPrevResultByVisitId';
            url = url + "/" + vstId
            const response: any = await this.httpWrapper.get(url);
            return response;
        } catch (error : any) {
            throw error
        }
    }

    public fetchPrevOutsideInvResultDetailsId = async (display: number) => {
        try {
            let url = 'v1/fetchOutsideInvPrevResultDetails';
            url = url + "/" + display
            const response: any = await this.httpWrapper.get(url);
            return response;
        } catch (error : any) {
            throw error
        }
    }

    public updatePrevOutsideInvDetails = async (display: number, formData: Object) => {
        try {
            let url = 'v1/updateOutsideInvDetails';
            url = url + "/" + display
            let data: any = await this.httpWrapper.put(url, formData);
            return (data);
        } catch (error) {
            throw error;
        }
    }

    public fetchAllInvDetailsByVisitId = async (visitId : string) => {
        try {
            let url = 'v1/fetchAllInvDetailsByVisitId';
            url = url + "/" + visitId
            const response : any = await this.httpWrapper.get(url);
            return response
        } catch (error : any) {
            throw error
        }
    }

    public fetchOutsideLabResultDetailsByPatId = async (patId: string) => {
        try {
            let url = '/v1/fetchOutsideLabResultDetailsByPatId';
            url = url + "/" + patId
            const response: any = await this.httpWrapper.get(url);
            return response;
        } catch (error: any) {
           throw error
        }
    }

    public deleteOutsideLabResultById = async (id : number) => {
        try {
            let url = 'v1/deleteOutsideLabResult';
            url = url + "/" + id ;
            let result: any = await this.httpWrapper.put(url);
            return (result);
        } catch (error) {
            throw error ;
        }
    }
    public deleteOutsideInvResultById = async (id : number) => {
        try {
            let url = 'v1/deleteOutsideInvResult';
            url = url + "/" + id ;
            let result: any = await this.httpWrapper.put(url);
            return (result);
        } catch (error) {
            throw error ;
        }
    }

     public fetchLabResultsByPatientId = async (patId: string) => {
        try {
            let url = `/v1/fetchLabResultsByPatientId/${patId}`;
            const response: any = await this.httpWrapper.get(url);
            return response;
        } catch (error: any) {
           throw error
        }
    }

    public deleteLabTemplateById = async (id : number) => {
        try {
            let url = 'v1/editLabTemplate';
            url = url + "/" + id ;
            let result: any = await this.httpWrapper.put(url);
            return (result);
        } catch (error) {
            throw error ;
        }
    }
}
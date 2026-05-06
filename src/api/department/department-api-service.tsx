import HttpClientWrapper from "../http-client-wrapper"

export class DepartmentApiService {

    private httpWrapper: HttpClientWrapper;

    constructor() {
        this.httpWrapper = new HttpClientWrapper();
    }

    public fetchDepartment = async (depName: string) => {
        try {
            let url = '/v1/department/fetchDepartmentName';
            url = url + "/" + depName
            const response: any = await this.httpWrapper.get(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }

    public fetchWards = async () => {
        try {
            let url = '/v1/department/fetchAllWards';
            url = url
            const response: any = await this.httpWrapper.get(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }

    public fetchAllConsultantDetails = async () => {
        try {
            let url = '/v1/department/fetchAllConsultantDetails';
            url = url
            const response: any = await this.httpWrapper.get(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }

    public saveDoctorTransfer = async (payload: any) => {
        try {
            const url = '/v1/saveDoctorTransfer';
            const response: any = await this.httpWrapper.post(url, payload);
            return response;
        } catch (error: any) {
            throw error;
        }
    }

    public fetchDoctorTransfer = async (visitId: string) => {
        try {
            let url = '/v1/fetchDoctorTransfer';
            url = url + "/" + visitId
            const response: any = await this.httpWrapper.get(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }

    public removeDoctorTransfer = async (transferId: number) => {
        try {
            let url = '/v1/removeDoctorTransfer';
            url = url + "/" + transferId
            const response: any = await this.httpWrapper.put(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }

    public updateDoctorTransfer = async (transferId: number, nextReview: string) => {
        try {
            let url = '/v1/completeDoctorTransfer';
            url = url + "/" + transferId + "/" + nextReview;
            const response: any = await this.httpWrapper.put(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }
}
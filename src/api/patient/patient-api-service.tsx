import HttpClientWrapper from "../http-client-wrapper"

export class PatientApiService {

    private httpWrapper: HttpClientWrapper;

    constructor() {
        this.httpWrapper = new HttpClientWrapper();
    }

    public getOutPatientList = async (page: number = 1, pageSize: number = 1000) => {
        try {
            let url = '/v1/patients/outPatients';
            url = url + "?page=" + page + "&pageSize=" + pageSize;
            const response: any = await this.httpWrapper.get(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }
    public getInPatientList = async () => {
        try {
            let url = '/v1/patients/inPatients';
            const response: any = await this.httpWrapper.get(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }
    public getPatientVisitDetailsByPatId = async (patId: string) => {
        try {
            let url = '/v1/patients/getPatientVisitDetails';
            url = url + "/" + patId;
            const response: any = await this.httpWrapper.get(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }
    public getPrePatientDetialsByVstId = async (vstId: string) => {
        try {
            let url = '/v1/patients/fetchPrePatientDetialsByVstId';
            url = url + "/" + vstId;
            const response: any = await this.httpWrapper.get(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }
    public getPatientVisitDetailsByPatDisplayNumber = async (patDisplayNumber: string) => {
        try {
            let url = '/v1/patients/getPatientVisitDetailsByPatDisplay';
            url = url + "/" + patDisplayNumber;
            const response: any = await this.httpWrapper.get(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }
    public fetchPatientAppointmentRegister = async () => {
        try {
            let url = '/v1/fetchPatientAppointmentRegister';
            const response: any = await this.httpWrapper.get(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }

    public getPatientIdByDisplayNo = async (opno: string) => {
        try {
            let url = '/v1/patients/getPatientIdByDisplayNo';
            url = url + "/" + opno;
            const response: any = await this.httpWrapper.get(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }
}
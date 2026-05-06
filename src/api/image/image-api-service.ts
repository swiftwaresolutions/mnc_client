import HttpClientWrapper from "../http-client-wrapper"

export class ImageApiService {

    private httpWrapper: HttpClientWrapper;

    constructor() {
        this.httpWrapper = new HttpClientWrapper();
    }

    public fetchPatientUploadedImageDetails = async (patId: string) => {
        try {
            let url = `v1/image/fetchUploadedImageDetails/${patId}`;
            const response: any = await this.httpWrapper.get(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }
    public fetchPatientImageDetails = async (patId: string) => {
        try {
            let url = `v1/fetchPatientImageDetails/${patId}`;
            const response: any = await this.httpWrapper.get(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }
    public fetchPatientUploadImageDetails = async (patId: string) => {
        try {
            let url = `v1/fetchPatientImageDetails/${patId}`;
            const response: any = await this.httpWrapper.get(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }
    // public fetchPatientUploadedImage = async (imgName: string) => {
    //     try {
    //         let url = `v1/image/fetchPatientUploadedImage/${imgName}`;
    //         const response: any = await this.httpWrapper.get(url);
    //         return response;
    //     } catch (error: any) {
    //         throw error
    //     }
    // }
    
    public fetchInvUploadedDetailsByVstId = async (vstId: string) => {
        try {
            let url = `v1/fetchPatientInvImageDetailsByVstId/${vstId}`;
            const response: any = await this.httpWrapper.get(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }

    public fetchInvUploadedDetailsByPatId = async (patId: string) => {
        try {
            let url = `v1/fetchPatientInvImageDetailsByPatId/${patId}`;
            const response: any = await this.httpWrapper.get(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }

}
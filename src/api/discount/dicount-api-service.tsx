import HttpClientWrapper from "../http-client-wrapper";

export class DiscountApiService {
    private httpWrapper: HttpClientWrapper;

    constructor() {
        this.httpWrapper = new HttpClientWrapper();
    }

    public saveLabAndProcedureOrderDiscount = async (saveLabAndProcedureOrderDiscountpayload: {}) => {
        try {
            let url = '/v1/saveOrderDiscount';
            const response: any = await this.httpWrapper.post(url, saveLabAndProcedureOrderDiscountpayload);
            return response;
        } catch (error: any) {
            throw error
        }
    }
    public fetchOrderDiscountAmount = async (patId:number) => {
        try {
            let url = '/v1/fetchOrderDiscountAmount'+"/"+patId;
            const response: any = await this.httpWrapper.get(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }
    public DeleteLabAndProcedureOrderDiscount = async (patId: string) => {
        try {
            let url = '/v1/deleteOrderDiscById';
            url = url + "/" + patId
            const response: any = await this.httpWrapper.delete(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }
    public savePrescriptionOrderDiscount = async (saveLabAndProcedureOrderDiscountpayload: {}) => {
        try {
            let url = '/v1/saveOrderDiscount';
            const response: any = await this.httpWrapper.post(url, saveLabAndProcedureOrderDiscountpayload);
            return response;
        } catch (error: any) {
            throw error
        }
    }

}
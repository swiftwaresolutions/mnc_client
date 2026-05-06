import HttpClientWrapper from "../http-client-wrapper"

export class ConsultantApiService {

    private httpWrapper: HttpClientWrapper;

    constructor() {
        this.httpWrapper = new HttpClientWrapper();
    }

    public getConsultantList = async (query:string) => {
        try {
            let url = '/v1/fetchConsultant';
            url =url + "/"+query
            const response: any = await this.httpWrapper.get(url);
            return response;
        } catch (error: any) {
            throw error
        }
    }
}
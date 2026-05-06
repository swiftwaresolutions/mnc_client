import axios, { AxiosInstance } from "axios";
import clinicalConfig from "../clinicalConfig";
class ApiConfig {

    private baseURL = clinicalConfig.apiBaseName;     

    private apiBaseUrl: string;

    constructor() {
        this.apiBaseUrl = this.baseURL + '/api/';
    }

    private getApiBaseURL = () => {
        return this.apiBaseUrl;
    }

    public getAxiosInstance = () => {
        return axios.create({ baseURL: this.getApiBaseURL()});
    }

}
export default ApiConfig;

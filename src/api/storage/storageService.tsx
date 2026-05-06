export class StorageService {
    TOKENKEY="token";
    LOGINKEY = "loginData";
    
    public setToken(token: string) {
        if (!token) {
            return;
        }
        window.sessionStorage.setItem(this.TOKENKEY, token);
    }

    public getToken() {
        return window.sessionStorage.getItem(this.TOKENKEY);
    }

    public clearToken = () => {
        window.sessionStorage.removeItem(this.TOKENKEY);
    }

    public setLoginData(data: any) {
        if (!data) return;
        try {
            window.sessionStorage.setItem(this.LOGINKEY, JSON.stringify(data));
        } catch (err) {
            console.error("Error saving loginData to sessionStorage", err);
        }
    }

    public getLoginData(): any | null {
        const data = window.sessionStorage.getItem(this.LOGINKEY);
        if (!data) return null;
        try {
            return JSON.parse(data);
        } catch (err) {
            console.error("Error parsing loginData from sessionStorage", err);
            this.clearLoginData();
            return null;
        }
    }

    public clearLoginData() {
        window.sessionStorage.removeItem(this.LOGINKEY);
    }

    public clearAll() {
        this.clearToken();
        this.clearLoginData();
    }
}

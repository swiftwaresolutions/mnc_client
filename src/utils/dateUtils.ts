class DateUtils extends Date {
    private dd;
    private mm;
    private yyyy;
    private hh;
    private MM;
    private ss;
    constructor(dateString: string) {
        super(dateString)
        this.dd = String(this.getDate()).padStart(2, '0');
        this.mm = String(this.getMonth() + 1).padStart(2, '0');
        this.yyyy = this.getFullYear();
        this.hh = String(this.getHours()).padStart(2, '0');
        this.MM = String(this.getMinutes()).padStart(2, '0');
        this.ss = String(this.getSeconds()).padStart(2, '0');
    }
    public dateFormat(dateFormat: string) {
        if (dateFormat === "DD-MM-YYYY") {
            return `${this.dd}-${this.mm}-${this.yyyy}`
        }
        else if (dateFormat === "YYYY-MM-DD") {
            return `${this.yyyy}-${this.mm}-${this.dd}`
        }
        else if (dateFormat === "YYYY/MM/DD") {
            return `${this.dd}/${this.mm}/${this.yyyy}`
        }
        else if (dateFormat === "YYYY/MM/DD") {
            return `${this.dd}/${this.mm}/${this.yyyy}`
        }
        throw Error("Date format wrong")
    }
    public timeFormat(timeFormat: string) {
        if (timeFormat === "HH:MM:SS") {
            return `${this.hh}:${this.MM}:${this.ss}`
        } else if (timeFormat === "HH:MM") {
            return `${this.hh}:${this.MM}`
        }
        throw Error("Time format wrong")
    }

}

export { DateUtils }
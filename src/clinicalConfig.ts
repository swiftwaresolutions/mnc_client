
const isDev: boolean = process.env.NODE_ENV !== 'production';

// const hostAddress = isDev ? "192.168.1.60" : window.location.hostname    npm install --save-dev shx
const hostAddress = isDev ? "localhost" : "192.168.1.60"

let routerBaseUrl = "/clinical-info";

const clinicalConfig = {
  // hospitalFullName: process.env.REACT_APP_HOSPITAL_FULL_NAME || "SWIFTWARE",
  // hospitalShortName: process.env.REACT_APP_HOSPITAL_SHORT_NAME || "SWIFT",
  apiBaseName: process.env.REACT_APP_API_BASE_URL || "http://localhost:9091"
};

export { routerBaseUrl,isDev, hostAddress };
export default clinicalConfig;

import createAxiosInstance from "./CreateAxiosInstance";
const API_URL = process.env.REACT_APP_API_URL || "http://192.168.1.13:8080/api";
const axiosInstance = createAxiosInstance(API_URL);
export default axiosInstance;



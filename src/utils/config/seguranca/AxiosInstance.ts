import createAxiosInstance from "./CreateAxiosInstance";
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";
const axiosInstance = createAxiosInstance(API_URL);
export default axiosInstance;



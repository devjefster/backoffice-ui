import createAxiosInstance from "./CreateAxiosInstance";
const AUTH_URL = process.env.REACT_APP_AUTH_URL || "http://192.168.1.13:8081/api";
const autenticacaAxiosInstance = createAxiosInstance(AUTH_URL);
export default autenticacaAxiosInstance;

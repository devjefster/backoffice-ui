import createAxiosInstance from "./CreateAxiosInstance";
const AUTH_URL = process.env.REACT_APP_AUTH_URL || "http://localhost:8081";
const autenticacaAxiosInstance = createAxiosInstance(AUTH_URL);
export default autenticacaAxiosInstance;

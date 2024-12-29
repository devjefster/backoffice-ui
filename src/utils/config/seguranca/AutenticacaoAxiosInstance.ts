import createAxiosInstance from "./CreateAxiosInstance";
import {AUTH_API_URL} from "../../Constants";

const autenticacaAxiosInstance = createAxiosInstance(AUTH_API_URL);
export default autenticacaAxiosInstance;

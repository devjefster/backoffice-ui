import {PaginatedResponse} from "../../../model/PaginatedResponse";
import axiosInstance from "../../../utils/config/seguranca/AxiosInstance";
import {Cliente} from "../model/Cliente";

const handleError = (error: any) => {
    console.error("ClienteService error:", error);
    throw error; // or return a fallback value if needed
};

const ClienteService = {
    listarComFiltros: async (textoBusca?: string, page: number = 0, size: number = 10) => {
        try {
            const params = new URLSearchParams();
            if (textoBusca) params.append('textoBusca', textoBusca);
            params.append('page', page.toString());
            params.append('size', size.toString());
            const response = await axiosInstance.get<PaginatedResponse<Cliente>>('/cliente', {params});
            return response.data;
        } catch (error) {
            handleError(error);
        }
    },
    criar: (dto: Cliente) => axiosInstance.post<Cliente>('/cliente', dto),
    buscarPorId: (id: number) => axiosInstance.get<Cliente>(`/cliente/${id}`),

    atualizar: (id: number, dto: Cliente) => axiosInstance.put<Cliente>(`/cliente/${id}`, dto),

    deletar: (id: number) => axiosInstance.delete<void>(`/cliente/${id}`),
};

export default ClienteService;

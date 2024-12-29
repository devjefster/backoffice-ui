import {PaginatedResponse} from "../../../model/PaginatedResponse";
import {Fabricante} from "../models/Fabricante";
import axiosInstance from "../../../utils/config/seguranca/AxiosInstance";

const handleError = (error: any) => {
    console.error("ClienteService error:", error);
    throw error; // or return a fallback value if needed
};

const FabricanteService = {
    listarComFiltros: async (textoBusca?: string, page: number = 0, size: number = 10) => {
        try {
            const params = new URLSearchParams();
            if (textoBusca) params.append('textoBusca', textoBusca);
            params.append('page', page.toString());
            params.append('size', size.toString());
            const response = await axiosInstance.get<PaginatedResponse<Fabricante>>('/fabricantes', {params});
            return response.data;
        } catch (error) {
            handleError(error);
        }
    },
    criar: (dto: Fabricante) => axiosInstance.post<Fabricante>('/fabricantes', dto),
    buscarPorId: (id: number) => axiosInstance.get<Fabricante>(`/fabricantes/${id}`),

    atualizar: (id: number, dto: Fabricante) => axiosInstance.put<Fabricante>(`/fabricantes/${id}`, dto),

    deletar: (id: number) => axiosInstance.delete<void>(`/fabricantes/${id}`),
    validarCPFCouNPJUnico: (cpfCnpj: string) => axiosInstance.get<boolean>(`/fabricantes/unico/${cpfCnpj}`),
};

export default FabricanteService;

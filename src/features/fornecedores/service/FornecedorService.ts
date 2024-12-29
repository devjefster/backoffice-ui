import {PaginatedResponse} from "../../../model/PaginatedResponse";
import {Fornecedor} from "../models/Fornecedor";
import {Fabricante} from "../../fabricantes/models/Fabricante";
import axiosInstance from "../../../utils/config/seguranca/AxiosInstance";

const handleError = (error: any) => {
    console.error("Fornecedor Service error:", error);
    throw error; // or return a fallback value if needed
};

const FornecedorService = {
    listarComFiltros: async (textoBusca?: string, page: number = 0, size: number = 10) => {

        try {
            const params = new URLSearchParams();
            if (textoBusca) params.append('textoBusca', textoBusca);
            params.append('page', page.toString());
            params.append('size', size.toString());

            const response = await axiosInstance.get<PaginatedResponse<Fabricante>>('/fornecedores', {params});
            return response.data;
        } catch (error) {
            handleError(error);
        }
    },

    criar: (dto: Fornecedor) => axiosInstance.post<Fornecedor>('/fornecedores', dto),
    buscarPorId: (id: number) => axiosInstance.get<Fornecedor>(`/fornecedores/${id}`),

    atualizar: (id: number, dto: Fornecedor) => axiosInstance.put<Fornecedor>(`/fornecedores/${id}`, dto),

    deletar: (id: number) => axiosInstance.delete<void>(`/fornecedores/${id}`),
};

export default FornecedorService;

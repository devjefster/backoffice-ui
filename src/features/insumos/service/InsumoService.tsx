import {InsumoDTO} from "@features/insumos/model/Insumo";
import axiosInstance from "@utils/config/seguranca/AxiosInstance";
import {PaginatedResponse} from "../../../model/PaginatedResponse";

const handleError = (error: any) => {
    console.error("InsumoService error:", error);
    throw error; // ou retornar um valor padrão, se necessário
};

const InsumoService = {
    listarComFiltros: async (textoBusca?: string, tipoInsumo?: string, page: number = 0, size: number = 10) => {
        try {
            const params = new URLSearchParams();
            if (textoBusca) params.append("textoBusca", textoBusca);
            if (tipoInsumo) params.append("tipo", tipoInsumo);
            params.append("page", page.toString());
            params.append("size", size.toString());
            const response = await axiosInstance.get<PaginatedResponse<InsumoDTO>>("/insumos", {params});
            return response.data;
        } catch (error) {
            handleError(error);
        }
    },
    criar: (dto: InsumoDTO) => {
        return axiosInstance.post<InsumoDTO>("/insumos", dto)
    },

    buscarPorId: (id: number) => axiosInstance.get<InsumoDTO>(`/insumos/${id}`),

    atualizar: (id: number, dto: InsumoDTO) => {
        return axiosInstance.put<InsumoDTO>(`/insumos/${id}`, dto);
    },

    deletar: (id: number) => axiosInstance.delete<void>(`/insumos/${id}`),

    obterTiposDeInsumo: async () => {
        try {
            const response = await axiosInstance.get<{ chave: string; valor: string }[]>("/insumos/tipo-insumo");
            return response.data;
        } catch (error) {
            handleError(error);
            return []; // Retorna um array vazio em caso de erro
        }
    },
    obterUnidadeMedida: async () => {
        try {
            const response = await axiosInstance.get<{ chave: string; valor: string }[]>("/insumos/unidade-medida");
            return response.data;
        } catch (error) {
            handleError(error);
            return []; // Retorna um array vazio em caso de erro
        }
    },

    obterSubtiposPorTipoInsumo: async (tipoInsumo: string) => {
        try {
            const response = await axiosInstance.get<{ chave: string; valor: string }[]>(
                `/insumos/subtipos-insumo/${tipoInsumo}`
            );
            return response.data;
        } catch (error) {
            handleError(error);
            return []; // Retorna um array vazio em caso de erro
        }
    },

};

export default InsumoService;

import { PaginatedResponse } from "../../../model/PaginatedResponse";
import axiosInstance from "../../../utils/config/seguranca/AxiosInstance";
import {EntradaInsumosDTO} from "@features/entrada_insumos/model/EntradaInsumos";

const handleError = (error: any) => {
    console.error("EntradaInsumosService error:", error);
    throw error;
};

const EntradaInsumosService = {
    criarEntrada: async (dto: EntradaInsumosDTO) => {
        try {
            const response = await axiosInstance.post<EntradaInsumosDTO>("/entrada-insumos", dto);
            return response.data;
        } catch (error) {
            handleError(error);
        }
    },

    buscarPorId: async (id: number)=>{
        try {
            const response = await axiosInstance.get<EntradaInsumosDTO>(`/entrada-insumos/${id}`);
            return response.data;
        } catch (error) {
            handleError(error);
        }
    },

    listar: async (
        textoBusca?: string | null,
        fornecedorId?: number | null,
        dataInicio?: string | null,
        dataFim?: string,
        page: number = 0,
        size: number = 10
    ) => {
        try {
            const params = new URLSearchParams();
            if (textoBusca) params.append("textoBusca", textoBusca);
            if (fornecedorId) params.append("fornecedorId", fornecedorId.toString());
            if (dataInicio) params.append("dataInicio", dataInicio);
            if (dataFim) params.append("dataFim", dataFim);
            params.append("page", page.toString());
            params.append("size", size.toString());
            const response = await axiosInstance.get<PaginatedResponse<EntradaInsumosDTO>>(
                "/entrada-insumos",
                { params }
            );
            return response.data;
        } catch (error) {
            handleError(error);
        }
    },

    atualizarEntrada: async (id: number, dto: EntradaInsumosDTO) => {
        try {
            const response = await axiosInstance.put<EntradaInsumosDTO>(`/entrada-insumos/${id}`, dto);
            return response.data;
        } catch (error) {
            handleError(error);
        }
    },

    deletarEntrada: async (id: number): Promise<void> => {
        try {
            await axiosInstance.delete<void>(`/entrada-insumos/${id}`);
        } catch (error) {
            handleError(error);
        }
    },
};

export default EntradaInsumosService;

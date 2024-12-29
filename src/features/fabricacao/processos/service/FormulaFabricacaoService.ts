import {CriarFormulaFabricacaoRequest, FormulaFabricacaoDTO} from "../model/FormulaFabricacao";
import {PaginatedResponse} from "../../../../model/PaginatedResponse";
import axiosInstance from "@utils/config/seguranca/AxiosInstance";

const handleError = (error: any) => {
    console.error("FormulaFabricacaoService error:", error);
    throw error;
};

const FormulaFabricacaoService = {
    listarComFiltros: async (
        textoBusca?: string,
        dataInicio?: string,
        dataFim?: string,
        page: number = 0,
        size: number = 10
    ) => {
        try {
            const params = new URLSearchParams();
            if (textoBusca) params.append("textoBusca", textoBusca);
            if (dataInicio) params.append("dataInicio", dataInicio);
            if (dataFim) params.append("dataFim", dataFim);
            params.append("page", page.toString());
            params.append("size", size.toString());
            const response = await axiosInstance.get<PaginatedResponse<FormulaFabricacaoDTO>>(
                "/formula-fabricacao",
                {params}
            );
            return response.data;
        } catch (error) {
            handleError(error);
        }
    },

    criarFabricacao: async (dto: CriarFormulaFabricacaoRequest) => {
        try {
            const response = await axiosInstance.post<FormulaFabricacaoDTO>("/formula-fabricacao", dto);
            return response.data;
        } catch (error) {
            handleError(error);
        }
    },

    buscarPorId: async (id: number) => {
        try {
            const response = await axiosInstance.get<FormulaFabricacaoDTO>(`/formula-fabricacao/${id}`);
            return response.data;
        } catch (error) {
            handleError(error);
        }
    },

    atualizar: async (id: number, dto: CriarFormulaFabricacaoRequest) => {
        try {
            const response = await axiosInstance.put<FormulaFabricacaoDTO>(`/formula-fabricacao/${id}`, dto);
            return response.data;
        } catch (error) {
            handleError(error);
        }
    },

    deletar: async (id: number) => {
        try {
            await axiosInstance.delete<void>(`/formula-fabricacao/${id}`);
        } catch (error) {
            handleError(error);
        }
    },
    listarTiposProcessoFabricacao: async () => {
        try {
            const response = await axiosInstance.get<string[]>("/formula-fabricacao/tipos-processo-fabricacao");
            return response.data;
        } catch (error) {
            handleError(error);
        }
    },

    listarProcessosDifusorDeVareta: async () => {
        try {
            const response = await axiosInstance.get<{ key: string; descricao: string }[]>(
                "/formula-fabricacao/processos-difusor-vareta"
            );
            return response.data;
        } catch (error) {
            handleError(error);
        }
    },

    listarProcessosHomeSpray: async () => {
        try {
            const response = await axiosInstance.get<{ key: string; descricao: string }[]>(
                "/formula-fabricacao/processos-home-spray"
            );
            return response.data;
        } catch (error) {
            handleError(error);
        }
    },

    listarProcessosVelaAromatica: async () => {
        try {
            const response = await axiosInstance.get<{ key: string; descricao: string }[]>(
                "/formula-fabricacao/processos-vela-aromatica"
            );
            return response.data;
        } catch (error) {
            handleError(error);
        }
    },

    listarProcessosAguaDeLencois: async () => {
        try {
            const response = await axiosInstance.get<{ key: string; descricao: string }[]>(
                "/formula-fabricacao/processos-agua-lencois"
            );
            return response.data;
        } catch (error) {
            handleError(error);
        }
    },
    listarProcessosDeFabricacao: async () => {
        try {
            const response = await axiosInstance.get<{ key: string; descricao: string }[]>(
                "/formula-fabricacao/processos-fabricacao"
            );
            return response.data;
        } catch (error) {
            handleError(error);
        }
    }
};

export default FormulaFabricacaoService;

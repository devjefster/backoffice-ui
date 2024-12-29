import {PaginatedResponse} from "../../../model/PaginatedResponse";
import axiosInstance from "@utils/config/seguranca/AxiosInstance";
import {EstoqueDTO, FiltrosEstoque, LoteEstoqueDTO, MovimentacaoEstoqueDTO} from "@features/estoque/model/Estoque";

const handleError = (error: any) => {
    console.error("EstoqueService error:", error);
    throw error;
};

const EstoqueService = {
    listarMovimentacoesEstoques: async (
        estoqueId: number,
        tipo?: string,
        page: number = 0,
        size: number = 10
    ) => {
        try {
            const params = new URLSearchParams();
            params.append("estoqueId", estoqueId.toString());
            if (tipo) params.append("tipo", tipo);
            params.append("page", page.toString());
            params.append("size", size.toString());

            const response = await axiosInstance.get<PaginatedResponse<MovimentacaoEstoqueDTO>>(
                "/api/estoques/movimentacoes",
                { params }
            );
            return response.data;
        } catch (error) {
            handleError(error);
        }
    },


    listarEstoques: async (
        filtros: FiltrosEstoque,
        page: number = 0,
        size: number = 10
    ) => {
        try {
            const params = new URLSearchParams();
            if (filtros.textoBusca) params.append("textoBusca", filtros.textoBusca);
            if (filtros.someLotesComEstoque) params.append("someLotesComEstoque", String(filtros.someLotesComEstoque));
            if (filtros.fabricacaoMinima) params.append("fabricacaoMinima", filtros.fabricacaoMinima);
            if (filtros.fabricacaoMaxima) params.append("fabricacaoMaxima", filtros.fabricacaoMaxima);
            if (filtros.validadeMinima) params.append("validadeMinima", filtros.validadeMinima);
            if (filtros.validadeMaxima) params.append("validadeMaxima", filtros.validadeMaxima);
            if (filtros.unidadeMedida) params.append("unidadeMedida", filtros.unidadeMedida);

            params.append("page", page.toString());
            params.append("size", size.toString());

            const response = await axiosInstance.get<PaginatedResponse<EstoqueDTO>>(
                "/api/estoques",
                { params }
            );
            return response.data;
        } catch (error) {
            handleError(error);
        }
    },


    consultarLotes: async (
        validadeMinima?: string,
        quantidadeMinima?: number
    ) => {
        try {
            const params = new URLSearchParams();
            if (validadeMinima) params.append("validadeMinima", validadeMinima);
            if (quantidadeMinima) params.append("quantidadeMinima", quantidadeMinima.toString());
            const response = await axiosInstance.get<LoteEstoqueDTO[]>("/api/estoques/lotes", {
                params,
            });
            return response.data;
        } catch (error) {
            handleError(error);
        }
    },
    async buscarPorId(id: number) {
        return await axiosInstance.get<EstoqueDTO>(`/api/estoques/${id}`);
    }
};

export default EstoqueService;

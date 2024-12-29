import axiosInstance from "../../../utils/config/seguranca/AxiosInstance";
import {LoteEntradaDTO} from "@features/entrada_insumos/model/EntradaInsumos";

const handleError = (error: any) => {
    console.error("EntradaInsumosService error:", error);
    throw error;
};

const EntradaInsumosService = {

    buscarPorId: async (id: number) => {
        try {
            const response = await axiosInstance.get<LoteEntradaDTO>(`/api/lote-entrada/${id}`);
            return response.data;
        } catch (error) {
            handleError(error);
        }
    },

    buscarPorEntradaInsumosId: async (entradaInsumosId: number) => {
        try {
            const response = await axiosInstance.get<LoteEntradaDTO>(`/api/lote-entrada/entrada/insumos/${entradaInsumosId}`);
            return response.data;
        } catch (error) {
            handleError(error);
        }
    },

};

export default EntradaInsumosService;

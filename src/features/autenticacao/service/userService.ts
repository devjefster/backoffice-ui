import axiosInstance from "../../../utils/config/seguranca/AxiosInstance";
import {AtualizarUsuario, CriarUsuario, Usuario} from "../model/Usuario";
import {PaginatedResponse} from "../../../model/PaginatedResponse";

export const criarUsuario = async (data: CriarUsuario): Promise<Usuario> => {
    try {
        const response = await axiosInstance.post<Usuario>('/usuario/criar', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};
export const deletar = (id: number) => axiosInstance.delete<void>(`/usuario/${id}`);
export const listarComFiltros = async (textoBusca?: string, page: number = 0, size: number = 10) => {
    try {
        const params = new URLSearchParams();
        if (textoBusca) params.append('textoBusca', textoBusca);
        params.append('page', page.toString());
        params.append('size', size.toString());
        const response = await axiosInstance.get<PaginatedResponse<Usuario>>('/usuario', {params});
        return response.data;
    } catch (error) {
        throw error;
    }
};
export const atualizarUsuario = async (id: number, data: AtualizarUsuario): Promise<Usuario> => {
    try {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined) formData.append(key, value as string | Blob);
        });

        const response = await axiosInstance.put<Usuario>(`/usuario/${id}/atualizar`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const buscarUsuarioPeloId = async (id: number): Promise<Usuario> => {
    try {
        const response = await axiosInstance.get<Usuario>(`/usuario/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

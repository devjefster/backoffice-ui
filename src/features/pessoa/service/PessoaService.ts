import {PaginatedResponse} from "../../../model/PaginatedResponse";
import axiosInstance from "@utils/config/seguranca/AxiosInstance";
import {FiltrosPessoa, Pessoa} from "@features/pessoa/model/Pessoa";

const handleError = (error: any) => {
    console.error("ClienteService error:", error);
    throw error; // or return a fallback value if needed
};

const PessoaService = {
    listarComFiltros: async (filtros?: FiltrosPessoa, page: number = 0, size: number = 10) => {
        try {
            const params = new URLSearchParams();
            if (filtros) {
                if (filtros.tipoPessoa) params.append('tipoPessoa', filtros.tipoPessoa);
                if (filtros.nome) params.append('nome', filtros.nome);
                if (filtros.tipo) params.append('tipo', filtros.tipo.toString());
                if (filtros.cpfCnpj) params.append('cpfCnpj', filtros.cpfCnpj);
            }
            params.append('page', page.toString());
            params.append('size', size.toString());
            const response = await axiosInstance.get<PaginatedResponse<Pessoa>>('/pessoa', {params});
            return response.data;
        } catch (error) {
            handleError(error);
        }
    },
    criar: (dto: Pessoa) => axiosInstance.post<Pessoa>('/pessoa', dto),
    buscarPorId: (id: number) => axiosInstance.get<Pessoa>(`/pessoa/${id}`),

    atualizar: (id: number, dto: Pessoa) => axiosInstance.put<Pessoa>(`/pessoa/${id}`, dto),

    deletar: (id: number) => axiosInstance.delete<void>(`/pessoa/${id}`),
    validarUnicidade: async (cpfCnpj: string | null, email: string | null) => {
        const params = new URLSearchParams();
        if (cpfCnpj) params.append('cpfCnpj', cpfCnpj);
        if (email) params.append('email', email);

        return axiosInstance.get<{
            unico: boolean,
            cpfCnpj: string,
            email: string
        }>(`/pessoa/validar-unicidade`, {params})

    }
};

export default PessoaService;

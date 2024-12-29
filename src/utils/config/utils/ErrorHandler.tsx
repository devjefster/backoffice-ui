import {AxiosError} from 'axios';

export interface ErrorResponse {
    code: number;
    type: string;
    message: string;
    cause?: string | null;
}

export const parseErrorResponse = (error: AxiosError): ErrorResponse | ErrorResponse[] => {
    if (error.response && error.response.data) {
        const responseData = error.response.data;

        if (Array.isArray(responseData)) {
            return responseData.map((err: Partial<ErrorResponse>) => ({
                code: err.code ?? 500,
                type: err.type ?? 'DESCONHECIDO',
                message: err.message ?? 'Erro inesperado',
                cause: err.cause ?? undefined,
            }));
        }

        const {code, type, message, cause} = responseData as Partial<ErrorResponse>;
        return {
            code: code ?? 500,
            type: type ?? 'DESCONHECIDO',
            message: message ?? 'Erro inesperado',
            cause: cause ?? undefined,
        };
    }

    return {code: 500, type: 'DESCONHECIDO', message: 'Erro inesperado', cause: undefined};
};

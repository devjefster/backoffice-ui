export enum TipoEndereco {
    RESIDENCIAL = "RESIDENCIAL",
    COMERCIAL = "COMERCIAL",
    OUTRO = "OUTRO",
}

export interface Endereco {
    id: number;
    tipo: TipoEndereco;
    logradouro: string;
    complemento: string;
    bairro: string;
    cep: string;
    cidade: string;
    uf: string;
    referencia: string;
}

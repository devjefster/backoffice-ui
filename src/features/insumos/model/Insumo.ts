import {Pessoa} from "@features/pessoa/model/Pessoa";

export interface InsumoDTO {
    id: number;
    nome: string;
    descricao: string;
    tipoInsumo: string; // Discriminador
    unidadeMedida: string;
    fabricantes: Pessoa[];
    fornecedores: Pessoa[];
    grades: GradeCadastradaDTO[];
}

export interface ConsumivelDTO extends InsumoDTO {
    tipoConsumivel: string; // Enum: PAVIO, VARETAS, etc.
    aplicacao: string;
}

export interface EmbalagemDTO extends InsumoDTO {
    tipoEmbalagem: string; // Enum: FRASCO_VIDRO, CAIXA, etc.
    dimensoes: string;
    material: string;
}

export interface MateriaPrimaDTO extends InsumoDTO {
    tipoMateriaPrima: string; // Enum: ESSENCIA, ALCOOL, etc.
    especificacoesTecnicas: string;
}

export interface ServicoDTO extends InsumoDTO {
    tipoServico: string; // Enum: DESIGN, LOGISTICA, etc.
    descricaoServico: string;
}

export interface GradeCadastradaDTO {
    id: number,
    nome: string,
    valores: string[]
}

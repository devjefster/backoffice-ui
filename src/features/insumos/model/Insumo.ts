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
    tipoConsumivel: string; // Enum: PAVIO, VARETAS, etc.
    aplicacao: string;
    tipoEmbalagem: string; // Enum: FRASCO_VIDRO, CAIXA, etc.
    dimensoes: string;
    material: string;
    tipoMateriaPrima: string; // Enum: ESSENCIA, ALCOOL, etc.
    especificacoesTecnicas: string;
}

export interface GradeCadastradaDTO {
    id: number,
    nome: string,
    valores: string[]
}

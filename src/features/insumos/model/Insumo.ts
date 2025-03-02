import {Pessoa} from "@features/pessoa/model/Pessoa";

export interface InsumoDTO {
    id: number;
    nome: string;
    descricao: string | null;
    tipo: string | null; // Discriminador
    unidadeMedida: string | null;
    fabricantes: Pessoa[];
    fornecedores: Pessoa[];
    grades: GradeCadastradaDTO[];
    tipoConsumivel: string | null; // Enum: PAVIO, VARETAS, etc.
    aplicacao: string | null;
    tipoEmbalagem: string | null; // Enum: FRASCO_VIDRO, CAIXA, etc.
    dimensoes: string | null;
    material: string | null;
    tipoMateriaPrima: string | null; // Enum: ESSENCIA, ALCOOL, etc.
    especificacoesTecnicas: string | null;
}

export interface GradeCadastradaDTO {
    id: number,
    nome: string,
    valores: string[]
}

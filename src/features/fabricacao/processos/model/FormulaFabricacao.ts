import {Produto} from "../../../../model/Produto";

export interface CriarFormulaFabricacaoRequest {
    produtoId: number; // obrigatorio
    nome: string,   // obrigatorio
    descricao: string,
    processosFabricacao: ProcessoFabricacaoDTO[]; // Lista de processos de fabricação
    volumeTotal: number; // Volume total desejado
}

export interface FormulaFabricacaoDTO {
    id: number;
    nome: string,
    descricao: string,
    produtoId: number; // Produto relacionado
    produto: Produto; // Produto relacionado
    processosFabricacao: ProcessoFabricacaoDTO[]; // Lista de processos de fabricação
}

export interface ProcessoFabricacaoDTO {
    id: number;
    insumoId: number;
    porcentagem: number; // Porcentagem usada
    tipoProcesso: string; // Porcentagem usada
}


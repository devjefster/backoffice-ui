import {Produto} from "../../../model/Produto";
import {GradeCadastradaDTO, InsumoDTO} from "@features/insumos/model/Insumo";


export interface FiltrosEstoque {
    textoBusca: string;
    tipo: string;
    validadeMinima: string;
    validadeMaxima: string;
    fabricacaoMinima: string;
    fabricacaoMaxima: string;
    unidadeMedida: string;
    someLotesComEstoque: boolean;

}

export interface MovimentacaoEstoqueDTO {
    id: number;
    loteEstoque: LoteEstoqueDTO;
    quantidade: number;
    tipo: string;
    dataMovimentacao: string;

}

export interface EstoqueDTO {
    id?: number;
    insumo: InsumoDTO;
    produto: Produto;
    unidadeMedida: string; // Enum UnidadeMedida as string
    quantidade: number;
    grades?: GradeCadastradaDTO[];
    lotes?: LoteEstoqueDTO[];
}

export interface LoteEstoqueDTO {
    id?: number;
    estoque: EstoqueDTO;
    unidadeMedida: string; // Enum UnidadeMedida as string
    quantidade: number;
    validade?: string; // ISO 8601 string for LocalDate
    grades?: GradeCadastradaDTO[];
    custoUnitario: number;
}
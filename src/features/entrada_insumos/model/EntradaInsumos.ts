import {GradeCadastradaDTO, InsumoDTO} from "@features/insumos/model/Insumo";
import {Pessoa} from "@features/pessoa/model/Pessoa";

export interface EntradaInsumoItemDTO {
    id?: number;
    insumo: InsumoDTO;
    fabricante: Pessoa;
    quantidade: number; // BigDecimal mapped to number
    unidadeMedidaEntrada: number; // Enum UnidadeMedida as string
    precoUnitario: number;
    validade?: string; // ISO 8601 string for LocalDate
    custoTotal: number;
    lote?: LoteEntradaDTO;
}

export interface EntradaInsumosDTO {
    id?: number;
    fornecedor: Pessoa | null;
    dataEntrada: string; // ISO 8601 string for LocalDate
    custoFrete: number;
    custoOutros: number;
    itens: EntradaInsumoItemDTO[];
}


export interface LoteEntradaDTO {
    id?: number;
    quantidadeConvertida: number;
    unidadeMedida: string; // Enum UnidadeMedida as string
    validade?: string; // ISO 8601 string for LocalDate
    grades?: GradeCadastradaDTO[];
}

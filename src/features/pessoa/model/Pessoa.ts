import {Endereco} from "@components/forms/endereco/Endereco";
import {Contato} from "@components/forms/contato/model/Contato";

export interface FiltrosPessoa {
    nome: string | null,
    tipo: TipoCadastro | null,
    tipoPessoa: TipoPessoa | null,
    cpfCnpj: string | null

}

export interface Pessoa {
    id: number;
    cpfCnpj: string | null;
    nomeFantasia: string | null;
    razaoSocial: string | null;
    inscricaoEstadual: string | null;
    nome: string | null;
    enderecos: Endereco[];
    email: string | null;
    emailSecundario: string | null;
    telefone: string | null;
    telefoneSecundario: string | null;
    tipoPessoa: TipoPessoa | null,
    tipo: TipoCadastro,
    contatos: Contato[],
}

export enum TipoPessoa {
    PESSOA_FISICA = "Pessoa Física", PESSOA_JURIDICA = "Pessoa Jurídica"
}

export enum TipoCadastro {
    CLIENTE, FABRICANTE, FORNECEDOR
}

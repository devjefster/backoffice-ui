import {Endereco} from "../components/forms/endereco/Endereco";

export interface Pessoa {
    id: number;
    cpfCnpj: string | null;
    nomeFantasia: string | null;
    razaoSocial: string | null;
    endereco: Endereco[];
    email: string | null;
    emailSecundario: string | null;
    telefone: string | null;
    telefoneSecundario: string | null;
}
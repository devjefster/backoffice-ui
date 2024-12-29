import {Pessoa} from "../../../model/Pessoa";
import {Contato} from "../../../components/forms/contato/model/Contato";

export interface Fornecedor extends Pessoa {

    contatos: Contato[]
}

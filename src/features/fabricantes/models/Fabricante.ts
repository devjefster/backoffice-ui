import {Pessoa} from "../../../model/Pessoa";
import {Contato} from "../../../components/forms/contato/model/Contato";

export interface Fabricante extends Pessoa {

    contatos:Contato[]
}

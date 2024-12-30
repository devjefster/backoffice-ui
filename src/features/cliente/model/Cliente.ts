import {Pessoa} from "../../pessoa/model/Pessoa";
import {Usuario} from "../../autenticacao/model/Usuario";

export interface Cliente extends Pessoa {

    usuario?: Usuario
}

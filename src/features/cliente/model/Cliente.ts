import {Pessoa} from "../../../model/Pessoa";
import {Usuario} from "../../autenticacao/model/Usuario";

export interface Cliente extends Pessoa {

    usuario?: Usuario
}

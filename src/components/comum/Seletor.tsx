import React from "react";
import { Select } from "flowbite-react";
import {Enum} from "../../model/Comum";

interface SeletorProps {
    value?: string;
    placeholder?: string;
    opcoes: Enum[];
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Seletor: React.FC<SeletorProps> = ({ opcoes, value, placeholder, onChange }) => {
    return (
        <Select value={value} onChange={onChange} className="w-full">
            <option value="">{placeholder || "Selecione uma opção"}</option>
            {opcoes.map((option) => (
                <option key={option.nome} value={option.nome}>
                    {option.descricao}
                </option>
            ))}
        </Select>
    );
};

export default Seletor;

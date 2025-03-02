import React from "react";
import {TextInput} from "flowbite-react";
import InputMask from "react-input-mask";

interface DinheiroInputProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    placeholder?: string;
}

const DinheiroInput: React.FC<DinheiroInputProps> = ({ value, onChange, label, placeholder }) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const maskedValue = e.target.value;
        // Remove todos os caracteres que não são dígitos ou vírgulas e substitui vírgula por ponto
        const numericValue = maskedValue.replace(/[^\d,]/g, "").replace(",", ".");
        onChange(numericValue);
    };

    return (
        <div>
            {label && <label className="block mb-2 text-sm font-medium text-gray-700">{label}</label>}
            <InputMask
                mask="R$ 999.999.999,99"
                value={value ? `R$ ${value}` : ""}
                onChange={handleInputChange}
                maskChar={null}
            >
                {(inputProps) => (
                    <TextInput
                        {...inputProps}
                        placeholder={placeholder || "R$ 0,00"}
                        className="rounded-md"
                    />
                )}
            </InputMask>
        </div>
    );
};

export default DinheiroInput;

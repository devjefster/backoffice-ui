import React, { useState } from "react";
import { Tooltip } from "flowbite-react";

interface CPFOrCNPJInputProps {
    value: string;
    onChange: (value: string) => void;
    label?: React.ReactNode;
    required?: boolean;
}

const CPFOrCNPJInput: React.FC<CPFOrCNPJInputProps> = ({
                                                           value,
                                                           onChange,
                                                           label,
                                                           required,
                                                       }) => {
    const [error, setError] = useState("");

    const formatCPFOrCNPJ = (input: string): string => {
        const sanitizedInput = input.replace(/\D/g, ""); // Remove non-numeric characters
        if (sanitizedInput.length <= 11) {
            // Format as CPF: 999.999.999-99
            return sanitizedInput
                .replace(/(\d{3})(\d)/, "$1.$2")
                .replace(/(\d{3})(\d)/, "$1.$2")
                .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        } else {
            // Format as CNPJ: 99.999.999/9999-99
            return sanitizedInput
                .replace(/(\d{2})(\d)/, "$1.$2")
                .replace(/(\d{3})(\d)/, "$1.$2")
                .replace(/(\d{3})(\d)/, "$1/$2")
                .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
        }
    };

    const validateCPFOrCNPJ = (input: string) => {
        const sanitizedInput = input.replace(/\D/g, "");
        if (sanitizedInput.length === 11) {
            return validateCPF(sanitizedInput);
        } else if (sanitizedInput.length === 14) {
            return validateCNPJ(sanitizedInput);
        }
        return false;
    };

    const validateCPF = (cpf: string) => {
        let sum = 0;
        let remainder;

        if (cpf === "00000000000") return false;

        for (let i = 1; i <= 9; i++) sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
        remainder = (sum * 10) % 11;

        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.substring(9, 10))) return false;

        sum = 0;
        for (let i = 1; i <= 10; i++) sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
        remainder = (sum * 10) % 11;

        if (remainder === 10 || remainder === 11) remainder = 0;
        return remainder === parseInt(cpf.substring(10, 11));
    };

    const validateCNPJ = (cnpj: string) => {
        if (cnpj.length !== 14) return false;

        let size = cnpj.length - 2;
        let numbers = cnpj.substring(0, size);
        const digits = cnpj.substring(size);
        let sum = 0;
        let pos = size - 7;

        for (let i = size; i >= 1; i--) {
            sum += parseInt(numbers.charAt(size - i)) * pos--;
            if (pos < 2) pos = 9;
        }

        let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
        if (result !== parseInt(digits.charAt(0))) return false;

        size++;
        numbers = cnpj.substring(0, size);
        sum = 0;
        pos = size - 7;

        for (let i = size; i >= 1; i--) {
            sum += parseInt(numbers.charAt(size - i)) * pos--;
            if (pos < 2) pos = 9;
        }

        result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
        return result === parseInt(digits.charAt(1));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        const formattedValue = formatCPFOrCNPJ(inputValue);

        onChange(formattedValue);

        const sanitizedInput = inputValue.replace(/\D/g, "");

        // Validate only when input length matches CPF or CNPJ
        if (sanitizedInput.length === 11 || sanitizedInput.length === 14) {
            const isValid = validateCPFOrCNPJ(sanitizedInput);
            setError(isValid ? "" : "CPF ou CNPJ inválido.");
        } else {
            setError(""); // Clear error for incomplete input
        }
    };

    return (
        <div>
            {label && (
                <label
                    htmlFor="cpf-cnpj"
                    className="text-sm font-medium text-gray-700 flex items-center"
                >
                    {label}
                    <Tooltip content="Informe o CPF (11 dígitos) ou CNPJ (14 dígitos).">
                        <i className="fa fa-info-circle ml-2 text-gray-500 cursor-pointer" />
                    </Tooltip>
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <input
                type="text"
                value={value}
                onChange={handleInputChange}
                className={`block w-full rounded-lg border ${
                    error ? "border-red-500" : "border-gray-300"
                } bg-gray-50 p-2.5 text-sm`}
                placeholder="Digite CPF ou CNPJ"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            {!error && value && <p className="text-green-500 text-sm mt-1">Válido!</p>}

            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>
    );
};

export default CPFOrCNPJInput;

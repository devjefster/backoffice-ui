import React, { useState } from "react";
import InputMask from "react-input-mask";

interface TelefoneInputProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    required?: boolean;
    className?: string;
}

const TelefoneInput: React.FC<TelefoneInputProps> = ({
                                                         value,
                                                         onChange,
                                                         label = "Telefone",
                                                         required = false,
                                                         className = "",
                                                     }) => {
    const [error, setError] = useState("");

    const mask = "(99) 99999-9999"; // Brazilian phone format

    const validatePhone = (phone: string): boolean => {
        const numericValue = phone.replace(/\D/g, "");
        return numericValue.length === 10 || numericValue.length === 11;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        onChange(input);

        if (input && !validatePhone(input)) {
            setError("Telefone inválido.");
        } else {
            setError("");
        }
    };

    return (
        <div className={`space-y-2 ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-900">{label}</label>
            )}
            <InputMask
                mask={mask}
                value={value}
                onChange={handleChange}
                placeholder="(XX) XXXXX-XXXX"
                className={`block w-full rounded-lg border ${
                    error ? "border-red-500" : "border-gray-300"
                } bg-gray-50 p-2.5 text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500`}
                required={required}
                aria-invalid={!!error}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
};

export default TelefoneInput;

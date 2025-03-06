import React, { useState } from "react";
import { TextInput } from "flowbite-react";

interface DinheiroInputProps {
    value: number | string;
    onChange: (value: number) => void;
    label?: string;
    placeholder?: string;
}

const DinheiroInput: React.FC<DinheiroInputProps> = ({ value, onChange, label, placeholder }) => {
    const [inputValue, setInputValue] = useState(value.toString()); // Store user input separately

    const formatCurrency = (value: number | string) => {
        const numValue = Number(value);
        if (isNaN(numValue) || numValue === 0) return "R$ 0,00"; // Ensure correct default
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
            minimumFractionDigits: 2,
        }).format(numValue);
    };

    const parseCurrency = (inputValue: string) => {
        // Remove everything except digits and commas
        let numericValue = inputValue.replace(/[^\d,]/g, "").replace(",", ".");
        return numericValue ? parseFloat(numericValue) : 0; // Avoid NaN values
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        setInputValue(rawValue); // Allow user to type freely
    };

    const handleBlur = () => {
        const numericValue = parseCurrency(inputValue);
        onChange(numericValue); // Notify parent
        setInputValue(formatCurrency(numericValue)); // Format display on blur
    };

    return (
        <div>
            {label && <label className="block mb-2 text-sm font-medium text-gray-700">{label}</label>}
            <TextInput
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleBlur} // Format when the user leaves the input
                placeholder={placeholder || "R$ 0,00"}
                className="rounded-md"
            />
        </div>
    );
};

export default DinheiroInput;

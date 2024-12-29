import React, { useState } from "react";
import { TextInput } from "flowbite-react";
import { HiOutlineSearch } from "react-icons/hi";

interface TextoBuscaInputProps {
    val?: string;
    change?: (value: string) => void;
    placeholder?: string;
    onEnter?: () => void;
    debounceTime?: number;
}

const TextoBuscaInput: React.FC<TextoBuscaInputProps> = ({ change, val, placeholder, onEnter, debounceTime = 300 }) => {
    const [inputValue, setInputValue] = useState(val || "");

    // Debounce implementation
    let debounceTimer: ReturnType<typeof setTimeout>;
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            if (change) {
                change(newValue);
            }
        }, debounceTime);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && onEnter) {
            onEnter();
        }
    };

    return (
        <div className="relative w-full">
            <TextInput
                placeholder={placeholder}
                value={inputValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                icon={HiOutlineSearch}
            />
        </div>
    );
};

export default TextoBuscaInput;

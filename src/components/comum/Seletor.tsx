import React from "react";
import { Select } from "flowbite-react";
import { Enum } from "../../model/Comum";

interface SeletorProps<T> {
    value?: string; // The selected value (enum value)
    placeholder?: string;
    enums?: Enum[]; // Predefined key-value pairs for the dropdown
    enumType?: T; // The TypeScript enum
    onChange: (selectedKey: string) => void; // Callback with the selected value
    labelTransform?: (key: keyof T) => string; // Optional transformation for readable labels
}

const Seletor = <T extends Record<string, string>>({
                                                       value,
                                                       placeholder,
                                                       enumType,
                                                       enums,
                                                       onChange,
                                                       labelTransform,
                                                   }: SeletorProps<T>) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        console.log('handleChange',e.target.value)
        onChange(e.target.value);
    };

    // Transform enums or enumType into options
    const getOptions = () => {
        if (enumType) {
            return Object.entries(enumType).map(([key, val]) => ({
                key,
                value: key,
                label: val,
            }));
        }
        if (enums) {
            return enums.map(({ chave, valor }) => ({
                key: chave,
                value: chave,
                label: valor,
            }));
        }
        return [];
    };

    const options = getOptions();

    return (
        <Select value={value} onChange={handleChange} className="w-full">
            <option value="">{placeholder || "Selecione uma opção"}</option>
            {options.map((option) => (
                <option key={option.key} value={option.value}>
                    {option.label}
                </option>
            ))}
        </Select>
    );
};

export default Seletor;

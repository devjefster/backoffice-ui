import React, {useState} from "react";
import {TextInput} from "flowbite-react";

interface TypeAheadProps {
    fetchOptions: (query: string) => Promise<any[]>;
    onSelect: (selected: any) => void;
    placeholder?: string;
}

const TypeAhead: React.FC<TypeAheadProps> = ({fetchOptions, onSelect, placeholder}) => {
    const [query, setQuery] = useState("");
    const [options, setOptions] = useState<any[]>([]);

    const handleInputChange = async (value: string) => {
        setQuery(value);
        if (value) {
            const fetchedOptions = await fetchOptions(value);
            setOptions(fetchedOptions || []);
        } else {
            setOptions([]);
        }
    };
    const handleSelect = (option: any) => {
        onSelect(option);
        setQuery(option.name || option.nome); // Adjust based on object structure
        setOptions([]);
    };

    return (
        <div className="relative">
            <TextInput
                value={query}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={placeholder || "Type to search"}
            />
            {options.length > 0 && (
                <ul className="absolute bg-white border mt-1 w-full max-h-60 overflow-auto">
                    {options.map((option) => (
                        <li
                            key={option.id}
                            onClick={() => handleSelect(option)}
                            className="p-2 cursor-pointer hover:bg-gray-100"
                        >
                            {option.name || option.nome}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TypeAhead;

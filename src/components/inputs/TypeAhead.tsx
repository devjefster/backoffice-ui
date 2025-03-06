import React, { useState, useEffect } from "react";
import { TextInput } from "flowbite-react";

interface TypeAheadProps {
    fetchOptions: (query: string) => Promise<any[]>;
    onSelect: (selected: any) => void;
    placeholder?: string;
}

const TypeAhead: React.FC<TypeAheadProps> = ({ fetchOptions, onSelect, placeholder }) => {
    const [query, setQuery] = useState("");
    const [options, setOptions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (query.trim() === "") {
            setOptions([]);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            const fetchedOptions = await fetchOptions(query);
            setOptions(fetchedOptions || []);
            setLoading(false);
        };

        const delayDebounceFn = setTimeout(() => {
            fetchData();
        }, 300); // Debounce API calls

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const handleSelect = (option: any) => {
        onSelect(option);
        setQuery(option.nome || option.razaoSocial || option.nomeFantasia); // Ensure proper display name
        setOptions([]);
    };

    return (
        <div className="relative"> {/* Ensure relative positioning */}
            <TextInput
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder || "Digite para buscar"}
            />
            {loading && <div className="absolute bg-white p-2 border mt-1 w-full z-50">Carregando...</div>}
            {options.length > 0 && (
                <ul className="absolute bg-white border mt-1 w-full max-h-60 overflow-auto z-50 shadow-lg rounded-md">
                    {options.map((option) => (
                        <li
                            key={option.id}
                            onClick={() => handleSelect(option)}
                            className="p-2 cursor-pointer hover:bg-gray-100"
                        >
                            {option.nome || option.razaoSocial || option.nomeFantasia}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TypeAhead;

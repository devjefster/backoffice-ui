import React, {useState} from "react";

interface EmailInputProps {
    value: string;
    onChange: (value: string) => void;
    label?: React.ReactNode; // Updated to accept strings or JSX elements
    required?: boolean;
    className?: string;
}

const EmailInput: React.FC<EmailInputProps> = ({
                                                   value,
                                                   onChange,
                                                   label = "E-mail",
                                                   required = false,
                                                   className = "",
                                               }) => {
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        onChange(input);

        if (input && !/^\S+@\S+\.\S+$/.test(input)) {
            setError("E-mail inválido.");
        } else {
            setError("");
        }
    };

    return (
        <div className="space-y-2">
            {label && (
                <label className="block text-sm font-medium text-gray-900">
                    {label}
                </label>
            )}
            <input
                type="email"
                value={value}
                onChange={handleChange}
                placeholder="Digite seu e-mail"
                className={`block w-full rounded-lg border ${
                    error ? "border-red-500" : "border-gray-300"
                } bg-gray-50 p-2.5 text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500`}
                required={required}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

    );
};

export default EmailInput;

import React, { useState, useEffect } from "react";
import { Button, Label, Checkbox, Textarea } from "flowbite-react";
import { Contato, TipoContato } from "./model/Contato";
import { FaWhatsapp, FaTelegramPlane } from "react-icons/fa";
import EmailInput from "../../../components/inputs/EmailInput";
import TelefoneInput from "../../../components/inputs/TelefoneInput";

interface ContatoComponentProps {
    contato: Contato;
    onUpdate: (updatedContato: Contato) => void;
    onRemove: () => void;
}

const ContatoComponent: React.FC<ContatoComponentProps> = ({
                                                               contato,
                                                               onUpdate,
                                                               onRemove,
                                                           }) => {
    const [localContato, setLocalContato] = useState<Contato>(contato);

    useEffect(() => {
        setLocalContato(contato);
    }, [contato]);

    const handleChange = (key: keyof Contato, value: any) => {
        const updatedContato = { ...localContato, [key]: value };
        setLocalContato(updatedContato);
        onUpdate(updatedContato); // Notify parent of the change
    };

    return (
        <div className="border rounded p-4 mb-4 bg-white shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tipo */}
                <div>
                    <Label htmlFor={`tipo-${localContato.id}`}>Tipo</Label>
                    <select
                        id={`tipo-${localContato.id}`}
                        value={localContato.tipo}
                        onChange={(e) => handleChange("tipo", parseInt(e.target.value))}
                        className="block w-full rounded-lg border-gray-300 bg-gray-50 p-2.5 text-sm"
                    >
                        {Object.keys(TipoContato)
                            .filter((key) => !isNaN(Number(key)))
                            .map((key) => (
                                <option key={key} value={key}>
                                    {TipoContato[parseInt(key)]}
                                </option>
                            ))}
                    </select>
                </div>

                {/* Telefone */}
                <div>
                    <TelefoneInput
                        value={localContato.telefone}
                        onChange={(value) => handleChange("telefone", value)}
                        label="Telefone"
                        required
                    />
                </div>

                {/* Email */}
                <div>
                    <EmailInput
                        value={localContato.email}
                        onChange={(value) => handleChange("email", value)}
                        label="Email"
                        required
                    />
                </div>

                {/* WhatsApp and Telegram Checkboxes */}
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id={`whatsapp-${localContato.id}`}
                            checked={localContato.isWhatsapp}
                            onChange={(e) => handleChange("isWhatsapp", e.target.checked)}
                        />
                        <Label htmlFor={`whatsapp-${localContato.id}`} className="flex items-center gap-2">
                            <FaWhatsapp className="text-green-500" />
                            WhatsApp
                        </Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id={`telegram-${localContato.id}`}
                            checked={localContato.isTelegram}
                            onChange={(e) => handleChange("isTelegram", e.target.checked)}
                        />
                        <Label htmlFor={`telegram-${localContato.id}`} className="flex items-center gap-2">
                            <FaTelegramPlane className="text-blue-500" />
                            Telegram
                        </Label>
                    </div>
                </div>
            </div>

            {/* Observações */}
            <div className="mt-4">
                <Label htmlFor={`observacoes-${localContato.id}`}>Observações</Label>
                <Textarea
                    id={`observacoes-${localContato.id}`}
                    placeholder="Adicione observações aqui..."
                    value={localContato.observacoes || ""}
                    onChange={(e) => handleChange("observacoes", e.target.value)}
                    rows={4}
                    className="mt-1"
                />
            </div>

            {/* Remove Button */}
            <Button
                type="button"
                color="failure"
                className="mt-4"
                onClick={onRemove}
            >
                Remover Contato
            </Button>
        </div>
    );
};

export default ContatoComponent;

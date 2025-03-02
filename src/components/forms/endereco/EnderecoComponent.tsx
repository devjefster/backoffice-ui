import React, {useState} from "react";
import {Button, Label, Select, Textarea, TextInput} from "flowbite-react";
import {Endereco, TipoEndereco} from "./Endereco";

interface EnderecoProps {
    endereco: Endereco;
    onChange: (key: string, value: string) => void;
    onRemove: () => void;
}

const EnderecoComponent: React.FC<EnderecoProps> = ({ endereco, onChange, onRemove }) => {
    const [isFetching, setIsFetching] = useState(false);
    const [fetchError, setFetchError] = useState("");
    const [isFieldsDisabled, setIsFieldsDisabled] = useState(true);

    const fetchAddressByCEP = async (cep: string) => {
        setIsFetching(true);
        setFetchError("");
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();

            if (data.erro) {
                setFetchError("CEP não encontrado.");
                setIsFieldsDisabled(true);
                return;
            }

            // Update the fields with the data from the API
            onChange("logradouro", data.logradouro || "");
            onChange("bairro", data.bairro || "");
            onChange("cidade", data.localidade || "");
            onChange("uf", data.uf || "");
            onChange("referencia", data.complemento || "");

            // Enable fields after successful fetch
            setIsFieldsDisabled(false);
        } catch (error) {
            console.error("Erro ao buscar o endereço:", error);
            setFetchError("Erro ao buscar o endereço.");
            setIsFieldsDisabled(true);
        } finally {
            setIsFetching(false);
        }
    };

    return (

        <div className="border p-4 rounded-lg space-y-4 bg-gray-50 relative">
            <br/>
            <Button
                color="failure"
                size="sm"
                className="absolute top-2 right-2"
                onClick={onRemove}
            >
                Remover
            </Button>
            <div>
                <Label value="Tipo de Endereço"/>
                <Select
                    value={endereco.tipo}
                    onChange={(e) => onChange("tipo", e.target.value)}
                    className="w-1/3"
                    disabled={isFieldsDisabled}
                >
                    {Object.values(TipoEndereco).map((tipo) => (
                        <option key={tipo} value={tipo}>
                            {tipo}
                        </option>
                    ))}
                </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <TextInput
                    type="text"
                    placeholder="CEP"
                    value={endereco.cep}
                    onChange={(e) => {
                        const cep = e.target.value.replace(/\D/g, "");
                        onChange("cep", cep);
                        if (cep.length === 8) {
                            fetchAddressByCEP(cep);
                        }
                    }}
                    required
                    maxLength={8}
                    className="w-full"
                />
                <TextInput
                    type="text"
                    placeholder="UF"
                    value={endereco.uf}
                    onChange={(e) => onChange("uf", e.target.value)}
                    required
                    maxLength={2}
                    className="w-full"
                    disabled={isFieldsDisabled}
                />
            </div>
            {isFetching && <p className="text-blue-500">Buscando endereço...</p>}
            {fetchError && <p className="text-red-500">{fetchError}</p>}
            <TextInput
                type="text"
                placeholder="Logradouro"
                value={endereco.logradouro}
                onChange={(e) => onChange("logradouro", e.target.value)}
                required
                maxLength={100}
                className="w-full"
                disabled={isFieldsDisabled}
            />
            <TextInput
                type="text"
                placeholder="Complemento"
                value={endereco.complemento}
                onChange={(e) => onChange("complemento", e.target.value)}
                maxLength={50}
                className="w-full"
                disabled={isFieldsDisabled}
            />
            <TextInput
                type="text"
                placeholder="Bairro"
                value={endereco.bairro}
                onChange={(e) => onChange("bairro", e.target.value)}
                required
                maxLength={50}
                className="w-1/2"
                disabled={isFieldsDisabled}
            />
            <TextInput
                type="text"
                placeholder="Cidade"
                value={endereco.cidade}
                onChange={(e) => onChange("cidade", e.target.value)}
                required
                maxLength={50}
                className="w-full"
                disabled={isFieldsDisabled}
            />
            <Textarea
                placeholder="Referência"
                value={endereco.referencia}
                rows={2}
                onChange={(e) => onChange("referencia", e.target.value)}
                maxLength={150}
                disabled={isFieldsDisabled}
            />
        </div>
    );
};

export default EnderecoComponent;

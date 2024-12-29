import React, {useEffect, useState} from "react";
import {Button, Label, TextInput} from "flowbite-react";
import CPFOrCNPJInput from "../../../components/inputs/CPFOrCNPJInput";
import EmailInput from "../../../components/inputs/EmailInput";
import TelefoneInput from "../../../components/inputs/TelefoneInput";
import {Cliente} from "../model/Cliente";
import {HiArrowLeft} from "react-icons/hi";
import {useNavigate} from "react-router-dom";

const ClienteForm: React.FC<{ cliente: Cliente }> = ({cliente}) => {
    const [formData, setFormData] = useState<Cliente>(cliente);
    const navigate = useNavigate();
    useEffect(() => {
        if (cliente) {
            setFormData(cliente);
        }
    }, [cliente]);

    return (
        <div className="p-6 bg-white shadow rounded-lg">
            <div className="flex justify-between items-center">

                <h2 className="flex items-center text-4xl font-extrabold text-primary">Detalhes do cliente
                </h2>

                <Button color="gray" onClick={() => navigate("/clientes")} className="flex items-center gap-2">
                    <HiArrowLeft className="w-5 h-5"/>
                    Voltar
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nome */}
                <div>
                    <Label htmlFor="razaoSocial">Nome</Label>
                    <TextInput
                        id="razaoSocial"
                        type="text"
                        value={formData.razaoSocial || ""}
                        readOnly
                        className="bg-gray-100"
                    />
                </div>

                {/* CPF or CNPJ */}
                <div>
                    <CPFOrCNPJInput
                        value={formData.cpfCnpj || ""}
                        onChange={() => {
                        }}
                        label="CPF ou CNPJ"
                        required
                    />
                </div>

                {/* Email */}
                <div>
                    <EmailInput
                        value={formData.email || ""}
                        onChange={() => {
                        }}
                        label="E-mail"
                        className="bg-gray-100 cursor-not-allowed"
                        required
                    />
                </div>

                {/* Telefone */}
                <div>
                    <TelefoneInput
                        value={formData.telefone || ""}
                        onChange={() => {
                        }}
                        label="Telefone"
                        className="bg-gray-100 cursor-not-allowed"
                        required
                    />
                </div>
            </div>

            {/* Usuario Section */}
            {formData.usuario && (
                <div className="mt-6">
                    <h3 className="text-lg font-bold mb-4">Usuário</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="usuarioNome">Nome do Usuário</Label>
                            <TextInput
                                id="usuarioNome"
                                type="text"
                                value={formData.usuario.nome}
                                readOnly
                                className="bg-gray-100"
                            />
                        </div>
                        <div>
                            <Label htmlFor="usuarioEmail">E-mail do Usuário</Label>
                            <TextInput
                                id="usuarioEmail"
                                type="text"
                                value={formData.usuario.email}
                                readOnly
                                className="bg-gray-100"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClienteForm;

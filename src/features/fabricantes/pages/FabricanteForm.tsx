import React, {useEffect, useState} from "react";
import {Button, Label, TextInput, Tooltip} from "flowbite-react";
import {HiArrowLeft, HiOutlineInformationCircle, HiOutlinePlus, HiTrash} from "react-icons/hi";
import FabricanteService from "../service/FabricanteService";
import {Fabricante} from "../models/Fabricante";
import {TipoEndereco} from "@components/forms/endereco/Endereco";
import {Contato, TipoContato} from "@components/forms/contato/model/Contato";
import {useNavigate} from "react-router-dom";
import DeleteModal from "@components/comum/DeleteModal";
import TelefoneInput from "@components/inputs/TelefoneInput";
import EnderecoComponent from "@components/forms/endereco/EnderecoComponent";
import EmailInput from "@components/inputs/EmailInput";
import ContatoComponent from "@components/forms/contato/ContatoComponent";
import CPFOrCNPJInput from "@components/inputs/CPFOrCNPJInput";
import TituloPagina from "@components/comum/TituloPagina";

const FabricanteForm: React.FC<{ fabricante?: Fabricante | null; onSave: (formData: Fabricante) => void }> = ({
                                                                                                                  fabricante,
                                                                                                                  onSave,
                                                                                                              }) => {
    const [formData, setFormData] = useState<Fabricante>({
        id: 0,
        cpfCnpj: "",
        nomeFantasia: "",
        razaoSocial: "",
        endereco: [],
        email: "",
        emailSecundario: "",
        telefone: "",
        telefoneSecundario: "",
        contatos: []
    });
    const [errors, setErrors] = useState<{ cpfCnpj?: string; razaoSocial?: string }>({});
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [fabricanteNameToDelete, setFabricanteNameToDelete] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        if (fabricante) {
            setFormData(fabricante);
        }
    }, [fabricante]);
    useEffect(() => {
        const fetchFabricante = async () => {
            if (fabricante?.id) {
                try {
                    const response = await FabricanteService.buscarPorId(fabricante.id);
                    setFormData(response.data);
                } catch (error) {
                    console.error("Erro ao buscar o fabricante:", error);
                    alert("Erro ao carregar os dados do fabricante.");
                }
            }
        };

        fetchFabricante();
    }, [fabricante?.id]);

    const handleChange = (key: string, value: string) => {
        setFormData((prev) => ({...prev, [key]: value}));
        setErrors((prev) => ({...prev, [key]: undefined}));
    };


    const addAddress = () => {
        setFormData((prev) => ({
            ...prev,
            endereco: [
                ...prev.endereco,
                {
                    id: 0,
                    tipo: TipoEndereco.RESIDENCIAL,
                    logradouro: "",
                    complemento: "",
                    bairro: "",
                    cep: "",
                    cidade: "",
                    uf: "",
                    referencia: "",
                },
            ],
        }));
    };
    const openDeleteModal = () => {
        setFabricanteNameToDelete(formData.nomeFantasia);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setFabricanteNameToDelete(null);
    };
    const removeAddress = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            endereco: prev.endereco.filter((_, i) => i !== index),
        }));
    };
    const validateForm = () => {
        const newErrors: { cpfCnpj?: string; razaoSocial?: string } = {};

        if (!formData.cpfCnpj) {
            newErrors.cpfCnpj = "CPF ou CNPJ é obrigatório.";
        } else if (formData.cpfCnpj.length !== 11 && formData.cpfCnpj.length !== 14) {
            newErrors.cpfCnpj = "CPF ou CNPJ deve ter 11 ou 14 dígitos.";
        }

        if (!formData.razaoSocial) {
            newErrors.razaoSocial = "Razão Social é obrigatória.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            if (formData.id && formData.id > 0) {
                const updated = await FabricanteService.atualizar(formData.id, formData);
                onSave(updated.data);
            } else {
                const created = await FabricanteService.criar(formData);
                onSave(created.data);
            }
        } catch (error) {
            console.error("Error saving fabricante:", error);
            alert("Ocorreu um erro ao salvar o fabricante.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (formData.id) {
            try {
                await FabricanteService.deletar(formData.id);
                alert("Fabricante excluído com sucesso!");
                closeDeleteModal();
                // Optionally, clear the form or navigate away
            } catch (error) {
                console.error("Error deleting fabricante:", error);
                alert("Ocorreu um erro ao excluir o fabricante.");
            }
        }
    };

    const addContato = () => {
        setFormData((prev) => ({
            ...prev,
            contatos: [
                ...prev.contatos,
                {
                    id: 0,
                    tipo: TipoContato.VENDEDOR,
                    telefone: "",
                    isWhatsapp: false,
                    isTelegram: false,
                    email: "",
                    observacoes: ""
                },
            ],
        }));
    };

    const updateContato = (index: number, updatedContato: Contato) => {
        setFormData((prev) => {
            const updatedContatos = [...prev.contatos];
            updatedContatos[index] = updatedContato;
            return {...prev, contatos: updatedContatos};
        });
    };

    const removeContato = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            contatos: prev.contatos.filter((_, i) => i !== index),
        }));
    };

    const handleAddressChange = (index: number, key: string, value: string) => {
        setFormData((prev) => {
            const updatedEndereco = [...prev.endereco];
            updatedEndereco[index] = {...updatedEndereco[index], [key]: value};
            return {...prev, endereco: updatedEndereco};
        });
    };
    return (
        <form className="space-y-6" onSubmit={handleSubmit}>

                <TituloPagina titulo={"Fabricante"} subTitulo= {!fabricante?.id || fabricante?.id === 0 ? ("Novo") : ("Atualizar")} url={"/fabricantes"} navigate={navigate}/>

            <div className="border-b pb-4 mb-6">
                <h2 className="text-lg font-bold text-gray-700">Informações Básicas</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <Label htmlFor="nomeFantasia" className="flex items-center">
                        Nome Fantasia
                        <Tooltip content="Nome utilizado comercialmente pela empresa">
                            <HiOutlineInformationCircle className="ml-2 text-gray-500 cursor-pointer"/>
                        </Tooltip>
                    </Label>
                    <TextInput
                        id="nomeFantasia"
                        type="text"
                        placeholder="Digite o Nome Fantasia"
                        value={formData.nomeFantasia || ""}
                        onChange={(e) => handleChange("nomeFantasia", e.target.value)}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="razaoSocial" className="flex items-center">
                        Razão Social
                        <Tooltip content="Nome oficial registrado da empresa">
                            <HiOutlineInformationCircle className="ml-2 text-gray-500 cursor-pointer"/>
                        </Tooltip>
                    </Label>
                    <TextInput
                        id="razaoSocial"
                        type="text"
                        placeholder="Digite a Razão Social"
                        value={formData.razaoSocial || ""}
                        onChange={(e) => handleChange("razaoSocial", e.target.value)}
                        className={`${errors.razaoSocial ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""}`}
                    />
                    {errors.razaoSocial && <p className="text-red-500 text-sm mt-1">{errors.razaoSocial}</p>}
                </div>
                <CPFOrCNPJInput
                    value={formData.cpfCnpj || ""}
                    onChange={(value) => handleChange("cpfCnpj", value)}
                    label="CPF ou CNPJ"
                    required
                />
                <EmailInput
                    value={formData.email || ""}
                    onChange={(value) => handleChange("email", value)}
                    label="E-mail"
                    required
                />
                <TelefoneInput
                    value={formData.telefone || ""}
                    onChange={(value) => handleChange("telefone", value)}
                    label="Telefone"
                    required
                />
                <TelefoneInput
                    value={formData.telefoneSecundario || ""}
                    onChange={(value) => handleChange("telefoneSecundario", value)}
                    label="Telefone Secundário"
                />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-bold">Endereços</h3>
                {formData.endereco.map((endereco, index) => (
                    <EnderecoComponent
                        key={index}
                        endereco={endereco}
                        onChange={(key, value) => handleAddressChange(index, key, value)}
                        onRemove={() => removeAddress(index)}
                    />
                ))}
                <Button type="button" onClick={addAddress}>
                    <HiOutlinePlus className="mr-2"/>
                    Adicionar Endereço
                </Button>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-bold">Contatos</h3>
                {formData.contatos.map((contato, index) => (
                    <ContatoComponent
                        key={index}
                        contato={contato}
                        onUpdate={(updatedContato) => updateContato(index, updatedContato)}
                        onRemove={() => removeContato(index)}
                    />
                ))}
                <Button type="button" onClick={addContato} className="mt-4">
                    <HiOutlinePlus className="mr-2"/>
                    Adicionar Contato
                </Button>
            </div>
            <div className="flex justify-end gap-4 mt-6">
                <div className="flex justify-end gap-4 mt-6">
                    <Button
                        type="button"
                        color="gray"
                        onClick={() => navigate("/fabricantes")}
                        className="hover:bg-gray-200"
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        gradientDuoTone="greenToBlue"
                        className="hover:shadow-lg transition-transform"
                    >
                        {isSubmitting ? "Salvando..." : "Salvar"}
                    </Button>
                </div>

                {formData.id > 0 && (
                    <Button
                        type="button"
                        color="failure"
                        onClick={openDeleteModal}
                        className="flex items-center gap-2"
                    >
                        <HiTrash className="w-5 h-5"/>
                        Excluir
                    </Button>
                )}
            </div>
            <DeleteModal
                isOpen={isDeleteModalOpen}
                entityName={fabricanteNameToDelete}
                onClose={closeDeleteModal}
                onConfirm={handleDelete}
            />
        </form>
    );
};

export default FabricanteForm;

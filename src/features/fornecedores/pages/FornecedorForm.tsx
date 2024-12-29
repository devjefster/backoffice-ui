import React, {useEffect, useState} from "react";
import {Button, Label, TextInput, Tooltip} from "flowbite-react";
import {HiArrowLeft, HiOutlineInformationCircle, HiOutlinePlus, HiTrash} from "react-icons/hi";
import FornecedorService from "../service/FornecedorService";
import {Fornecedor} from "../models/Fornecedor";
import {useNavigate} from "react-router-dom";
import {TipoEndereco} from "@components/forms/endereco/Endereco";
import {Contato, TipoContato} from "@components/forms/contato/model/Contato";
import CPFOrCNPJInput from "@components/inputs/CPFOrCNPJInput";
import EmailInput from "@components/inputs/EmailInput";
import TelefoneInput from "@components/inputs/TelefoneInput";
import EnderecoComponent from "@components/forms/endereco/EnderecoComponent";
import ContatoComponent from "@components/forms/contato/ContatoComponent";
import DeleteModal from "@components/comum/DeleteModal";
import TituloPagina from "@components/comum/TituloPagina";

const FornecedorForm: React.FC<{ fornecedor?: Fornecedor | null; onSave: (formData: Fornecedor) => void }> = ({
                                                                                                                  fornecedor,
                                                                                                                  onSave,
                                                                                                              }) => {
    const [formData, setFormData] = useState<Fornecedor>({
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
    const [fornecedorNameToDelete, setFornecedorNameToDelete] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        if (fornecedor) {
            setFormData(fornecedor);
        }
    }, [fornecedor]);
    useEffect(() => {
        const fetchFornecedor = async () => {
            if (fornecedor?.id) {
                try {
                    const response = await FornecedorService.buscarPorId(fornecedor.id);
                    setFormData(response.data);
                } catch (error) {
                    console.error("Erro ao buscar o fornecedor:", error);
                    alert("Erro ao carregar os dados do fornecedor.");
                }
            }
        };

        fetchFornecedor();
    }, [fornecedor?.id]);

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
        setFornecedorNameToDelete(formData.nomeFantasia);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setFornecedorNameToDelete(null);
    };
    const removeAddress = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            endereco: prev.endereco.filter((_, i) => i !== index),
        }));
    };
    const validateForm = () => {
        const newErrors: { cpfCnpj?: string; razaoSocial?: string } = {};

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
                const updated = await FornecedorService.atualizar(formData.id, formData);
                onSave(updated.data);
            } else {
                const created = await FornecedorService.criar(formData);
                onSave(created.data);
            }
        } catch (error) {
            console.error("Error saving fornecedor:", error);
            alert("Ocorreu um erro ao salvar o fornecedor.");
        } finally {
            setIsSubmitting(false);
        }
    };


    const handleDelete = async () => {
        if (formData.id) {
            try {
                await FornecedorService.deletar(formData.id);
                alert("Fornecedor excluído com sucesso!");
                closeDeleteModal();
                // Optionally, clear the form or navigate away
            } catch (error) {
                console.error("Error deleting fornecedor:", error);
                alert("Ocorreu um erro ao excluir o fornecedor.");
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
            <div className="flex justify-between items-center">
                <TituloPagina titulo={"Fornecedor"}
                              subTitulo={!fornecedor?.id || fornecedor?.id === 0 ? ("Novo") : ("Atualizar")}/>

                <Button color="gray" onClick={() => navigate("/fornecedores")} className="flex items-center gap-2">
                    <HiArrowLeft className="w-5 h-5"/>
                    Voltar
                </Button>
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
                    label={
                        <>
                            CPF ou CNPJ
                        </>
                    }
                    required
                />
                {errors.cpfCnpj && <p className="text-red-500 text-sm mt-1">{errors.cpfCnpj}</p>}
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

            {/* Address Section */
            }
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
                <Button type="button" color="gray" onClick={() => console.log("Cancel action")}>
                    Cancelar
                </Button>
                <Button type="submit" gradientDuoTone="greenToBlue" disabled={isSubmitting}>
                    {isSubmitting ? "Salvando..." : "Salvar"}
                </Button>
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
                entityName={fornecedorNameToDelete}
                onClose={closeDeleteModal}
                onConfirm={handleDelete}
            />
        </form>
    );
};

export default FornecedorForm;

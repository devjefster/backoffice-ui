import React, {useEffect, useState} from "react";
import {Button, Label, TextInput, Tooltip} from "flowbite-react";
import {HiArrowLeft, HiOutlineInformationCircle, HiOutlinePlus, HiTrash} from "react-icons/hi";
import {useNavigate} from "react-router-dom";
import {TipoEndereco} from "@components/forms/endereco/Endereco";
import EmailInput from "@components/inputs/EmailInput";
import TelefoneInput from "@components/inputs/TelefoneInput";
import EnderecoComponent from "@components/forms/endereco/EnderecoComponent";
import DeleteModal from "@components/comum/DeleteModal";
import TituloPagina from "@components/comum/TituloPagina";
import {Pessoa, TipoCadastro, TipoPessoa} from "@features/pessoa/model/Pessoa";
import PessoaService from "@features/pessoa/service/PessoaService";
import Seletor from "@components/comum/Seletor";
import CPFOrCNPJInput from "@components/inputs/CPFOrCNPJInput";

const FornecedorForm: React.FC<{ fornecedor?: Pessoa | null; onSave: (formData: Pessoa) => void }> = ({
                                                                                                          fornecedor,
                                                                                                          onSave,
                                                                                                      }) => {
    const [formData, setFormData] = useState<Pessoa>({
        id: null,
        cpfCnpj: "",
        nomeFantasia: "",
        nome: "",
        razaoSocial: "",
        enderecos: [],
        email: "",
        emailSecundario: "",
        telefone: "",
        telefoneSecundario: "",
        tipo: TipoCadastro[TipoCadastro.FORNECEDOR],
        tipoPessoa: "PESSOA_JURIDICA", // Valor padrão para evitar null
        inscricaoEstadual: ""
    });

    const [errors, setErrors] = useState<{ cpfCnpj?: string; razaoSocial?: string, nome?: string }>({});
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [fornecedorNameToDelete, setPessoaNameToDelete] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        if (fornecedor) {
            setFormData(fornecedor);
        }
    }, [fornecedor]);
    useEffect(() => {
        const fetchPessoa = async () => {
            if (fornecedor?.id) {
                try {
                    const response = await PessoaService.buscarPorId(fornecedor.id);
                    setFormData(response.data);
                } catch (error) {
                    console.error("Erro ao buscar o fornecedor:", error);
                    alert("Erro ao carregar os dados do fornecedor.");
                }
            }
        };

        fetchPessoa();
    }, [fornecedor?.id]);

    const handleChange = (key: string, value: string) => {
        setFormData((prev) => ({...prev, [key]: value}));
        setErrors((prev) => ({...prev, [key]: undefined}));
    };


    const addAddress = () => {
        setFormData((prev) => ({
            ...prev,
            enderecos: [
                ...prev.enderecos,
                {
                    id: null,
                    tipo: TipoEndereco.COMERCIAL,
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
        setPessoaNameToDelete(formData.nomeFantasia);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setPessoaNameToDelete(null);
    };
    const removeAddress = (index: number) => {

        setFormData((prev) => ({
            ...prev,
            enderecos: prev.enderecos.filter((_, i) => i !== index),
        }));
    };
    const validateForm = () => {
        const newErrors: { cpfCnpj?: string; razaoSocial?: string, nome?: string } = {};
        if (formData.tipoPessoa === TipoPessoa.PESSOA_FISICA) {
            if (!formData.nome) {
                newErrors.nome = "O campo Nome é obrigatório.";
            }
            if (!formData.cpfCnpj) {
                newErrors.cpfCnpj = "O campo CPF é obrigatório.";
            }
        }
        if (formData.tipoPessoa === TipoPessoa.PESSOA_JURIDICA) {
            if (!formData.nomeFantasia && !formData.razaoSocial) {
                newErrors.razaoSocial = "Preencha Nome Fantasia ou Razão Social.";
            }
            if (!formData.cpfCnpj) {
                newErrors.cpfCnpj = "O campo CNPJ é obrigatório.";
            }
        }


        setErrors(newErrors);

        return Object.keys(newErrors).length === 0; // Return true if no errors
    };
    const validateUniqueFields = async (): Promise<boolean> => {
        try {
            const response = await PessoaService.validarUnicidade(
                formData.cpfCnpj,
                formData.email
            );
            if (!response.data.unico) {
                setErrors({
                    ...errors,
                    cpfCnpj: response.data.cpfCnpj || ""
                });
                return false;
            }
            return true;
        } catch (error) {
            console.error("Erro ao validar unicidade:", error);
            alert("Erro ao validar campos únicos. Tente novamente.");
            return false;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm() || !(await validateUniqueFields())) {
            return;
        }

        setIsSubmitting(true);

        try {
            if (formData.id && formData.id > 0) {
                const updated = await PessoaService.atualizar(formData.id, formData);
                onSave(updated.data);
                alert("Fornecedor atualizado com sucesso!");
            } else {
                const created = await PessoaService.criar(formData);
                onSave(created.data);
                alert("Fornecedor cadastrado com sucesso!");
            }
        } catch (error) {
            alert("Ocorreu um erro ao salvar o Fornecedor.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (formData.id) {
            try {
                await PessoaService.deletar(formData.id);
                alert("Fornecedor excluído com sucesso!");
                closeDeleteModal();
                // Optionally, clear the form or navigate away
            } catch (error) {
                console.error("Error deleting fornecedor:", error);
                alert("Ocorreu um erro ao excluir o fornecedor.");
            }
        }
    };


    const handleAddressChange = (index: number, key: string, value: string) => {
        setFormData((prev) => {
            const updatedEndereco = [...prev.enderecos];
            updatedEndereco[index] = {...updatedEndereco[index], [key]: value};
            return {...prev, enderecos: updatedEndereco};
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
            <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                <div>
                    <Label htmlFor="nome" className="flex items-center">
                        Pessoa Física ou Jurídica
                    </Label>
                    <Seletor
                        enumType={TipoPessoa}
                        value={formData.tipoPessoa || TipoPessoa.PESSOA_JURIDICA}
                        placeholder="Selecione o Tipo de Pessoa"
                        onChange={(e) => {
                            setFormData((prevState) => {
                                return {...prevState, tipoPessoa: e as TipoPessoa};
                            });
                        }
                        }/></div>

                {formData.tipoPessoa === "PESSOA_FISICA" && (
                    <div>
                        <Label htmlFor="nome" className="flex items-center">
                            Nome
                            <Tooltip content="Nome utilizado comercialmente pela empresa">
                                <HiOutlineInformationCircle className="ml-2 text-gray-500 cursor-pointer"/>
                            </Tooltip>
                        </Label>
                        <TextInput
                            id="nome"
                            type="text"
                            placeholder="Digite o Nome"
                            value={formData.nome || ""}
                            onChange={(e) => handleChange("nome", e.target.value)}
                            required/>
                    </div>
                )}

                {formData.tipoPessoa === "PESSOA_JURIDICA" && (
                    <>
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
                                required/>
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
                                className={`${errors.razaoSocial ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""}`}/>
                            {errors.razaoSocial &&
                                <p className="text-red-500 text-sm mt-1">{errors.razaoSocial}</p>}
                        </div>
                        <div>
                            <Label htmlFor="razaoSocial" className="flex items-center">Inscrição Estadual
                            </Label>
                            <TextInput
                                id="inscricaoEstadual"
                                type="text"
                                placeholder="Digite a inscrição estadual"
                                value={formData.inscricaoEstadual || ""}
                                onChange={(e) => handleChange("inscricaoEstadual", e.target.value)}/>
                        </div>
                    </>
                )}
                <CPFOrCNPJInput
                    value={formData.cpfCnpj || ""}
                    onChange={(value) => handleChange("cpfCnpj", value)}
                    label="CPF ou CNPJ"
                    required/>
                <EmailInput
                    value={formData.email || ""}
                    onChange={(value) => handleChange("email", value)}
                    label="E-mail"/>
                <TelefoneInput
                    value={formData.telefone || ""}
                    onChange={(value) => handleChange("telefone", value)}
                    label="Telefone"/>
                <TelefoneInput
                    value={formData.telefoneSecundario || ""}
                    onChange={(value) => handleChange("telefoneSecundario", value)}
                    label="Telefone Secundário"/>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-bold">Endereços</h3>

                {formData.enderecos.map((endereco, index) => (

                    <EnderecoComponent
                        key={index}
                        endereco={endereco}
                        onChange={(key, value) => handleAddressChange(index, key, value)}
                        onRemove={() => removeAddress(index)}/>
                ))}
                <Button type="button" onClick={addAddress}>
                    <HiOutlinePlus className="mr-2"/>
                    Adicionar Endereço
                </Button>

            </div>
            <div className="flex justify-end gap-4 mt-6">
                <Button type="button" color="gray" onClick={() => console.log("Cancel action")}>
                    Cancelar
                </Button>
                <Button type="submit" gradientDuoTone="greenToBlue" disabled={isSubmitting}>
                    {isSubmitting ? "Salvando..." : "Salvar"}
                </Button>
                {formData.id && (
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
                onConfirm={handleDelete}/>
        </form>
    )
        ;
};

export default FornecedorForm;

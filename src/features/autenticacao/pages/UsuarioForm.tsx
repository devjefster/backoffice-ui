import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Button, Tooltip} from "flowbite-react";
import {HiArrowLeft, HiOutlineInformationCircle} from "react-icons/hi";
import EmailInput from "@components/inputs/EmailInput";
import TelefoneInput from "@components/inputs/TelefoneInput";
import {AtualizarUsuario, CriarUsuario, Usuario} from "../model/Usuario";
import {atualizarUsuario, criarUsuario} from "@features/autenticacao/service/userService";

const UsuarioForm: React.FC<{ usuario?: Usuario | null; onSave: (formData: Usuario) => void }> = ({
                                                                                                      usuario,
                                                                                                      onSave,
                                                                                                  }) => {
    const [formData, setFormData] = useState<CriarUsuario | AtualizarUsuario>({
        id: usuario?.id || 0,
        nome: usuario?.nome || "",
        telefone: usuario?.telefone || "",
        email: usuario?.email || "",
        password: "",
        novaSenha: "",
        fotoPerfil: undefined,
        instagramUser: usuario?.instagramUser || "",
        tiktokUser: usuario?.tiktokUser || "",
    });

    const [errors, setErrors] = useState<{ nome?: string; email?: string; telefone?: string; password?: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (usuario) {
            setFormData({
                ...usuario,
                password: "",
                novaSenha: "",
                fotoPerfil: undefined,
            });
        }
    }, [usuario]);

    const handleChange = (key: string, value: string | File) => {
        setFormData((prev) => ({...prev, [key]: value}));
        setErrors((prev) => ({...prev, [key]: undefined}));
    };

    const validateForm = () => {
        const newErrors: { nome?: string; email?: string; telefone?: string; password?: string } = {};

        if (!formData.nome) {
            newErrors.nome = "Nome é obrigatório.";
        }
        if (!formData.email) {
            newErrors.email = "E-mail é obrigatório.";
        }
        if (!formData.telefone) {
            newErrors.telefone = "Telefone é obrigatório.";
        }
        if (!formData.id && !formData.password) {
            newErrors.password = "Senha é obrigatória para criação de usuário.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0; // Valid if no errors
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            if (formData.id && formData.id > 0) {
                const updatedUser = await atualizarUsuario(formData.id, formData);
                onSave(updatedUser);
            } else {
                const createdUser = await criarUsuario(formData);
                onSave(createdUser);
            }
            alert("Usuário salvo com sucesso!");
            navigate("/usuarios");
        } catch (error) {
            console.error("Erro ao salvar usuário:", error);
            alert("Erro ao salvar usuário.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="flex justify-between items-center">
                <h1 className="flex items-center text-4xl font-extrabold text-primary">
                    Usuário
                    <span
                        className="bg-pink-100 text-text-secondary text-2xl font-semibold me-2 px-2.5 py-0.5 rounded dark:bg-fuchsia-200-200 dark:text-blue-800 ms-2">
                        {!usuario?.id ? "Novo" : "Atualizar"}
                    </span>
                </h1>
                <Button color="gray" onClick={() => navigate("/usuarios")} className="flex items-center gap-2">
                    <HiArrowLeft className="w-5 h-5"/>
                    Voltar
                </Button>
            </div>
            <div className="border-b pb-4 mb-6">
                <h2 className="text-lg font-bold text-gray-700">Informações do Usuário</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nome */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 flex items-center">
                        Nome
                        <Tooltip content="Nome completo do usuário">
                            <HiOutlineInformationCircle className="ml-2 text-gray-500 cursor-pointer"/>
                        </Tooltip>
                    </label>
                    <input
                        type="text"
                        value={formData.nome}
                        onChange={(e) => handleChange("nome", e.target.value)}
                        placeholder="Digite o Nome"
                        className={`block w-full rounded-lg border ${
                            errors.nome ? "border-red-500" : "border-gray-300"
                        } bg-gray-50 p-2.5 text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500`}
                    />
                    {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome}</p>}
                </div>

                {/* Email */}
                <EmailInput
                    value={formData.email}
                    onChange={(value) => handleChange("email", value)}
                    label="E-mail"
                    required
                />

                {/* Telefone */}
                <TelefoneInput
                    value={formData.telefone}
                    onChange={(value) => handleChange("telefone", value)}
                    label="Telefone"
                    required
                />

                {/* Instagram */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Instagram</label>
                    <input
                        type="text"
                        value={formData.instagramUser || ""}
                        onChange={(e) => handleChange("instagramUser", e.target.value)}
                        placeholder="Usuário do Instagram"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* TikTok */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">TikTok</label>
                    <input
                        type="text"
                        value={formData.tiktokUser || ""}
                        onChange={(e) => handleChange("tiktokUser", e.target.value)}
                        placeholder="Usuário do TikTok"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Password */}
                {!formData.id && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Senha</label>
                        <input
                            type="password"
                            value={formData.password || ""}
                            onChange={(e) => handleChange("password", e.target.value)}
                            placeholder="Digite uma senha"
                            className={`block w-full rounded-lg border ${
                                errors.password ? "border-red-500" : "border-gray-300"
                            } bg-gray-50 p-2.5 text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500`}
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>
                )}
            </div>

            <div className="flex justify-end gap-4 mt-6">
                <Button
                    type="button"
                    color="gray"
                    onClick={() => navigate("/usuarios")}
                    className="hover:bg-gray-200"
                >
                    Cancelar
                </Button>
                <Button type="submit" gradientDuoTone="greenToBlue" disabled={isSubmitting}>
                    {isSubmitting ? "Salvando..." : "Salvar"}
                </Button>
            </div>
        </form>
    );
};

export default UsuarioForm;
